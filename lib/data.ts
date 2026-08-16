import { apiFetch, apiFetchReliable, type ApiResult } from "@/lib/api";
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

export async function getDestination(slug: string, locale: Locale) {
  const response = await apiFetch<{ data?: ApiPage }>(
    `destinations/${encodeURIComponent(slug)}?includes=seo`,
    { locale },
  );
  return response?.data ?? null;
}

export async function getDestinationReliable(
  slug: string,
  locale: Locale,
): Promise<ApiResult<ApiPage | null>> {
  const result = await apiFetchReliable<{ data?: ApiPage }>(
    `destinations/${encodeURIComponent(slug)}?includes=seo`,
    { locale },
  );
  if (!result.ok) return result;
  return { ok: true, value: result.value?.data ?? null };
}

export async function getHome(locale: Locale) {
  const response = await apiFetch<{ data?: ApiPage }>("pages/home?includes=seo", {
    locale,
  });
  return response?.data ?? null;
}

export async function getTours(endpoint: string, locale: Locale, limit = 8, page = 1) {
  const sep = endpoint.includes("?") ? "&" : "?";
  const response = await apiFetch<ApiList<Tour>>(
    `${endpoint}${sep}page_limit=${limit}&page=${page}`,
    { locale },
  );
  return response ?? null;
}

export function tourListData(response: ApiList<Tour> | null | undefined): Tour[] {
  return listData(response);
}

export function tourMeta(response: ApiList<Tour> | null | undefined) {
  const data = response?.data;
  if (Array.isArray(data)) {
    return { from: 1, to: data.length, total: data.length, lastPage: 1 };
  }
  const total = data?.total ?? response?.total ?? data?.data?.length ?? 0;
  const to = data?.to ?? response?.to ?? data?.data?.length ?? 0;
  return {
    from: total === 0 ? 0 : (data?.from ?? response?.from ?? 1),
    to: total === 0 ? 0 : to,
    total,
    lastPage: data?.last_page ?? response?.last_page ?? 1,
  };
}

export async function getDestinations(endpoint: string, locale: Locale, limit = 200) {
  const response = await apiFetch<ApiList<ApiPage>>(
    `${endpoint}${endpoint.includes("?") ? "&" : "?"}page_limit=${limit}`,
    { locale },
  );
  return listData(response);
}

export async function getCategories(endpoint: string, locale: Locale, limit = 100) {
  const response = await apiFetch<ApiList<ApiPage>>(
    `${endpoint}${endpoint.includes("?") ? "&" : "?"}page_limit=${limit}`,
    { locale },
  );
  return listData(response);
}

export async function getCategory(slug: string, locale: Locale) {
  const response = await apiFetch<{ data?: ApiPage }>(
    `categories/${encodeURIComponent(slug)}?includes=seo,children`,
    { locale },
  );
  return response?.data ?? null;
}

export async function getCategoryReliable(
  slug: string,
  locale: Locale,
): Promise<ApiResult<ApiPage | null>> {
  const result = await apiFetchReliable<{ data?: ApiPage }>(
    `categories/${encodeURIComponent(slug)}?includes=seo,children`,
    { locale },
  );
  if (!result.ok) return result;
  return { ok: true, value: result.value?.data ?? null };
}

export async function getBlogCategories(locale: Locale, parentId: number | null = null) {
  const parent = parentId === null ? "%5Bnull%5D" : String(parentId);
  const response = await apiFetch<ApiList<ApiPage>>(
    `blog-categories?page=1&parent_id=${parent}`,
    { locale },
  );
  return listData(response);
}

export async function getBlogCategory(slugOrId: string | number, locale: Locale) {
  if (typeof slugOrId === "number" || /^\d+$/.test(String(slugOrId))) {
    const response = await apiFetch<{ data?: ApiPage }>(
      `blog-categories/${encodeURIComponent(String(slugOrId))}?page=1`,
      { locale },
    );
    return response?.data ?? null;
  }
  const response = await apiFetch<ApiList<ApiPage>>(
    `blog-categories?slug%5B%5D=${encodeURIComponent(String(slugOrId))}&includes=seo&exists=children&page_limit=100`,
    { locale },
  );
  return listData(response)[0] ?? null;
}

export async function getFaqs(locale: Locale, limit = 200) {
  const response = await apiFetch<ApiList<ApiPage>>(`faqs?page_limit=${limit}`, {
    locale,
  });
  return listData(response);
}

export async function getTour(slug: string, locale: Locale) {
  const includes = "seo,destinations,categories,options,days,seasons";
  const response = await apiFetch<{ data?: Tour }>(
    `tours/${encodeURIComponent(slug)}?includes=${includes}`,
    { locale, next: { revalidate: 180 } },
  );

  if (response?.data) return response.data;

  const fallback = await apiFetch<ApiList<Tour>>(
    `tours?slug=${encodeURIComponent(slug)}&includes=${includes}`,
    { locale, next: { revalidate: 180 } },
  );
  return listData(fallback)[0] ?? null;
}

export async function getRelatedTours(tour: Tour | null, locale: Locale, limit = 12) {
  if (!tour?.id) return [];
  const categoryIds = (tour.categories ?? []).map((c) => c.id).filter(Boolean);
  if (!categoryIds.length) return [];
  const params = new URLSearchParams();
  params.set("page_limit", String(limit + 1));
  params.set("order_by", "display_order,asc");
  categoryIds.forEach((id) => params.append("categories.id[]", String(id)));
  const response = await apiFetch<ApiList<Tour>>(`tours?${params.toString()}`, { locale });
  return listData(response).filter((item) => item.id !== tour.id).slice(0, limit);
}

export async function getBlogCategoryChildren(parentId: number, locale: Locale) {
  const response = await apiFetch<ApiList<ApiPage>>(
    `blog-categories?page=1&parent_id=${parentId}&page_limit=100`,
    { locale },
  );
  return listData(response);
}

export async function getCategoryBlogs(categorySlug: string, locale: Locale) {
  const response = await apiFetch<ApiList<ApiPage>>(
    `blogs?page=1&order_by=display_order,asc&includes=%26categories.slug=${encodeURIComponent(categorySlug)}`,
    { locale },
  );
  return listData(response);
}

export async function getBlogCategoryReliable(
  slugOrId: string | number,
  locale: Locale,
): Promise<ApiResult<ApiPage | null>> {
  const endpoint =
    typeof slugOrId === "number" || /^\d+$/.test(String(slugOrId))
      ? `blog-categories/${encodeURIComponent(String(slugOrId))}?page=1`
      : `blog-categories?slug%5B%5D=${encodeURIComponent(String(slugOrId))}&includes=seo&exists=children&page_limit=100`;

  const result = await apiFetchReliable<{ data?: ApiPage } | ApiList<ApiPage>>(
    endpoint,
    { locale },
  );

  if (!result.ok) return result;

  const value = result.value;
  if (!value) return { ok: true, value: null };

  const dataField = (value as { data?: unknown }).data;
  if (Array.isArray(dataField)) {
    return { ok: true, value: (dataField as ApiPage[])[0] ?? null };
  }
  if (dataField && typeof dataField === "object" && "data" in (dataField as Record<string, unknown>)) {
    return { ok: true, value: listData(value as ApiList<ApiPage>)[0] ?? null };
  }
  return { ok: true, value: (dataField as ApiPage) ?? null };
}

export async function blogCategoryExists(
  slug: string,
  locale: Locale,
): Promise<ApiResult<ApiPage | null>> {
  const result = await apiFetchReliable<ApiList<ApiPage>>(
    `blog-categories?slug%5B%5D=${encodeURIComponent(slug)}&exists=children&page_limit=1`,
    { locale },
  );

  if (!result.ok) return result;
  return { ok: true, value: listData(result.value)[0] ?? null };
}

export async function getCategoryBlogsReliable(
  categorySlug: string,
  locale: Locale,
): Promise<ApiResult<ApiPage[]>> {
  const result = await apiFetchReliable<ApiList<ApiPage>>(
    `blogs?page=1&order_by=display_order,asc&includes=%26categories.slug=${encodeURIComponent(categorySlug)}`,
    { locale },
  );

  if (!result.ok) return result;
  return { ok: true, value: listData(result.value) };
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
