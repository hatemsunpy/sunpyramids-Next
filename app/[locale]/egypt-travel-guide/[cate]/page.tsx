import type { Metadata } from "next";
import { SiteShell } from "@/components/SiteShell";
import { TravelGuidePage } from "@/components/ClonedNuxtPages";
import { getBlogCategory, getBlogCategoryChildren } from "@/lib/data";
import { resolvePrefixedLocale } from "@/lib/route-helpers";
import { metadataFromPage } from "@/lib/seo";

type Props = { params: Promise<{ locale: string; cate: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolved = await params;
  const locale = await resolvePrefixedLocale(Promise.resolve({ locale: resolved.locale }));
  const category = await getBlogCategory(resolved.cate, locale);
  return metadataFromPage(category, `/${locale}/egypt-travel-guide/${resolved.cate}`, locale);
}

export default async function Page({ params }: Props) {
  const resolved = await params;
  const locale = await resolvePrefixedLocale(Promise.resolve({ locale: resolved.locale }));
  const category = await getBlogCategory(resolved.cate, locale);
  const children = category?.id ? await getBlogCategoryChildren(Number(category.id), locale) : [];
  const blogs = Array.isArray(category?.blogs) ? category.blogs : [];
  return (
    <SiteShell locale={locale}>
      <TravelGuidePage page={category} categories={children} blogs={blogs} locale={locale} />
    </SiteShell>
  );
}