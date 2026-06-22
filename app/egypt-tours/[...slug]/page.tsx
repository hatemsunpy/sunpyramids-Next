import type { Metadata } from "next";
import { DestinationCard } from "@/components/DestinationCard";
import { SiteShell } from "@/components/SiteShell";
import { TourCard } from "@/components/TourCard";
import { getDestinations, getPage, getTours } from "@/lib/data";
import { metadataFromPage } from "@/lib/seo";

const pageSlugMap: Record<string, string> = {
  "one-day-tours": "one-day-tours",
  "multi-days-tours": "multi-days-tours",
  "nile-cruises": "nile-cruises",
  "shore-excursions": "shore-excursions",
};

type Props = { params: Promise<{ slug: string[] }> };

function routePath(slug: string[]) {
  return `/egypt-tours/${slug.join("/")}`;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const pageSlug = pageSlugMap[slug[0]] || "tours-search-results";
  const page = await getPage(pageSlug, "en");
  return metadataFromPage(page, routePath(slug), "en");
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const pageSlug = pageSlugMap[slug[0]] || "tours-search-results";
  const isOneDayRoute = slug[0] === "one-day-tours";
  const destinationSlug = slug[1];
  const [page, items] = await Promise.all([
    getPage(pageSlug, "en"),
    isOneDayRoute
      ? getDestinations("destinations?parent.slug=egypt&order_by=display_order,asc", "en")
      : getTours(`tours?categories.slug=${encodeURIComponent(slug.at(-1) || slug[0])}&order_by=display_order,asc`, "en", 12),
  ]);
  const tourQuery = destinationSlug
    ? `tours?destinations.slug=${encodeURIComponent(destinationSlug)}&order_by=display_order,asc`
    : "";
  const destinationTours = destinationSlug ? await getTours(tourQuery, "en", 12) : [];
  const displayItems = destinationSlug ? destinationTours : items;

  return (
    <SiteShell locale="en">
      <main>
        <section
          className="page-hero"
          style={{ backgroundImage: `linear-gradient(rgba(0,0,0,.38), rgba(0,0,0,.38)), url(${page?.banner || "/images/mainBanner.png"})` }}
        >
          <h1>{page?.title || page?.name || "Egypt Tours"}</h1>
        </section>
        <section className={isOneDayRoute && !destinationSlug ? "destination-grid-section" : "section-pad container-shell grid-cards"}>
          {isOneDayRoute && !destinationSlug
            ? displayItems.map((destination) => (
                <DestinationCard
                  key={destination.id || destination.slug}
                  destination={destination}
                  basePath="/egypt-tours/one-day-tours"
                  locale="en"
                />
              ))
            : displayItems.map((tour) => <TourCard key={tour.id || tour.slug} tour={tour} locale="en" />)}
        </section>
      </main>
    </SiteShell>
  );
}
