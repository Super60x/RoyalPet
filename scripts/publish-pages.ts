/**
 * Drip Publisher — RoyalPet.app
 *
 * Sets `published: true` for SEO pages whose publishDate <= today.
 * Called daily by GitHub Actions to release pages on schedule.
 * After publishing, pings IndexNow API to notify search engines.
 *
 * Usage:
 *   npm run publish-pages
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataPath = path.join(__dirname, "../data/seo-pages.json");

const INDEXNOW_KEY = "950c3391-9d3f-4930-aef0-0776e597d660";
const SITE_URL = "https://www.royalpet.app";

async function pingIndexNow(slugs: string[]) {
  if (slugs.length === 0) return;

  const urls = slugs.map((slug) => `${SITE_URL}/kennisbank/${slug}`);

  console.log(`\nPinging IndexNow for ${urls.length} URL(s)...`);

  try {
    const response = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        host: "www.royalpet.app",
        key: INDEXNOW_KEY,
        keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
        urlList: urls,
      }),
    });

    if (response.ok || response.status === 202) {
      console.log(`IndexNow: accepted (${response.status})`);
    } else {
      console.warn(`IndexNow: unexpected status ${response.status}`);
    }
  } catch (err) {
    console.warn(`IndexNow: ping failed — ${err}`);
  }
}

async function main() {
  if (!fs.existsSync(dataPath)) {
    console.log("No seo-pages.json found — nothing to publish.");
    return;
  }

  const pages = JSON.parse(fs.readFileSync(dataPath, "utf8"));
  const today = new Date().toISOString().split("T")[0];
  let publishedCount = 0;
  const publishedSlugs: string[] = [];

  for (const page of pages) {
    if (!page.published && page.publishDate && page.publishDate <= today) {
      page.published = true;
      publishedCount++;
      publishedSlugs.push(page.slug);
      console.log(`  Published: ${page.naam} (${page.slug})`);
    }
  }

  if (publishedCount > 0) {
    fs.writeFileSync(dataPath, JSON.stringify(pages, null, 2));
    console.log(`\nDone! ${publishedCount} pages published (total published: ${pages.filter((p: { published: boolean }) => p.published).length}/${pages.length})`);

    // Notify search engines via IndexNow
    await pingIndexNow(publishedSlugs);
  } else {
    console.log("No pages due for publishing today.");
  }
}

main();
