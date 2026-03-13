"use client";

import { getAllStyles, type StyleConfig } from "@/config/prompts";

interface StyleSelectorProps {
  currentStyle: string;
  onSelect: (styleId: string) => void;
  darkMode?: boolean;
}

const STYLE_COLORS: Record<string, string> = {
  flemish_masters: "from-amber-900 to-amber-800",
  baroque_red: "from-red-900 to-red-800",
  renaissance_sky: "from-blue-800 to-sky-700",
  rococo: "from-pink-400 to-rose-300",
};

export default function StyleSelector({ currentStyle, onSelect, darkMode }: StyleSelectorProps) {
  const styles = getAllStyles();

  return (
    <div className="grid grid-cols-2 gap-3">
      {styles.map((style: StyleConfig) => (
        <button
          key={style.id}
          onClick={() => onSelect(style.id)}
          className={`
            relative rounded-lg p-3 text-left transition-all
            ${
              currentStyle === style.id
                ? darkMode
                  ? "ring-2 ring-emerald-500 bg-emerald-500/10"
                  : "ring-2 ring-royal-gold bg-royal-gold/10"
                : darkMode
                  ? "border border-white/10 hover:bg-white/5"
                  : "hover:bg-royal-brown/5 border border-royal-brown/10"
            }
          `}
        >
          {/* Color indicator */}
          <div
            className={`w-8 h-8 rounded-full bg-gradient-to-br ${
              STYLE_COLORS[style.id] || "from-gray-700 to-gray-600"
            } mb-2`}
          />
          <p className={`font-body text-sm font-semibold ${darkMode ? "text-white" : "text-royal-brown"}`}>
            {style.name}
          </p>
          <p className={`font-body text-xs mt-0.5 ${darkMode ? "text-white/50" : "text-royal-brown/50"}`}>
            {style.description}
          </p>
          {currentStyle === style.id && (
            <span className={`absolute top-2 right-2 text-xs font-semibold ${darkMode ? "text-emerald-400" : "text-royal-gold"}`}>
              Huidig
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
