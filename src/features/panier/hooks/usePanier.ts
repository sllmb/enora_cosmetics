"use client";

import { useSyncExternalStore } from "react";
import { ajouter, compterArticles, modifier, retirer } from "../lib/panier";
import {
  enregistrerPanier,
  obtenirPanier,
  obtenirPanierServeur,
  sAbonnerAuPanier,
} from "../lib/stockage";

export function usePanier() {
  const instantane = useSyncExternalStore(sAbonnerAuPanier, obtenirPanier, obtenirPanierServeur);
  const lignes = instantane ?? [];
  return {
    lignes,
    /** Faux pendant le premier rendu, avant la lecture du stockage du navigateur. */
    pret: instantane !== null,
    nombreArticles: compterArticles(lignes),
    ajouter(slug: string, quantite: number, stock: number): number {
      const resultat = ajouter(obtenirPanier(), slug, quantite, stock);
      enregistrerPanier(resultat.lignes);
      return resultat.ajoute;
    },
    modifier: (slug: string, quantite: number) =>
      enregistrerPanier(modifier(obtenirPanier(), slug, quantite)),
    retirer: (slug: string) => enregistrerPanier(retirer(obtenirPanier(), slug)),
    vider: () => enregistrerPanier([]),
  };
}
