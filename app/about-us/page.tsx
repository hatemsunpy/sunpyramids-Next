import type { Metadata } from "next";
import { GenericPage } from "@/components/GenericPage";
import { JsonLd } from "@/components/JsonLd";
import { SiteShell } from "@/components/SiteShell";
import { getPage } from "@/lib/data";
import { metadataFromPage } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage("about-us", "en");
  return metadataFromPage(page, "/about-us", "en");
}

export default async function Page() {
  const page = await getPage("about-us", "en");
  return (
    <SiteShell locale="en">
      <JsonLd schema={page?.seo?.structure_schema} />
      <GenericPage page={page} fallbackTitle="About Us" />
    </SiteShell>
  );
}
