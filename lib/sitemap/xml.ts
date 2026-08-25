import { FRONTEND_ORIGIN } from "@/lib/seo";
import { withLocale } from "@/lib/locales";
import type { SitemapRecord } from "@/lib/sitemap/types";
import type { Locale } from "@/types/api";

const XML_DECLARATION = '<?xml version="1.0" encoding="UTF-8"?>';
const XSL_INSTRUCTION = '<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>';

export function escapeXml(xmlText: string) {
  return xmlText
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export function absolutePublicUrl(path: string) {
  const normalizedPath = path === "/" ? "/" : `/${path.replace(/^\/+|\/+$/g, "")}`;
  const origin = `${FRONTEND_ORIGIN.replace(/\/+$/, "")}/`;
  return new URL(normalizedPath, origin)
    .toString()
    .replace(/\/$/, normalizedPath === "/" ? "" : "/");
}

function localizedUrl(record: SitemapRecord, locale: Locale) {
  const path = new URL(record.loc).pathname;
  return absolutePublicUrl(withLocale(path, locale));
}

export function sitemapRecordXml(record: SitemapRecord, documentLocale: Locale) {
  const englishUrl = localizedUrl(record, "en");
  const alternates = [
    `<xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(englishUrl)}" />`,
    ...record.locales.map((locale) =>
      `<xhtml:link rel="alternate" hreflang="${locale}" href="${escapeXml(localizedUrl(record, locale))}" />`,
    ),
  ];
  const images = record.images.map((image) => [
    "<image:image>",
    `<image:loc>${escapeXml(image.loc)}</image:loc>`,
    image.title ? `<image:title>${escapeXml(image.title)}</image:title>` : "",
    "</image:image>",
  ].filter(Boolean).join(""));

  return [
    "<url>",
    `<loc>${escapeXml(localizedUrl(record, documentLocale))}</loc>`,
    record.lastmod ? `<lastmod>${escapeXml(record.lastmod)}</lastmod>` : "",
    ...alternates,
    ...images,
    "</url>",
  ].filter(Boolean).join("");
}

export function sitemapRecordXmlEntries(record: SitemapRecord) {
  return record.locales.map((locale) => sitemapRecordXml(record, locale));
}

export function sitemapUrlsetXml(records: SitemapRecord[]) {
  return [
    XML_DECLARATION,
    XSL_INSTRUCTION,
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    ...records.flatMap(sitemapRecordXmlEntries),
    "</urlset>",
  ].join("\n");
}

export function sitemapIndexXml(children: { loc: string; lastmod?: string }[]) {
  return [
    XML_DECLARATION,
    XSL_INSTRUCTION,
    '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...children.map((child) => [
      "<sitemap>",
      `<loc>${escapeXml(child.loc)}</loc>`,
      child.lastmod ? `<lastmod>${escapeXml(child.lastmod)}</lastmod>` : "",
      "</sitemap>",
    ].filter(Boolean).join("")),
    "</sitemapindex>",
  ].join("\n");
}
