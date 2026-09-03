import type { MetadataRoute } from "next";
import { siteConfig } from "./site-config";

// Sitemap statique limité aux routes réellement publiques du site.
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteConfig.siteUrl,
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
