import { describe, expect, it } from "vitest";
import { normaliserTelephoneSn, telephoneSn } from "./validation";

describe("normaliserTelephoneSn", () => {
  it.each([
    ["77 123 45 67", "771234567"],
    ["+221 70 123 45 67", "701234567"],
    ["00221781234567", "781234567"],
    ["33-823-45-67", "338234567"],
  ])("accepte %s", (saisie, attendu) => {
    expect(normaliserTelephoneSn(saisie)).toBe(attendu);
  });

  it.each(["79 123 45 67", "7712345", "+33 6 12 34 56 78", "abc"])("refuse %s", (saisie) => {
    expect(normaliserTelephoneSn(saisie)).toBeNull();
  });
});

describe("telephoneSn", () => {
  it("renvoie le numéro normalisé ou un message français", () => {
    expect(telephoneSn.parse("77 123 45 67")).toBe("771234567");
    const resultat = telephoneSn.safeParse("12");
    expect(resultat.success).toBe(false);
    expect(resultat.error?.issues[0]?.message).toMatch(/sénégalais/);
  });
});
