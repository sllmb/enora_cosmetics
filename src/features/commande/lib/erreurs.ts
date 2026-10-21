import type { ResultatCommande } from "../types";

/*
 * Traduit les erreurs de la fonction SQL creer_commande (code stable, ex.
 * « STOCK_INSUFFISANT:savon-ambre-noir ») en message pour la cliente.
 * Le texte affiché ne dépend jamais du message technique.
 */

type Echec = Extract<ResultatCommande, { ok: false }>;

const MESSAGES: Record<string, string> = {
  PANIER_VIDE: "Votre panier est vide.",
  PANIER_TROP_GRAND: "Votre panier contient trop de produits différents.",
  ZONE_INVALIDE: "Cette zone de livraison n'est plus disponible. Choisissez-en une autre.",
  QUANTITE_INVALIDE: "Une quantité de votre panier n'est pas valide (1 à 20 par produit).",
  PRODUIT_INDISPONIBLE: "Un produit de votre panier n'est plus proposé.",
  STOCK_INSUFFISANT: "Un produit de votre panier n'a plus assez de stock.",
};

const GENERIQUE = "La commande n'a pas pu être enregistrée. Réessayez dans un instant.";

export function traduireErreurCommande(message: string | undefined): Echec {
  const [code = "", produit] = (message ?? "").split(":");
  const texte = MESSAGES[code];
  if (!texte) return { ok: false, message: GENERIQUE };
  return {
    ok: false,
    message: texte,
    ...(code === "ZONE_INVALIDE" && { erreurs: { zoneId: texte } }),
    ...(produit && { produit }),
  };
}
