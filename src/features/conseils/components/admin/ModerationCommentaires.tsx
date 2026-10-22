"use client";

import { MessagesSquare } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import { formaterDate } from "@/shared/lib/format";
import { Badge, Button, DialogueConfirmation, EmptyState } from "@/shared/ui";
import { modererCommentaire, supprimerCommentaire } from "../../actions/commentaires";
import type { CommentaireAdmin, ResultatCommentaire } from "../../types";

const STATUTS = {
  en_attente: { libelle: "À modérer", ton: "avertissement" },
  publie: { libelle: "Publié", ton: "succes" },
  refuse: { libelle: "Refusé", ton: "neutre" },
} as const;

export function ModerationCommentaires({ commentaires }: { commentaires: CommentaireAdmin[] }) {
  const router = useRouter();
  const [envoi, demarrer] = useTransition();
  const executer = (action: () => Promise<ResultatCommentaire>) =>
    demarrer(async () => {
      const resultat = await action();
      if (resultat.ok) {
        toast.success(resultat.message);
        router.refresh();
      } else toast.error(resultat.message);
    });

  if (commentaires.length === 0) {
    return (
      <EmptyState
        icone={<MessagesSquare className="size-7" strokeWidth={1.5} />}
        titre="Aucun commentaire"
        description="Les commentaires des lectrices apparaîtront ici avant publication."
      />
    );
  }

  return (
    <ul className="flex flex-col gap-4">
      {commentaires.map((c) => (
        <li
          key={c.id}
          className="flex flex-col gap-3 rounded-carte border border-bordure bg-surface p-5"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <Link
              href={`/conseils/${c.articleSlug}`}
              target="_blank"
              className="font-medium hover:text-primaire"
            >
              {c.articleTitre}
            </Link>
            <Badge ton={STATUTS[c.statut].ton}>{STATUTS[c.statut].libelle}</Badge>
          </div>
          <p className="text-sm text-texte-attenue">
            {c.auteur} · {formaterDate(c.creeLe)}
          </p>
          <p className="leading-relaxed whitespace-pre-line">{c.contenu}</p>
          <div className="flex flex-wrap gap-2">
            {c.statut !== "publie" && (
              <Button
                taille="sm"
                disabled={envoi}
                onClick={() => executer(() => modererCommentaire(c.id, "publie"))}
              >
                Publier
              </Button>
            )}
            {c.statut !== "refuse" && (
              <Button
                taille="sm"
                variante="secondaire"
                disabled={envoi}
                onClick={() => executer(() => modererCommentaire(c.id, "refuse"))}
              >
                {c.statut === "publie" ? "Retirer" : "Refuser"}
              </Button>
            )}
            <DialogueConfirmation
              declencheur={
                <Button taille="sm" variante="discret" disabled={envoi} className="text-danger">
                  Supprimer
                </Button>
              }
              titre="Supprimer ce commentaire ?"
              description="Il est supprimé définitivement. Pour simplement le masquer, refusez-le."
              libelleConfirmer="Supprimer"
              onConfirmer={() => executer(() => supprimerCommentaire(c.id))}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}
