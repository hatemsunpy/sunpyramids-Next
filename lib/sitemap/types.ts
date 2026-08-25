import type { Locale, SeoFields } from "@/types/api";

export type SitemapApiItem = {
  id?: number;
  key?: string;
  slug?: string;
  title?: string;
  name?: string;
  link?: string | null;
  parent_id?: number | string | null;
  enabled?: boolean;
  active?: boolean;
  status?: string | null;
  updated_at?: string | null;
  featured_image?: string | null;
  banner?: string | null;
  image?: string | null;
  gallery?: string[] | null;
  categories?: SitemapApiItem[];
  seo?: SeoFields | null;
};

export type SitemapDataset = {
  pages: SitemapApiItem[];
  tours: SitemapApiItem[];
  blogs: SitemapApiItem[];
  events: SitemapApiItem[];
  categories: SitemapApiItem[];
  destinations: SitemapApiItem[];
  blogCategories: SitemapApiItem[];
};

export type SitemapImage = { loc: string; title?: string };

export type SitemapRecord = {
  loc: string;
  lastmod?: string;
  locales: Locale[];
  images: SitemapImage[];
};

export type SitemapCatalog = {
  pages: SitemapRecord[];
  posts: SitemapRecord[];
  events: SitemapRecord[];
  travelGuide: SitemapRecord[];
  taxonomies: SitemapRecord[];
  tourChunks: SitemapRecord[][];
};
