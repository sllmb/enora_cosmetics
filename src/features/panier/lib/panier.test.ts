import { describe, expect, it } from "vitest";
import type { Produit } from "@/features/catalogue";
import {
  ajouter,
  compterArticles,
  detaillerPanier,
  modifier,
  QUANTITE_MAX,
  retirer,
  type LignePanier,
} from "./panier";

const produit = (slug: string, champs: Partial<Produit> = {}) =>
  ({ slug, nom: slug, prix: 5000, prixPromo: null, stock: 10, ...champs }) as Produit;

describe("ajouter (RM-05)", () => {
  it("ajoute puis cumule une même ligne", () => {
    const un = ajouter([], "a", 2, 10);
    expect(un).toEqual({ lignes: [{ slug: "a", quantite: 2 }], ajoute: 2 });
    expect(ajouter(un.lignes, "a", 3, 10).lignes).toEqual([{ slug: "a", quantite: 5 }]);
  });

  it("plafonne au stock et à 20, et signale ce qui a été ajouté", () => {
    expect(ajouter([{ slug: "a", quantite: 4 }], "a", 5, 6)).toEqual({
      lignes: [{ slug: "a", quantite: 6 }],
      ajoute: 2,
    });
    expect(ajouter([], "a", 50, 100).lignes[0]?.quantite).toBe(QUANTITE_MAX);
    const plein: LignePanier[] = [{ slug: "a", quantite: 6 }];
    expect(ajouter(plein, "a", 1, 6)).toEqual({ lignes: plein, ajoute: 0 });
  });

  it("n'ajoute rien pour un produit épuisé", () => {
    expect(ajouter([], "a", 1, 0)).toEqual({ lignes: [], ajoute: 0 });
  });
});

describe("modifier / retirer / compter", () => {
  const lignes: LignePanier[] = [
    { slug: "a", quantite: 2 },
    { slug: "b", quantite: 1 },
  ];

  it("modifie, borne à 20 et retire à zéro", () => {
    expect(modifier(lignes, "a", 30)[0]?.quantite).toBe(QUANTITE_MAX);
    expect(modifier(lignes, "a", 0)).toEqual([{ slug: "b", quantite: 1 }]);
    expect(retirer(lignes, "b")).toEqual([{ slug: "a", quantite: 2 }]);
    expect(compterArticles(lignes)).toBe(3);
  });
});

describe("detaillerPanier", () => {
  it("calcule le sous-total avec le prix promo (RM-03)", () => {
    const resultat = detaillerPanier(
      [
        { slug: "a", quantite: 2 },
        { slug: "b", quantite: 1 },
      ],
      [produit("a"), produit("b", { prixPromo: 4000 })],
    );
    expect(resultat.sousTotal).toBe(14000);
    expect(resultat.nombreArticles).toBe(3);
    expect(resultat.commandable).toBe(true);
  });

  it("signale les produits retirés, épuisés ou en stock insuffisant", () => {
    const resultat = detaillerPanier(
      [
        { slug: "retire", quantite: 1 },
        { slug: "epuise", quantite: 1 },
        { slug: "rare", quantite: 5 },
        { slug: "ok", quantite: 1 },
      ],
      [produit("epuise", { stock: 0 }), produit("rare", { stock: 2 }), produit("ok")],
    );
    expect(resultat.lignes.map((l) => l.probleme)).toEqual([
      "indisponible",
      "epuise",
      "stock",
      null,
    ]);
    expect(resultat.sousTotal).toBe(5000);
    expect(resultat.commandable).toBe(false);
  });

  it("un panier vide n'est pas commandable", () => {
    expect(detaillerPanier([], []).commandable).toBe(false);
  });
});
