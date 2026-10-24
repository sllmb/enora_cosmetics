import { ChevronRight, Inbox } from "lucide-react";
import Link from "next/link";
import { formaterDate, formaterPrix, formaterTelephone } from "@/shared/lib/format";
import { Badge, EmptyState } from "@/shared/ui";
import { STATUTS } from "../lib/statuts";
import { MODES_PAIEMENT } from "../schemas/commande";
import type { CommandeAdmin } from "../types";

export function ListeCommandesAdmin({ commandes }: { commandes: CommandeAdmin[] }) {
  if (commandes.length === 0) {
    return (
      <EmptyState
        icone={<Inbox className="size-7" strokeWidth={1.5} />}
        titre="Aucune commande"
        description="Aucune commande ne correspond à ces critères."
      />
    );
  }
  return (
    <ul className="divide-y divide-bordure rounded-carte border border-bordure bg-surface">
      {commandes.map((commande) => {
        const statut = STATUTS[commande.statut];
        const paiementAttendu =
          ["wave", "orange_money"].includes(commande.modePaiement) &&
          !commande.paiementRecuLe &&
          commande.statut !== "annulee";
        return (
          <li key={commande.reference}>
            <Link
              href={`/admin/commandes/${commande.reference}`}
              className="flex items-center gap-4 px-4 py-4 hover:bg-surface-douce/60 sm:px-6"
            >
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <p className="flex flex-wrap items-center gap-2">
                  <span className="font-medium">{commande.reference}</span>
                  <Badge ton={statut.ton}>{statut.libelle}</Badge>
                  {paiementAttendu && <Badge ton="avertissement">Paiement à vérifier</Badge>}
                </p>
                {/* Rien de coupé : nom, téléphone, zone et paiement servent à traiter la commande. */}
                <p className="text-sm">
                  {commande.nom} ·{" "}
                  <span className="whitespace-nowrap">{formaterTelephone(commande.telephone)}</span>
                </p>
                <p className="text-sm text-texte-attenue">
                  {commande.zoneNom} · {MODES_PAIEMENT[commande.modePaiement].libelle}
                </p>
                <p className="text-xs text-texte-attenue">{formaterDate(commande.creeLe)}</p>
              </div>
              <span className="font-medium whitespace-nowrap">{formaterPrix(commande.total)}</span>
              <ChevronRight aria-hidden className="size-4 shrink-0 text-texte-attenue" />
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
