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

export const languageOptions: { code: Locale; name: string; country: string; language: string }[] = [
  { code: "en", name: "EN", country: "United States", language: "English" },
  { code: "fr", name: "FR", country: "France", language: "Français" },
  { code: "de", name: "DE", country: "Germany", language: "Deutsch" },
  { code: "it", name: "IT", country: "Italia", language: "Italiano" },
  { code: "pt", name: "PT", country: "Portugal", language: "Português" },
  { code: "es", name: "ES", country: "Spain", language: "Español" },
  { code: "zh", name: "ZH", country: "中国", language: "中文" },
];

export function isLocale(value: string | undefined): value is Locale {
  return !!value && (locales as readonly string[]).includes(value);
}

export function localeFromPathname(pathname: string): Locale {
  const firstSegment = pathname.split("/").filter(Boolean)[0];
  return isLocale(firstSegment) && firstSegment !== "en" ? firstSegment : "en";
}

export function decodePathSegment(segment: string) {
  try {
    return decodeURIComponent(segment);
  } catch {
    return segment;
  }
}

export function localePrefix(locale: Locale) {
  return locale === "en" ? "" : `/${locale}`;
}

export function withLocale(path: string, locale: Locale) {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${localePrefix(locale)}${normalized === "/" ? "" : normalized}` || "/";
}

export function tourPath(slug: string, locale: Locale) {
  return withLocale(`/tour/${encodeURIComponent(slug)}`, locale);
}

export function stripLocale(path: string) {
  const parts = path.split("/");
  if ((prefixedLocales as readonly string[]).includes(parts[1])) {
    return `/${parts.slice(2).join("/")}`.replace(/\/$/, "") || "/";
  }
  return path || "/";
}
