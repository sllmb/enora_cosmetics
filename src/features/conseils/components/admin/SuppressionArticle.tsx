"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import { Button, DialogueConfirmation } from "@/shared/ui";
import { supprimerArticle } from "../../actions/conseils";

export function SuppressionArticle({ id, titre }: { id: number; titre: string }) {
  const router = useRouter();
  const [envoi, demarrer] = useTransition();
  return (
    <DialogueConfirmation
      declencheur={
        <Button variante="discret" disabled={envoi} className="text-danger">
          Supprimer l&apos;article
        </Button>
      }
      titre={`Supprimer « ${titre} » ?`}
      description="L'article et son image sont supprimés définitivement. Pour le retirer temporairement, décochez plutôt « Publié »."
      libelleConfirmer="Supprimer"
      onConfirmer={() =>
        demarrer(async () => {
          const resultat = await supprimerArticle(id);
          if (!resultat.ok) return void toast.error(resultat.message);
          toast.success("Article supprimé.");
          router.push("/admin/articles");
        })
      }
    />
  );
}
