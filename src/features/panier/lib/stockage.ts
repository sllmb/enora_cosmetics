import { z } from "zod";
import { QUANTITE_MAX, type LignePanier } from "./panier";

/*
 * Panier enregistré dans le navigateur (localStorage), partagé entre les
 * onglets. Un contenu illisible ou trafiqué est ignoré : le panier repart vide.
 * Si le stockage est bloqué (navigation privée), le panier vit en mémoire.
 */

const CLE = "enora:panier:v1";

const panierSchema = z
  .array(z.object({ slug: z.string().min(1), quantite: z.number().int().min(1).max(QUANTITE_MAX) }))
  .max(50);

let cache: LignePanier[] | null = null;
const abonnes = new Set<() => void>();

function lire(): LignePanier[] {
  if (cache) return cache;
  try {
    const brut = window.localStorage.getItem(CLE);
    const lu = panierSchema.safeParse(brut ? JSON.parse(brut) : []);
    cache = lu.success ? lu.data : [];
  } catch {
    cache = [];
  }
  return cache;
}

export function obtenirPanier(): LignePanier[] {
  return lire();
}

/** Côté serveur, le panier est inconnu : null permet d'afficher un état de chargement. */
export function obtenirPanierServeur(): LignePanier[] | null {
  return null;
}

export function enregistrerPanier(lignes: LignePanier[]): void {
  cache = lignes;
  try {
    window.localStorage.setItem(CLE, JSON.stringify(lignes));
  } catch {
    // Stockage indisponible : le panier reste en mémoire pour cette visite.
  }
  abonnes.forEach((notifier) => notifier());
}

export function sAbonnerAuPanier(notifier: () => void): () => void {
  abonnes.add(notifier);
  const surStockage = (evenement: StorageEvent) => {
    if (evenement.key !== CLE) return;
    cache = null; // modifié dans un autre onglet
    notifier();
  };
  window.addEventListener("storage", surStockage);
  return () => {
    abonnes.delete(notifier);
    window.removeEventListener("storage", surStockage);
  };
}
