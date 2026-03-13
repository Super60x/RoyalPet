/**
 * Structured prompt system for RoyalPet.app AI portrait generation.
 *
 * 4 art styles × 2 poses = 8 base templates.
 * All prompts are pet-agnostic (dogs, cats, rabbits, birds, etc.)
 * Anti-instructions (no human hands, etc.) are embedded in every prompt.
 * Modifiers: gender, color preference, custom edit — appended to base prompt.
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
// Shared prompt sections
// ---------------------------------------------------------------------------

const IDENTITY =
  "IDENTITY: Keep the pet's exact face, fur or feather colors, markings, and breed perfectly recognizable. " +
  "Preserve the original coloring with absolute fidelity.";

const ANATOMY =
  "ANATOMY: The pet retains its completely natural animal body — natural paws, natural legs, " +
  "natural proportions. NO human hands, NO human arms, NO human fingers, NO humanoid limbs " +
  "whatsoever. Only the clothing is anthropomorphized, never the body.";

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
// Base prompts — 4 styles × 2 poses
// ---------------------------------------------------------------------------

const BASE_PROMPTS: Record<string, Record<Pose, string>> = {
  flemish_masters: {
    laying_down: [
      "Transform this pet photo into a breathtaking 16th century Flemish Masters oil painting portrait.",
      IDENTITY,
      "POSE: The pet rests in a dignified reclining pose on an ornate deep crimson velvet cushion with golden tasseled corners, front paws or legs elegantly extended forward, head held high with proud dignified expression. NOT standing upright, NOT on hind legs.",
      "ATTIRE: Ornate deep crimson velvet doublet with intricate gold-threaded embroidery and an elaborate white Mechlin lace ruff collar fastened with a jeweled ruby brooch. Heavy gold chain of office draped across the chest.",
      ANATOMY,
      "LIGHTING: Dramatic Rembrandt chiaroscuro with warm golden candlelight from upper left, deep velvety shadows on the right, subtle rim light defining the fur texture.",
      "BACKGROUND: Dark rich walnut brown background with a subtle draped emerald velvet curtain, a classical marble column, and a glimpse of a Dutch landscape through an arched window.",
      "TECHNIQUE: Render in the masterful style of Jan van Eyck, Anthony van Dyck, and Rembrandt van Rijn. Museum-quality oil on canvas with visible aged canvas texture, authentic crackled varnish, thick impasto brushwork in highlights, delicate glazing in shadows, ultra-detailed rendering of fur and fabric textures.",
      "MOOD: Solemn aristocratic dignity, timeless nobility, as if this portrait has hung in a Flemish manor for four centuries.",
    ].join("\n"),

    standing: [
      "Transform this pet photo into a breathtaking 16th century Flemish Masters oil painting portrait.",
      IDENTITY,
      "POSE: The pet stands in a proud noble stance on all four legs upon a dark marble floor, body angled three-quarters to the viewer, head turned with a commanding gaze directly at the viewer. NOT lying down, NOT on a cushion, NOT reclining.",
      "ATTIRE: Ornate dark teal military jacket with gold buttons and red trim draped over the pet's shoulders like a cape, elaborate white lace ruff collar around the neck, red velvet royal mantle over shoulders.",
      ANATOMY,
      "LIGHTING: Dramatic Rembrandt chiaroscuro with warm golden candlelight from upper left, deep velvety shadows on the right, subtle rim light defining the fur texture.",
      "BACKGROUND: Dark interior with a stone column, burgundy velvet drape, warm amber tones, and a sliver of golden light from a distant window.",
      "TECHNIQUE: Render in the masterful style of Jan van Eyck, Anthony van Dyck, and Rembrandt van Rijn. Museum-quality oil on canvas with visible aged canvas texture, authentic crackled varnish, thick impasto brushwork in highlights, delicate glazing in shadows, ultra-detailed rendering of fur and fabric textures.",
      "MOOD: Solemn aristocratic dignity, timeless nobility, as if this portrait has hung in a Flemish manor for four centuries.",
    ].join("\n"),
  },

  baroque_red: {
    laying_down: [
      "Transform this pet photo into a magnificent Baroque oil painting portrait of a powerful royal court member.",
      IDENTITY,
      "POSE: The pet reclines regally on an ornate gilded throne with deep burgundy velvet upholstery, front paws or legs resting on the carved golden armrest, radiating supreme authority. NOT standing upright, NOT on hind legs.",
      "ATTIRE: Lavish deep burgundy and gold brocade ceremonial robes with ermine fur collar and trim, a heavy gold chain of office with a royal medallion, and a ruby-studded golden coronet resting beside the pet.",
      ANATOMY,
      "LIGHTING: Warm dramatic candlelight from the right with rich golden tones, deep velvety shadows, the glow of gold and jewels catching the light.",
      "BACKGROUND: Sweeping crimson velvet curtains pulled back with golden tassels, towering marble pillars, a grand Baroque palace interior with a checkered marble floor and a coat of arms.",
      "TECHNIQUE: Render in the opulent style of Peter Paul Rubens and Diego Velazquez. Museum-quality oil on canvas with thick impasto brushwork, rich saturated colors, luminous fur rendering, and gilded frame aesthetic.",
      "MOOD: Supreme royal power and opulence, the grandeur of a Baroque court at the height of its glory.",
    ].join("\n"),

    standing: [
      "Transform this pet photo into a magnificent Baroque oil painting portrait of a powerful royal court member.",
      IDENTITY,
      "POSE: The pet stands commanding on all four legs on a checkered marble floor before the gilded throne, body facing the viewer with regal bearing, head held high. NOT lying down, NOT on a cushion, NOT reclining.",
      "ATTIRE: Lavish deep burgundy and gold brocade ceremonial robes with ermine fur collar and trim, a heavy gold chain of office with a royal medallion, and a ruby-studded golden coronet atop the head.",
      ANATOMY,
      "LIGHTING: Warm dramatic candlelight from the right with rich golden tones, deep velvety shadows, the glow of gold and jewels catching the light.",
      "BACKGROUND: Sweeping crimson velvet curtains pulled back with golden tassels, towering marble pillars, a grand Baroque palace interior with a checkered marble floor and a coat of arms.",
      "TECHNIQUE: Render in the opulent style of Peter Paul Rubens and Diego Velazquez. Museum-quality oil on canvas with thick impasto brushwork, rich saturated colors, luminous fur rendering, and gilded frame aesthetic.",
      "MOOD: Supreme royal power and opulence, the grandeur of a Baroque court at the height of its glory.",
    ].join("\n"),
  },

  renaissance_sky: {
    laying_down: [
      "Transform this pet photo into a luminous Italian Renaissance oil painting portrait of a Florentine noble.",
      IDENTITY,
      "POSE: The pet reclines gracefully on a stone balustrade draped with azure silk, overlooking a Tuscan landscape, front paws or legs resting serenely, gazing at the viewer with gentle wisdom. NOT standing upright, NOT on hind legs.",
      "ATTIRE: An elegant azure blue silk tunic with pearl buttons, a delicate gold filigree collar with a sapphire pendant, and a garland of laurel leaves.",
      ANATOMY,
      "LIGHTING: Soft diffused natural daylight from the left, gentle and warm with subtle sfumato shadows, a golden afternoon glow.",
      "BACKGROUND: Rolling Tuscan hills under a luminous azure sky, distant cypress trees, a golden horizon, a classical Renaissance loggia with marble arches.",
      "TECHNIQUE: Render in the ethereal style of Raphael Sanzio and Leonardo da Vinci. Museum-quality tempera and oil on wood panel with sfumato technique, delicate glazing layers, ethereal atmospheric perspective, and luminous color harmony.",
      "MOOD: Serene Florentine elegance, intellectual grace, the golden light of the Italian Renaissance.",
    ].join("\n"),

    standing: [
      "Transform this pet photo into a luminous Italian Renaissance oil painting portrait of a Florentine noble.",
      IDENTITY,
      "POSE: The pet stands gracefully on all four legs upon a sunlit terrace of a Renaissance loggia, body poised elegantly with one paw slightly forward, gazing serenely at the viewer. NOT lying down, NOT on a cushion, NOT reclining.",
      "ATTIRE: An elegant azure blue silk tunic with pearl buttons, a delicate gold filigree collar with a sapphire pendant, and a garland of laurel leaves.",
      ANATOMY,
      "LIGHTING: Soft diffused natural daylight from the left, gentle and warm with subtle sfumato shadows, a golden afternoon glow.",
      "BACKGROUND: Rolling Tuscan hills under a luminous azure sky, distant cypress trees, a golden horizon, a classical Renaissance loggia with marble arches.",
      "TECHNIQUE: Render in the ethereal style of Raphael Sanzio and Leonardo da Vinci. Museum-quality tempera and oil on wood panel with sfumato technique, delicate glazing layers, ethereal atmospheric perspective, and luminous color harmony.",
      "MOOD: Serene Florentine elegance, intellectual grace, the golden light of the Italian Renaissance.",
    ].join("\n"),
  },

  rococo: {
    laying_down: [
      "Transform this pet photo into a charming Rococo oil painting portrait of a French aristocrat at Versailles.",
      IDENTITY,
      "POSE: The pet lounges playfully on a gilded chaise longue draped in pastel pink silk, surrounded by scattered rose petals and ribbons, with a coquettish tilt of the head. NOT standing upright, NOT on hind legs.",
      "ATTIRE: A pastel pink and powder blue silk ensemble with cascading Valenciennes lace, delicate floral embroidery of roses and forget-me-nots, satin ribbons, pearl earrings, and a tiny jeweled hair ornament.",
      ANATOMY,
      "LIGHTING: Soft pearlescent glow, warm and flattering like morning light through gauze curtains, gentle highlights on silk and pearls.",
      "BACKGROUND: A lush palace garden with blooming pink roses, an ornate stone fountain with cherubs, manicured topiary, and a soft pastel sky with wispy clouds.",
      "TECHNIQUE: Render in the delightful style of Francois Boucher and Jean-Honore Fragonard. Museum-quality oil on canvas with feathery delicate brushwork, soft pastel palette, luminous tones, ornamental rocaille details, and playful compositional curves.",
      "MOOD: Playful aristocratic charm, lighthearted elegance, the carefree luxury of the French Ancien Regime.",
    ].join("\n"),

    standing: [
      "Transform this pet photo into a charming Rococo oil painting portrait of a French aristocrat at Versailles.",
      IDENTITY,
      "POSE: The pet stands playfully on all four legs in a manicured palace garden among scattered rose petals, body turned with a charming tilt of the head, a satin ribbon trailing. NOT lying down, NOT on a cushion, NOT reclining.",
      "ATTIRE: A pastel pink and powder blue silk ensemble with cascading Valenciennes lace, delicate floral embroidery of roses and forget-me-nots, satin ribbons, pearl earrings, and a tiny jeweled hair ornament.",
      ANATOMY,
      "LIGHTING: Soft pearlescent glow, warm and flattering like morning light through gauze curtains, gentle highlights on silk and pearls.",
      "BACKGROUND: A lush palace garden with blooming pink roses, an ornate stone fountain with cherubs, manicured topiary, and a soft pastel sky with wispy clouds.",
      "TECHNIQUE: Render in the delightful style of Francois Boucher and Jean-Honore Fragonard. Museum-quality oil on canvas with feathery delicate brushwork, soft pastel palette, luminous tones, ornamental rocaille details, and playful compositional curves.",
      "MOOD: Playful aristocratic charm, lighthearted elegance, the carefree luxury of the French Ancien Regime.",
    ].join("\n"),
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

  // Gender modifier
  if (gender === "masculine") {
    prompt +=
      "\nATTIRE MODIFIER: Make the attire distinctly masculine — strong military-style doublet, authoritative bearing, bold dark colors.";
  } else if (gender === "feminine") {
    prompt +=
      "\nATTIRE MODIFIER: Make the attire distinctly feminine — graceful silk gown, delicate lace, refined jewelry, elegant poise.";
  }

  // Color preference
  if (colorPreference && colorPreference.trim()) {
    prompt += `\nCOLOR MODIFIER: Change the primary attire and drapery colors to: ${colorPreference.trim().slice(0, 100)}.`;
  }

  // Custom edit
  if (customEdit && customEdit.trim()) {
    prompt += `\nADDITIONAL INSTRUCTIONS: ${customEdit.trim().slice(0, 200)}`;
  }

  return prompt;
}

/** Get all styles as an array (for UI) */
export function getAllStyles(): StyleConfig[] {
  return Object.values(STYLES);
}

// Backward-compatible re-export for existing code that imports STYLE_PROMPTS
export const STYLE_PROMPTS = STYLES;
