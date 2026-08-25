import { ThankfulPage } from "@/components/ClonedNuxtPages";
import { resolvePrefixedLocale } from "@/lib/route-helpers";

type Props = { params: Promise<{ locale: string }> };

export default async function Page({ params }: Props) {
  const locale = await resolvePrefixedLocale(params);
  return <ThankfulPage locale={locale} />;
}
