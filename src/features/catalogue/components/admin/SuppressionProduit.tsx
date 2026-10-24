"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import { Button, DialogueConfirmation } from "@/shared/ui";
import { supprimerProduit } from "../../actions/admin";

export function SuppressionProduit({ id, nom }: { id: number; nom: string }) {
  const router = useRouter();
  const [envoi, demarrer] = useTransition();
  return (
    <DialogueConfirmation
      declencheur={
        <Button variante="discret" disabled={envoi} className="text-danger">
          Supprimer le produit
        </Button>
      }
      titre={`Supprimer « ${nom} » ?`}
      description="Le produit et ses photos sont supprimés définitivement. Les commandes déjà passées restent intactes. Pour le retirer temporairement, décochez plutôt « Visible dans la boutique »."
      libelleConfirmer="Supprimer"
      onConfirmer={() =>
        demarrer(async () => {
          const resultat = await supprimerProduit(id);
          if (!resultat.ok) return void toast.error(resultat.message);
          toast.success("Produit supprimé.");
          router.push("/admin/produits");
        })
      }
    />
  );
}
