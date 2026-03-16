/**
 * Simplified prompt system for RoyalPet.app AI portrait generation.
 *
 * Key insight: GPT Image 1.5 produces BETTER results with SHORT prompts.
 * Long detailed prompts overwhelm the model and destroy identity preservation.
 *
 * 4 art styles × 2 poses = 8 base templates.
 * Each prompt is ~50-80 words max (was ~300+).
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type Pose = "laying_down" | "standing";

export interface StyleConfig {
  id: string;
  name: string;
  description: string;
}

export interface PromptOptions {
  styleId: string;
  pose?: Pose;
  gender?: string | null;
  colorPreference?: string | null;
  customEdit?: string | null;
}

// ---------------------------------------------------------------------------
// Style definitions (UI-facing)
// ---------------------------------------------------------------------------

export const STYLES: Record<string, StyleConfig> = {
  flemish_masters: {
    id: "flemish_masters",
    name: "Vlaamse Meesters",
    description: "Klassiek portret in de stijl van Rembrandt en Van Eyck",
  },
  baroque_red: {
    id: "baroque_red",
    name: "Barok Rood",
    description: "Rijke barokstijl met dieprode draperie en vergulde ornamenten",
  },
  renaissance_sky: {
    id: "renaissance_sky",
    name: "Renaissance Hemel",
    description: "Licht Renaissance-portret met hemelsblauwe achtergrond",
  },
  rococo: {
    id: "rococo",
    name: "Rococo",
    description: "Speels en elegant met pastelkleuren en bloemdetails",
  },
};

// ---------------------------------------------------------------------------
// Base prompts — SHORT and focused
// GPT Image works best with concise instructions
// ---------------------------------------------------------------------------

const BASE_PROMPTS: Record<string, Record<Pose, string>> = {
  flemish_masters: {
    laying_down:
      "Transform this exact pet into a 16th century Flemish Masters oil painting. " +
      "The pet reclines on a crimson velvet cushion with golden tassels, wearing an ornate velvet doublet with gold embroidery and a white lace ruff collar with ruby brooch. " +
      "Dramatic Rembrandt chiaroscuro lighting. Dark brown background with emerald curtain and marble column. " +
      "Style of Van Eyck and Rembrandt. Museum-quality oil on canvas with crackled varnish texture. " +
      "CRITICAL: Keep the pet's exact breed, face, fur colors, and markings identical to the input photo. Natural animal body — no human hands or arms.",

    standing:
      "Transform this exact pet into a 16th century Flemish Masters oil painting. " +
      "The pet stands proudly on all four legs on dark marble, wearing a teal military jacket with gold buttons and a white lace ruff collar, red velvet mantle over shoulders. " +
      "Dramatic Rembrandt chiaroscuro lighting. Dark interior with stone column and burgundy drape. " +
      "Style of Van Eyck and Rembrandt. Museum-quality oil on canvas with crackled varnish texture. " +
      "CRITICAL: Keep the pet's exact breed, face, fur colors, and markings identical to the input photo. Natural animal body — no human hands or arms.",
  },

  baroque_red: {
    laying_down:
      "Transform this exact pet into a magnificent Baroque oil painting of a royal court member. " +
      "The pet reclines on an ornate gilded throne with burgundy velvet, wearing lavish burgundy and gold brocade robes with ermine fur trim and a heavy gold chain with royal medallion. " +
      "Warm dramatic candlelight with golden tones. Grand palace interior with crimson curtains, marble pillars, and coat of arms. " +
      "Style of Rubens and Velazquez. Rich saturated oil painting. " +
      "CRITICAL: Keep the pet's exact breed, face, fur colors, and markings identical to the input photo. Natural animal body — no human hands or arms.",

    standing:
      "Transform this exact pet into a magnificent Baroque oil painting of a royal court member. " +
      "The pet stands commanding on all four legs on checkered marble before a gilded throne, wearing burgundy and gold brocade robes with ermine trim and a golden coronet. " +
      "Warm dramatic candlelight with golden tones. Grand palace interior with crimson curtains and marble pillars. " +
      "Style of Rubens and Velazquez. Rich saturated oil painting. " +
      "CRITICAL: Keep the pet's exact breed, face, fur colors, and markings identical to the input photo. Natural animal body — no human hands or arms.",
  },

  renaissance_sky: {
    laying_down:
      "Transform this exact pet into a luminous Italian Renaissance oil painting of a Florentine noble. " +
      "The pet reclines gracefully on a stone balustrade draped with azure silk, wearing an azure blue silk tunic with pearl buttons and a gold filigree collar with sapphire pendant. " +
      "Soft natural daylight with sfumato shadows. Rolling Tuscan hills under azure sky with cypress trees. " +
      "Style of Raphael and Leonardo da Vinci. Ethereal sfumato technique on wood panel. " +
      "CRITICAL: Keep the pet's exact breed, face, fur colors, and markings identical to the input photo. Natural animal body — no human hands or arms.",

    standing:
      "Transform this exact pet into a luminous Italian Renaissance oil painting of a Florentine noble. " +
      "The pet stands gracefully on all four legs on a sunlit Renaissance terrace, wearing an azure blue silk tunic with pearl buttons and a gold filigree collar with sapphire pendant. " +
      "Soft natural daylight with sfumato shadows. Rolling Tuscan hills under azure sky with cypress trees. " +
      "Style of Raphael and Leonardo da Vinci. Ethereal sfumato technique on wood panel. " +
      "CRITICAL: Keep the pet's exact breed, face, fur colors, and markings identical to the input photo. Natural animal body — no human hands or arms.",
  },

  rococo: {
    laying_down:
      "Transform this exact pet into a charming Rococo oil painting of a French aristocrat at Versailles. " +
      "The pet lounges on a gilded chaise longue with pastel pink silk, surrounded by rose petals, wearing a pastel pink and powder blue silk ensemble with lace and pearl jewelry. " +
      "Soft pearlescent glow. Lush palace garden with roses, fountain with cherubs, and pastel sky. " +
      "Style of Boucher and Fragonard. Delicate brushwork with soft pastel palette. " +
      "CRITICAL: Keep the pet's exact breed, face, fur colors, and markings identical to the input photo. Natural animal body — no human hands or arms.",

    standing:
      "Transform this exact pet into a charming Rococo oil painting of a French aristocrat at Versailles. " +
      "The pet stands playfully on all four legs in a manicured palace garden among rose petals, wearing a pastel pink and powder blue silk ensemble with lace and pearl jewelry. " +
      "Soft pearlescent glow. Lush garden with roses, fountain with cherubs, and pastel sky. " +
      "Style of Boucher and Fragonard. Delicate brushwork with soft pastel palette. " +
      "CRITICAL: Keep the pet's exact breed, face, fur colors, and markings identical to the input photo. Natural animal body — no human hands or arms.",
  },
};

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

const STYLE_IDS = Object.keys(STYLES);

/** Get a random style ID for first-time generation */
export function getRandomStyle(): string {
  return STYLE_IDS[Math.floor(Math.random() * STYLE_IDS.length)];
}

/** Build the full prompt from options, including all modifiers */
export function buildPrompt(options: PromptOptions): string {
  const {
    styleId,
    pose = "laying_down",
    gender,
    colorPreference,
    customEdit,
  } = options;

  // Get base prompt for style + pose (fallback to flemish_masters laying_down)
  const stylePrompts = BASE_PROMPTS[styleId] || BASE_PROMPTS.flemish_masters;
  let prompt = stylePrompts[pose] || stylePrompts.laying_down;

  // Gender modifier — default to masculine/noble when not specified
  // Most pet owners expect a "regal" look, not feminine
  if (gender === "feminine") {
    prompt += " Make the attire feminine — elegant gown, delicate lace, refined jewelry.";
  } else {
    // Default + explicit masculine: noble, commanding look
    prompt += " Make the attire masculine and noble — military doublet, dark bold colors, commanding presence.";
  }

  // Color preference
  if (colorPreference && colorPreference.trim()) {
    prompt += ` Change attire colors to: ${colorPreference.trim().slice(0, 100)}.`;
  }

  // Custom edit
  if (customEdit && customEdit.trim()) {
    prompt += ` Also: ${customEdit.trim().slice(0, 200)}`;
  }

  return prompt;
}

/** Get all styles as an array (for UI) */
export function getAllStyles(): StyleConfig[] {
  return Object.values(STYLES);
}

// Backward-compatible re-export for existing code that imports STYLE_PROMPTS
export const STYLE_PROMPTS = STYLES;
