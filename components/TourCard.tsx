import Image from "next/image";
import Link from "next/link";
import type { Locale, Tour } from "@/types/api";
import { withLocale } from "@/lib/locales";

function imageOf(item: Tour) {
  return (
    item.image ||
    item.banner ||
    item.gallery?.[0] ||
    item.images?.[0] ||
    "/images/mainBanner.png"
  );
}

export function TourCard({ tour, locale = "en" }: { tour: Tour; locale?: Locale }) {
  const slug = tour.slug || String(tour.id || "");
  const title = tour.title || tour.name || "Egypt Tour";

  return (
    <article className="tour-card">
      <Link href={withLocale(`/tour/${slug}`, locale)}>
        <div style={{ position: "relative", aspectRatio: "4 / 3" }}>
          <Image src={imageOf(tour)} alt={title} fill sizes="(max-width: 768px) 100vw, 25vw" />
        </div>
        <div className="card-body">
          <h3 className="line-clamp-2">{title}</h3>
          <p className="muted line-clamp-2">{tour.description || tour.duration || "Explore Egypt with Sun Pyramids Tours."}</p>
          <p style={{ color: "var(--primary)", fontWeight: 700 }}>
            {tour.price || tour.start_from ? `Start From $${tour.price || tour.start_from}` : "View Details"}
          </p>
        </div>
      </Link>
    </article>
  );
}
