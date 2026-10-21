import { formaterPrix } from "@/shared/lib/format";
import { MODES_PAIEMENT } from "../schemas/commande";
import type { CommandeConfirmee } from "../types";

/** Message pré-rempli envoyé par la cliente : la commande est déjà enregistrée, il sert de rappel. */
export function messageCommande(commande: CommandeConfirmee): string {
  return [
    `Bonjour Énora, je viens de passer la commande ${commande.reference}.`,
    "",
    ...commande.lignes.map((l) => `• ${l.nom} × ${l.quantite} — ${formaterPrix(l.total)}`),
    "",
    `Livraison (${commande.zoneNom}) : ${formaterPrix(commande.fraisLivraison)}`,
    `Total : ${formaterPrix(commande.total)}`,
    `Paiement : ${MODES_PAIEMENT[commande.modePaiement].libelle}`,
    "",
    `Nom : ${commande.nom}`,
    `Adresse : ${commande.adresse}`,
  ].join("\n");
}

export function lienWhatsApp(numero: string, message: string): string {
  return `https://wa.me/${numero}?text=${encodeURIComponent(message)}`;
}
