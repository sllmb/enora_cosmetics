import { describe, expect, it } from "vitest";
import type { Produit } from "../types";
import { PRODUITS_DEMO } from "./donnees-demo";
import {
  appliquerSelection,
  ecrireSelection,
  famillesDisponibles,
  lireSelection,
  SELECTION_PAR_DEFAUT,
} from "./filtres";
import { prixEffectif } from "./produit";

const slugs = (produits: Produit[]) => produits.map((p) => p.slug);

describe("lireSelection / ecrireSelection", () => {
  it("relit ce qu'elle écrit", () => {
    const selection = {
      tri: "prix-croissant" as const,
      familles: ["floral" as const, "oriental" as const],
      disponiblesSeulement: true,
    };
    const url = ecrireSelection(selection);
    expect(url).toBe("?tri=prix-croissant&famille=floral%2Coriental&dispo=1");
    expect(lireSelection(new URLSearchParams(url))).toEqual(selection);
  });

  it("ignore les valeurs inconnues et n'écrit rien par défaut", () => {
    expect(lireSelection(new URLSearchParams("?tri=hasard&famille=floral,xx,floral"))).toEqual({
      ...SELECTION_PAR_DEFAUT,
      familles: ["floral"],
    });
    expect(ecrireSelection(SELECTION_PAR_DEFAUT)).toBe("");
  });
});

describe("appliquerSelection", () => {
  it("trie par prix effectif (promo comprise)", () => {
    const tries = appliquerSelection(PRODUITS_DEMO, {
      ...SELECTION_PAR_DEFAUT,
      tri: "prix-croissant",
    });
    const prix = tries.map(prixEffectif);
    expect(prix).toEqual([...prix].sort((a, b) => a - b));
    expect(tries[0]?.slug).toBe("savon-fleur-oranger"); // 2 000 FCFA en promo
  });

  it("filtre par famille et masque les produits épuisés", () => {
    const floral = appliquerSelection(PRODUITS_DEMO, {
      ...SELECTION_PAR_DEFAUT,
      familles: ["floral"],
    });
    expect(slugs(floral)).toEqual(["huile-parfumee-jasmin", "savon-fleur-oranger"]);
    const disponibles = appliquerSelection(PRODUITS_DEMO, {
      ...SELECTION_PAR_DEFAUT,
      familles: ["floral"],
      disponiblesSeulement: true,
    });
    expect(slugs(disponibles)).toEqual(["huile-parfumee-jasmin"]);
  });

  it("place les produits épuisés en dernier par défaut", () => {
    const tries = appliquerSelection(PRODUITS_DEMO, SELECTION_PAR_DEFAUT);
    expect(tries.at(-1)?.slug).toBe("savon-fleur-oranger");
    expect(tries).toHaveLength(PRODUITS_DEMO.length);
  });
});

describe("famillesDisponibles", () => {
  it("ne propose que les familles présentes", () => {
    const savons = PRODUITS_DEMO.filter((p) => p.categorieSlug === "savons");
    expect(famillesDisponibles(savons)).toEqual(["floral", "oriental", "gourmand"]);
  });
});
