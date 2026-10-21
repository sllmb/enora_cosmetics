import type { Metadata } from "next";

type OpenGraph = NonNullable<Metadata["openGraph"]>;

/** Partage par défaut (WhatsApp, Facebook…), repris par les pages qui précisent le leur. */
export const OPEN_GRAPH_BASE = {
  type: "website",
  locale: "fr_SN",
  siteName: "Énora Cosmetics",
  images: [
    {
      url: "/brand/partage.png",
      width: 1200,
      height: 630,
      alt: "Énora Cosmetics — déodorants, huiles parfumées et savons",
    },
  ],
} satisfies OpenGraph;
