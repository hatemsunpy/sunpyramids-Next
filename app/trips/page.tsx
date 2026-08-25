import type { Metadata } from "next";
import { SiteShell } from "@/components/SiteShell";
import { TripsListingPage } from "@/components/ClonedNuxtPages";
import { JsonLd } from "@/components/JsonLd";
import { getPage, getTours, getTripTaxonomy, tourListData } from "@/lib/data";
import { metadataFromPage } from "@/lib/seo";
import { tripsRequest, type TripsSearchParams } from "@/lib/trips-query";

type Props = { searchParams: Promise<TripsSearchParams> };

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage("tours-search-results", "en");
  return metadataFromPage(page, "/trips", "en");
}

export default async function Page({ searchParams }: Props) {
  const [page, taxonomy] = await Promise.all([
    getPage("tours-search-results", "en"),
    getTripTaxonomy("en"),
  ]);
  const request = tripsRequest(await searchParams, taxonomy);
  const toursResponse = await getTours(request.endpoint, "en", 24, request.page);
  const tours = tourListData(toursResponse);
  return (
    <SiteShell locale="en">
      <JsonLd schema={page?.seo?.structure_schema} />
      <TripsListingPage page={page} tours={tours} taxonomy={taxonomy} active={request} />
    </SiteShell>
  );
}
