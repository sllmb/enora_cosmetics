import { ChevronRight, Package } from "lucide-react";
import Link from "next/link";
import { STATUTS, type CommandeConfirmee } from "@/features/commande";
import { formaterDate, formaterPrix, pluriel } from "@/shared/lib/format";
import { Badge, ButtonLink, EmptyState } from "@/shared/ui";

export function ListeCommandes({ commandes }: { commandes: CommandeConfirmee[] }) {
  if (commandes.length === 0) {
    return (
      <EmptyState
        icone={<Package className="size-7" strokeWidth={1.5} />}
        titre="Aucune commande pour l'instant"
        description="Les commandes passées en étant connectée apparaîtront ici."
        action={<ButtonLink href="/boutique">Découvrir la boutique</ButtonLink>}
      />
    );
  }
  return (
    <ul className="divide-y divide-bordure border-y border-bordure">
      {commandes.map((commande) => {
        const articles = commande.lignes.reduce((n, l) => n + l.quantite, 0);
        const statut = STATUTS[commande.statut];
        return (
          <li key={commande.reference}>
            <Link
              href={`/compte/commandes/${commande.reference}`}
              className="flex items-center gap-4 py-4 hover:bg-surface-douce/60"
            >
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <p className="flex flex-wrap items-center gap-2 font-medium">
                  {commande.reference}
                  <Badge ton={statut.ton}>{statut.libelle}</Badge>
                </p>
                <p className="text-sm text-texte-attenue">
                  {formaterDate(commande.creeLe)} · {pluriel(articles, "article")}
                </p>
              </div>
              <span className="font-medium whitespace-nowrap">{formaterPrix(commande.total)}</span>
              <ChevronRight aria-hidden className="size-4 text-texte-attenue" />
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
