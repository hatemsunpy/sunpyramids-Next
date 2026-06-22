import type { MetadataRoute } from "next";
import { FRONTEND_ORIGIN } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/admin/", "/dashboard/", "/cart/checkout"],
    },
    sitemap: `${FRONTEND_ORIGIN}/sitemap.xml`,
  };
}
