import type { Locale } from "@/types/api";

export const locales = ["en", "fr", "de", "it", "pt", "es", "zh"] as const;
export const prefixedLocales = ["fr", "de", "it", "pt", "es", "zh"] as const;

export const localeLabels: Record<Locale, string> = {
  en: "EN",
  fr: "FR",
  de: "DE",
  it: "IT",
  pt: "PT",
  es: "ES",
  zh: "ZH",
};

export function isLocale(value: string | undefined): value is Locale {
  return !!value && (locales as readonly string[]).includes(value);
}

export function localePrefix(locale: Locale) {
  return locale === "en" ? "" : `/${locale}`;
}

export function withLocale(path: string, locale: Locale) {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${localePrefix(locale)}${normalized === "/" ? "" : normalized}` || "/";
}

export function stripLocale(path: string) {
  const parts = path.split("/");
  if ((prefixedLocales as readonly string[]).includes(parts[1])) {
    return `/${parts.slice(2).join("/")}`.replace(/\/$/, "") || "/";
  }
  return path || "/";
}
