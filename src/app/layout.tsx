import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import { Toaster } from "sonner";
import { env } from "@/shared/config/env";
import "@/styles/globals.css";
import { OPEN_GRAPH_BASE } from "./_seo";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const jost = Jost({ variable: "--font-jost", subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(env.siteUrl),
  title: { default: "Énora Cosmetics — Hygiène corporelle", template: "%s · Énora Cosmetics" },
  description:
    "Déodorants, huiles parfumées et savons Énora : l'hygiène corporelle raffinée, livrée à Dakar et environs.",
  openGraph: OPEN_GRAPH_BASE,
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = { themeColor: "#690817" };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr" className={`${cormorant.variable} ${jost.variable}`}>
      <body className="flex min-h-dvh flex-col">
        <a
          href="#contenu"
          className="sr-only z-50 rounded-full tissu-soie px-4 py-2 text-sur-primaire focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          Aller au contenu
        </a>
        {children}
        <Toaster position="top-center" richColors closeButton />
      </body>
    </html>
  );
}
