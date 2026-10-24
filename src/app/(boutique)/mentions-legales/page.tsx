import type { Metadata } from "next";
import Link from "next/link";
import { PageTexte } from "@/app/_composants/PageTexte";
import { env } from "@/shared/config/env";
import { ENTREPRISE } from "@/shared/config/entreprise";
import { formaterTelephone } from "@/shared/lib/format";

export const metadata: Metadata = {
  title: "Mentions légales",
  description:
    "Éditeur, hébergement, données personnelles et propriété intellectuelle du site Énora Cosmetics.",
  alternates: { canonical: "/mentions-legales" },
};

const telephone = env.whatsappNumero ? formaterTelephone(env.whatsappNumero) : null;
const contact = <a href={`mailto:${ENTREPRISE.email}`}>{ENTREPRISE.email}</a>;

const SECTIONS = [
  {
    id: "editeur",
    titre: "Éditeur du site",
    contenu: (
      <ul>
        <li>
          {ENTREPRISE.nom}, {ENTREPRISE.formeJuridique.toLowerCase()}
        </li>
        <li>Responsable de la publication : {ENTREPRISE.responsable}</li>
        <li>Adresse : {ENTREPRISE.adresse}</li>
        <li>E-mail : {contact}</li>
        {telephone && <li>Téléphone et WhatsApp : {telephone}</li>}
        {ENTREPRISE.ninea && <li>NINEA : {ENTREPRISE.ninea}</li>}
        {ENTREPRISE.rccm && <li>RCCM : {ENTREPRISE.rccm}</li>}
      </ul>
    ),
  },
  {
    id: "hebergement",
    titre: "Hébergement",
    contenu: (
      <ul>
        <li>
          Site : Vercel Inc., États-Unis —{" "}
          <a href="https://vercel.com" target="_blank" rel="noopener noreferrer">
            vercel.com
          </a>
        </li>
        <li>
          Base de données, comptes et photos : Supabase Inc. —{" "}
          <a href="https://supabase.com" target="_blank" rel="noopener noreferrer">
            supabase.com
          </a>
        </li>
      </ul>
    ),
  },
  {
    id: "donnees",
    titre: "Données personnelles",
    contenu: (
      <>
        <p>
          Responsable du traitement : {ENTREPRISE.responsable}, pour {ENTREPRISE.nom}.
        </p>
        <p>
          <strong>Ce que nous recueillons</strong> : vos nom, téléphone, adresse de livraison et, si
          vous le donnez, votre e-mail lors d&apos;une commande ; votre e-mail et votre mot de passe
          (chiffré, illisible pour nous) si vous créez un compte ; vos avis et commentaires si vous
          en publiez.
        </p>
        <p>
          <strong>Pourquoi</strong> : uniquement pour traiter et livrer vos commandes, vous
          contacter à leur sujet, gérer votre compte et afficher les avis et commentaires que vous
          choisissez de publier (sous votre prénom et l&apos;initiale de votre nom). Nous
          n&apos;envoyons pas de promotions sans votre accord et ne vendons jamais vos données.
        </p>
        <p>
          <strong>Qui y a accès</strong> : l&apos;équipe Énora et, pour la livraison, le livreur
          (nom, téléphone, adresse). Les données sont hébergées par nos prestataires techniques
          (voir « Hébergement »).
        </p>
        <p>
          <strong>Combien de temps</strong> : les commandes sont conservées le temps nécessaire à
          leur suivi et à nos obligations comptables ; votre compte, jusqu&apos;à ce que vous
          demandiez sa suppression.
        </p>
        <p>
          <strong>Vos droits</strong> : conformément à la loi sénégalaise n° 2008-12 sur la
          protection des données à caractère personnel, vous pouvez demander l&apos;accès, la
          correction ou la suppression de vos données, ou vous opposer à leur utilisation, en
          écrivant à {contact}. Vous pouvez aussi saisir la Commission de protection des données
          personnelles (CDP).
        </p>
      </>
    ),
  },
  {
    id: "cookies",
    titre: "Cookies et stockage",
    contenu: (
      <p>
        Le site n&apos;utilise ni publicité ni outil de suivi. Il garde seulement ce qui est
        nécessaire à son fonctionnement : votre session de connexion (cookie) et, dans votre
        navigateur, le contenu de votre panier.
      </p>
    ),
  },
  {
    id: "propriete",
    titre: "Propriété intellectuelle",
    contenu: (
      <p>
        Le nom et le logo Énora, les textes et la présentation du site appartiennent à{" "}
        {ENTREPRISE.nom}. Les marques et visuels des produits vendus appartiennent à leurs
        propriétaires respectifs. Toute reproduction sans autorisation est interdite.
      </p>
    ),
  },
];

export default function MentionsLegalesPage() {
  return (
    <PageTexte
      surtitre="Énora Cosmetics"
      titre="Mentions légales"
      miseAJour={ENTREPRISE.miseAJourJuridique}
      introduction={
        <p>
          Qui édite ce site, où il est hébergé et comment nous protégeons vos données. Voir aussi
          nos{" "}
          <Link href="/cgv" className="text-primaire underline">
            conditions générales de vente
          </Link>
          .
        </p>
      }
      sections={SECTIONS}
    />
  );
}
