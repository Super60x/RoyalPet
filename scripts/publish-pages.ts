/**
 * Drip Publisher — RoyalPet.app
 *
 * Sets `published: true` for SEO pages whose publishDate <= today.
 * Called daily by GitHub Actions to release pages on schedule.
 *
 * Usage:
 *   npm run publish-pages
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataPath = path.join(__dirname, "../data/seo-pages.json");

function main() {
  if (!fs.existsSync(dataPath)) {
    console.log("No seo-pages.json found — nothing to publish.");
    return;
  }

  const pages = JSON.parse(fs.readFileSync(dataPath, "utf8"));
  const today = new Date().toISOString().split("T")[0];
  let publishedCount = 0;

  for (const page of pages) {
    if (!page.published && page.publishDate && page.publishDate <= today) {
      page.published = true;
      publishedCount++;
      console.log(`  Published: ${page.naam} (${page.slug})`);
    }
  }

  if (publishedCount > 0) {
    fs.writeFileSync(dataPath, JSON.stringify(pages, null, 2));
    console.log(`\nDone! ${publishedCount} pages published (total published: ${pages.filter((p: { published: boolean }) => p.published).length}/${pages.length})`);
  } else {
    console.log("No pages due for publishing today.");
  }
}

main();
