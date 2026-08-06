import type { Metadata } from "next";
import { DestinationCard } from "@/components/DestinationCard";
import { Pagination } from "@/components/Pagination";
import { ResultCount } from "@/components/ResultCount";
import { SiteShell } from "@/components/SiteShell";
import { TourCard } from "@/components/TourCard";
import { getDestinations, getPage, getTours, tourListData, tourMeta } from "@/lib/data";
import { resolvePrefixedLocale } from "@/lib/route-helpers";
import { metadataFromPage } from "@/lib/seo";
import type { ApiList, ApiPage, Tour } from "@/types/api";

const pageSlugMap: Record<string, string> = {
  "one-day-tours": "one-day-tours",
  "multi-days-tours": "multi-days-tours",
  "nile-cruises": "nile-cruises",
  "shore-excursions": "shore-excursions",
};

type Props = {
  params: Promise<{ locale: string; slug: string[] }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function routePath(slug: string[]) {
  return `/egypt-tours/${slug.join("/")}`;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolved = await params;
  const locale = await resolvePrefixedLocale(Promise.resolve({ locale: resolved.locale }));
  const pageSlug = pageSlugMap[resolved.slug[0]] || "tours-search-results";
  const page = await getPage(pageSlug, locale);
  return metadataFromPage(page, `/${locale}${routePath(resolved.slug)}`, locale);
}

export default async function Page({ params, searchParams }: Props) {
  const resolved = await params;
  const query = await searchParams;
  const rawPage = query.page;
  const currentPage = Math.max(
    1,
    parseInt(Array.isArray(rawPage) ? rawPage[0] : rawPage || "1", 10) || 1,
  );
  const locale = await resolvePrefixedLocale(Promise.resolve({ locale: resolved.locale }));
  const pageSlug = pageSlugMap[resolved.slug[0]] || "tours-search-results";
  const isOneDayRoute = resolved.slug?.[0] === "one-day-tours";
  const isOneDayIndex = isOneDayRoute && resolved.slug.length === 1;
  const filterSlug = resolved.slug.at(-1) || resolved.slug[0];
  const limit = isOneDayRoute ? 24 : 12;
  const [page, itemsResponse] = await Promise.all([
    getPage(pageSlug, locale),
    isOneDayIndex
      ? getDestinations("destinations?parent.slug=egypt&order_by=display_order,asc", locale)
      : isOneDayRoute
        ? getTours(
            `tours?exists=wishlisted&destinations.slug=${encodeURIComponent(filterSlug)}&categories.slug[]=night-tours&categories.slug[]=one-day-tours&categories.slug[]=half-day-tour&categories.slug[]=layover&order_by=display_order,asc`,
            locale,
            limit,
            currentPage,
          )
        : getTours(`tours?categories.slug=${encodeURIComponent(filterSlug)}&order_by=display_order,asc`, locale, limit, currentPage),
  ]);
  const items = isOneDayIndex
    ? (itemsResponse as ApiPage[])
    : tourListData(itemsResponse as ApiList<Tour> | null);
  const meta = isOneDayIndex ? null : tourMeta(itemsResponse as ApiList<Tour> | null);

  return (
    <SiteShell locale={locale}>
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
                  locale={locale}
                />
              ))
            : items.map((tour) => <TourCard key={tour.id || tour.slug} tour={tour} locale={locale} />)}
          {!isOneDayIndex && meta && (
            <div className="col-span-full mt-8 flex flex-col items-center justify-between gap-4 lg:flex-row">
              <ResultCount from={meta.from} to={meta.to} total={meta.total} />
              {meta.lastPage > 1 && (
                <Pagination
                  page={currentPage}
                  lastPage={meta.lastPage}
                  basePath={`/${locale}${routePath(resolved.slug)}`}
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
