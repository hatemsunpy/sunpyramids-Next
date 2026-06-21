import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { SiteShell } from "@/components/SiteShell";
import { TourPage } from "@/components/TourPage";
import { getTour } from "@/lib/data";
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
  return (
    <SiteShell locale="en">
      <JsonLd schema={tour?.seo?.structure_schema} />
      <TourPage tour={tour} locale="en" />
    </SiteShell>
  );
}
