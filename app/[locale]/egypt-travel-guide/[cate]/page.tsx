import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteShell } from "@/components/SiteShell";
import { TravelGuidePage } from "@/components/ClonedNuxtPages";
import { getBlogCategoryChildren, getBlogCategoryReliable } from "@/lib/data";
import { formatApiError } from "@/lib/api";
import { resolvePrefixedLocale } from "@/lib/route-helpers";
import { metadataFromPage } from "@/lib/seo";
import type { ApiPage, Locale } from "@/types/api";

type Props = { params: Promise<{ locale: string; cate: string }> };

async function resolveCategory(cate: string, locale: Locale): Promise<ApiPage | null> {
  const result = await getBlogCategoryReliable(cate, locale);
  if (!result.ok) {
    if (result.reason === "not_found") notFound();
    throw new Error(`Failed to fetch category "${cate}": ${formatApiError(result)}`);
  }
  if (!result.value) notFound();
  return result.value;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolved = await params;
  const locale = await resolvePrefixedLocale(Promise.resolve({ locale: resolved.locale }));
  const category = await resolveCategory(resolved.cate, locale);
  return metadataFromPage(category, `/${locale}/egypt-travel-guide/${resolved.cate}`, locale);
}

export default async function Page({ params }: Props) {
  const resolved = await params;
  const locale = await resolvePrefixedLocale(Promise.resolve({ locale: resolved.locale }));
  const category = await resolveCategory(resolved.cate, locale);
  const children = category?.id ? await getBlogCategoryChildren(Number(category.id), locale) : [];
  const blogs = Array.isArray(category?.blogs) ? category.blogs : [];
  return (
    <SiteShell locale={locale}>
      <TravelGuidePage page={category} categories={children} blogs={blogs} locale={locale} />
    </SiteShell>
  );
}