# File: src/app/sitemap.ts

Replace your existing `src/app/sitemap.ts` with this.
It reads `breeds.json` and adds all breed pages automatically — no manual updates needed.

---

```ts
import { MetadataRoute } from "next";
import breeds from "../../data/breeds.json";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://royalpet.app";

  const breedPages = breeds.map((b) => ({
    url: `${baseUrl}/rassen/${b.slug}`,
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
    ...breedPages,
  ];
}
```

---

# File: next.config.js

Replace your existing `next.config.js` with this.
Adds Replicate and Cloudinary as allowed image domains alongside your existing Supabase domain.

---

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        // Existing Supabase storage — do not remove
        protocol: "https",
        hostname: "ylollsyoquziqdezmcyv.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        // Replicate generated portrait images
        protocol: "https",
        hostname: "replicate.delivery",
      },
      {
        // Replicate CDN (alternative hostname)
        protocol: "https",
        hostname: "pbxt.replicate.delivery",
      },
      {
        // Cloudinary (add when you set it up)
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
};

module.exports = nextConfig;
```
