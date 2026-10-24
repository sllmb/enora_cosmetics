import { describe, expect, it } from "vitest";
import type { Produit } from "../types";
import { choisirVedette, choisirVisuelsAccueil } from "./accueil";
import { PRODUITS_DEMO } from "./donnees-demo";

const base = PRODUITS_DEMO[0]!;
const produit = (slug: string, champs: Partial<Produit> = {}): Produit => ({
  ...base,
  slug,
  vedette: false,
  estNouveaute: false,
  images: [],
  ...champs,
});
const photo = [{ url: "https://exemple/photo.webp", alt: "" }];

describe("choisirVedette", () => {
  it("prend le produit désigné dans l'administration", () => {
    const liste = [
      produit("a", { estNouveaute: true, images: photo }),
      produit("b", { vedette: true }),
    ];
    expect(choisirVedette(liste)?.slug).toBe("b");
  });

  it("sinon une nouveauté avec photo, puis un produit avec photo", () => {
    expect(
      choisirVedette([
        produit("a", { estNouveaute: true }),
        produit("b", { estNouveaute: true, images: photo }),
      ])?.slug,
    ).toBe("b");
    expect(choisirVedette([produit("a"), produit("b", { images: photo })])?.slug).toBe("b");
  });

  it("ne plante pas sur un catalogue vide", () => {
    expect(choisirVedette([])).toBeNull();
  });
});

describe("choisirVisuelsAccueil", () => {
  it("met la vedette en premier, puis les produits avec photo, sans doublon", () => {
    const liste = [
      produit("sans-photo"),
      produit("nouveau-photo", { estNouveaute: true, images: photo }),
      produit("photo", { images: photo }),
      produit("vedette", { vedette: true, images: photo }),
    ];
    expect(choisirVisuelsAccueil(liste).map((p) => p.slug)).toEqual([
      "vedette",
      "nouveau-photo",
      "photo",
    ]);
  });

  it("complète avec les autres produits s'il manque des photos", () => {
    expect(choisirVisuelsAccueil([produit("a"), produit("b")], 3).map((p) => p.slug)).toEqual([
      "a",
      "b",
    ]);
  });
});
