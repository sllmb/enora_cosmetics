import { describe, expect, it } from "vitest";
import { estActif } from "./menus";

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
});
