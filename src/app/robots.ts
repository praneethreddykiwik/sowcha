import type { MetadataRoute } from "next";
import { siteUrl } from "@/config/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // The admin and anything order-shaped has no search value, and keeping
      // crawlers out of it is cheaper than relying on per-page noindex alone.
      disallow: ["/admin/", "/checkout", "/orders/"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
