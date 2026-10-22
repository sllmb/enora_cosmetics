import { Mail, MessageCircle, Phone } from "lucide-react";
import { formaterDate, formaterPrix } from "@/shared/lib/format";
import { Badge } from "@/shared/ui";
import { STATUTS } from "../lib/statuts";
import { MODES_PAIEMENT } from "../schemas/commande";
import type { CommandeAdmin } from "../types";
import { ActionsCommandeAdmin } from "./ActionsCommandeAdmin";

const lienContact =
  "inline-flex items-center gap-2 rounded-full border border-bordure px-4 py-2 text-sm hover:border-primaire";

export function DetailCommandeAdmin({ commande }: { commande: CommandeAdmin }) {
  const statut = STATUTS[commande.statut];
  const telephoneInternational = `221${commande.telephone}`;
  const message = encodeURIComponent(
    `Bonjour ${commande.nom.split(" ")[0]}, c'est Énora au sujet de votre commande ${commande.reference}.`,
  );

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_20rem] lg:items-start">
      <div className="flex flex-col gap-8">
        <section className="flex flex-col gap-3 rounded-carte border border-bordure bg-surface p-6">
          <h2 className="text-2xl">Cliente</h2>
          <p className="font-medium">
            {commande.nom}
            {commande.avecCompte && (
              <Badge ton="doux" className="ml-2">
                Compte
              </Badge>
            )}
          </p>
          <p className="text-sm">{commande.adresse}</p>
          <p className="text-sm text-texte-attenue">Zone : {commande.zoneNom}</p>
          {commande.note && (
            <p className="rounded-controle bg-surface-douce p-3 text-sm">
              <span className="font-medium">Note : </span>
              {commande.note}
            </p>
          )}
          <div className="flex flex-wrap gap-2 pt-2">
            <a href={`tel:+${telephoneInternational}`} className={lienContact}>
              <Phone aria-hidden className="size-4" /> Appeler
            </a>
            <a
              href={`https://wa.me/${telephoneInternational}?text=${message}`}
              target="_blank"
              rel="noopener noreferrer"
              className={lienContact}
            >
              <MessageCircle aria-hidden className="size-4" /> WhatsApp
            </a>
            {commande.email && (
              <a href={`mailto:${commande.email}`} className={lienContact}>
                <Mail aria-hidden className="size-4" /> Email
              </a>
            )}
          </div>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-2xl">Articles</h2>
          <ul className="divide-y divide-bordure border-y border-bordure text-sm">
            {commande.lignes.map((ligne) => (
              <li key={ligne.nom} className="flex justify-between gap-3 py-3">
                <span>
                  {ligne.nom} × {ligne.quantite}
                  <span className="text-texte-attenue"> ({formaterPrix(ligne.prixUnitaire)})</span>
                </span>
                <span className="font-medium">{formaterPrix(ligne.total)}</span>
              </li>
            ))}
          </ul>
          <dl className="flex flex-col gap-1 text-sm">
            <div className="flex justify-between">
              <dt>Sous-total</dt>
              <dd>{formaterPrix(commande.sousTotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt>Livraison</dt>
              <dd>{formaterPrix(commande.fraisLivraison)}</dd>
            </div>
            <div className="flex justify-between text-base font-medium">
              <dt>Total</dt>
              <dd>{formaterPrix(commande.total)}</dd>
            </div>
          </dl>
        </section>
      </div>

      <aside className="flex flex-col gap-5 rounded-carte bg-surface-douce p-6 lg:sticky lg:top-6">
        <dl className="flex flex-col gap-3 text-sm">
          <div className="flex items-center justify-between gap-2">
            <dt>Statut</dt>
            <dd>
              <Badge ton={statut.ton}>{statut.libelle}</Badge>
            </dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt>Paiement</dt>
            <dd className="text-right">{MODES_PAIEMENT[commande.modePaiement].libelle}</dd>
          </div>
          <div className="flex items-center justify-between gap-2">
            <dt>Encaissé</dt>
            <dd>
              {commande.paiementRecuLe ? (
                <Badge ton="succes">Le {formaterDate(commande.paiementRecuLe)}</Badge>
              ) : (
                <Badge ton="avertissement">Non</Badge>
              )}
            </dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt>Passée le</dt>
            <dd>{formaterDate(commande.creeLe)}</dd>
          </div>
        </dl>
        <ActionsCommandeAdmin commande={commande} />
      </aside>
    </div>
  );
}
