/**
 * One-time logo generator for Pinterest profile — RoyalPet.app
 * Generates a 1024x1024 logo via GPT Image 1.5
 *
 * Usage: npx tsx --env-file=.env.local scripts/generate-logo.ts
 */

import Replicate from "replicate";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
});

async function main() {
  console.log("Generating RoyalPet logo...");

  const prediction = await replicate.predictions.create({
    model: "openai/gpt-image-1.5",
    input: {
      prompt: `A luxury brand logo on a solid black (#0A0A0A) background. A golden ornate royal crown in a classic heraldic style, rendered in rich warm gold (#B8942A) with fine detail and subtle shading. Below the crown, the text "RoyalPet" in an elegant serif font (similar to Cormorant Garamond), also in gold (#B8942A). The design is centered, minimal, and premium — no other elements, no gradients, no patterns in the background. Square format, suitable as a profile picture.`,
      aspect_ratio: "1:1",
      quality: "high",
      output_format: "png",
    },
  });

  console.log(`Prediction started: ${prediction.id}`);

  // Poll until done
  const pollInterval = 3000;
  const timeout = 120000;
  const start = Date.now();

  while (Date.now() - start < timeout) {
    const result = await replicate.predictions.get(prediction.id);

    if (result.status === "succeeded" && result.output) {
      const outputUrl = Array.isArray(result.output)
        ? result.output[0]
        : result.output;

      console.log(`Generated! Downloading...`);

      // Download the image
      const response = await fetch(outputUrl as string);
      const buffer = Buffer.from(await response.arrayBuffer());
      const outputPath = path.join(__dirname, "../public/logo.png");
      fs.writeFileSync(outputPath, buffer);

      console.log(`Saved to public/logo.png (${(buffer.length / 1024).toFixed(0)} KB)`);
      console.log(`\nUse this as your Pinterest profile picture.`);
      return;
    }

    if (result.status === "failed" || result.status === "canceled") {
      console.error("Failed:", result.error);
      return;
    }

    console.log(`  Status: ${result.status}...`);
    await new Promise((r) => setTimeout(r, pollInterval));
  }

  console.error("Timed out after 2 minutes");
}

main();
