import { describe, expect, it } from "vitest";
import { categorieAdminSchema, produitAdminSchema } from "./admin";

const saisie = {
  nom: "Savon Ambre noir",
  categorieId: "3",
  accroche: "",
  contenance: "100 g",
  prix: "3000",
  prixPromo: "",
  stock: "18",
  description: "",
  conseilsUtilisation: "",
  composition: "",
  familleOlfactive: "",
  notesTete: "Bergamote,  Rose ,",
  notesCoeur: "",
  notesFond: "",
  estNouveaute: true,
  actif: true,
};

describe("produitAdminSchema", () => {
  it("convertit les nombres, vide les champs facultatifs et découpe les notes", () => {
    const produit = produitAdminSchema.parse(saisie);
    expect(produit).toMatchObject({
      categorieId: 3,
      prix: 3000,
      prixPromo: null,
      stock: 18,
      accroche: null,
      familleOlfactive: null,
      notesTete: ["Bergamote", "Rose"],
      notesCoeur: [],
    });
  });

  it("refuse une promotion supérieure ou égale au prix (RM-03)", () => {
    const resultat = produitAdminSchema.safeParse({ ...saisie, prixPromo: "3000" });
    expect(resultat.success).toBe(false);
    expect(resultat.error?.issues[0]).toMatchObject({
      path: ["prixPromo"],
      message: "Le prix promo doit être inférieur au prix.",
    });
    expect(produitAdminSchema.parse({ ...saisie, prixPromo: "2500" }).prixPromo).toBe(2500);
  });

  it("refuse prix nul, stock négatif ou décimal", () => {
    for (const champs of [{ prix: "0" }, { stock: "-1" }, { stock: "2.5" }, { categorieId: "" }]) {
      expect(produitAdminSchema.safeParse({ ...saisie, ...champs }).success).toBe(false);
    }
  });
});

describe("categorieAdminSchema", () => {
  it("accepte une nouvelle catégorie", () => {
    expect(
      categorieAdminSchema.parse({ nom: "Gels douche", description: "", ordre: "4", active: true }),
    ).toEqual({ nom: "Gels douche", description: null, ordre: 4, active: true });
  });
});
