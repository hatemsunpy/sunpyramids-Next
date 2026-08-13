import type { Metadata } from "next";
import { SiteShell } from "@/components/SiteShell";
import { EventDetailPage } from "@/components/ClonedNuxtPages";
import { JsonLd } from "@/components/JsonLd";
import { getCategory, getTours, tourListData } from "@/lib/data";
import { resolvePrefixedLocale } from "@/lib/route-helpers";
import { metadataFromPage } from "@/lib/seo";

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolved = await params;
  const locale = await resolvePrefixedLocale(Promise.resolve({ locale: resolved.locale }));
  const event = await getCategory(resolved.slug, locale);
  return metadataFromPage(event, `/${locale}/event/${resolved.slug}`, locale);
}

export default async function Page({ params }: Props) {
  const resolved = await params;
  const locale = await resolvePrefixedLocale(Promise.resolve({ locale: resolved.locale }));
  const event = await getCategory(resolved.slug, locale);
  const toursResponse = event?.id
    ? await getTours(`tours?exists=wishlisted&categories.id=${event.id}&order_by=display_order,asc&page=1`, locale, 10)
    : null;
  const tours = tourListData(toursResponse);
  return (
    <SiteShell locale={locale}>
      <JsonLd schema={event?.seo?.structure_schema} />
      <EventDetailPage event={event} relatedTours={tours} locale={locale} />
    </SiteShell>
  );
}