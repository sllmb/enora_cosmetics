import { CheckCircle2, MessageCircle } from "lucide-react";
import { env } from "@/shared/config/env";
import { formaterDate, formaterPrix } from "@/shared/lib/format";
import { Badge, ButtonLink } from "@/shared/ui";
import { lienWhatsApp, messageCommande } from "../lib/whatsapp";
import { STATUTS } from "../lib/statuts";
import { MODES_PAIEMENT } from "../schemas/commande";
import type { CommandeConfirmee } from "../types";

const formaterNumero = (n: string) => n.replace(/(\d{2})(\d{3})(\d{2})(\d{2})/, "$1 $2 $3 $4");

function Instructions({ commande }: { commande: CommandeConfirmee }) {
  const total = <strong>{formaterPrix(commande.total)}</strong>;
  const reference = <strong>{commande.reference}</strong>;
  switch (commande.modePaiement) {
    case "livraison":
      return (
        <p>
          Nous vous appelons au {formaterNumero(commande.telephone)} pour convenir de la livraison.
          Vous réglerez {total} au livreur, en espèces ou par mobile money.
        </p>
      );
    case "wave":
    case "orange_money": {
      const service = MODES_PAIEMENT[commande.modePaiement].libelle;
      const numero = commande.modePaiement === "wave" ? env.waveNumero : env.orangeMoneyNumero;
      // RM-12 : la commande reste en attente jusqu'à la vérification du paiement.
      return numero ? (
        <p>
          Envoyez {total} par {service} au <strong>{formaterNumero(numero)}</strong> en indiquant la
          référence {reference}. Votre commande est préparée dès réception du paiement.
        </p>
      ) : (
        <p>
          Nous vous envoyons sur WhatsApp le numéro {service} pour régler {total}, avec la référence{" "}
          {reference}. Votre commande est préparée dès réception du paiement.
        </p>
      );
    }
    case "whatsapp":
      return (
        <p>
          Envoyez-nous le récapitulatif sur WhatsApp : nous confirmons ensemble la livraison et le
          paiement de {total}.
        </p>
      );
  }
}

type Props = {
  commande: CommandeConfirmee;
  /** « confirmation » juste après la commande, « historique » depuis Mes commandes. */
  contexte?: "confirmation" | "historique";
};

export function Confirmation({ commande, contexte = "confirmation" }: Props) {
  const historique = contexte === "historique";
  // RM-09 : les instructions n'ont de sens que tant que la commande est en attente.
  const enAttente = commande.statut === "en_attente";
  const whatsapp = env.whatsappNumero
    ? lienWhatsApp(env.whatsappNumero, messageCommande(commande))
    : null;
  // WhatsApp est la suite naturelle si la cliente l'a choisi, ou si le numéro
  // marchand Wave / Orange Money n'est pas encore configuré.
  const numeroManquant =
    (commande.modePaiement === "wave" && !env.waveNumero) ||
    (commande.modePaiement === "orange_money" && !env.orangeMoneyNumero);
  const whatsappPrincipal = commande.modePaiement === "whatsapp" || numeroManquant;
  const libelleWhatsapp =
    commande.modePaiement === "whatsapp"
      ? "Envoyer ma commande sur WhatsApp"
      : numeroManquant
        ? "Recevoir les instructions sur WhatsApp"
        : "Une question ? Écrivez-nous sur WhatsApp";

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-8">
      {historique ? (
        <header className="flex flex-col items-start gap-3">
          <h1 className="text-4xl sm:text-5xl">Commande {commande.reference}</h1>
          <p className="flex items-center gap-3 text-texte-attenue">
            <Badge ton={STATUTS[commande.statut].ton}>{STATUTS[commande.statut].libelle}</Badge>
            Passée le {formaterDate(commande.creeLe)}
          </p>
        </header>
      ) : (
        <header className="flex flex-col items-center gap-3 text-center">
          <CheckCircle2 aria-hidden className="size-12 text-succes" strokeWidth={1.5} />
          <h1 className="text-4xl sm:text-5xl">Merci {commande.nom.split(" ")[0]} !</h1>
          <p className="text-texte-attenue">
            Votre commande <strong className="text-texte">{commande.reference}</strong> est
            enregistrée.
          </p>
        </header>
      )}

      {enAttente && (
        <section
          aria-labelledby="suite"
          className="flex flex-col gap-4 rounded-carte bg-primaire-doux p-6"
        >
          <h2 id="suite" className="text-2xl">
            La suite
          </h2>
          <div className="leading-relaxed">
            <Instructions commande={commande} />
          </div>
          {whatsapp && (
            <a
              href={whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className={
                whatsappPrincipal
                  ? "inline-flex h-13 items-center justify-center gap-2 rounded-full bg-primaire px-8 font-medium text-sur-primaire hover:bg-primaire-survol"
                  : "inline-flex items-center gap-2 text-sm font-medium text-primaire hover:underline"
              }
            >
              <MessageCircle aria-hidden className="size-5" strokeWidth={1.5} />
              {libelleWhatsapp}
            </a>
          )}
        </section>
      )}

      <section aria-labelledby="recap" className="flex flex-col gap-4">
        <h2 id="recap" className="text-2xl">
          Récapitulatif
        </h2>
        <ul className="divide-y divide-bordure border-y border-bordure text-sm">
          {commande.lignes.map((ligne) => (
            <li key={ligne.nom} className="flex justify-between gap-3 py-3">
              <span>
                {ligne.nom} × {ligne.quantite}
              </span>
              <span className="font-medium">{formaterPrix(ligne.total)}</span>
            </li>
          ))}
        </ul>
        <dl className="flex flex-col gap-2 text-sm">
          <div className="flex justify-between">
            <dt>Sous-total</dt>
            <dd>{formaterPrix(commande.sousTotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt>Livraison ({commande.zoneNom})</dt>
            <dd>{formaterPrix(commande.fraisLivraison)}</dd>
          </div>
          <div className="flex justify-between text-base font-medium">
            <dt>Total</dt>
            <dd>{formaterPrix(commande.total)}</dd>
          </div>
        </dl>
        <dl className="grid gap-3 rounded-carte border border-bordure p-5 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-texte-attenue">Livraison à</dt>
            <dd>{commande.adresse}</dd>
          </div>
          <div>
            <dt className="text-texte-attenue">Paiement</dt>
            <dd>{MODES_PAIEMENT[commande.modePaiement].libelle}</dd>
          </div>
          <div>
            <dt className="text-texte-attenue">Passée le</dt>
            <dd>{formaterDate(commande.creeLe)}</dd>
          </div>
        </dl>
        {!historique && (
          <p className="text-xs text-texte-attenue">
            Gardez cette page dans vos favoris : son adresse est personnelle et permet de retrouver
            votre commande.
          </p>
        )}
      </section>

      <ButtonLink
        href={historique ? "/compte/commandes" : "/boutique"}
        variante="secondaire"
        className="self-center"
      >
        {historique ? "Toutes mes commandes" : "Continuer mes achats"}
      </ButtonLink>
    </div>
  );
}
