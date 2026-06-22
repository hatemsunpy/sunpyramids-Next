import type { Metadata } from "next";
import { SiteShell } from "@/components/SiteShell";
import { MarketingLandingPage } from "@/components/ClonedNuxtPages";
import { JsonLd } from "@/components/JsonLd";
import { getPage, getTours } from "@/lib/data";
import { metadataFromPage } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage("book-egypt-trip", "en");
  return metadataFromPage(page, "/book-egypt-trip", "en");
}

export default async function Page() {
  const [page, tours] = await Promise.all([
    getPage("book-egypt-trip", "en"),
    getTours("tours?exists=wishlisted&order_by=display_order,asc&page=1", "en", 4),
  ]);
  return (
    <SiteShell locale="en">
      <JsonLd schema={page?.seo?.structure_schema} />
      <MarketingLandingPage page={page} tours={tours} />
    </SiteShell>
  );
}
