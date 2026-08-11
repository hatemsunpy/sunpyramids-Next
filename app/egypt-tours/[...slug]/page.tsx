import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { DestinationCard } from "@/components/DestinationCard";
import { Pagination } from "@/components/Pagination";
import { ResultCount } from "@/components/ResultCount";
import { SiteShell } from "@/components/SiteShell";
import { TourCard } from "@/components/TourCard";
import { getDestinations, getPage, getTours, tourListData, tourMeta } from "@/lib/data";
import { metadataFromPage } from "@/lib/seo";
import type { ApiList, ApiPage, Tour } from "@/types/api";

const pageSlugMap: Record<string, string> = {
  "one-day-tours": "one-day-tours",
  "multi-days-tours": "multi-days-tours",
  "nile-cruises": "nile-cruises",
  "shore-excursions": "shore-excursions",
};

type Props = {
  params: Promise<{ slug: string[] }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function routePath(slug: string[]) {
  return `/egypt-tours/${slug.join("/")}`;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const pageSlug = pageSlugMap[slug[0]] || "tours-search-results";
  const page = await getPage(pageSlug, "en");
  return metadataFromPage(page, routePath(slug), "en");
}

export default async function Page({ params, searchParams }: Props) {
  const { slug } = await params;
  const query = await searchParams;
  const rawPage = query.page;
  const currentPage = Math.max(
    1,
    parseInt(Array.isArray(rawPage) ? rawPage[0] : rawPage || "1", 10) || 1,
  );
  const pageSlug = pageSlugMap[slug[0]] || "tours-search-results";
  const isOneDayRoute = slug[0] === "one-day-tours";
  const isOneDayIndex = isOneDayRoute && slug.length === 1;
  const filterSlug = slug.at(-1) || slug[0];
  const limit = isOneDayRoute ? 24 : 12;
  const [page, itemsResponse] = await Promise.all([
    getPage(pageSlug, "en"),
    isOneDayIndex
      ? getDestinations("destinations?parent.slug=egypt&order_by=display_order,asc", "en")
      : isOneDayRoute
        ? getTours(
            `tours?exists=wishlisted&destinations.slug=${encodeURIComponent(filterSlug)}&categories.slug[]=night-tours&categories.slug[]=one-day-tours&categories.slug[]=half-day-tour&categories.slug[]=layover&order_by=display_order,asc`,
            "en",
            limit,
            currentPage,
          )
        : getTours(`tours?categories.slug=${encodeURIComponent(filterSlug)}&order_by=display_order,asc`, "en", limit, currentPage),
  ]);
  const items = isOneDayIndex
    ? (itemsResponse as ApiPage[])
    : tourListData(itemsResponse as ApiList<Tour> | null);
  const meta = isOneDayIndex ? null : tourMeta(itemsResponse as ApiList<Tour> | null);

  // Validate the requested page against the API-provided last page and redirect
  // back to a valid page instead of rendering an empty out-of-range listing.
  if (!isOneDayIndex && meta && currentPage > meta.lastPage) {
    redirect(meta.lastPage > 1 ? `${routePath(slug)}?page=${meta.lastPage}` : routePath(slug));
  }

  return (
    <SiteShell locale="en">
      <main>
        <section
          className="page-hero"
          style={{ backgroundImage: `linear-gradient(rgba(0,0,0,.38), rgba(0,0,0,.38)), url(${page?.banner || "/images/mainBanner.png"})` }}
        >
          <h1>{page?.title || page?.name || "Egypt Tours"}</h1>
        </section>
        <section className={isOneDayIndex ? "destination-grid-section" : "section-pad container-shell grid-cards"}>
          {isOneDayIndex
            ? items.map((destination) => (
                <DestinationCard
                  key={destination.id || destination.slug}
                  destination={destination}
                  basePath="/egypt-tours/one-day-tours"
                  locale="en"
                />
              ))
            : items.map((tour) => <TourCard key={tour.id || tour.slug} tour={tour} locale="en" />)}
          {!isOneDayIndex && meta && (
            <div className="col-span-full mt-8 flex flex-col items-center justify-between gap-4 lg:flex-row">
              <ResultCount from={meta.from} to={meta.to} total={meta.total} />
              {meta.lastPage > 1 && (
                <Pagination
                  page={currentPage}
                  lastPage={meta.lastPage}
                  basePath={routePath(slug)}
                  query={new URLSearchParams()}
                />
              )}
            </div>
          )}
        </section>
      </main>
    </SiteShell>
  );
}
