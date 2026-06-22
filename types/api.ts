export type Locale = "en" | "fr" | "de" | "it" | "pt" | "es" | "zh";

export type SeoFields = {
  meta_title?: string | null;
  meta_description?: string | null;
  meta_keywords?: string | null;
  canonical?: string | null;
  structure_schema?: string | object | object[] | null;
  viewport?: string | null;
  robots?: string | null;
  og_title?: string | null;
  og_description?: string | null;
  og_image?: string | null;
  og_type?: string | null;
  twitter_card?: string | null;
  twitter_description?: string | null;
  twitter_title?: string | null;
  twitter_image?: string | null;
  twitter_creator?: string | null;
};

export type ApiPage = {
  id?: number;
  title?: string;
  name?: string;
  slug?: string;
  description?: string;
  short_description?: string | null;
  content?: string;
  banner?: string;
  featured_image?: string;
  image?: string;
  gallery?: string[];
  metas?: { meta_key?: string; meta_value?: string; value?: string; title?: string; description?: string; [key: string]: unknown }[];
  seo?: SeoFields | null;
  [key: string]: unknown;
};

export type ApiList<T> = {
  data?: T[] | { data?: T[] };
  meta?: unknown;
  links?: unknown;
};

export type Tour = ApiPage & {
  price?: number | string;
  start_from?: number | string;
  adult_price?: number | string;
  duration?: string;
  city?: string;
  destination?: string;
  category?: { name?: string; slug?: string };
  categories?: { name?: string; title?: string; slug?: string }[];
  destinations?: { name?: string; title?: string; slug?: string }[];
  images?: string[];
};
