import { API_BASE } from "@/lib/config";
import {
  SITEMAP_API_MAX_ATTEMPTS,
  SITEMAP_API_PAGE_LIMIT,
  SITEMAP_API_TIMEOUT_MS,
  SITEMAP_REVALIDATE_SECONDS,
} from "@/lib/sitemap/config";
import type { SitemapApiItem, SitemapDataset } from "@/lib/sitemap/types";

const TRANSIENT_STATUSES = new Set([408, 429, 500, 502, 503, 504]);

export class SitemapApiError extends Error {
  constructor(
    message: string,
    readonly kind: "not_found" | "transient" | "invalid_response" | "request_error",
    readonly status?: number,
  ) {
    super(message);
    this.name = "SitemapApiError";
  }
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchApiJson(endpoint: string): Promise<unknown> {
  let lastError: SitemapApiError | undefined;

  for (let attempt = 1; attempt <= SITEMAP_API_MAX_ATTEMPTS; attempt += 1) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), SITEMAP_API_TIMEOUT_MS);
    try {
      const response = await fetch(new URL(endpoint, API_BASE), {
        headers: { Accept: "application/json", "X-Localize": "en" },
        next: { revalidate: SITEMAP_REVALIDATE_SECONDS },
        signal: controller.signal,
      });

      if (response.status === 404) {
        throw new SitemapApiError(`Sitemap API endpoint returned 404: ${endpoint}`, "not_found", 404);
      }
      if (!response.ok) {
        const kind = TRANSIENT_STATUSES.has(response.status) ? "transient" : "request_error";
        const error = new SitemapApiError(
          `Sitemap API endpoint returned HTTP ${response.status}: ${endpoint}`,
          kind,
          response.status,
        );
        if (kind === "transient" && attempt < SITEMAP_API_MAX_ATTEMPTS) {
          lastError = error;
          await delay(250 * 2 ** (attempt - 1));
          continue;
        }
        throw error;
      }

      try {
        return await response.json();
      } catch (error) {
        if (
          controller.signal.aborted ||
          (error instanceof DOMException && error.name === "AbortError") ||
          error instanceof TypeError
        ) {
          throw new SitemapApiError(
            `Sitemap API response stream failed for ${endpoint}: ${error instanceof Error ? error.message : String(error)}`,
            "transient",
            response.status,
          );
        }
        throw new SitemapApiError(
          `Sitemap API returned malformed JSON for ${endpoint}: ${error instanceof Error ? error.message : String(error)}`,
          "invalid_response",
          response.status,
        );
      }
    } catch (error) {
      if (error instanceof SitemapApiError && error.kind !== "transient") throw error;
      const transient = error instanceof SitemapApiError
        ? error
        : new SitemapApiError(
            `Sitemap API network/timeout failure for ${endpoint}: ${error instanceof Error ? error.message : String(error)}`,
            "transient",
          );
      lastError = transient;
      if (attempt < SITEMAP_API_MAX_ATTEMPTS) {
        await delay(250 * 2 ** (attempt - 1));
        continue;
      }
      throw transient;
    } finally {
      clearTimeout(timeout);
    }
  }

  throw lastError ?? new SitemapApiError(`Sitemap API request failed: ${endpoint}`, "transient");
}

type ParsedPage = { items: SitemapApiItem[]; currentPage: number; lastPage: number };

function sitemapEntityIdentity(entity: SitemapApiItem) {
  if (entity.id != null) return `id:${entity.id}`;
  if (entity.slug) return `slug:${entity.slug}`;
  return JSON.stringify(entity);
}

function parsePage(payload: unknown, endpoint: string): ParsedPage {
  if (!payload || typeof payload !== "object") {
    throw new SitemapApiError(`Sitemap API response was not an object: ${endpoint}`, "invalid_response");
  }
  const envelope = (payload as { data?: unknown }).data;
  if (!envelope || typeof envelope !== "object" || Array.isArray(envelope)) {
    throw new SitemapApiError(`Sitemap API response did not contain a paginator: ${endpoint}`, "invalid_response");
  }
  const paginator = envelope as { data?: unknown; current_page?: unknown; last_page?: unknown };
  if (!Array.isArray(paginator.data)) {
    throw new SitemapApiError(`Sitemap API paginator did not contain a data array: ${endpoint}`, "invalid_response");
  }
  const currentPage = Number(paginator.current_page);
  const lastPage = Number(paginator.last_page);
  if (!Number.isInteger(currentPage) || currentPage < 1 || !Number.isInteger(lastPage) || lastPage < currentPage) {
    throw new SitemapApiError(`Sitemap API pagination metadata was invalid: ${endpoint}`, "invalid_response");
  }
  return { items: paginator.data as SitemapApiItem[], currentPage, lastPage };
}

async function enumerate(endpoint: string): Promise<SitemapApiItem[]> {
  const separator = endpoint.includes("?") ? "&" : "?";
  const endpointForPage = (page: number) => `${endpoint}${separator}page=${page}&page_limit=${SITEMAP_API_PAGE_LIMIT}`;
  const firstEndpoint = endpointForPage(1);
  const first = parsePage(await fetchApiJson(firstEndpoint), firstEndpoint);

  const remaining = await Promise.all(
    Array.from({ length: first.lastPage - 1 }, async (_, index) => {
      const pageEndpoint = endpointForPage(index + 2);
      const parsed = parsePage(await fetchApiJson(pageEndpoint), pageEndpoint);
      if (parsed.currentPage !== index + 2 || parsed.lastPage !== first.lastPage) {
        throw new SitemapApiError(`Sitemap API pagination changed during enumeration: ${endpoint}`, "invalid_response");
      }
      return parsed.items;
    }),
  );

  const seen = new Set<string>();
  return first.items.concat(...remaining).filter((entity) => {
    const identity = sitemapEntityIdentity(entity);
    if (seen.has(identity)) return false;
    seen.add(identity);
    return true;
  });
}

export async function loadSitemapDataset(): Promise<SitemapDataset> {
  const [pages, tours, blogs, events, categories, destinations, blogCategories] = await Promise.all([
    enumerate("pages?includes=seo"),
    enumerate("tours?includes=seo,categories,destinations"),
    enumerate("blogs?includes=seo,categories"),
    enumerate("categories?parent_id=55&includes=seo"),
    enumerate("categories?includes=seo"),
    enumerate("destinations?parent.slug=egypt&order_by=display_order,asc&includes=seo"),
    enumerate("blog-categories?includes=seo"),
  ]);

  return { pages, tours, blogs, events, categories, destinations, blogCategories };
}
