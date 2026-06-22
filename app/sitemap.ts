import type { MetadataRoute } from "next";
import { API_BASE } from "@/lib/config";
import { locales, withLocale } from "@/lib/locales";
import { FRONTEND_ORIGIN, publicUrl } from "@/lib/seo";
import type { Locale } from "@/types/api";

type SitemapItem = {
  slug?: string;
  link?: string | null;
  updated_at?: string;
  seo?: { robots?: string | null };
};

const staticPaths = [
  "/",
  "/about-us",
  "/accessible-travel",
  "/book-egypt-trip",
  "/contact-us",
  "/blogs/all-blogs",
  "/egypt-travel-guide",
  "/egypt-tours/one-day-tours",
  "/egypt-tours/multi-days-tours",
  "/egypt-tours/nile-cruises",
  "/egypt-tours/shore-excursions",
  "/egypt-tours/plan-your-egypt-journy",
  "/egypt-tours/tailor-your-egypt-trip",
  "/make-your-trip",
  "/make_your_trip",
  "/rent-car",
  "/faqs",
  "/events",
  "/privacy-and-cookies",
  "/sustainability",
  "/terms-and-conditions",
  "/thankful",
];

async function fetchGroup(endpoint: string): Promise<SitemapItem[]> {
  const json = await fetchJson(endpoint);
  return itemsFromResponse(json);
}

async function fetchPaginatedGroup(endpoint: string, pageLimit = 100): Promise<SitemapItem[]> {
  const separator = endpoint.includes("?") ? "&" : "?";
  const first = await fetchJson(`${endpoint}${separator}page=1&page_limit=${pageLimit}`);
  const items = itemsFromResponse(first);
  const lastPage = Math.min(Number(first?.data?.last_page || 1), 20);

  if (lastPage <= 1) return items;

  const rest = await Promise.all(
    Array.from({ length: lastPage - 1 }, (_, index) =>
      fetchJson(`${endpoint}${separator}page=${index + 2}&page_limit=${pageLimit}`).then(itemsFromResponse),
    ),
  );

  return items.concat(...rest);
}

async function fetchJson(endpoint: string): Promise<any> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const response = await fetch(new URL(endpoint, API_BASE), {
      headers: { Accept: "application/json", "X-Localize": "en" },
      cache: "no-store",
      signal: controller.signal,
    });
    if (!response.ok) return null;
    return await response.json();
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

function itemsFromResponse(json: any): SitemapItem[] {
  if (Array.isArray(json?.data)) return json.data;
  if (Array.isArray(json?.data?.data)) return json.data.data;
  return [];
}

function alternates(path: string) {
  return {
    languages: Object.fromEntries(
      locales.map((locale) => [locale, publicUrl(withLocale(path, locale as Locale))]),
    ),
  };
}

function isIndexable(item: SitemapItem) {
  return !item.seo?.robots?.toLowerCase().includes("noindex");
}

function publicPathFromLink(link: string | null | undefined) {
  if (!link) return null;

  try {
    const url = new URL(link);
    if (url.hostname !== "sunpyramidstours.com") return null;
    return `${url.pathname}${url.search}` || "/";
  } catch {
    return null;
  }
}

function pushEntry(entries: MetadataRoute.Sitemap, seen: Set<string>, path: string, updatedAt?: string) {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  const url = publicUrl(normalized);
  if (seen.has(url)) return;
  seen.add(url);
  entries.push({
    url,
    lastModified: updatedAt ? new Date(updatedAt) : new Date(),
    alternates: alternates(normalized),
  });
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [tours, blogs, categories, destinations, blogCategories] = await Promise.all([
    fetchPaginatedGroup("tours?includes=seo", 100),
    fetchPaginatedGroup("blogs?includes=seo", 100),
    fetchGroup("categories?page_limit=200&includes=seo"),
    fetchGroup("destinations?page_limit=200&parent.slug=egypt&order_by=display_order,asc&includes=seo"),
    fetchGroup("blog-categories?page_limit=200&includes=seo"),
  ]);

  const entries: MetadataRoute.Sitemap = [];
  const seen = new Set<string>();

  for (const path of staticPaths) {
    pushEntry(entries, seen, path);
  }

  for (const tour of tours) {
    if (!tour.slug || !isIndexable(tour)) continue;
    pushEntry(entries, seen, `/tour/${tour.slug}`, tour.updated_at);
  }

  for (const blog of blogs) {
    if (!blog.slug || !isIndexable(blog)) continue;
    pushEntry(entries, seen, `/blog/${blog.slug}`, blog.updated_at);
  }

  for (const category of categories) {
    if (!isIndexable(category)) continue;
    const path = publicPathFromLink(category.link) || (category.slug ? `/egypt-tours/${category.slug}` : null);
    if (!path) continue;
    pushEntry(entries, seen, path, category.updated_at);
  }

  for (const destination of destinations) {
    if (!destination.slug || !isIndexable(destination)) continue;
    pushEntry(entries, seen, `/egypt-tours/one-day-tours/${destination.slug}`, destination.updated_at);
  }

  for (const category of blogCategories) {
    if (!category.slug || !isIndexable(category)) continue;
    pushEntry(entries, seen, `/egypt-travel-guide/${category.slug}`, category.updated_at);
  }

  return entries;
}
