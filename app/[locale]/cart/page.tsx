import { SiteShell } from "@/components/SiteShell";
import { CartClonePage } from "@/components/ClonedNuxtPages";
import { resolvePrefixedLocale } from "@/lib/route-helpers";

type Props = { params: Promise<{ locale: string }> };

export default async function Page({ params }: Props) {
  const locale = await resolvePrefixedLocale(params);
  return <SiteShell locale={locale}><CartClonePage locale={locale} /></SiteShell>;
}
