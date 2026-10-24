import { MessageCircle, ShieldCheck, Sparkles } from "lucide-react";
import type { Metadata } from "next";
import { OPEN_GRAPH_BASE } from "@/app/_seo";
import { CLASSES_POLICE } from "@/features/conseils";
import { cn } from "@/shared/lib/cn";
import { ENTREPRISE } from "@/shared/config/entreprise";
import { ButtonLink } from "@/shared/ui";

const DESCRIPTION =
  "Énora, c'est l'histoire de deux amies de Dakar qui sélectionnent des produits d'hygiène originaux pour que chaque femme sente bon, chaque jour.";

export const metadata: Metadata = {
  title: "À propos",
  description: DESCRIPTION,
  alternates: { canonical: "/a-propos" },
  openGraph: {
    ...OPEN_GRAPH_BASE,
    title: "À propos d'Énora",
    description: DESCRIPTION,
    url: "/a-propos",
  },
};

const ENGAGEMENTS = [
  {
    Icone: ShieldCheck,
    titre: "Des produits originaux",
    texte:
      "Nous ne vendons que des produits authentiques de marques reconnues, achetés auprès de fournisseurs de confiance.",
  },
  {
    Icone: Sparkles,
    titre: "Une sélection soignée",
    texte:
      "Déodorants, huiles parfumées, savons : nous choisissons ce que nous aimons vraiment porter, et nous vous le conseillons sincèrement.",
  },
  {
    Icone: MessageCircle,
    titre: "Tout près de vous",
    texte:
      "Basées à Yoff, nous livrons Dakar et ses environs et répondons sur WhatsApp, du lundi au samedi.",
  },
];

export default function AProposPage() {
  return (
    <>
      <section className="bg-surface-douce">
        <div className="conteneur flex max-w-3xl flex-col items-center gap-5 py-16 text-center sm:py-24">
          <p className="titre-espace text-texte-attenue">Notre histoire</p>
          <h1
            className={cn(
              CLASSES_POLICE.princesse,
              "text-6xl leading-tight text-primaire sm:text-7xl lg:text-8xl",
            )}
          >
            Pour que chaque femme sente bon
          </h1>
          <p className="text-lg text-texte-attenue">{DESCRIPTION}</p>
        </div>
      </section>

      <section aria-labelledby="histoire" className="conteneur max-w-3xl py-16 sm:py-20">
        <h2 id="histoire" className="mb-6 text-4xl">
          Deux amies, une évidence
        </h2>
        <div className="flex flex-col gap-5 text-lg leading-relaxed text-texte/90">
          <p>
            Énora est née de l&apos;amitié entre {ENTREPRISE.fondatrices}, à Dakar. Un constat
            simple nous a réunies : l&apos;hygiène corporelle, c&apos;est la base de tout. Se sentir
            fraîche, sentir bon du matin au soir, c&apos;est se sentir bien dans sa peau.
          </p>
          <p>
            Plutôt que de chercher partout le bon déodorant, la bonne huile parfumée ou le bon
            savon, nous avons décidé de réunir ces essentiels au même endroit. Nous sélectionnons
            des produits originaux, que nous connaissons et que nous aimons, et nous les rendons
            faciles à commander et à recevoir.
          </p>
        </div>
        <blockquote
          className={cn(
            CLASSES_POLICE.princesse,
            "mt-10 border-l-2 border-primaire pl-5 text-4xl leading-snug text-primaire sm:text-5xl",
          )}
        >
          Notre promesse : que toutes les femmes sentent bon, chaque jour.
        </blockquote>
      </section>

      <section aria-labelledby="engagements" className="border-y border-bordure bg-surface">
        <div className="conteneur py-16 sm:py-20">
          <h2 id="engagements" className="mb-10 text-center text-4xl">
            Nos engagements
          </h2>
          <ul className="grid gap-8 md:grid-cols-3">
            {ENGAGEMENTS.map(({ Icone, titre, texte }) => (
              <li key={titre} className="flex flex-col items-center gap-3 text-center">
                <span
                  aria-hidden
                  className="flex size-14 items-center justify-center rounded-full bg-primaire-doux text-primaire"
                >
                  <Icone className="size-6" strokeWidth={1.5} />
                </span>
                <h3 className="text-2xl">{titre}</h3>
                <p className="text-texte-attenue">{texte}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="conteneur flex flex-col items-center gap-5 py-16 text-center sm:py-20">
        <p className={cn(CLASSES_POLICE.princesse, "text-5xl text-primaire")}>
          Envie de nous découvrir ?
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <ButtonLink href="/boutique" taille="lg">
            Voir la boutique
          </ButtonLink>
          <ButtonLink href="/contact" taille="lg" variante="secondaire">
            Nous contacter
          </ButtonLink>
        </div>
      </section>
    </>
  );
}
