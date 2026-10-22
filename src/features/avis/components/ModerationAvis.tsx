"use client";

import { MessageSquareText } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import { formaterDate } from "@/shared/lib/format";
import { Badge, Button, DialogueConfirmation, EmptyState } from "@/shared/ui";
import { modererAvis, supprimerAvis } from "../actions/avis";
import type { AvisAdmin, ResultatAvis } from "../types";
import { Etoiles } from "./Etoiles";

const STATUTS = {
  en_attente: { libelle: "À modérer", ton: "avertissement" },
  publie: { libelle: "Publié", ton: "succes" },
  refuse: { libelle: "Refusé", ton: "neutre" },
} as const;

export function ModerationAvis({ avis }: { avis: AvisAdmin[] }) {
  const router = useRouter();
  const [envoi, demarrer] = useTransition();
  const executer = (action: () => Promise<ResultatAvis>) =>
    demarrer(async () => {
      const resultat = await action();
      if (resultat.ok) {
        toast.success(resultat.message);
        router.refresh();
      } else toast.error(resultat.message);
    });

  if (avis.length === 0) {
    return (
      <EmptyState
        icone={<MessageSquareText className="size-7" strokeWidth={1.5} />}
        titre="Aucun avis"
        description="Les avis des clientes apparaîtront ici avant publication."
      />
    );
  }

  return (
    <ul className="flex flex-col gap-4">
      {avis.map((a) => (
        <li
          key={a.id}
          className="flex flex-col gap-3 rounded-carte border border-bordure bg-surface p-5"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <Link
              href={`/produit/${a.produitSlug}`}
              target="_blank"
              className="font-medium hover:text-primaire"
            >
              {a.produitNom}
            </Link>
            <Badge ton={STATUTS[a.statut].ton}>{STATUTS[a.statut].libelle}</Badge>
          </div>
          <p className="flex flex-wrap items-center gap-3 text-sm text-texte-attenue">
            <Etoiles note={a.note} /> {a.auteur} · {formaterDate(a.creeLe)}
          </p>
          {a.commentaire ? (
            <p className="leading-relaxed">{a.commentaire}</p>
          ) : (
            <p className="text-sm text-texte-attenue italic">Sans commentaire.</p>
          )}
          <div className="flex flex-wrap gap-2">
            {a.statut !== "publie" && (
              <Button
                taille="sm"
                disabled={envoi}
                onClick={() => executer(() => modererAvis(a.id, "publie"))}
              >
                Publier
              </Button>
            )}
            {a.statut !== "refuse" && (
              <Button
                taille="sm"
                variante="secondaire"
                disabled={envoi}
                onClick={() => executer(() => modererAvis(a.id, "refuse"))}
              >
                {a.statut === "publie" ? "Retirer" : "Refuser"}
              </Button>
            )}
            <DialogueConfirmation
              declencheur={
                <Button taille="sm" variante="discret" disabled={envoi} className="text-danger">
                  Supprimer
                </Button>
              }
              titre="Supprimer cet avis ?"
              description="La cliente pourra en déposer un nouveau. Pour simplement le masquer, refusez-le."
              libelleConfirmer="Supprimer"
              onConfirmer={() => executer(() => supprimerAvis(a.id))}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}
