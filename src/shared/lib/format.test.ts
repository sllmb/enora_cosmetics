import { describe, expect, it } from "vitest";
import { formaterPrix, pluriel, slugifier } from "./format";

describe("formaterPrix", () => {
  it("formate en FCFA sans décimales", () => {
    expect(formaterPrix(12500).replace(/\s/g, " ")).toBe("12 500 FCFA");
    expect(formaterPrix(999.6).replace(/\s/g, " ")).toBe("1 000 FCFA");
  });
});

describe("pluriel", () => {
  it("accorde selon le nombre", () => {
    expect(pluriel(1, "article")).toBe("1\u00a0article");
    expect(pluriel(3, "article")).toBe("3\u00a0articles");
    expect(pluriel(0, "article")).toBe("0\u00a0article");
  });
});

describe("slugifier", () => {
  it("retire accents et ponctuation", () => {
    expect(slugifier("Huile parfumée — Ambre & Oud")).toBe("huile-parfumee-ambre-oud");
  });
});
