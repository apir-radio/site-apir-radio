import type { MetadataRoute } from "next";

export const dynamic = "force-static";

const siteUrl = "https://www.apir-radio.fr";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteUrl,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${siteUrl}/adhesion/`,
      changeFrequency: "yearly",
      priority: 0.6,
    },
  ];
}
