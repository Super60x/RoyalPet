import { MetadataRoute } from "next";
import seoPages from "../../data/seo-pages.json";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://royalpet.app";

  const kennisbankPages = seoPages
    .filter((p) => p.published)
    .map((p) => ({
      url: `${baseUrl}/kennisbank/${p.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.3,
    },
    ...kennisbankPages,
  ];
}
