import { catalogGroups, latestLastmod } from "@/lib/sitemap/builders";
import { xmlResponse } from "@/lib/sitemap/response";
import { getSitemapCatalog } from "@/lib/sitemap/service";
import { absolutePublicUrl, sitemapIndexXml } from "@/lib/sitemap/xml";

// Route segment config must be a statically analyzable literal in Next.js.
export const revalidate = 86400;
export const dynamic = "force-dynamic";

export async function GET() {
  const catalog = await getSitemapCatalog();
  const children = catalogGroups(catalog).map(({ route, records }) => ({
    loc: absolutePublicUrl(route),
    lastmod: latestLastmod(records),
  }));
  return xmlResponse(sitemapIndexXml(children));
}
