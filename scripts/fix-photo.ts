/**
 * Fix Photo — RoyalPet.app
 *
 * Re-fetches the Unsplash breed photo for a single slug and overwrites it in
 * Supabase Storage. Use this when a breed page shows the wrong subject
 * (e.g. "Boxer" returning a human boxer instead of a Boxer dog).
 *
 * Does NOT regenerate the AI portrait or article content.
 * Does NOT edit data/seo-pages.json (the path is stable — Supabase upsert overwrites the file in place).
 *
 * Usage:
 *   npm run fix-photo -- boxer-portret
 *   npm run fix-photo -- boxer-portret --query "boxer dog portrait"
 */

import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataPath = path.join(__dirname, "../data/seo-pages.json");

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

type BreedEntry = {
  slug: string;
  type: string;
  naam: string;
  nameEn: string;
  photoUrl?: string;
};

function parseArgs(): { slug: string; customQuery: string | null } {
  const args = process.argv.slice(2);
  let slug: string | null = null;
  let customQuery: string | null = null;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--query" && args[i + 1]) {
      customQuery = args[i + 1];
      i++;
    } else if (!args[i].startsWith("--")) {
      slug = args[i];
    }
  }

  if (!slug) {
    console.error("Usage: npm run fix-photo -- <slug> [--query \"custom search\"]");
    console.error("Example: npm run fix-photo -- boxer-portret");
    process.exit(1);
  }

  return { slug, customQuery };
}

async function fetchUnsplashPhoto(searchTerms: string): Promise<string> {
  const accessKey = process.env.UNSPLASH_ACCESS_KEY;
  if (!accessKey) throw new Error("UNSPLASH_ACCESS_KEY missing in env");

  const query = encodeURIComponent(searchTerms);
  const res = await fetch(
    `https://api.unsplash.com/search/photos?query=${query}&per_page=1&orientation=landscape&content_filter=high`,
    { headers: { Authorization: `Client-ID ${accessKey}` } }
  );

  if (!res.ok) throw new Error(`Unsplash API ${res.status}`);
  const data = await res.json();

  if (!data.results || data.results.length === 0) {
    throw new Error(`No Unsplash results for: "${searchTerms}"`);
  }

  return data.results[0].urls.regular as string;
}

async function uploadToSupabase(slug: string, imageUrl: string): Promise<string> {
  const response = await fetch(imageUrl);
  if (!response.ok) throw new Error(`Image fetch failed: ${response.status}`);
  const buffer = Buffer.from(await response.arrayBuffer());

  const filePath = `breeds/photos/${slug}.jpg`;
  const { error } = await supabase.storage
    .from("portraits-public")
    .upload(filePath, buffer, {
      contentType: "image/jpeg",
      upsert: true,
    });

  if (error) throw error;

  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/portraits-public/${filePath}`;
}

async function main() {
  const { slug, customQuery } = parseArgs();

  const pages = JSON.parse(fs.readFileSync(dataPath, "utf-8")) as BreedEntry[];
  const breed = pages.find((p) => p.slug === slug);

  if (!breed) {
    console.error(`Slug "${slug}" not found in data/seo-pages.json`);
    process.exit(1);
  }

  // Same detection logic as generate-pages.ts: cat breeds already contain "cat"
  // in nameEn ("Persian cat", "Maine Coon cat" etc.), so they're unambiguous.
  // Dog breeds need the "dog breed" qualifier.
  const isCat = /\bcat\b/i.test(breed.nameEn);
  const searchTerms = customQuery ?? (isCat ? breed.nameEn : `${breed.nameEn} dog breed`);

  console.log(`Fixing photo for ${breed.naam} (${slug})`);
  console.log(`  Query: "${searchTerms}"`);

  const unsplashUrl = await fetchUnsplashPhoto(searchTerms);
  console.log(`  Unsplash source: ${unsplashUrl}`);

  const publicUrl = await uploadToSupabase(slug, unsplashUrl);
  console.log(`  Uploaded to: ${publicUrl}`);
  console.log("");
  console.log("Done. Verify at:");
  console.log(`  Local:      http://localhost:3000/kennisbank/${slug}`);
  console.log(`  Production: https://www.royalpet.app/kennisbank/${slug}`);
  console.log("Tip: append ?v=2 to bypass Next.js/browser image cache.");
}

main().catch((err) => {
  console.error("Failed:", err.message);
  process.exit(1);
});
