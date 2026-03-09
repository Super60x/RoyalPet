import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "royal-black": "#0A0A0A",
        "royal-gold": "#B8942A",
        "royal-cream": "#FAF8F3",
        "royal-brown": "#3D2B1F",
      },
      fontFamily: {
        heading: ["var(--font-heading)", "Cormorant Garamond", "serif"],
        body: ["var(--font-body)", "Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
