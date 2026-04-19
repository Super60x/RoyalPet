/**
 * SEO Page Generator — RoyalPet.app
 *
 * Generates Dutch SEO content + Renaissance portrait images for breed pages.
 * Images are uploaded to Supabase Storage for permanent URLs.
 *
 * Usage:
 *   npm run generate-pages
 *   npm run generate-pages -- --batch-size 5 --start-date 2026-04-10 --interval-days 2
 *
 * Flags:
 *   --batch-size N        Only generate N new breeds (default: all)
 *   --start-date DATE     First publishDate for new breeds (default: today)
 *   --interval-days N     Days between batches of 5 (default: 2)
 *
 * Crash-safe: saves after every breed. Re-run to continue where it left off.
 */

import Anthropic from "@anthropic-ai/sdk";
import Replicate from "replicate";
import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataPath = path.join(__dirname, "../data/seo-pages.json");

// --- Clients ---

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const replicate = new Replicate({ auth: process.env.REPLICATE_API_TOKEN });
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// --- Breed list (NL/BE market) ---

const ALL_BREEDS = [
  // Dogs
  { naam: "Gouden Retriever", slug: "gouden-retriever-portret", nameEn: "Golden Retriever" },
  { naam: "Labrador", slug: "labrador-portret", nameEn: "Labrador Retriever" },
  { naam: "Franse Bulldog", slug: "franse-bulldog-portret", nameEn: "French Bulldog" },
  { naam: "Beagle", slug: "beagle-portret", nameEn: "Beagle" },
  { naam: "Teckel", slug: "teckel-portret", nameEn: "Dachshund" },
  { naam: "Chihuahua", slug: "chihuahua-portret", nameEn: "Chihuahua" },
  { naam: "Mopshond", slug: "mopshond-portret", nameEn: "Pug" },
  { naam: "Shih Tzu", slug: "shih-tzu-portret", nameEn: "Shih Tzu" },
  { naam: "Border Collie", slug: "border-collie-portret", nameEn: "Border Collie" },
  { naam: "Maltezer", slug: "maltezer-portret", nameEn: "Maltese" },
  { naam: "Poedel", slug: "poedel-portret", nameEn: "Poodle" },
  { naam: "Rottweiler", slug: "rottweiler-portret", nameEn: "Rottweiler" },
  { naam: "Husky", slug: "husky-portret", nameEn: "Siberian Husky" },
  { naam: "Dalmatier", slug: "dalmatier-portret", nameEn: "Dalmatian" },
  { naam: "Cocker Spaniël", slug: "cocker-spaniel-portret", nameEn: "Cocker Spaniel" },
  { naam: "Engelse Bulldog", slug: "engelse-bulldog-portret", nameEn: "English Bulldog" },
  { naam: "Boxer", slug: "boxer-portret", nameEn: "Boxer" },
  { naam: "Dobermann", slug: "dobermann-portret", nameEn: "Dobermann" },
  { naam: "Weimaraner", slug: "weimaraner-portret", nameEn: "Weimaraner" },
  { naam: "Berner Sennenhond", slug: "berner-sennenhond-portret", nameEn: "Bernese Mountain Dog" },
  { naam: "Samoyed", slug: "samoyed-portret", nameEn: "Samoyed" },
  { naam: "Akita", slug: "akita-portret", nameEn: "Akita" },
  { naam: "Chow Chow", slug: "chow-chow-portret", nameEn: "Chow Chow" },
  { naam: "Australische Herder", slug: "australische-herder-portret", nameEn: "Australian Shepherd" },
  { naam: "Dwergschnauzer", slug: "dwergschnauzer-portret", nameEn: "Miniature Schnauzer" },
  { naam: "Duitse Herder", slug: "duitse-herder-portret", nameEn: "German Shepherd" },
  { naam: "Jack Russell", slug: "jack-russell-portret", nameEn: "Jack Russell Terrier" },
  { naam: "Cavalier King Charles", slug: "cavalier-king-charles-portret", nameEn: "Cavalier King Charles Spaniel" },
  { naam: "Stafford", slug: "stafford-portret", nameEn: "Staffordshire Bull Terrier" },
  { naam: "Yorkshire Terrier", slug: "yorkshire-terrier-portret", nameEn: "Yorkshire Terrier" },
  // Cats
  { naam: "Kat", slug: "kat-portret", nameEn: "domestic cat" },
  { naam: "Perzische Kat", slug: "perzische-kat-portret", nameEn: "Persian cat" },
  { naam: "Maine Coon", slug: "maine-coon-portret", nameEn: "Maine Coon cat" },
  { naam: "Britse Korthaar", slug: "britse-korthaar-portret", nameEn: "British Shorthair cat" },
  { naam: "Siamese Kat", slug: "siamese-kat-portret", nameEn: "Siamese cat" },
];

// --- CLI args ---

function parseArgs() {
  const args = process.argv.slice(2);
  let batchSize = Infinity;
  let startDate = new Date().toISOString().split("T")[0]; // today
  let intervalDays = 2;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--batch-size" && args[i + 1]) {
      batchSize = parseInt(args[i + 1], 10);
      i++;
    } else if (args[i] === "--start-date" && args[i + 1]) {
      startDate = args[i + 1];
      i++;
    } else if (args[i] === "--interval-days" && args[i + 1]) {
      intervalDays = parseInt(args[i + 1], 10);
      i++;
    }
  }

  return { batchSize, startDate, intervalDays };
}

// --- Helpers ---

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function addDays(dateStr: string, days: number): string {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
}

// --- Unsplash breed photo ---

async function fetchUnsplashPhoto(breed: { nameEn: string }): Promise<string> {
  const accessKey = process.env.UNSPLASH_ACCESS_KEY;
  if (!accessKey) {
    console.log(`  Skipping Unsplash (no UNSPLASH_ACCESS_KEY)`);
    return "";
  }

  console.log(`  Fetching Unsplash photo for ${breed.nameEn}...`);
  try {
    // Cat breeds already contain "cat" in nameEn (e.g. "Persian cat") — unambiguous.
    // Dog breeds need the "dog breed" qualifier, otherwise Unsplash returns sport/object
    // photos for ambiguous names like "Boxer", "Pug", "Beagle", "Poodle".
    const isCat = /\bcat\b/i.test(breed.nameEn);
    const searchTerms = isCat ? breed.nameEn : `${breed.nameEn} dog breed`;
    const query = encodeURIComponent(searchTerms);
    const res = await fetch(
      `https://api.unsplash.com/search/photos?query=${query}&per_page=1&orientation=landscape&content_filter=high`,
      { headers: { Authorization: `Client-ID ${accessKey}` } }
    );
    const data = await res.json();

    if (data.results && data.results.length > 0) {
      // Use "regular" size (1080px wide) — good quality, fast loading
      const url = data.results[0].urls.regular as string;
      console.log(`  Unsplash photo: ${url.slice(0, 60)}...`);
      return url;
    }

    console.log(`  No Unsplash results for ${breed.nameEn}`);
    return "";
  } catch (err) {
    console.error(`  Unsplash failed:`, (err as Error).message);
    return "";
  }
}

// --- Renaissance portrait generation (Replicate FLUX) ---
// Uses adapted version of the production Flemish Masters prompt from src/config/prompts.ts

async function generatePortrait(breed: { naam: string; nameEn: string }): Promise<string> {
  console.log(`  Generating Renaissance portrait for ${breed.naam} (FLUX 2 Pro)...`);
  try {
    // Use the same Flemish Masters laying_down prompt as production (src/config/prompts.ts)
    const prompt =
      `A ${breed.nameEn} in a 16th century Flemish Masters oil painting. ` +
      `The ${breed.nameEn} lies naturally on a crimson velvet cushion with golden tassels. A rich velvet robe with gold embroidery and white ermine fur trim is draped over its back. A gold chain with ruby pendant hangs around its neck. ` +
      `Dramatic Rembrandt chiaroscuro lighting. Dark brown background with emerald curtain and marble column. ` +
      `Style of Van Eyck and Rembrandt. Museum-quality oil on canvas with crackled varnish texture. ` +
      `Make the draped fabrics masculine and regal — dark rich colors like burgundy and navy, heavy gold jewelry, bold royal presence. ` +
      `The ${breed.nameEn} must be in a natural animal lying position — NOT sitting upright like a human, NO human body, NO human hands or arms. No text, no watermark.`;

    const output = await replicate.run("black-forest-labs/flux-2-pro", {
      input: {
        prompt,
        guidance: 3.5,
        output_format: "webp",
      },
    });

    // Handle different Replicate SDK output types
    let url: string;
    if (Array.isArray(output)) {
      url = String(output[0]);
    } else if (typeof output === "string") {
      url = output;
    } else if (output && typeof output === "object" && "url" in output) {
      url = String((output as { url: () => string }).url());
    } else {
      url = String(output);
    }

    console.log(`  Portrait generated: ${url.slice(0, 60)}...`);
    return url;
  } catch (err) {
    console.error(`  Portrait failed for ${breed.naam}:`, (err as Error).message);
    return "";
  }
}

// --- Upload to Supabase Storage (permanent URL) ---

async function uploadToSupabase(
  slug: string,
  imageUrl: string,
  subfolder: string = "breeds"
): Promise<string> {
  console.log(`  Uploading to Supabase Storage (${subfolder})...`);
  try {
    const response = await fetch(imageUrl);
    if (!response.ok) throw new Error(`Fetch failed: ${response.status}`);
    const buffer = Buffer.from(await response.arrayBuffer());

    const ext = imageUrl.includes("unsplash") ? "jpg" : "webp";
    const contentType = ext === "jpg" ? "image/jpeg" : "image/webp";
    const filePath = `${subfolder}/${slug}.${ext}`;
    const { error } = await supabase.storage
      .from("portraits-public")
      .upload(filePath, buffer, {
        contentType,
        upsert: true,
      });

    if (error) throw error;

    const permanentUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/portraits-public/${filePath}`;
    console.log(`  Uploaded: ${permanentUrl.slice(0, 60)}...`);
    return permanentUrl;
  } catch (err) {
    console.error(`  Upload failed:`, (err as Error).message);
    return imageUrl; // fallback to Replicate URL
  }
}

// --- Content generation (Claude) ---

async function generateContent(
  breed: { naam: string; nameEn: string; slug: string },
  photoUrl: string,
  portraitUrl: string,
  publishDate: string
): Promise<Record<string, unknown>> {
  console.log(`  Generating Dutch content for ${breed.naam}...`);

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4000,
    messages: [
      {
        role: "user",
        content: `Je bent een dierenkenner en schrijver voor RoyalPet.app — een Nederlandse dienst die huisdierfoto's omzet naar AI-gegenereerde Renaissance-portretten in Vlaamse meesterstijl.

Schrijf een informatief, uitgebreid artikel over het ras: ${breed.naam} (${breed.nameEn})
Doelmarkt: Nederland en België (Vlaanderen)
Taal: Nederlands, warm en persoonlijk maar informatief en betrouwbaar

BELANGRIJK:
- Dit is een KENNISARTIKEL, geen verkooppagina
- Schrijf informatief over het ras: karakter, geschiedenis, verzorging, gezondheid, populariteit in NL/BE
- De laatste sectie mag kort verbinden naar Renaissance portretten (waarom dit ras er mooi uitziet als schilderij)
- GEEN prijzen noemen in de tekst
- GEEN "bestel nu" of verkooptaal
- Elke sectie moet 120-180 woorden zijn (blog-lengte)
- Schrijf 5 secties

Geef ALLEEN geldig JSON terug. Geen uitleg, geen markdown-blokken, geen tekst voor of na de JSON.

{
  "slug": "${breed.slug}",
  "type": "breed",
  "naam": "${breed.naam}",
  "nameEn": "${breed.nameEn}",
  "photoUrl": "${photoUrl}",
  "portraitUrl": "${portraitUrl}",
  "title": "(max 60 tekens, bevat ras naam + portret schilderij + RoyalPet)",
  "metaDescription": "(max 155 tekens, informatief over het ras, eindig met hint naar portret)",
  "h1": "(informatieve kop over het ras, formaat: 'De [Ras] — [2-3 eigenschappen]')",
  "intro": "(150-200 woorden introductie over het ras, warm en informatief)",
  "sections": [
    {"title": "Karakter en temperament", "content": "(120-180 woorden)"},
    {"title": "Geschiedenis en oorsprong", "content": "(120-180 woorden)"},
    {"title": "Verzorging en gezondheid", "content": "(120-180 woorden)"},
    {"title": "De ${breed.naam} in Nederland en België", "content": "(120-180 woorden)"},
    {"title": "Waarom de ${breed.naam} een prachtig Renaissance model is", "content": "(120-180 woorden, dit mag subtiel naar RoyalPet verwijzen)"}
  ],
  "altText": "(beschrijvende alt-tekst, keyword-rijk, max 125 tekens)",
  "pinterestTitle": "(max 100 tekens, Dutch, keyword-rijk)",
  "pinterestDescription": "(max 500 tekens, Dutch, informatief, bevat royalpet.app)",
  "faq": [],
  "publishDate": "${publishDate}",
  "published": false
}`,
      },
    ],
  });

  const raw = (response.content[0] as { type: string; text: string }).text.trim();
  try {
    return JSON.parse(raw);
  } catch {
    // Strip markdown code fences if Claude added them
    const cleaned = raw.replace(/^```json\n?/, "").replace(/\n?```$/, "").trim();
    return JSON.parse(cleaned);
  }
}

// --- Main ---

async function main() {
  const { batchSize, startDate, intervalDays } = parseArgs();

  // Load existing data
  let existing: Record<string, unknown>[] = [];
  if (fs.existsSync(dataPath)) {
    existing = JSON.parse(fs.readFileSync(dataPath, "utf8"));
  }
  const existingSlugs = new Set(existing.map((b) => b.slug as string));
  const results = [...existing];

  // Filter to breeds that need generating
  const toGenerate = ALL_BREEDS.filter((b) => !existingSlugs.has(b.slug));
  const batch = toGenerate.slice(0, batchSize);

  console.log(`\nRoyalPet SEO Page Generator`);
  console.log(`  Already done: ${existing.length} pages`);
  console.log(`  To generate: ${batch.length} pages`);
  console.log(`  Start date: ${startDate}`);
  console.log(`  Interval: every ${intervalDays} days (batches of 5)\n`);

  if (batch.length === 0) {
    console.log("Nothing to generate — all breeds already exist.");
    return;
  }

  for (let i = 0; i < batch.length; i++) {
    const breed = batch[i];

    // Calculate publishDate: every 5 breeds gets a new date
    const batchIndex = Math.floor(i / 5);
    const publishDate = addDays(startDate, batchIndex * intervalDays);

    console.log(`[${i + 1}/${batch.length}] ${breed.naam} (publish: ${publishDate})`);

    // 1. Fetch breed photo from Unsplash
    const unsplashUrl = await fetchUnsplashPhoto(breed);
    let photoUrl = "";
    if (unsplashUrl) {
      photoUrl = await uploadToSupabase(breed.slug, unsplashUrl, "breeds/photos");
    }

    // 2. Generate Renaissance portrait via Replicate
    const replicateUrl = await generatePortrait(breed);
    let portraitUrl = "";
    if (replicateUrl) {
      portraitUrl = await uploadToSupabase(breed.slug, replicateUrl, "breeds/portraits");
    }

    // 3. Generate Dutch content
    const content = await generateContent(breed, photoUrl, portraitUrl, publishDate);
    results.push(content);

    // 4. Save after every breed (crash-safe)
    fs.mkdirSync(path.dirname(dataPath), { recursive: true });
    fs.writeFileSync(dataPath, JSON.stringify(results, null, 2));
    console.log(`  Saved (total: ${results.length} pages)\n`);

    // Polite pause between API calls
    await sleep(1500);
  }

  console.log(`Done! ${results.length} pages saved to data/seo-pages.json`);
  console.log(`Next: review locally with 'npm run dev', then commit and push.`);
}

main().catch((err) => {
  console.error("Script failed:", err);
  process.exit(1);
});
