import type { Metadata } from "next";
import { genericPages } from "@/lib/generic-page-config";
import { getPage } from "@/lib/data";
import { metadataFromPage } from "@/lib/seo";
import type { Locale } from "@/types/api";

export async function genericMetadata(route: string, locale: Locale = "en"): Promise<Metadata> {
  const config = genericPages[route];
  const path = locale === "en" ? `/${route}` : `/${locale}/${route}`;
  const page = await getPage(config.apiSlug, locale);
  return metadataFromPage(page, path, locale);
}
