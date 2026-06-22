import { SiteShell } from "@/components/SiteShell";
import { TravelGuidePage } from "@/components/ClonedNuxtPages";
import { getBlogCategory } from "@/lib/data";

type Props = { params: Promise<{ id: string }> };

export default async function Page({ params }: Props) {
  const { id } = await params;
  const category = await getBlogCategory(id, "en");
  const blogs = Array.isArray(category?.blogs) ? category.blogs : [];
  return (
    <SiteShell locale="en">
      <TravelGuidePage page={category} categories={[]} blogs={blogs} />
    </SiteShell>
  );
}
