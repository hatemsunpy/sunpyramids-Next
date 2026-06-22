import type { Metadata } from "next";
import { DestinationCard } from "@/components/DestinationCard";
import { SiteShell } from "@/components/SiteShell";
import { TourCard } from "@/components/TourCard";
import { getDestinations, getPage, getTours } from "@/lib/data";
import { resolvePrefixedLocale } from "@/lib/route-helpers";
import { metadataFromPage } from "@/lib/seo";

const pageSlugMap: Record<string, string> = {
  "one-day-tours": "one-day-tours",
  "multi-days-tours": "multi-days-tours",
  "nile-cruises": "nile-cruises",
  "shore-excursions": "shore-excursions",
};

type Props = { params: Promise<{ locale: string; slug: string[] }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolved = await params;
  const locale = await resolvePrefixedLocale(Promise.resolve({ locale: resolved.locale }));
  const pageSlug = pageSlugMap[resolved.slug[0]] || "tours-search-results";
  const page = await getPage(pageSlug, locale);
  return metadataFromPage(page, `/${locale}/egypt-tours/${resolved.slug.join("/")}`, locale);
}

export default async function Page({ params }: Props) {
  const resolved = await params;
  const locale = await resolvePrefixedLocale(Promise.resolve({ locale: resolved.locale }));
  const pageSlug = pageSlugMap[resolved.slug[0]] || "tours-search-results";
  const isOneDayRoute = resolved.slug?.[0] === "one-day-tours";
  const [page, items] = await Promise.all([
    getPage(pageSlug, locale),
    isOneDayRoute
      ? getDestinations("destinations?parent.slug=egypt&order_by=display_order,asc", locale)
      : getTours(`tours?categories.slug=${encodeURIComponent(resolved.slug.at(-1) || resolved.slug[0])}&order_by=display_order,asc`, locale, 12),
  ]);

  return (
    <SiteShell locale={locale}>
      <main>
        <section
          className="page-hero"
          style={{ backgroundImage: `linear-gradient(rgba(0,0,0,.38), rgba(0,0,0,.38)), url(${page?.banner || "/images/mainBanner.png"})` }}
        >
          <h1>{page?.title || page?.name || "Egypt Tours"}</h1>
        </section>
        <section className={isOneDayRoute ? "destination-grid-section" : "section-pad container-shell grid-cards"}>
          {isOneDayRoute
            ? items.map((destination) => (
                <DestinationCard
                  key={destination.id || destination.slug}
                  destination={destination}
                  basePath="/egypt-tours/one-day-tours"
                  locale={locale}
                />
              ))
            : items.map((tour) => <TourCard key={tour.id || tour.slug} tour={tour} locale={locale} />)}
        </section>
      </main>
    </SiteShell>
  );
}
