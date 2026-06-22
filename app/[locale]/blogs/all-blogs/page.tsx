import type { Metadata } from "next";
import { BlogCard } from "@/components/BlogCard";
import { JsonLd } from "@/components/JsonLd";
import { SiteShell } from "@/components/SiteShell";
import { getBlogs, getPage } from "@/lib/data";
import { resolvePrefixedLocale } from "@/lib/route-helpers";
import { metadataFromPage } from "@/lib/seo";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await resolvePrefixedLocale(params);
  const page = await getPage("all-blogs", locale);
  return metadataFromPage(page, `/${locale}/blogs/all-blogs`, locale);
}

export default async function Page({ params }: Props) {
  const locale = await resolvePrefixedLocale(params);
  const [page, blogs] = await Promise.all([getPage("all-blogs", locale), getBlogs(locale, 12)]);
  return (
    <SiteShell locale={locale}>
      <JsonLd schema={page?.seo?.structure_schema} />
      <main>
        <section
          className="page-hero"
          style={{ backgroundImage: `linear-gradient(rgba(0,0,0,.38), rgba(0,0,0,.38)), url(${page?.banner || "/images/blogsHero.png"})` }}
        >
          <h1>{page?.title || "Travel Blogs"}</h1>
        </section>
        <section className="section-pad container-shell grid-cards">
          {blogs.map((blog) => <BlogCard key={blog.id || blog.slug} blog={blog} locale={locale} />)}
        </section>
      </main>
    </SiteShell>
  );
}
