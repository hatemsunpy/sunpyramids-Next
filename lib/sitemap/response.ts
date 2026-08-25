import { SITEMAP_HEADERS } from "@/lib/sitemap/config";

export function xmlResponse(xml: string, status = 200) {
  return new Response(xml, { status, headers: SITEMAP_HEADERS });
}
