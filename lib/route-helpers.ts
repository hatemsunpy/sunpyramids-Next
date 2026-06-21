import { notFound } from "next/navigation";
import { isLocale } from "@/lib/locales";
import type { Locale } from "@/types/api";

export async function resolvePrefixedLocale(params: Promise<{ locale: string }>): Promise<Locale> {
  const { locale } = await params;
  if (!isLocale(locale) || locale === "en") notFound();
  return locale;
}
