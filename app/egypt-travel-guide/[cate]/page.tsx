import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteShell } from "@/components/SiteShell";
import { TravelGuidePage } from "@/components/ClonedNuxtPages";
import { getBlogCategoryChildren, getBlogCategoryReliable } from "@/lib/data";
import { formatApiError } from "@/lib/api";
import { metadataFromPage } from "@/lib/seo";
import type { ApiPage, Locale } from "@/types/api";

type Props = { params: Promise<{ cate: string }> };

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
  const { cate } = await params;
  const category = await resolveCategory(cate, "en");
  return metadataFromPage(category, `/egypt-travel-guide/${cate}`, "en");
}

export default async function Page({ params }: Props) {
  const { cate } = await params;
  const category = await resolveCategory(cate, "en");
  const children = category?.id ? await getBlogCategoryChildren(Number(category.id), "en") : [];
  const blogs = Array.isArray(category?.blogs) ? category.blogs : [];
  return (
    <SiteShell locale="en">
      <TravelGuidePage page={category} categories={children} blogs={blogs} />
    </SiteShell>
  );
}