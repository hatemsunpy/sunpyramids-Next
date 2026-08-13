import type { Metadata } from "next";
import { SiteShell } from "@/components/SiteShell";
import { TripsListingPage } from "@/components/ClonedNuxtPages";
import { JsonLd } from "@/components/JsonLd";
import { getPage, getTours, tourListData } from "@/lib/data";
import { resolvePrefixedLocale } from "@/lib/route-helpers";
import { metadataFromPage } from "@/lib/seo";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolved = await params;
  const locale = await resolvePrefixedLocale(Promise.resolve({ locale: resolved.locale }));
  const page = await getPage("tours-search-results", locale);
  return metadataFromPage(page, `/${locale}/trips`, locale);
}

export default async function Page({ params }: Props) {
  const resolved = await params;
  const locale = await resolvePrefixedLocale(Promise.resolve({ locale: resolved.locale }));
  const [page, toursResponse] = await Promise.all([
    getPage("tours-search-results", locale),
    getTours("tours?order_by=display_order,asc&page=1", locale, 24),
  ]);
  const tours = tourListData(toursResponse);
  return (
    <SiteShell locale={locale}>
      <JsonLd schema={page?.seo?.structure_schema} />
      <TripsListingPage page={page} tours={tours} locale={locale} />
    </SiteShell>
  );
}