import type { Metadata } from "next";
import { SiteShell } from "@/components/SiteShell";
import { TripsListingPage } from "@/components/ClonedNuxtPages";
import { JsonLd } from "@/components/JsonLd";
import { getPage, getTours } from "@/lib/data";
import { metadataFromPage } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage("tours-search-results", "en");
  return metadataFromPage(page, "/trips", "en");
}

export default async function Page() {
  const [page, tours] = await Promise.all([
    getPage("tours-search-results", "en"),
    getTours("tours?order_by=display_order,asc&page=1", "en", 24),
  ]);
  return (
    <SiteShell locale="en">
      <JsonLd schema={page?.seo?.structure_schema} />
      <TripsListingPage page={page} tours={tours} />
    </SiteShell>
  );
}
