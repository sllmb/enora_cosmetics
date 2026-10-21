import { describe, expect, it } from "vitest";
import { ligneProduitSchema, versCategorie, versProduit } from "./lignes";

const ligne = {
  slug: "huile-parfumee-jasmin",
  nom: "Huile parfumée Jasmin",
  accroche: null,
  description: "Florale",
  conseils_utilisation: null,
  composition: null,
  contenance: "10 ml",
  prix: 6500,
  prix_promo: null,
  stock: 25,
  est_nouveaute: false,
  famille_olfactive: "floral",
  notes_olfactives: { tete: ["Néroli"], coeur: ["Jasmin"], fond: ["Musc"] },
  categories: { slug: "huiles-parfumees" },
  produit_images: [
    { chemin: "jasmin/2.jpg", alt: "", ordre: 2 },
    { chemin: "jasmin/1.jpg", alt: "Flacon de face", ordre: 1 },
  ],
};

describe("versProduit", () => {
  it("convertit une ligne Supabase en produit du site", () => {
    const produit = versProduit(ligneProduitSchema.parse(ligne), (c) => `https://cdn/${c}`);
    expect(produit).toMatchObject({
      categorieSlug: "huiles-parfumees",
      accroche: "",
      forme: "flacon",
      familleOlfactive: "floral",
    });
    expect(produit.images).toEqual([
      { url: "https://cdn/jasmin/1.jpg", alt: "Flacon de face" },
      { url: "https://cdn/jasmin/2.jpg", alt: "Huile parfumée Jasmin" },
    ]);
  });

  it("neutralise une famille ou des notes olfactives inattendues", () => {
    const produit = versProduit(
      ligneProduitSchema.parse({ ...ligne, famille_olfactive: "musqué", notes_olfactives: "x" }),
      (c) => c,
    );
    expect(produit.familleOlfactive).toBeNull();
    expect(produit.notesOlfactives).toBeNull();
  });

  it("refuse une ligne sans prix", () => {
    expect(ligneProduitSchema.safeParse({ ...ligne, prix: null }).success).toBe(false);
  });
});

describe("versCategorie", () => {
  it("déduit la forme d'illustration de la catégorie", () => {
    expect(versCategorie({ slug: "savons", nom: "Savons", description: null })).toEqual({
      slug: "savons",
      nom: "Savons",
      description: "",
      forme: "savon",
    });
  });
});
