import { Great_Vibes, Parisienne, Pinyon_Script } from "next/font/google";
import type { PoliceTitre } from "../lib/polices";

// Écritures manuscrites des titres. Non préchargées : le navigateur ne
// télécharge que la police réellement affichée.
const greatVibes = Great_Vibes({
  weight: "400",
  subsets: ["latin", "latin-ext"],
  display: "swap",
  preload: false,
});
const pinyon = Pinyon_Script({
  weight: "400",
  subsets: ["latin", "latin-ext"],
  display: "swap",
  preload: false,
});
const parisienne = Parisienne({
  weight: "400",
  subsets: ["latin", "latin-ext"],
  display: "swap",
  preload: false,
});

export const CLASSES_POLICE: Record<PoliceTitre, string> = {
  classique: "font-titre",
  princesse: greatVibes.className,
  plume: pinyon.className,
  parisienne: parisienne.className,
};
