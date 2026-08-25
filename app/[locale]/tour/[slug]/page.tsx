import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { SiteShell } from "@/components/SiteShell";
import { TourPage } from "@/components/TourPage";
import { getRelatedTours, getTourReliable } from "@/lib/data";
import { resolvePrefixedLocale } from "@/lib/route-helpers";
import { resolveRequiredApiResult } from "@/lib/resolve-api-result";
import { metadataFromPage } from "@/lib/seo";

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolved = await params;
  const locale = await resolvePrefixedLocale(Promise.resolve({ locale: resolved.locale }));
  const tour = resolveRequiredApiResult(await getTourReliable(resolved.slug, locale), `tour "${resolved.slug}"`);
  return metadataFromPage(tour, `/${locale}/tour/${resolved.slug}`, locale);
}

export default async function Page({ params }: Props) {
  const resolved = await params;
  const locale = await resolvePrefixedLocale(Promise.resolve({ locale: resolved.locale }));
  const tour = resolveRequiredApiResult(await getTourReliable(resolved.slug, locale), `tour "${resolved.slug}"`);
  const relatedTours = await getRelatedTours(tour, locale, 12);
  return (
    <SiteShell locale={locale}>
      <JsonLd schema={tour?.seo?.structure_schema} />
      <TourPage tour={tour} relatedTours={relatedTours} locale={locale} />
    </SiteShell>
  );
}
