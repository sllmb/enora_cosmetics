"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import { Button, DialogueConfirmation } from "@/shared/ui";
import { changerStatutCommande, marquerPaiement, type ResultatAdmin } from "../actions/admin";
import { STATUTS } from "../lib/statuts";
import type { CommandeAdmin, StatutCommande } from "../types";

// RM-09 : prochaines étapes possibles depuis chaque statut (contrôlées aussi en base).
const SUITES: Record<StatutCommande, StatutCommande[]> = {
  en_attente: ["confirmee"],
  confirmee: ["expediee"],
  expediee: ["livree"],
  livree: [],
  annulee: [],
};

const LIBELLES_ACTION: Partial<Record<StatutCommande, string>> = {
  confirmee: "Confirmer la commande",
  expediee: "Marquer comme expédiée",
  livree: "Marquer comme livrée",
};

export function ActionsCommandeAdmin({ commande }: { commande: CommandeAdmin }) {
  const router = useRouter();
  const [envoi, demarrer] = useTransition();
  const annulable = !["livree", "annulee"].includes(commande.statut);

  const executer = (action: () => Promise<ResultatAdmin>, succes: string) =>
    demarrer(async () => {
      const resultat = await action();
      if (resultat.ok) {
        toast.success(succes);
        router.refresh();
      } else {
        toast.error(resultat.message);
      }
    });

  return (
    <div className="flex flex-col gap-3">
      {SUITES[commande.statut].map((suivant) => (
        <Button
          key={suivant}
          disabled={envoi}
          onClick={() =>
            executer(
              () => changerStatutCommande(commande.reference, suivant),
              `Commande ${STATUTS[suivant].libelle.toLowerCase()}.`,
            )
          }
        >
          {LIBELLES_ACTION[suivant]}
        </Button>
      ))}

      {commande.statut !== "annulee" && (
        <Button
          variante="secondaire"
          disabled={envoi}
          onClick={() =>
            executer(
              () => marquerPaiement(commande.reference, !commande.paiementRecuLe),
              commande.paiementRecuLe ? "Paiement remis en attente." : "Paiement enregistré.",
            )
          }
        >
          {commande.paiementRecuLe ? "Annuler la réception du paiement" : "Paiement reçu"}
        </Button>
      )}

      {annulable && (
        <DialogueConfirmation
          declencheur={
            <Button variante="discret" disabled={envoi} className="text-danger">
              Annuler la commande
            </Button>
          }
          titre={`Annuler ${commande.reference} ?`}
          description="Les produits sont remis en stock. Cette action est définitive."
          libelleConfirmer="Annuler la commande"
          onConfirmer={() =>
            executer(
              () => changerStatutCommande(commande.reference, "annulee"),
              "Commande annulée, stock remis.",
            )
          }
        />
      )}
    </div>
  );
}
