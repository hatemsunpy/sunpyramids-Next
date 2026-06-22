import type { Metadata } from "next";
import { SiteShell } from "@/components/SiteShell";
import { EventDetailPage } from "@/components/ClonedNuxtPages";
import { JsonLd } from "@/components/JsonLd";
import { getCategory, getTours } from "@/lib/data";
import { metadataFromPage } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const event = await getCategory(slug, "en");
  return metadataFromPage(event, `/event/${slug}`, "en");
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const event = await getCategory(slug, "en");
  const tours = event?.id ? await getTours(`tours?exists=wishlisted&categories.id=${event.id}&order_by=display_order,asc&page=1`, "en", 10) : [];
  return (
    <SiteShell locale="en">
      <JsonLd schema={event?.seo?.structure_schema} />
      <EventDetailPage event={event} relatedTours={tours} />
    </SiteShell>
  );
}
