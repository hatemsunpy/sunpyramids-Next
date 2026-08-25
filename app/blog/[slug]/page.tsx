import type { Metadata } from "next";
import { GenericPage } from "@/components/GenericPage";
import { JsonLd } from "@/components/JsonLd";
import { SiteShell } from "@/components/SiteShell";
import { getBlogReliable } from "@/lib/data";
import { resolveRequiredApiResult } from "@/lib/resolve-api-result";
import { metadataFromPage } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const blog = resolveRequiredApiResult(await getBlogReliable(slug, "en"), `blog "${slug}"`);
  return metadataFromPage(blog, `/blog/${slug}`, "en");
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const blog = resolveRequiredApiResult(await getBlogReliable(slug, "en"), `blog "${slug}"`);
  return (
    <SiteShell locale="en">
      <JsonLd schema={blog?.seo?.structure_schema} />
      <GenericPage page={blog} fallbackTitle="Egypt Travel Guide" route="blog" />
    </SiteShell>
  );
}
