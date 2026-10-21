import { describe, expect, it } from "vitest";
import { estEnPromo, estEpuise, pourcentageRemise, prixEffectif } from "./produit";

describe("règles de prix (RM-03)", () => {
  it("applique le prix promo inférieur au prix", () => {
    const produit = { prix: 4500, prixPromo: 3900 };
    expect(estEnPromo(produit)).toBe(true);
    expect(prixEffectif(produit)).toBe(3900);
    expect(pourcentageRemise(produit)).toBe(13);
  });

  it("ignore un prix promo absent, égal ou supérieur", () => {
    for (const prixPromo of [null, 4500, 5000]) {
      const produit = { prix: 4500, prixPromo };
      expect(estEnPromo(produit)).toBe(false);
      expect(prixEffectif(produit)).toBe(4500);
      expect(pourcentageRemise(produit)).toBe(0);
    }
  });
});

describe("stock (RM-04)", () => {
  it("considère épuisé un stock nul", () => {
    expect(estEpuise({ stock: 0 })).toBe(true);
    expect(estEpuise({ stock: 3 })).toBe(false);
  });
});
