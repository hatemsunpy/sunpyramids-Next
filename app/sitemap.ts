import type { MetadataRoute } from "next";
import { API_BASE } from "@/lib/config";
import { locales, withLocale } from "@/lib/locales";
import { FRONTEND_ORIGIN, publicUrl } from "@/lib/seo";
import type { Locale } from "@/types/api";

type SitemapItem = {
  slug?: string;
  updated_at?: string;
  seo?: { robots?: string | null };
};

const staticPaths = [
  "/",
  "/about-us",
  "/contact-us",
  "/blogs/all-blogs",
  "/egypt-tours/one-day-tours",
  "/egypt-tours/multi-days-tours",
  "/egypt-tours/nile-cruises",
  "/egypt-tours/shore-excursions",
  "/make-your-trip",
  "/rent-car",
  "/faqs",
  "/events",
];

async function fetchGroup(endpoint: string): Promise<SitemapItem[]> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const response = await fetch(new URL(endpoint, API_BASE), {
      headers: { Accept: "application/json", "X-Localize": "en" },
      next: { revalidate: 1800 },
      signal: controller.signal,
    });
    if (!response.ok) return [];
    const json = await response.json();
    return Array.isArray(json?.data) ? json.data : [];
  } catch {
    return [];
  } finally {
    clearTimeout(timeout);
  }
}

function alternates(path: string) {
  return {
    languages: Object.fromEntries(
      locales.map((locale) => [locale, publicUrl(withLocale(path, locale as Locale))]),
    ),
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [tours, blogs] = await Promise.all([
    fetchGroup("tours?page_limit=200&includes=seo"),
    fetchGroup("blogs?page_limit=200&includes=seo"),
  ]);

  const entries: MetadataRoute.Sitemap = [];

  for (const path of staticPaths) {
    entries.push({
      url: `${FRONTEND_ORIGIN}${path === "/" ? "" : path}`,
      lastModified: new Date(),
      alternates: alternates(path),
    });
  }

  for (const tour of tours) {
    if (!tour.slug || tour.seo?.robots?.includes("noindex")) continue;
    const path = `/tour/${tour.slug}`;
    entries.push({
      url: publicUrl(path),
      lastModified: tour.updated_at ? new Date(tour.updated_at) : new Date(),
      alternates: alternates(path),
    });
  }

  for (const blog of blogs) {
    if (!blog.slug || blog.seo?.robots?.includes("noindex")) continue;
    const path = `/blog/${blog.slug}`;
    entries.push({
      url: publicUrl(path),
      lastModified: blog.updated_at ? new Date(blog.updated_at) : new Date(),
      alternates: alternates(path),
    });
  }

  return entries;
}
