import { GenericPage } from "@/components/GenericPage";
import { JsonLd } from "@/components/JsonLd";
import { SiteShell } from "@/components/SiteShell";
import { genericPages } from "@/lib/generic-page-config";
import { getPage } from "@/lib/data";
import type { Locale } from "@/types/api";

export async function GenericRoute({ route, locale = "en" }: { route: string; locale?: Locale }) {
  const config = genericPages[route];
  const page = await getPage(config.apiSlug, locale);

  return (
    <SiteShell locale={locale}>
      <JsonLd schema={page?.seo?.structure_schema} />
      <GenericPage page={page} fallbackTitle={config.title} />
    </SiteShell>
  );
}
