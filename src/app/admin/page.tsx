import {
  AlertTriangle,
  Banknote,
  Clock,
  MessageSquareText,
  MessagesSquare,
  ShoppingBag,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Suspense, type ReactNode } from "react";
import { EnteteAdmin } from "@/app/_composants/EnteteAdmin";
import { compterAvisEnAttente } from "@/features/avis/serveur";
import { listerStocksBas } from "@/features/catalogue/serveur";
import { compterCommentairesEnAttente } from "@/features/conseils/serveur";
import { ListeCommandesAdmin } from "@/features/commande/admin";
import { listerCommandesAdmin, lireStatistiques } from "@/features/commande/serveur";
import { formaterMontant, pluriel } from "@/shared/lib/format";
import { Badge } from "@/shared/ui";

export const metadata: Metadata = { title: "Tableau de bord" };

export default function TableauDeBordPage() {
  return (
    <div className="px-4 py-8 sm:px-8">
      <EnteteAdmin titre="Tableau de bord" />
      <Suspense
        fallback={<div aria-busy className="h-96 animate-pulse rounded-carte bg-surface-douce" />}
      >
        <Contenu />
      </Suspense>
    </div>
  );
}

function Indicateur(props: {
  titre: string;
  valeur: string;
  /** Unité affichée en petit après la valeur (ex. FCFA) : le montant tient dans la carte. */
  unite?: string;
  detail?: string;
  icone: ReactNode;
  href?: string;
  alerte?: boolean;
}) {
  const contenu = (
    <>
      <span
        aria-hidden
        className={`flex size-10 items-center justify-center rounded-full ${props.alerte ? "bg-avertissement-doux text-avertissement" : "bg-primaire-doux text-primaire"}`}
      >
        {props.icone}
      </span>
      <span className="text-sm text-texte-attenue">{props.titre}</span>
      <span className="font-titre text-3xl sm:text-4xl">
        {props.valeur}
        {props.unite && <span className="ml-1.5 font-sans text-sm">{props.unite}</span>}
      </span>
      {props.detail && <span className="text-xs text-texte-attenue">{props.detail}</span>}
    </>
  );
  const classe =
    "flex min-w-0 flex-col gap-2 rounded-carte border border-bordure bg-surface p-4 shadow-carte sm:p-5";
  return props.href ? (
    <Link href={props.href} className={`${classe} hover:border-primaire`}>
      {contenu}
    </Link>
  ) : (
    <div className={classe}>{contenu}</div>
  );
}

async function Contenu() {
  const [stats, aTraiter, stocksBas, avisEnAttente, commentairesEnAttente] = await Promise.all([
    lireStatistiques(),
    listerCommandesAdmin({ statut: "en_attente" }),
    listerStocksBas(),
    compterAvisEnAttente(),
    compterCommentairesEnAttente(),
  ]);

  return (
    <div className="flex flex-col gap-10">
      {avisEnAttente > 0 && (
        <Link
          href="/admin/avis"
          className="flex items-center gap-3 rounded-carte border border-avertissement/30 bg-avertissement-doux p-4 text-sm text-avertissement hover:border-avertissement"
        >
          <MessageSquareText aria-hidden className="size-5" />
          {pluriel(avisEnAttente, "avis", "avis")} à modérer
        </Link>
      )}
      {commentairesEnAttente > 0 && (
        <Link
          href="/admin/commentaires"
          className="flex items-center gap-3 rounded-carte border border-avertissement/30 bg-avertissement-doux p-4 text-sm text-avertissement hover:border-avertissement"
        >
          <MessagesSquare aria-hidden className="size-5" />
          {pluriel(commentairesEnAttente, "commentaire")} à modérer
        </Link>
      )}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <Indicateur
          titre="À traiter"
          valeur={String(stats.aTraiter)}
          detail="Commandes en attente"
          icone={<Clock className="size-5" />}
          href="/admin/commandes?statut=en_attente"
          alerte={stats.aTraiter > 0}
        />
        <Indicateur
          titre="Paiements à vérifier"
          valeur={String(stats.paiementsAVerifier)}
          detail="Wave et Orange Money"
          icone={<Banknote className="size-5" />}
          alerte={stats.paiementsAVerifier > 0}
        />
        <Indicateur
          titre="Aujourd'hui"
          valeur={String(stats.aujourdhui)}
          detail={pluriel(stats.aujourdhui, "commande")}
          icone={<ShoppingBag className="size-5" />}
        />
        <Indicateur
          titre="Ce mois-ci"
          valeur={formaterMontant(stats.chiffreDuMois)}
          unite="FCFA"
          detail={`${pluriel(stats.commandesDuMois, "commande")}, hors annulées`}
          icone={<Banknote className="size-5" />}
        />
      </div>

      {/* grid-cols-1 = minmax(0, 1fr) : les longues lignes se coupent au lieu d'élargir la page. */}
      <div className="grid grid-cols-1 gap-10 xl:grid-cols-[1fr_22rem] xl:items-start">
        <section aria-labelledby="a-traiter" className="flex flex-col gap-4">
          <h2 id="a-traiter" className="text-3xl">
            Commandes en attente
          </h2>
          <ListeCommandesAdmin commandes={aTraiter.slice(0, 10)} />
        </section>

        <section
          aria-labelledby="stocks"
          className="flex flex-col gap-4 rounded-carte border border-bordure bg-surface p-6"
        >
          <h2 id="stocks" className="flex items-center gap-2 text-2xl">
            <AlertTriangle aria-hidden className="size-5 text-avertissement" /> Stocks bas
          </h2>
          {stocksBas.length === 0 ? (
            <p className="text-sm text-texte-attenue">Aucun produit sous 5 unités.</p>
          ) : (
            <ul className="flex flex-col gap-2 text-sm">
              {stocksBas.map((produit) => (
                <li key={produit.id}>
                  <Link
                    href={`/admin/produits/${produit.id}`}
                    className="flex items-center justify-between gap-3 hover:text-primaire"
                  >
                    {produit.nom}
                    <Badge ton={produit.stock === 0 ? "danger" : "avertissement"}>
                      {produit.stock === 0 ? "Épuisé" : produit.stock}
                    </Badge>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
