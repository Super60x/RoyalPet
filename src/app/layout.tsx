import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { Analytics, CookieConsent } from "@/components/Analytics";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-heading",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "RoyalPet — Vereeuw uw huisdier als Renaissance meesterwerk",
  description:
    "Upload een foto van uw huisdier en ontvang een prachtig AI-gegenereerd Renaissance portret. Digitaal of op canvas.",
  metadataBase: new URL("https://royalpet.app"),
  openGraph: {
    title: "RoyalPet — Vereeuw uw huisdier als Renaissance meesterwerk",
    description:
      "Upload een foto en ontvang binnen 60 seconden een prachtig AI-geschilderd Renaissance portret van uw huisdier.",
    url: "https://royalpet.app",
    siteName: "RoyalPet.app",
    images: [
      {
        url: "/og-image.webp",
        width: 1024,
        height: 1536,
        alt: "RoyalPet Renaissance portret voorbeeld",
      },
    ],
    locale: "nl_NL",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "RoyalPet — Vereeuw uw huisdier als Renaissance meesterwerk",
    description:
      "Upload een foto en ontvang binnen 60 seconden een prachtig AI-geschilderd Renaissance portret.",
    images: ["/og-image.webp"],
  },
  icons: {
    icon: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="nl" className={`${cormorant.variable} ${inter.variable}`}>
      <body>
        {children}
        <Analytics />
        <CookieConsent />
      </body>
    </html>
  );
}
