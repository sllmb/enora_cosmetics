import { afterEach, describe, expect, it, vi } from "vitest";
import { lireEnvPublic } from "./env";

afterEach(() => vi.restoreAllMocks());

describe("lireEnvPublic", () => {
  it("accepte les numéros marchands sous toutes leurs formes courantes", () => {
    for (const saisie of ["771234567", "77 123 45 67", "+221 77 123 45 67", " 00221771234567 "]) {
      expect(lireEnvPublic({ NEXT_PUBLIC_WAVE_NUMERO: saisie }).waveNumero).toBe("771234567");
    }
  });

  it("ignore une valeur invalide sans jamais lever d'erreur", () => {
    const avertissement = vi.spyOn(console, "warn").mockImplementation(() => {});
    const env = lireEnvPublic({
      NEXT_PUBLIC_SITE_URL: "pas une adresse",
      NEXT_PUBLIC_WHATSAPP_NUMERO: "abc",
      NEXT_PUBLIC_WAVE_NUMERO: "12",
      NEXT_PUBLIC_ORANGE_MONEY_NUMERO: "",
    });
    expect(env).toEqual({
      siteUrl: "http://localhost:3000",
      whatsappNumero: undefined,
      waveNumero: undefined,
      orangeMoneyNumero: undefined,
    });
    expect(avertissement).toHaveBeenCalledTimes(3);
  });

  it("nettoie l'adresse du site et le numéro WhatsApp", () => {
    expect(
      lireEnvPublic({
        NEXT_PUBLIC_SITE_URL: "https://enora.sn/",
        NEXT_PUBLIC_WHATSAPP_NUMERO: "+221 771234567",
      }),
    ).toMatchObject({ siteUrl: "https://enora.sn", whatsappNumero: "221771234567" });
  });
});
