import type { Metadata } from "next";
import { GenericPage } from "@/components/GenericPage";
import { JsonLd } from "@/components/JsonLd";
import { SiteShell } from "@/components/SiteShell";
import { getBlog } from "@/lib/data";
import { metadataFromPage } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const blog = await getBlog(slug, "en");
  return metadataFromPage(blog, `/blog/${slug}`, "en");
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const blog = await getBlog(slug, "en");
  return (
    <SiteShell locale="en">
      <JsonLd schema={blog?.seo?.structure_schema} />
      <GenericPage page={blog} fallbackTitle="Egypt Travel Guide" />
    </SiteShell>
  );
}
