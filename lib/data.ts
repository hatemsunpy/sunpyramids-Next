import { apiFetch } from "@/lib/api";
import type { ApiList, ApiPage, Locale, Tour } from "@/types/api";

function listData<T>(response: ApiList<T> | null | undefined): T[] {
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.data?.data)) return response.data.data;
  return [];
}

export async function getPage(slug: string, locale: Locale) {
  const response = await apiFetch<{ data?: ApiPage }>(
    `pages/${slug}?includes=seo,metas`,
    { locale },
  );
  return response?.data ?? null;
}

export async function getHome(locale: Locale) {
  const response = await apiFetch<{ data?: ApiPage }>("pages/home?includes=seo", {
    locale,
  });
  return response?.data ?? null;
}

export async function getTours(endpoint: string, locale: Locale, limit = 8) {
  const response = await apiFetch<ApiList<Tour>>(
    `${endpoint}${endpoint.includes("?") ? "&" : "?"}page_limit=${limit}`,
    { locale },
  );
  return listData(response);
}

export async function getTour(slug: string, locale: Locale) {
  const response = await apiFetch<{ data?: Tour }>(
    `tours/${encodeURIComponent(slug)}?includes=seo,gallery,category,destination,itinerary,includes,excludes,faqs,reviews`,
    { locale, next: { revalidate: 180 } },
  );

  if (response?.data) return response.data;

  const fallback = await apiFetch<ApiList<Tour>>(
    `tours?slug=${encodeURIComponent(slug)}&includes=seo,gallery,category,destination`,
    { locale, next: { revalidate: 180 } },
  );
  return listData(fallback)[0] ?? null;
}

export async function getBlogs(locale: Locale, limit = 9) {
  const response = await apiFetch<ApiList<ApiPage>>(
    `blogs?page_limit=${limit}&order_by=id,desc`,
    { locale },
  );
  return listData(response);
}

export async function getBlog(slug: string, locale: Locale) {
  const response = await apiFetch<{ data?: ApiPage }>(
    `blogs/${encodeURIComponent(slug)}?includes=seo,category,related`,
    { locale },
  );
  return response?.data ?? null;
}
