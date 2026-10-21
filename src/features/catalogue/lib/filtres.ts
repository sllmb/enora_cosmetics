import type { FamilleOlfactive, Produit } from "../types";
import { estEpuise, LIBELLES_FAMILLE, prixEffectif } from "./produit";

/*
 * Tri et filtres du catalogue, lus et écrits dans l'URL (?tri=…&famille=…&dispo=1)
 * pour qu'une sélection soit partageable et survive au rechargement.
 */

export const TRIS = {
  pertinence: "Pertinence",
  nouveautes: "Nouveautés",
  "prix-croissant": "Prix croissant",
  "prix-decroissant": "Prix décroissant",
} as const;

export type Tri = keyof typeof TRIS;

export type Selection = {
  tri: Tri;
  familles: FamilleOlfactive[];
  disponiblesSeulement: boolean;
};

export const SELECTION_PAR_DEFAUT: Selection = {
  tri: "pertinence",
  familles: [],
  disponiblesSeulement: false,
};

const estTri = (valeur: string | null): valeur is Tri => valeur !== null && valeur in TRIS;
const estFamille = (valeur: string): valeur is FamilleOlfactive => valeur in LIBELLES_FAMILLE;

/** Valeurs inconnues ignorées : une URL modifiée à la main ne casse jamais la page. */
export function lireSelection(params: URLSearchParams): Selection {
  const tri = params.get("tri");
  return {
    tri: estTri(tri) ? tri : "pertinence",
    familles: [...new Set((params.get("famille") ?? "").split(",").filter(estFamille))],
    disponiblesSeulement: params.get("dispo") === "1",
  };
}

/** N'écrit que ce qui diffère du choix par défaut, pour garder des URL courtes. */
export function ecrireSelection(selection: Selection): string {
  const params = new URLSearchParams();
  if (selection.tri !== "pertinence") params.set("tri", selection.tri);
  if (selection.familles.length > 0) params.set("famille", selection.familles.join(","));
  if (selection.disponiblesSeulement) params.set("dispo", "1");
  const texte = params.toString();
  return texte ? `?${texte}` : "";
}

export function appliquerSelection(produits: Produit[], selection: Selection): Produit[] {
  const filtres = produits.filter(
    (p) =>
      (selection.familles.length === 0 ||
        (p.familleOlfactive !== null && selection.familles.includes(p.familleOlfactive))) &&
      (!selection.disponiblesSeulement || !estEpuise(p)),
  );
  const parPrix = (a: Produit, b: Produit) => prixEffectif(a) - prixEffectif(b);
  switch (selection.tri) {
    case "prix-croissant":
      return [...filtres].sort(parPrix);
    case "prix-decroissant":
      return [...filtres].sort((a, b) => parPrix(b, a));
    case "nouveautes":
      return [...filtres].sort((a, b) => Number(b.estNouveaute) - Number(a.estNouveaute));
    case "pertinence":
      // Ordre du catalogue, produits épuisés en dernier.
      return [...filtres].sort((a, b) => Number(estEpuise(a)) - Number(estEpuise(b)));
  }
}

/** Familles présentes dans la liste, dans l'ordre des libellés. */
export function famillesDisponibles(produits: Produit[]): FamilleOlfactive[] {
  const presentes = new Set(produits.map((p) => p.familleOlfactive));
  return (Object.keys(LIBELLES_FAMILLE) as FamilleOlfactive[]).filter((f) => presentes.has(f));
}
