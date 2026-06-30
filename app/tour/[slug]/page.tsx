import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { SiteShell } from "@/components/SiteShell";
import { TourPage } from "@/components/TourPage";
import { getRelatedTours, getTour } from "@/lib/data";
import { metadataFromPage } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tour = await getTour(slug, "en");
  return metadataFromPage(tour, `/tour/${slug}`, "en");
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const tour = await getTour(slug, "en");
  const relatedTours = await getRelatedTours(tour, "en", 12);
  return (
    <SiteShell locale="en">
      <JsonLd schema={tour?.seo?.structure_schema} />
      <TourPage tour={tour} relatedTours={relatedTours} locale="en" />
    </SiteShell>
  );
}
