import { SiteShell } from "@/components/SiteShell";
import { TravelGuidePage } from "@/components/ClonedNuxtPages";
import { getBlogCategory } from "@/lib/data";

type Props = { params: Promise<{ cate: string }> };

export default async function Page({ params }: Props) {
  const { cate } = await params;
  const category = await getBlogCategory(cate, "en");
  const children = Array.isArray(category?.children) ? category.children : [];
  const blogs = Array.isArray(category?.blogs) ? category.blogs : [];
  return (
    <SiteShell locale="en">
      <TravelGuidePage page={category} categories={children} blogs={blogs} />
    </SiteShell>
  );
}
