import type { Metadata } from "next";
import { SiteShell } from "@/components/SiteShell";
import { TourCard } from "@/components/TourCard";
import { getPage, getTours } from "@/lib/data";
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
  const [page, tours] = await Promise.all([
    getPage(pageSlug, "en"),
    getTours(`tours?categories.slug=${encodeURIComponent(slug.at(-1) || slug[0])}&order_by=display_order,asc`, "en", 12),
  ]);
  return (
    <SiteShell locale="en">
      <main>
        <section className="page-hero">
          <h1>{page?.title || page?.name || "Egypt Tours"}</h1>
        </section>
        <section className="section-pad container-shell grid-cards">
          {tours.map((tour) => <TourCard key={tour.id || tour.slug} tour={tour} locale="en" />)}
        </section>
      </main>
    </SiteShell>
  );
}
