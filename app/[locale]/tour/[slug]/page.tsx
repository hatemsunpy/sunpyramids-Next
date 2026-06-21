import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { SiteShell } from "@/components/SiteShell";
import { TourPage } from "@/components/TourPage";
import { getTour } from "@/lib/data";
import { resolvePrefixedLocale } from "@/lib/route-helpers";
import { metadataFromPage } from "@/lib/seo";

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolved = await params;
  const locale = await resolvePrefixedLocale(Promise.resolve({ locale: resolved.locale }));
  const tour = await getTour(resolved.slug, locale);
  return metadataFromPage(tour, `/${locale}/tour/${resolved.slug}`, locale);
}

export default async function Page({ params }: Props) {
  const resolved = await params;
  const locale = await resolvePrefixedLocale(Promise.resolve({ locale: resolved.locale }));
  const tour = await getTour(resolved.slug, locale);
  return (
    <SiteShell locale={locale}>
      <JsonLd schema={tour?.seo?.structure_schema} />
      <TourPage tour={tour} locale={locale} />
    </SiteShell>
  );
}
