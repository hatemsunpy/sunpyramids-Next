import type { Metadata } from "next";
import { SiteShell } from "@/components/SiteShell";
import { TravelGuidePage } from "@/components/ClonedNuxtPages";
import { getBlogCategory, getBlogCategoryChildren } from "@/lib/data";
import { metadataFromPage } from "@/lib/seo";

type Props = { params: Promise<{ cate: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { cate } = await params;
  const category = await getBlogCategory(cate, "en");
  return metadataFromPage(category, `/egypt-travel-guide/${cate}`, "en");
}

export default async function Page({ params }: Props) {
  const { cate } = await params;
  const category = await getBlogCategory(cate, "en");
  const children = category?.id ? await getBlogCategoryChildren(Number(category.id), "en") : [];
  const blogs = Array.isArray(category?.blogs) ? category.blogs : [];
  return (
    <SiteShell locale="en">
      <TravelGuidePage page={category} categories={children} blogs={blogs} />
    </SiteShell>
  );
}
