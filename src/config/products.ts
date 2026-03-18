// Product catalog — prices in cents, all in EUR
// Source of truth: CLAUDE.md pricing table

export type ProductType = "digital" | "fine_art" | "canvas";

export interface ProductSize {
  id: string;
  label: string;
  labelInch: string;
  priceCents: number;
  tooltip?: string;
}

export interface ProductCategory {
  type: ProductType;
  name: string;
  description: string;
  sizes: ProductSize[];
}

export const PRODUCTS: ProductCategory[] = [
  {
    type: "fine_art",
    name: "Fine Art Print",
    description: "Museumkwaliteit papier, vakkundig verpakt",
    sizes: [
      {
        id: "fine_art_20x25",
        label: "20x25cm",
        labelInch: '8x10"',
        priceCents: 8900,
        tooltip: "Past op uw bureau of nachtkastje",
      },
      {
        id: "fine_art_30x40",
        label: "30x40cm",
        labelInch: '12x16"',
        priceCents: 11900,
        tooltip: "Populair formaat, past boven een dressoir",
      },
      {
        id: "fine_art_45x60",
        label: "45x60cm",
        labelInch: '18x24"',
        priceCents: 19900,
        tooltip: "Opvallend formaat voor in de woonkamer",
      },
      {
        id: "fine_art_60x90",
        label: "60x90cm",
        labelInch: '24x36"',
        priceCents: 29900,
        tooltip: "Groot statement stuk voor boven de bank",
      },
    ],
  },
  {
    type: "canvas",
    name: "Canvas",
    description: "Gespannen op houten frame, klaar om op te hangen",
    sizes: [
      {
        id: "canvas_30x40",
        label: "30x40cm",
        labelInch: '12x16"',
        priceCents: 29900,
        tooltip: "Populair formaat, past boven een dressoir",
      },
      {
        id: "canvas_45x60",
        label: "45x60cm",
        labelInch: '18x24"',
        priceCents: 39900,
        tooltip: "Opvallend formaat voor in de woonkamer",
      },
      {
        id: "canvas_60x90",
        label: "60x90cm",
        labelInch: '24x36"',
        priceCents: 49900,
        tooltip: "Groot statement stuk voor boven de bank",
      },
      {
        id: "canvas_100x150",
        label: "100x150cm",
        labelInch: '40x60"',
        priceCents: 89900,
        tooltip: "Museumformaat, blikvanger in elke ruimte",
      },
    ],
  },
];

const priceFormatter = new Intl.NumberFormat("nl-NL", {
  style: "currency",
  currency: "EUR",
});

export function formatPrice(cents: number): string {
  return priceFormatter.format(cents / 100);
}

export function getCategory(type: ProductType): ProductCategory | undefined {
  return PRODUCTS.find((p) => p.type === type);
}

export function getProductLabel(productId: string): string {
  for (const cat of PRODUCTS) {
    const size = cat.sizes.find((s) => s.id === productId);
    if (size) return `${cat.name} ${size.label}`;
  }
  return productId;
}

export function getStartingPrice(type: ProductType): number {
  const cat = getCategory(type);
  return cat ? cat.sizes[0].priceCents : 0;
}
