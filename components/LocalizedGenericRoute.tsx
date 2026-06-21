import { GenericRoute } from "@/components/GenericRoute";
import { resolvePrefixedLocale } from "@/lib/route-helpers";

export async function LocalizedGenericRoute({
  route,
  params,
}: {
  route: string;
  params: Promise<{ locale: string }>;
}) {
  const locale = await resolvePrefixedLocale(params);
  return <GenericRoute route={route} locale={locale} />;
}
