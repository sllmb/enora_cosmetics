import { describe, expect, it } from "vitest";
import {
  adresseVisiteuse,
  MAX_EN_ATTENTE_PAR_TELEPHONE,
  MAX_PAR_CONNEXION_PAR_HEURE,
  motifLimite,
} from "./limites";

describe("motifLimite", () => {
  it("laisse passer une cliente ordinaire", () => {
    expect(motifLimite({ enAttenteTelephone: 1, recentesConnexion: 2 })).toBeNull();
  });

  it("bloque trop de commandes en attente pour un même numéro", () => {
    const motif = motifLimite({
      enAttenteTelephone: MAX_EN_ATTENTE_PAR_TELEPHONE,
      recentesConnexion: 0,
    });
    expect(motif).toMatch(/WhatsApp/);
  });

  it("bloque trop de commandes depuis une même connexion", () => {
    const motif = motifLimite({
      enAttenteTelephone: 0,
      recentesConnexion: MAX_PAR_CONNEXION_PAR_HEURE,
    });
    expect(motif).toMatch(/une heure/);
  });
});

describe("adresseVisiteuse", () => {
  const entetes = (valeurs: Record<string, string>) => ({ get: (n: string) => valeurs[n] ?? null });

  it("prend la première adresse transmise par l'hébergeur", () => {
    expect(adresseVisiteuse(entetes({ "x-forwarded-for": "41.82.1.2, 10.0.0.1" }))).toBe(
      "41.82.1.2",
    );
  });

  it("se replie sur x-real-ip, sinon rien", () => {
    expect(adresseVisiteuse(entetes({ "x-real-ip": "41.82.1.3" }))).toBe("41.82.1.3");
    expect(adresseVisiteuse(entetes({}))).toBeNull();
  });
});
