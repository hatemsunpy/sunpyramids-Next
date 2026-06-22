import type { Metadata } from "next";
import { SiteShell } from "@/components/SiteShell";
import { TourCard } from "@/components/TourCard";
import { getPage, getTours } from "@/lib/data";
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
  const [page, tours] = await Promise.all([
    getPage(pageSlug, locale),
    getTours(`tours?categories.slug=${encodeURIComponent(resolved.slug.at(-1) || resolved.slug[0])}&order_by=display_order,asc`, locale, 12),
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
        <section className="section-pad container-shell grid-cards">
          {tours.map((tour) => <TourCard key={tour.id || tour.slug} tour={tour} locale={locale} />)}
        </section>
      </main>
    </SiteShell>
  );
}
