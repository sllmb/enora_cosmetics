import { describe, expect, it } from "vitest";
import { cheminDeRetour } from "./redirection";

describe("cheminDeRetour", () => {
  it("garde un chemin interne", () => {
    expect(cheminDeRetour("/compte/commandes")).toBe("/compte/commandes");
    expect(cheminDeRetour("/commande?x=1")).toBe("/commande?x=1");
  });

  it("refuse tout ce qui mènerait vers un autre site", () => {
    for (const valeur of [
      "https://pirate.com",
      "//pirate.com",
      "/\\pirate.com",
      "compte",
      "",
      null,
    ]) {
      expect(cheminDeRetour(valeur)).toBe("/compte");
    }
  });
});
