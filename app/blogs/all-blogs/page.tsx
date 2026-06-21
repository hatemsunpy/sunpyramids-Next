import type { Metadata } from "next";
import { BlogCard } from "@/components/BlogCard";
import { JsonLd } from "@/components/JsonLd";
import { SiteShell } from "@/components/SiteShell";
import { getBlogs, getPage } from "@/lib/data";
import { metadataFromPage } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage("all-blogs", "en");
  return metadataFromPage(page, "/blogs/all-blogs", "en");
}

export default async function Page() {
  const [page, blogs] = await Promise.all([getPage("all-blogs", "en"), getBlogs("en", 12)]);
  return (
    <SiteShell locale="en">
      <JsonLd schema={page?.seo?.structure_schema} />
      <main>
        <section className="page-hero" style={{ backgroundImage: "linear-gradient(rgba(0,0,0,.38), rgba(0,0,0,.38)), url(/images/blogsHero.png)" }}>
          <h1>{page?.title || "Travel Blogs"}</h1>
        </section>
        <section className="section-pad container-shell grid-cards">
          {blogs.map((blog) => <BlogCard key={blog.id || blog.slug} blog={blog} locale="en" />)}
        </section>
      </main>
    </SiteShell>
  );
}
