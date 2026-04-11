/**
 * Pinterest Pin Export — RoyalPet.app
 *
 * Generates a CSV file with all published breed pages for Pinterest bulk upload.
 * Output: pinterest-pins.csv (in project root)
 *
 * CSV columns match Pinterest's bulk upload format:
 *   Title, Description, Link, Image URL, Board
 *
 * Usage:
 *   npm run export-pins
 *   npx tsx scripts/export-pinterest-pins.ts
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataPath = path.join(__dirname, "../data/seo-pages.json");
const outputPath = path.join(__dirname, "../pinterest-pins.csv");

const SITE_URL = "https://www.royalpet.app";

function escapeCsv(value: string): string {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function main() {
  if (!fs.existsSync(dataPath)) {
    console.log("No seo-pages.json found.");
    return;
  }

  const pages = JSON.parse(fs.readFileSync(dataPath, "utf8"));
  const published = pages.filter(
    (p: { published: boolean; portraitUrl?: string }) => p.published && p.portraitUrl
  );

  if (published.length === 0) {
    console.log("No published pages with portraits found.");
    return;
  }

  // CSV header — Pinterest required column names
  const rows: string[] = ["Title,Description,Link,Media URL,Pinterest board,Keywords"];

  for (const page of published) {
    const title = page.pinterestTitle || `${page.naam} Renaissance Portret | RoyalPet`;
    const description =
      page.pinterestDescription ||
      `${page.naam} als Renaissance meesterwerk. AI-gegenereerd portret op royalpet.app`;
    const link = `${SITE_URL}/kennisbank/${page.slug}`;
    const mediaUrl = page.portraitUrl;

    // Board name based on type
    const board =
      page.type === "breed"
        ? "Honden Renaissance Portretten"
        : "Huisdier Portretten";

    const keywords = `${page.naam},renaissance portret,huisdier portret,honden kunst,AI portret,RoyalPet`;

    rows.push(
      [
        escapeCsv(title),
        escapeCsv(description),
        escapeCsv(link),
        escapeCsv(mediaUrl),
        escapeCsv(board),
        escapeCsv(keywords),
      ].join(",")
    );
  }

  fs.writeFileSync(outputPath, rows.join("\n"), "utf8");
  console.log(`Exported ${published.length} pins to pinterest-pins.csv`);
  console.log("\nNext steps:");
  console.log("1. Go to Pinterest Business → Bulk create pins");
  console.log('2. Create board "Honden Renaissance Portretten" if it doesn\'t exist');
  console.log("3. Upload pinterest-pins.csv");
}

main();
