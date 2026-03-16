export interface CreditPack {
  id: string;
  credits: number;
  priceCents: number;
  label: string;
  perGenLabel: string;
  badge?: string;
}

export const CREDIT_PACKS: CreditPack[] = [
  {
    id: "pack_3",
    credits: 3,
    priceCents: 999,
    label: "3 generaties",
    perGenLabel: "€3,33/portret",
  },
  {
    id: "pack_5",
    credits: 5,
    priceCents: 1499,
    label: "5 generaties",
    perGenLabel: "€3,00/portret",
    badge: "Populair",
  },
  {
    id: "pack_10",
    credits: 10,
    priceCents: 2499,
    label: "10 generaties",
    perGenLabel: "€2,50/portret",
    badge: "Beste waarde",
  },
];

export function getPack(id: string): CreditPack | undefined {
  return CREDIT_PACKS.find((p) => p.id === id);
}
