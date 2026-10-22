import { describe, expect, it } from "vitest";
import { avisSchema } from "../schemas/avis";
import { formaterNote, nomPublic, resumerAvis } from "./avis";

describe("resumerAvis", () => {
  it("calcule la moyenne au dixième", () => {
    expect(resumerAvis([{ note: 5 }, { note: 4 }, { note: 4 }])).toEqual({
      moyenne: 4.3,
      nombre: 3,
    });
    expect(resumerAvis([])).toEqual({ moyenne: 0, nombre: 0 });
  });

  it("affiche la note à la française", () => {
    expect(formaterNote(4.3)).toBe("4,3");
    expect(formaterNote(5)).toBe("5,0");
  });
});

describe("nomPublic", () => {
  it("garde le prénom et l'initiale du nom", () => {
    expect(nomPublic("Awa Ndiaye")).toBe("Awa N.");
    expect(nomPublic("  Fatou   Bintou   diop ")).toBe("Fatou D.");
    expect(nomPublic("Mariama")).toBe("Mariama");
    expect(nomPublic("")).toBe("Cliente Énora");
  });
});

describe("avisSchema", () => {
  it("exige une note de 1 à 5, commentaire facultatif", () => {
    expect(avisSchema.parse({ note: "4", commentaire: "" })).toEqual({
      note: 4,
      commentaire: null,
    });
    for (const note of ["0", "6", "4.5", ""]) {
      expect(avisSchema.safeParse({ note }).success).toBe(false);
    }
    expect(avisSchema.safeParse({ note: 5, commentaire: "x".repeat(1001) }).success).toBe(false);
  });
});
