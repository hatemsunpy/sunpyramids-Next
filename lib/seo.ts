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

const BRAND_NAME = "Sun Pyramids Tours";

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
  options: { alternateLocales?: readonly Locale[] } = {},
): Metadata {
  const seo = page?.seo || {};
  const title = normalizeMetadataText(
    seo.meta_title || page?.title || page?.name || BRAND_NAME,
  );
  const description = normalizeMetadataText(
    seo.meta_description ||
      page?.description ||
      "Sun Pyramids Tours offers Egypt tours, Nile cruises, day tours, and vacation packages.",
  );
  const canonical = normalizeCanonical(seo.canonical, path);
  const barePath = path === "/" ? "/" : path.replace(/^\/(fr|de|it|pt|es|zh)/, "") || "/";

  const alternates: NonNullable<Metadata["alternates"]> = {
    canonical,
    languages: {
      "x-default": publicUrl(barePath),
    },
  };

  for (const item of options.alternateLocales ?? locales) {
    alternates.languages![item] = publicUrl(withLocale(barePath, item));
  }

  return {
    title: { absolute: brandedTitle(title) },
    description,
    robots: seo.robots || "index, follow",
    alternates,
    openGraph: {
      title: seo.og_title || title,
      description: normalizeMetadataText(seo.og_description || description),
      url: canonical,
      siteName: "Sun Pyramids Tours",
      type: openGraphType(seo.og_type),
      images: seo.og_image ? [{ url: seo.og_image }] : undefined,
      locale,
    },
    twitter: {
      card: twitterCard(seo.twitter_card),
      title: seo.twitter_title || seo.og_title || title,
      description: normalizeMetadataText(seo.twitter_description || seo.og_description || description),
      images: seo.twitter_image ? [seo.twitter_image] : undefined,
      creator: seo.twitter_creator || "@sunpyramidstours",
    },
  };
}

export function commercePageMetadata(
  page: "cart" | "checkout",
  locale: Locale,
): Metadata {
  const checkout = page === "checkout";
  return metadataFromPage(
    {
      title: checkout ? "Secure Checkout" : "Shopping Cart",
      description: checkout
        ? "Review your booking details and complete your Sun Pyramids Tours checkout."
        : "Review the tours in your Sun Pyramids Tours shopping cart.",
    },
    withLocale(checkout ? "/cart/checkout" : "/cart", locale),
    locale,
  );
}

function brandedTitle(title: string) {
  return title.toLocaleLowerCase().includes(BRAND_NAME.toLocaleLowerCase())
    ? title
    : `${title} | ${BRAND_NAME}`;
}

function normalizeMetadataText(value: string | null | undefined) {
  if (!value) return "";

  const namedEntities: Record<string, string> = {
    amp: "&",
    apos: "'",
    bull: "•",
    copy: "©",
    euro: "€",
    gt: ">",
    hellip: "…",
    ldquo: "“",
    lsquo: "‘",
    lt: "<",
    mdash: "—",
    nbsp: " ",
    ndash: "–",
    pound: "£",
    quot: '"',
    rdquo: "”",
    reg: "®",
    rsquo: "’",
    trade: "™",
  };
  let decoded = value;
  for (let pass = 0; pass < 3; pass += 1) {
    const next = decoded.replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (entity, key: string) => {
      if (key[0] !== "#") return namedEntities[key.toLowerCase()] ?? entity;
      const hexadecimal = key[1]?.toLowerCase() === "x";
      const codePoint = Number.parseInt(key.slice(hexadecimal ? 2 : 1), hexadecimal ? 16 : 10);
      try {
        return Number.isFinite(codePoint) ? String.fromCodePoint(codePoint) : entity;
      } catch {
        return entity;
      }
    });
    if (next === decoded) break;
    decoded = next;
  }

  return decoded
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
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
