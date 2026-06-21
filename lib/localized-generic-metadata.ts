import { resolvePrefixedLocale } from "@/lib/route-helpers";
import { genericMetadata } from "@/lib/generic-metadata";

export async function localizedGenericMetadata(
  route: string,
  params: Promise<{ locale: string }>,
) {
  const locale = await resolvePrefixedLocale(params);
  return genericMetadata(route, locale);
}
