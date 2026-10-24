import { describe, expect, it } from "vitest";
import { estActif, MENU_PRINCIPAL } from "./menus";

describe("estActif", () => {
  it("compare exactement si demandé", () => {
    const lien = { libelle: "Boutique", href: "/boutique", exact: true };
    expect(estActif(lien, "/boutique")).toBe(true);
    expect(estActif(lien, "/boutique/savons")).toBe(false);
  });

  it("active le parent sur les sous-pages sans confondre les préfixes", () => {
    const lien = { libelle: "Conseils", href: "/conseils" };
    expect(estActif(lien, "/conseils/bien-choisir-son-deodorant")).toBe(true);
    expect(estActif(lien, "/conseilsx")).toBe(false);
  });

  it("garde le catalogue actif sur les catégories et les fiches produit", () => {
    const catalogue = MENU_PRINCIPAL.find((l) => l.libelle === "Catalogue")!;
    expect(estActif(catalogue, "/boutique")).toBe(true);
    expect(estActif(catalogue, "/boutique/savons")).toBe(true);
    expect(estActif(catalogue, "/produit/savon-dove")).toBe(true);
    expect(estActif(catalogue, "/produits-x")).toBe(false);
  });

  it("n'active l'accueil que sur la page d'accueil", () => {
    const accueil = MENU_PRINCIPAL[0]!;
    expect(accueil.libelle).toBe("Accueil");
    expect(estActif(accueil, "/")).toBe(true);
    expect(estActif(accueil, "/boutique")).toBe(false);
  });
});
