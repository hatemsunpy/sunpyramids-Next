import { apiFetch, apiFetchReliable, type ApiResult } from "@/lib/api";
import type {
  ApiList,
  ApiPage,
  Locale,
  PublicSiteSettings,
  SiteSetting,
  SocialLink,
  TeamMember,
  Tour,
  TripTaxonomy,
} from "@/types/api";

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

export async function getPageReliable(
  slug: string,
  locale: Locale,
): Promise<ApiResult<ApiPage>> {
  const apiResult = await apiFetchReliable<{ data?: ApiPage }>(
    `pages/${encodeURIComponent(slug)}?includes=seo,metas`,
    { locale },
  );
  if (!apiResult.ok) return apiResult;
  if (!apiResult.value?.data) {
    return { ok: false, reason: "invalid_response", message: "Page response did not contain data" };
  }
  return { ok: true, value: apiResult.value.data };
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
  const apiResult = await apiFetchReliable<{ data?: ApiPage }>(
    `destinations/${encodeURIComponent(slug)}?includes=seo`,
    { locale },
  );
  if (!apiResult.ok) return apiResult;
  if (!apiResult.value?.data) {
    return { ok: false, reason: "invalid_response", message: "Destination response did not contain data" };
  }
  return { ok: true, value: apiResult.value.data };
}

export async function getHome(locale: Locale) {
  const response = await apiFetch<{ data?: ApiPage }>("pages/home?includes=seo", {
    locale,
  });
  return response?.data ?? null;
}

export async function getHomeTours(endpoint: string, locale: Locale) {
  const response = await apiFetch<ApiList<Tour>>(endpoint, { locale });
  return listData(response);
}

export async function getHomeDestinations(locale: Locale) {
  const response = await apiFetch<ApiList<ApiPage>>(
    "destinations/home?page_limit=200&parent.slug=egypt&order_by=display_order,asc",
    { locale },
  );
  return listData(response);
}

export async function getHomeFaqs(locale: Locale) {
  const response = await apiFetch<ApiList<ApiPage>>("faqs/home?page_limit=5", { locale });
  return listData(response);
}

export async function getHomeBlogs(locale: Locale) {
  const response = await apiFetch<ApiList<ApiPage>>(
    "blogs/home?page_limit=8&order_by=id,desc",
    { locale },
  );
  return listData(response);
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

async function getListReliable<T>(endpoint: string, locale: Locale): Promise<ApiResult<T[]>> {
  const result = await apiFetchReliable<ApiList<T>>(endpoint, { locale });
  if (!result.ok) return result;
  return { ok: true, value: listData(result.value) };
}

export async function getTripTaxonomy(locale: Locale): Promise<TripTaxonomy> {
  const [categoriesResult, countsResult, destinationsResult] = await Promise.all([
    getListReliable<ApiPage>("categories?page_limit=200&order_by=display_order,asc", locale),
    apiFetchReliable<{ data?: Record<string, number> }>("categories/count", { locale }),
    getListReliable<ApiPage>("destinations?page_limit=200&parent.slug=egypt&order_by=display_order,asc", locale),
  ]);

  const categories = categoriesResult.ok ? (categoriesResult.value ?? []) : [];
  const counts = countsResult.ok && countsResult.value?.data ? countsResult.value.data : {};
  const countSlugs = new Set(Object.keys(counts));
  const rootCategories = categories.filter(
    (category) => category.parent_id == null && category.slug && countSlugs.has(category.slug),
  );
  const rootIds = new Set(rootCategories.map((category) => category.id).filter(Boolean));
  const childCategories = categories.filter((category) => rootIds.has(category.parent_id as number));
  const destinations = destinationsResult.ok ? (destinationsResult.value ?? []) : [];

  return {
    allCategories: categories,
    rootCategories,
    childCategories,
    destinations,
    counts,
    available: rootCategories.length > 0 || childCategories.length > 0 || destinations.length > 0,
  };
}

export async function getSettingValueReliable<T>(
  optionKey: string,
  locale: Locale,
): Promise<ApiResult<T | null>> {
  const result = await apiFetchReliable<{ data?: SiteSetting[] }>(
    `settings?option_key=${encodeURIComponent(optionKey)}`,
    { locale },
  );
  if (!result.ok) return result;
  const setting = result.value?.data?.find((item) => item.option_key === optionKey);
  return { ok: true, value: (setting?.option_value as T | undefined) ?? null };
}

function stringList(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string" && !!item.trim()) : [];
}

function firstString(value: unknown): string | null {
  return stringList(value)[0] ?? null;
}

function socialList(value: unknown): SocialLink[] {
  if (!Array.isArray(value)) return [];
  return value.filter(
    (item): item is SocialLink =>
      !!item &&
      typeof item === "object" &&
      typeof (item as SocialLink).type === "string" &&
      typeof (item as SocialLink).url === "string",
  );
}

export async function getPublicSiteSettings(locale: Locale): Promise<PublicSiteSettings> {
  // Request only public presentation keys. The unfiltered endpoint also contains
  // operational settings that must never be copied into the browser payload.
  const [title, emails, socials, location] = await Promise.all([
    getSettingValueReliable<unknown>("site_title", locale),
    getSettingValueReliable<unknown>("notification_emails", locale),
    getSettingValueReliable<unknown>("social_links", locale),
    getSettingValueReliable<unknown>("company_location_url", locale),
  ]);

  return {
    siteTitle: title.ok ? firstString(title.value) : null,
    notificationEmails: emails.ok ? stringList(emails.value) : [],
    socialLinks: socials.ok ? socialList(socials.value) : [],
    locationUrl: location.ok ? firstString(location.value) : null,
  };
}

export async function getCompanyTeam(locale: Locale): Promise<TeamMember[]> {
  const result = await getSettingValueReliable<unknown>("company_team", locale);
  if (!result.ok || !Array.isArray(result.value)) return [];
  return result.value.filter(
    (item): item is TeamMember =>
      !!item &&
      typeof item === "object" &&
      typeof (item as TeamMember).name === "string" &&
      typeof (item as TeamMember).position === "string" &&
      typeof (item as TeamMember).image === "string",
  );
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
  const apiResult = await apiFetchReliable<{ data?: ApiPage }>(
    `categories/${encodeURIComponent(slug)}?includes=seo,children`,
    { locale },
  );
  if (!apiResult.ok) return apiResult;
  if (!apiResult.value?.data) {
    return { ok: false, reason: "invalid_response", message: "Category response did not contain data" };
  }
  return { ok: true, value: apiResult.value.data };
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

export async function getTourReliable(
  slug: string,
  locale: Locale,
): Promise<ApiResult<Tour>> {
  const includes = "seo,destinations,categories,options,days,seasons";
  const apiResult = await apiFetchReliable<{ data?: Tour }>(
    `tours/${encodeURIComponent(slug)}?includes=${includes}`,
    { locale, next: { revalidate: 180 } },
  );
  if (!apiResult.ok) return apiResult;
  if (!apiResult.value?.data) {
    return { ok: false, reason: "invalid_response", message: "Tour response did not contain data" };
  }
  return { ok: true, value: apiResult.value.data };
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

export async function getBlogReliable(
  slug: string,
  locale: Locale,
): Promise<ApiResult<ApiPage>> {
  const apiResult = await apiFetchReliable<{ data?: ApiPage }>(
    `blogs/${encodeURIComponent(slug)}?includes=seo,categories`,
    { locale },
  );
  if (!apiResult.ok) return apiResult;
  if (!apiResult.value?.data) {
    return { ok: false, reason: "invalid_response", message: "Blog response did not contain data" };
  }
  return { ok: true, value: apiResult.value.data };
}
