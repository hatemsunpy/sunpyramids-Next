import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { DestinationCard } from "@/components/DestinationCard";
import { JsonLd } from "@/components/JsonLd";
import { Pagination } from "@/components/Pagination";
import { ResultCount } from "@/components/ResultCount";
import { SiteShell } from "@/components/SiteShell";
import { TourCard } from "@/components/TourCard";
import { getCategoryReliable, getDestinationReliable, getDestinations, getPageReliable, getTours, tourListData, tourMeta } from "@/lib/data";
import { formatApiError, type ApiResult } from "@/lib/api";
import { decodePathSegment } from "@/lib/locales";
import { resolvePrefixedLocale } from "@/lib/route-helpers";
import { metadataFromPage } from "@/lib/seo";
import type { ApiList, ApiPage, Locale, Tour } from "@/types/api";

const pageSlugMap: Record<string, string> = {
  "one-day-tours": "one-day-tours",
  "multi-days-tours": "multi-days-tours",
  "nile-cruises": "nile-cruises",
  "shore-excursions": "shore-excursions",
};

const marketingPageKeyMap: Record<string, string> = {
  "egypt-sightseeing-tours": "egypt-sightseeing-tours",
  "egypt-travel-packages": "egypt-travel-packages",
  "egypt-vacation-packages": "egypt-vacation-packages",
  "pyramids-tours": "pyramids-tours",
};

type Props = {
  params: Promise<{ locale: string; slug: string[] }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function routePath(slug: string[]) {
  return `/egypt-tours/${slug.map(encodeURIComponent).join("/")}`;
}

async function resolveEgyptToursPage(slug: string[], locale: Locale): Promise<ApiResult<ApiPage | null>> {
  const root = slug[0];
  const childSlug = slug.length > 1 ? slug[slug.length - 1] : null;
  if (childSlug) {
    if (root === "one-day-tours") {
      return getDestinationReliable(childSlug, locale);
    }
    return getCategoryReliable(childSlug, locale);
  }
  if (root === "multi-days-tours" || root === "shore-excursions") {
    return getCategoryReliable(root, locale);
  }
  const pageSlug = pageSlugMap[root] || marketingPageKeyMap[root];
  if (pageSlug) return getPageReliable(pageSlug, locale);
  return getCategoryReliable(root, locale);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolved = await params;
  const slug = resolved.slug.map(decodePathSegment);
  const locale = await resolvePrefixedLocale(Promise.resolve({ locale: resolved.locale }));
  const result = await resolveEgyptToursPage(slug, locale);
  if (!result.ok) {
    if (result.reason === "not_found") notFound();
    throw new Error(`Failed to fetch egypt-tours page "${slug.join("/")}": ${formatApiError(result)}`);
  }
  return metadataFromPage(result.value, `/${locale}${routePath(slug)}`, locale);
}

export default async function Page({ params, searchParams }: Props) {
  const resolved = await params;
  const slug = resolved.slug.map(decodePathSegment);
  const query = await searchParams;
  const rawPage = query.page;
  const currentPage = Math.max(
    1,
    parseInt(Array.isArray(rawPage) ? rawPage[0] : rawPage || "1", 10) || 1,
  );
  const locale = await resolvePrefixedLocale(Promise.resolve({ locale: resolved.locale }));
  const isOneDayRoute = slug?.[0] === "one-day-tours";
  const isOneDayIndex = isOneDayRoute && slug.length === 1;
  const filterSlug = slug.at(-1) || slug[0];
  const limit = isOneDayRoute ? 24 : 12;
  const [pageResult, itemsResponse] = await Promise.all([
    resolveEgyptToursPage(slug, locale),
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
  if (!pageResult.ok) {
    if (pageResult.reason === "not_found") notFound();
    throw new Error(`Failed to fetch egypt-tours page "${slug.join("/")}": ${formatApiError(pageResult)}`);
  }
  const page = pageResult.value;
  if (!page) notFound();
  const items = isOneDayIndex
    ? (itemsResponse as ApiPage[])
    : tourListData(itemsResponse as ApiList<Tour> | null);
  const meta = isOneDayIndex ? null : tourMeta(itemsResponse as ApiList<Tour> | null);

  // Validate the requested page against the API-provided last page and redirect
  // back to a valid page instead of rendering an empty out-of-range listing.
  if (!isOneDayIndex && meta && currentPage > meta.lastPage) {
    redirect(meta.lastPage > 1 ? `/${locale}${routePath(slug)}?page=${meta.lastPage}` : `/${locale}${routePath(slug)}`);
  }

  return (
    <SiteShell locale={locale}>
      <JsonLd schema={page.seo?.structure_schema} />
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
                  basePath={`/${locale}${routePath(slug)}`}
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
