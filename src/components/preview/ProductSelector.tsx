"use client";

import { useRef, useEffect } from "react";
import {
  PRODUCTS,
  formatPrice,
  getStartingPrice,
  type ProductType,
} from "@/config/products";

export interface ProductSelection {
  type: ProductType;
  sizeId: string;
  sizeLabel: string;
  priceCents: number;
}

interface ProductSelectorProps {
  selected: ProductSelection | null;
  onSelect: (selection: ProductSelection) => void;
}

const TYPE_ICONS: Record<ProductType, string> = {
  digital: "\u{1F4E5}",
  fine_art: "\u{1F5BC}\uFE0F",
  canvas: "\u{1F3A8}",
};

export default function ProductSelector({
  selected,
  onSelect,
}: ProductSelectorProps) {
  const sizesRef = useRef<HTMLDivElement | null>(null);

  // Scroll sizes into view when type changes
  const selectedType = selected?.type;
  useEffect(() => {
    if (selectedType && sizesRef.current) {
      sizesRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [selectedType]);

  const handleTypeClick = (type: ProductType) => {
    const category = PRODUCTS.find((p) => p.type === type);
    if (!category) return;

    // Auto-select first (cheapest) size
    const firstSize = category.sizes[0];
    onSelect({
      type,
      sizeId: firstSize.id,
      sizeLabel:
        type === "digital"
          ? "Digitale Download"
          : `${category.name} ${firstSize.label}`,
      priceCents: firstSize.priceCents,
    });
  };

  const handleSizeClick = (
    type: ProductType,
    sizeId: string,
    sizeLabel: string,
    priceCents: number
  ) => {
    const category = PRODUCTS.find((p) => p.type === type);
    if (!category) return;

    onSelect({
      type,
      sizeId,
      sizeLabel: `${category.name} ${sizeLabel}`,
      priceCents,
    });
  };

  return (
    <div className="space-y-3">
      {PRODUCTS.map((category) => {
        const isSelected = selected?.type === category.type;
        const startPrice = getStartingPrice(category.type);

        return (
          <div key={category.type}>
            {/* Type card */}
            <button
              onClick={() => handleTypeClick(category.type)}
              className={`w-full text-left p-4 rounded-lg border-2 transition-all min-h-[80px]
                ${
                  isSelected
                    ? "border-royal-gold bg-royal-gold/5 shadow-md"
                    : "border-royal-brown/10 bg-white hover:border-royal-brown/30"
                }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl" role="img" aria-hidden="true">
                    {TYPE_ICONS[category.type]}
                  </span>
                  <div>
                    <div className="font-heading font-semibold text-lg text-royal-brown">
                      {category.name}
                    </div>
                    <div className="text-sm font-body text-royal-brown/60">
                      {category.description}
                    </div>
                  </div>
                </div>
                <div className="text-right shrink-0 ml-2">
                  <div className="font-heading font-bold text-lg text-royal-brown">
                    {category.sizes.length === 1
                      ? formatPrice(startPrice)
                      : `vanaf ${formatPrice(startPrice)}`}
                  </div>
                </div>
              </div>
            </button>

            {/* Size pills — only show for selected type with multiple sizes */}
            {isSelected && category.sizes.length > 1 && (
              <div ref={sizesRef} className="mt-2 pl-2">
                <div className="flex flex-wrap gap-2">
                  {category.sizes.map((size) => {
                    const isSizeSelected = selected?.sizeId === size.id;
                    return (
                      <button
                        key={size.id}
                        onClick={() =>
                          handleSizeClick(
                            category.type,
                            size.id,
                            size.label,
                            size.priceCents
                          )
                        }
                        title={size.tooltip}
                        className={`px-4 py-2.5 rounded-lg border-2 font-body text-sm transition-all min-h-[44px]
                          ${
                            isSizeSelected
                              ? "border-royal-gold bg-royal-gold/10 text-royal-brown font-semibold"
                              : "border-royal-brown/10 bg-white text-royal-brown/70 hover:border-royal-brown/30"
                          }`}
                      >
                        <span className="block">{size.label}</span>
                        <span className="block text-xs mt-0.5">
                          {formatPrice(size.priceCents)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
