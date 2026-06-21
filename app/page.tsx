import type { Metadata } from "next";
import { SiteShell } from "@/components/SiteShell";
import { HomePage } from "@/components/HomePage";
import { JsonLd } from "@/components/JsonLd";
import { getBlogs, getHome, getTours } from "@/lib/data";
import { metadataFromPage } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getHome("en");
  return metadataFromPage(page, "/", "en");
}

export default async function Page() {
  const [page, tours, blogs] = await Promise.all([
    getHome("en"),
    getTours("tours?exists=wishlisted&categories.id=59&order_by=display_order,asc&page=1", "en", 8),
    getBlogs("en", 4),
  ]);

  return (
    <SiteShell locale="en">
      <JsonLd schema={page?.seo?.structure_schema} />
      <HomePage page={page} tours={tours} blogs={blogs} locale="en" />
    </SiteShell>
  );
}
