import type { Metadata } from "next";
import type { ApiPage, Locale, SeoFields } from "@/types/api";
import { locales, withLocale } from "@/lib/locales";

type OpenGraphType =
  | "website"
  | "article"
  | "book"
  | "profile"
  | "music.song"
  | "music.album"
  | "music.playlist"
  | "music.radio_station"
  | "video.movie"
  | "video.episode"
  | "video.tv_show"
  | "video.other";

type TwitterCard = "summary" | "summary_large_image" | "app" | "player";

const VALID_OPEN_GRAPH_TYPES = new Set<OpenGraphType>([
  "website",
  "article",
  "book",
  "profile",
  "music.song",
  "music.album",
  "music.playlist",
  "music.radio_station",
  "video.movie",
  "video.episode",
  "video.tv_show",
  "video.other",
]);

const VALID_TWITTER_CARDS = new Set<TwitterCard>([
  "summary",
  "summary_large_image",
  "app",
  "player",
]);

export const FRONTEND_ORIGIN =
  process.env.NEXT_PUBLIC_APP_URL || "https://sunpyramidstours.com";

export function validateAndParseSchema(raw: SeoFields["structure_schema"]) {
  if (!raw) return null;

  if (typeof raw === "object") {
    return Array.isArray(raw) || raw["@context" as keyof typeof raw] ? raw : null;
  }

  if (!raw.trim()) return null;

  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed.length ? parsed : null;
    if (parsed && typeof parsed === "object") return parsed;
    return null;
  } catch {
    return null;
  }
}

export function publicUrl(path: string) {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${FRONTEND_ORIGIN}${normalized === "/" ? "" : normalized}`;
}

export function metadataFromPage(
  page: ApiPage | null | undefined,
  path: string,
  locale: Locale,
): Metadata {
  const seo = page?.seo || {};
  const title =
    seo.meta_title || page?.title || page?.name || "Sun Pyramids Tours";
  const description =
    seo.meta_description ||
    page?.description ||
    "Sun Pyramids Tours offers Egypt tours, Nile cruises, day tours, and vacation packages.";
  const canonical = normalizeCanonical(seo.canonical, path);
  const barePath = path === "/" ? "/" : path.replace(/^\/(fr|de|it|pt|es|zh)/, "") || "/";

  const alternates: NonNullable<Metadata["alternates"]> = {
    canonical,
    languages: {
      "x-default": publicUrl(barePath),
    },
  };

  for (const item of locales) {
    alternates.languages![item] = publicUrl(withLocale(barePath, item));
  }

  return {
    title,
    description,
    robots: seo.robots || "index, follow",
    alternates,
    openGraph: {
      title: seo.og_title || title,
      description: seo.og_description || description,
      url: canonical,
      siteName: "Sun Pyramids Tours",
      type: openGraphType(seo.og_type),
      images: seo.og_image ? [{ url: seo.og_image }] : undefined,
      locale,
    },
    twitter: {
      card: twitterCard(seo.twitter_card),
      title: seo.twitter_title || seo.og_title || title,
      description: seo.twitter_description || seo.og_description || description,
      images: seo.twitter_image ? [seo.twitter_image] : undefined,
      creator: seo.twitter_creator || "@sunpyramidstours",
    },
  };
}

function openGraphType(type: string | null | undefined): OpenGraphType {
  return type && VALID_OPEN_GRAPH_TYPES.has(type as OpenGraphType) ? (type as OpenGraphType) : "website";
}

function twitterCard(card: string | null | undefined): TwitterCard {
  return card && VALID_TWITTER_CARDS.has(card as TwitterCard) ? (card as TwitterCard) : "summary_large_image";
}

function normalizeCanonical(canonical: string | null | undefined, path: string) {
  if (!canonical) return publicUrl(path);

  try {
    const url = new URL(canonical);
    return `${FRONTEND_ORIGIN}${url.pathname}${url.search}`;
  } catch {
    return publicUrl(path);
  }
}
