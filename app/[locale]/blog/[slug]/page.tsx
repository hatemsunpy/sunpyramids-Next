import type { Metadata } from "next";
import { GenericPage } from "@/components/GenericPage";
import { JsonLd } from "@/components/JsonLd";
import { SiteShell } from "@/components/SiteShell";
import { getBlog } from "@/lib/data";
import { resolvePrefixedLocale } from "@/lib/route-helpers";
import { metadataFromPage } from "@/lib/seo";

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolved = await params;
  const locale = await resolvePrefixedLocale(Promise.resolve({ locale: resolved.locale }));
  const blog = await getBlog(resolved.slug, locale);
  return metadataFromPage(blog, `/${locale}/blog/${resolved.slug}`, locale);
}

export default async function Page({ params }: Props) {
  const resolved = await params;
  const locale = await resolvePrefixedLocale(Promise.resolve({ locale: resolved.locale }));
  const blog = await getBlog(resolved.slug, locale);
  return (
    <SiteShell locale={locale}>
      <JsonLd schema={blog?.seo?.structure_schema} />
      <GenericPage page={blog} fallbackTitle="Egypt Travel Guide" route="blog" locale={locale} />
    </SiteShell>
  );
}
