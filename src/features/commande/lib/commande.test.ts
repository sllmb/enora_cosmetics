import { describe, expect, it } from "vitest";
import { coordonneesSchema, lignesCommandeSchema } from "../schemas/commande";
import type { CommandeConfirmee } from "../types";
import { traduireErreurCommande } from "./erreurs";
import { lienWhatsApp, messageCommande } from "./whatsapp";

const saisie = {
  nom: "Awa Ndiaye",
  telephone: "77 123 45 67",
  email: "",
  adresse: "Sacré-Cœur 3, villa 12",
  zoneId: "1",
  modePaiement: "wave",
};

describe("coordonneesSchema", () => {
  it("normalise le téléphone et convertit la zone", () => {
    const resultat = coordonneesSchema.parse(saisie);
    expect(resultat.telephone).toBe("771234567");
    expect(resultat.zoneId).toBe(1);
  });

  it("explique chaque champ manquant en français", () => {
    const resultat = coordonneesSchema.safeParse({ ...saisie, adresse: "", zoneId: "" });
    const messages = resultat.error?.issues.map((i) => i.message) ?? [];
    expect(messages).toContain("Précisez l'adresse de livraison (quartier, rue, point de repère).");
    expect(messages).toContain("Choisissez une zone de livraison.");
  });

  it("refuse un mode de paiement inconnu", () => {
    expect(coordonneesSchema.safeParse({ ...saisie, modePaiement: "carte" }).success).toBe(false);
  });
});

describe("lignesCommandeSchema (RM-05)", () => {
  it("refuse un panier vide ou une quantité hors limites", () => {
    expect(lignesCommandeSchema.safeParse([]).success).toBe(false);
    expect(lignesCommandeSchema.safeParse([{ slug: "a", quantite: 21 }]).success).toBe(false);
    expect(lignesCommandeSchema.safeParse([{ slug: "a", quantite: 2 }]).success).toBe(true);
  });
});

describe("traduireErreurCommande", () => {
  it("donne un message clair et le produit en cause", () => {
    expect(traduireErreurCommande("STOCK_INSUFFISANT:savon-ambre-noir")).toEqual({
      ok: false,
      message: "Un produit de votre panier n'a plus assez de stock.",
      produit: "savon-ambre-noir",
    });
    expect(traduireErreurCommande("ZONE_INVALIDE").erreurs?.zoneId).toMatch(/zone/);
  });

  it("ne montre jamais un message technique", () => {
    expect(traduireErreurCommande('relation "x" does not exist').message).toMatch(/Réessayez/);
    expect(traduireErreurCommande(undefined).message).toMatch(/Réessayez/);
  });
});

describe("message WhatsApp", () => {
  const commande: CommandeConfirmee = {
    reference: "ENR-2026-00001",
    nom: "Awa Ndiaye",
    telephone: "771234567",
    adresse: "Sacré-Cœur 3",
    zoneNom: "Dakar",
    modePaiement: "whatsapp",
    statut: "en_attente",
    sousTotal: 9000,
    fraisLivraison: 1500,
    total: 10500,
    creeLe: "2026-10-22T10:00:00Z",
    lignes: [{ nom: "Savon Ambre noir", prixUnitaire: 3000, quantite: 3, total: 9000 }],
  };

  it("reprend la référence, les articles et le total", () => {
    const message = messageCommande(commande).replace(/\s/g, " ");
    expect(message).toContain("ENR-2026-00001");
    expect(message).toContain("Savon Ambre noir × 3 — 9 000 FCFA");
    expect(message).toContain("Total : 10 500 FCFA");
    expect(message).toContain("Paiement : Finaliser sur WhatsApp");
  });

  it("encode le message dans le lien", () => {
    expect(lienWhatsApp("221771234567", "Bonjour & merci")).toBe(
      "https://wa.me/221771234567?text=Bonjour%20%26%20merci",
    );
  });
});
