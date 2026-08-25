import { xmlResponse } from "@/lib/sitemap/response";
import { getSitemapCatalog } from "@/lib/sitemap/service";
import { sitemapUrlsetXml } from "@/lib/sitemap/xml";

// Route segment config must be a statically analyzable literal in Next.js.
export const revalidate = 86400;
export const dynamic = "force-dynamic";

type Context = { params: Promise<{ chunk: string }> };

export async function GET(_request: Request, { params }: Context) {
  const chunkNumber = Number((await params).chunk);
  if (!Number.isInteger(chunkNumber) || chunkNumber < 1) return new Response("Not found", { status: 404 });
  const records = (await getSitemapCatalog()).tourChunks[chunkNumber - 1];
  if (!records) return new Response("Not found", { status: 404 });
  return xmlResponse(sitemapUrlsetXml(records));
}
