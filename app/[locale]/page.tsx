import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteShell } from "@/components/SiteShell";
import { HomePage } from "@/components/HomePage";
import { JsonLd } from "@/components/JsonLd";
import { getBlogs, getHome, getTours, tourListData } from "@/lib/data";
import { isLocale } from "@/lib/locales";
import { metadataFromPage } from "@/lib/seo";
import type { Locale } from "@/types/api";

type Props = { params: Promise<{ locale: string }> };

async function resolveLocale(params: Promise<{ locale: string }>): Promise<Locale> {
  const { locale } = await params;
  if (!isLocale(locale) || locale === "en") notFound();
  return locale;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const page = await getHome(locale);
  return metadataFromPage(page, `/${locale}`, locale);
}

export default async function Page({ params }: Props) {
  const locale = await resolveLocale(params);
  const [page, toursResponse, blogs] = await Promise.all([
    getHome(locale),
    getTours("tours?exists=wishlisted&categories.id=59&order_by=display_order,asc&page=1", locale, 8),
    getBlogs(locale, 4),
  ]);
  const tours = tourListData(toursResponse);

  return (
    <SiteShell locale={locale}>
      <JsonLd schema={page?.seo?.structure_schema} />
      <HomePage page={page} tours={tours} blogs={blogs} locale={locale} />
    </SiteShell>
  );
}
