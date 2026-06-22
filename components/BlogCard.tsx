import Image from "next/image";
import Link from "next/link";
import type { ApiPage, Locale } from "@/types/api";
import { withLocale } from "@/lib/locales";

export function BlogCard({ blog, locale = "en" }: { blog: ApiPage; locale?: Locale }) {
  const slug = blog.slug || String(blog.id || "");
  const title = blog.title || blog.name || "Egypt Travel Guide";
  const image = blog.featured_image || blog.image || blog.banner || "/images/blogsHero.png";
  const description = blog.short_description || blog.description || "Read the latest Egypt travel insights.";

  return (
    <article className="blog-card">
      <Link href={withLocale(`/blog/${slug}`, locale)}>
        <div style={{ position: "relative", aspectRatio: "4 / 3" }}>
          <Image src={image} alt={title} fill sizes="(max-width: 768px) 100vw, 33vw" />
        </div>
        <div className="card-body">
          <h3 className="line-clamp-2">{title}</h3>
          <p className="muted line-clamp-3">{description}</p>
        </div>
      </Link>
    </article>
  );
}
