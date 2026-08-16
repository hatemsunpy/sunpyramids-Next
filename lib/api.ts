import { cookies } from "next/headers";
import type { Locale } from "@/types/api";
import { API_BASE } from "@/lib/config";

type ApiOptions = {
  locale?: Locale;
  token?: string;
  next?: NextFetchRequestConfig;
  cache?: RequestCache;
};

function buildUrl(endpoint: string) {
  return new URL(endpoint.replace(/^\/+/, ""), API_BASE).toString();
}

export async function apiFetch<T>(
  endpoint: string,
  options: ApiOptions = {},
): Promise<T | null> {
  const cookieStore = await cookies();
  const token = options.token ?? cookieStore.get("sunpyramids-token")?.value;
  const headers: HeadersInit = {
    Accept: "application/json",
    "Content-Type": "application/json",
    "X-Localize": options.locale || "en",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);

  try {
    const response = await fetch(buildUrl(endpoint), {
      headers,
      cache: options.cache ?? "force-cache",
      next: options.next ?? { revalidate: 300 },
      signal: controller.signal,
    });

    if (!response.ok) {
      return null;
    }

    return (await response.json()) as T;
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

export { buildUrl };

const TRANSIENT_STATUS = new Set([408, 425, 429, 500, 502, 503, 504]);

type RetryOptions = {
  maxAttempts?: number;
  baseDelayMs?: number;
};

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export type ApiResult<T> =
  | { ok: true; value: T | null }
  | { ok: false; reason: "not_found" }
  | { ok: false; reason: "error"; status?: number; message?: string };

export function formatApiError(result: ApiResult<unknown>): string {
  if (result.ok) return "";
  if (result.reason === "not_found") return "confirmed not found (HTTP 404)";
  return `${result.reason}` + (result.status ? ` (HTTP ${result.status})` : "") + (result.message ? ` — ${result.message}` : "");
}

export async function apiFetchReliable<T>(
  endpoint: string,
  options: ApiOptions = {},
  retry: RetryOptions = {},
): Promise<ApiResult<T>> {
  const maxAttempts = retry.maxAttempts ?? 3;
  const baseDelayMs = retry.baseDelayMs ?? 400;

  const cookieStore = await cookies();
  const token = options.token ?? cookieStore.get("sunpyramids-token")?.value;
  const headers: HeadersInit = {
    Accept: "application/json",
    "Content-Type": "application/json",
    "X-Localize": options.locale || "en",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let lastStatus: number | undefined;
  let lastMessage: string | undefined;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000);

    try {
      const response = await fetch(buildUrl(endpoint), {
        headers,
        cache: options.cache ?? "force-cache",
        next: options.next ?? { revalidate: 300 },
        signal: controller.signal,
      });

      if (response.status === 404) {
        return { ok: false, reason: "not_found" as const };
      }

      if (!response.ok) {
        lastStatus = response.status;
        if (TRANSIENT_STATUS.has(response.status) && attempt < maxAttempts) {
          await sleep(baseDelayMs * 2 ** (attempt - 1));
          continue;
        }
        return { ok: false, reason: "error", status: response.status };
      }

      const value = (await response.json()) as T;
      return { ok: true, value };
    } catch (err) {
      lastMessage = err instanceof Error ? err.message : String(err);
      if (attempt < maxAttempts) {
        await sleep(baseDelayMs * 2 ** (attempt - 1));
        continue;
      }
      return { ok: false, reason: "error", message: lastMessage };
    } finally {
      clearTimeout(timeout);
    }
  }

  return { ok: false, reason: "error", status: lastStatus, message: lastMessage };
}
