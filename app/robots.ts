import type { MetadataRoute } from "next";
import { siteConfig } from "./site-config";

// Déclare les règles d’exploration et l’URL canonique du sitemap.
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    host: siteConfig.siteUrl,
    sitemap: `${siteConfig.siteUrl}/sitemap.xml`,
  };
}
