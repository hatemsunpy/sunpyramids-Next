import Image from "next/image";
import Link from "next/link";
import type { ApiPage, Locale } from "@/types/api";
import { withLocale } from "@/lib/locales";

export function BlogCard({ blog, locale = "en" }: { blog: ApiPage; locale?: Locale }) {
  const slug = blog.slug || String(blog.id || "");
  const title = blog.title || blog.name || "Egypt Travel Guide";
  const image = blog.featured_image || blog.image || blog.banner || "/images/blogsHero.png";
  const description = stripHtml(blog.short_description || blog.description || "Read the latest Egypt travel insights.");

  return (
    <article className="blog-card">
      <Link href={withLocale(`/blog/${slug}`, locale)}>
        <div className="blog-card-media">
          <Image src={image} alt={title} fill sizes="(max-width: 768px) 100vw, 33vw" />
        </div>
        <div className="blog-card-body">
          <p>Travel Guide</p>
          <h3 className="line-clamp-2">{title}</h3>
          <p className="line-clamp-3">{description}</p>
        </div>
      </Link>
    </article>
  );
}

function stripHtml(value: unknown) {
  return decodeHtmlEntities(String(value)
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim());
}

function decodeHtmlEntities(value: string) {
  const namedEntities: Record<string, string> = {
    amp: "&",
    apos: "'",
    gt: ">",
    lt: "<",
    nbsp: " ",
    quot: "\"",
  };

  return value.replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (entity, code: string) => {
    const normalized = code.toLowerCase();
    if (normalized in namedEntities) return namedEntities[normalized];
    if (normalized.startsWith("#x")) return String.fromCodePoint(Number.parseInt(normalized.slice(2), 16));
    if (normalized.startsWith("#")) return String.fromCodePoint(Number.parseInt(normalized.slice(1), 10));
    return entity;
  });
}
