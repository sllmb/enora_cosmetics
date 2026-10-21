import { Droplets, Sparkles, Wind } from "lucide-react";
import Link from "next/link";
import { ButtonLink, Logo } from "@/shared/ui";

// Accueil provisoire (Sprint 0) : la version avec produits arrive au Sprint 1,
// après validation de la maquette.
const UNIVERS = [
  {
    titre: "Déodorants",
    texte: "Une fraîcheur qui dure, en douceur pour la peau.",
    href: "/boutique/deodorants",
    Icone: Wind,
  },
  {
    titre: "Huiles parfumées",
    texte: "Le parfum en petit flacon, à emporter partout.",
    href: "/boutique/huiles-parfumees",
    Icone: Sparkles,
  },
  {
    titre: "Savons",
    texte: "Des savons délicatement parfumés pour chaque jour.",
    href: "/boutique/savons",
    Icone: Droplets,
  },
];

export default function AccueilPage() {
  return (
    <>
      <section className="bg-surface-douce">
        <div className="conteneur flex flex-col items-center gap-8 py-20 text-center sm:py-28">
          <Logo forme="complet" priority className="w-64 animate-apparition sm:w-96" />
          <p className="max-w-xl text-lg text-texte-attenue">
            L&apos;hygiène corporelle, en version raffinée. Déodorants, huiles parfumées et savons
            pensés pour prendre soin de vous au quotidien.
          </p>
          <ButtonLink href="/boutique" taille="lg">
            Découvrir la boutique
          </ButtonLink>
        </div>
      </section>

      <section aria-labelledby="univers" className="conteneur py-20">
        <p className="text-center titre-espace text-texte-attenue">Nos univers</p>
        <h2 id="univers" className="mt-3 text-center text-4xl sm:text-5xl">
          Prendre soin de soi, simplement
        </h2>
        <ul className="mt-12 grid gap-6 md:grid-cols-3">
          {UNIVERS.map(({ titre, texte, href, Icone }) => (
            <li key={href}>
              <Link
                href={href}
                className="group flex h-full flex-col gap-4 rounded-carte border border-bordure bg-surface p-8 shadow-carte transition-transform duration-220 ease-douce hover:-translate-y-1"
              >
                <span
                  aria-hidden
                  className="flex size-12 items-center justify-center rounded-full bg-primaire-doux text-primaire"
                >
                  <Icone className="size-6" strokeWidth={1.5} />
                </span>
                <h3 className="text-3xl">{titre}</h3>
                <p className="text-texte-attenue">{texte}</p>
                <span className="mt-auto text-sm font-medium text-primaire group-hover:underline">
                  Voir les produits
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
