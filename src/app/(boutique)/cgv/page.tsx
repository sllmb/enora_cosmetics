import type { Metadata } from "next";
import Link from "next/link";
import { PageTexte } from "@/app/_composants/PageTexte";
import { env } from "@/shared/config/env";
import { ENTREPRISE } from "@/shared/config/entreprise";
import { formaterTelephone } from "@/shared/lib/format";

export const metadata: Metadata = {
  title: "Conditions générales de vente",
  description:
    "Commande, paiement, livraison à Dakar et environs, réclamations : les conditions de vente d'Énora Cosmetics.",
  alternates: { canonical: "/cgv" },
};

const telephone = env.whatsappNumero ? formaterTelephone(env.whatsappNumero) : null;

const SECTIONS = [
  {
    id: "vendeur",
    titre: "Qui sommes-nous ?",
    contenu: (
      <>
        <p>
          Le site est édité par {ENTREPRISE.nom}, {ENTREPRISE.formeJuridique.toLowerCase()}{" "}
          représentée par {ENTREPRISE.responsable}, basée à {ENTREPRISE.adresse}.
        </p>
        <p>
          Contact : <a href={`mailto:${ENTREPRISE.email}`}>{ENTREPRISE.email}</a>
          {telephone && <> · {telephone} (téléphone et WhatsApp)</>}.
        </p>
        <p>
          Les présentes conditions s&apos;appliquent à toute commande passée sur le site. Passer
          commande vaut acceptation de ces conditions.
        </p>
      </>
    ),
  },
  {
    id: "produits",
    titre: "Nos produits",
    contenu: (
      <>
        <p>
          Énora sélectionne et revend des produits d&apos;hygiène corporelle originaux (déodorants,
          huiles parfumées, savons…) de marques reconnues, achetés auprès de fournisseurs de
          confiance. Nous ne fabriquons pas les produits : leur composition et leurs précautions
          d&apos;emploi sont celles indiquées par la marque sur l&apos;emballage.
        </p>
        <p>
          Les photos sont aussi fidèles que possible mais peuvent légèrement différer du produit
          (emballage renouvelé par la marque, lumière). Les produits sont proposés dans la limite
          des stocks affichés.
        </p>
      </>
    ),
  },
  {
    id: "prix",
    titre: "Prix",
    contenu: (
      <p>
        Les prix sont indiqués en francs CFA (FCFA). Les frais de livraison dépendent de la zone et
        sont affichés avant la validation de la commande. Le prix payé est celui affiché au moment
        de la commande.
      </p>
    ),
  },
  {
    id: "commande",
    titre: "Commande",
    contenu: (
      <>
        <p>
          La commande est enregistrée dès sa validation sur le site : elle reçoit une référence (par
          exemple ENR-2026-00001) et apparaît dans « Mes commandes » pour les clientes ayant un
          compte. Nous vous contactons ensuite pour la confirmer et organiser la livraison.
        </p>
        <p>
          Énora peut annuler une commande en cas de rupture de stock, d&apos;adresse incomplète ou
          si la cliente reste injoignable ; tout montant déjà versé est alors remboursé.
        </p>
      </>
    ),
  },
  {
    id: "paiement",
    titre: "Paiement",
    contenu: (
      <>
        <p>Trois façons de payer :</p>
        <ul>
          <li>
            <strong>À la livraison</strong>, en espèces, au livreur ;
          </li>
          <li>
            <strong>Wave</strong> ou <strong>Orange Money</strong>, en indiquant la référence de la
            commande : la commande est préparée dès réception du paiement ;
          </li>
          <li>
            <strong>WhatsApp</strong> : nous convenons ensemble du moyen de paiement.
          </li>
        </ul>
        <p>
          Sans paiement Wave ou Orange Money dans les 24 heures suivant la commande, et sans
          nouvelle de votre part, la commande peut être annulée et les produits remis en vente.
        </p>
      </>
    ),
  },
  {
    id: "livraison",
    titre: "Livraison et retrait",
    contenu: (
      <>
        <p>
          Nous livrons à Dakar et dans les environs proches. Les zones, délais et frais sont
          détaillés sur la page <Link href="/livraison">Livraison et paiement</Link> ; les délais
          sont indicatifs et courent à partir de la confirmation de la commande.
        </p>
        <p>
          Le livreur vous appelle avant de passer. En cas d&apos;absence, nous convenons avec vous
          d&apos;un nouveau passage, qui peut entraîner de nouveaux frais de livraison. Sans réponse
          après deux tentatives, la commande peut être annulée.
        </p>
        <p>
          Vous pouvez aussi venir récupérer votre colis à Yoff, sur rendez-vous : écrivez-nous sur
          WhatsApp pour convenir d&apos;un moment.
        </p>
      </>
    ),
  },
  {
    id: "reclamations",
    titre: "Réclamations, retours et remboursements",
    contenu: (
      <>
        <p>
          Merci de vérifier votre colis à la réception. Pour des raisons d&apos;hygiène, un produit
          ouvert ou utilisé n&apos;est ni repris ni remboursé.
        </p>
        <p>
          Produit abîmé, cassé ou erreur dans la commande : prévenez-nous dans les 48 heures suivant
          la livraison, sur WhatsApp ou par e-mail, avec une photo du produit et de
          l&apos;emballage. Nous étudions chaque situation avec vous pour trouver une solution
          adaptée.
        </p>
        <p>
          Lorsqu&apos;un remboursement est accordé, il est effectué sous 48 heures, par Wave, Orange
          Money ou en espèces.
        </p>
      </>
    ),
  },
  {
    id: "donnees",
    titre: "Données personnelles",
    contenu: (
      <p>
        Les informations demandées lors de la commande servent uniquement à la traiter et à vous
        livrer. Le détail de leur utilisation et de vos droits figure dans les{" "}
        <Link href="/mentions-legales#donnees">mentions légales</Link>.
      </p>
    ),
  },
  {
    id: "litiges",
    titre: "Litiges",
    contenu: (
      <p>
        Les présentes conditions sont soumises au droit sénégalais. En cas de difficulté, contactez-
        nous d&apos;abord : nous recherchons toujours une solution amiable. À défaut, les tribunaux
        de Dakar sont compétents.
      </p>
    ),
  },
];

export default function CgvPage() {
  return (
    <PageTexte
      surtitre="Énora Cosmetics"
      titre="Conditions générales de vente"
      miseAJour={ENTREPRISE.miseAJourJuridique}
      introduction={
        <p>
          Comment commander, payer et recevoir vos produits Énora, et ce qui se passe en cas de
          souci. Une question ?{" "}
          <Link href="/contact" className="text-primaire underline">
            Écrivez-nous
          </Link>
          .
        </p>
      }
      sections={SECTIONS}
    />
  );
}
