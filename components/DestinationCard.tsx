import Image from "next/image";
import Link from "next/link";
import type { ApiPage, Locale } from "@/types/api";
import { withLocale } from "@/lib/locales";

export function DestinationCard({
  destination,
  basePath,
  locale = "en",
}: {
  destination: ApiPage;
  basePath: string;
  locale?: Locale;
}) {
  const slug = destination.slug || String(destination.id || "");
  const title = destination.title || destination.name || "Egypt Destination";
  const image = destination.featured_image || destination.image || destination.banner || "/images/mainBanner.png";

  return (
    <article className="destination-card">
      <Link href={withLocale(`${basePath}/${slug}`, locale)}>
        <Image src={image} alt={title} fill sizes="(max-width: 768px) 50vw, 25vw" />
        <h2>{title}</h2>
      </Link>
    </article>
  );
}
