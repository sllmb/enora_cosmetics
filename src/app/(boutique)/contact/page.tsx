import { Clock, Mail, MapPin, Phone } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { OPEN_GRAPH_BASE } from "@/app/_seo";
import { CLASSES_POLICE } from "@/features/conseils";
import { cn } from "@/shared/lib/cn";
import { env } from "@/shared/config/env";
import { ENTREPRISE } from "@/shared/config/entreprise";
import { formaterTelephone } from "@/shared/lib/format";
import { LogoWhatsApp } from "@/shared/ui";
import { FormulaireContact } from "./FormulaireContact";

const DESCRIPTION =
  "Une question sur un produit ou une commande ? Écrivez à Énora sur WhatsApp ou par e-mail, du lundi au samedi.";

export const metadata: Metadata = {
  title: "Contact",
  description: DESCRIPTION,
  alternates: { canonical: "/contact" },
  openGraph: {
    ...OPEN_GRAPH_BASE,
    title: "Contacter Énora",
    description: DESCRIPTION,
    url: "/contact",
  },
};

export default function ContactPage() {
  const whatsapp = env.whatsappNumero;
  const telephone = whatsapp ? formaterTelephone(whatsapp) : null;
  const coordonnees = [
    whatsapp && {
      Icone: LogoWhatsApp,
      titre: "WhatsApp",
      contenu: (
        <a
          href={`https://wa.me/${whatsapp}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primaire underline"
        >
          Nous écrire sur WhatsApp
        </a>
      ),
    },
    telephone && {
      Icone: Phone,
      titre: "Téléphone",
      contenu: (
        <a href={`tel:+${whatsapp}`} className="text-primaire underline">
          {telephone}
        </a>
      ),
    },
    {
      Icone: Mail,
      titre: "E-mail",
      contenu: (
        <a href={`mailto:${ENTREPRISE.email}`} className="break-all text-primaire underline">
          {ENTREPRISE.email}
        </a>
      ),
    },
    { Icone: Clock, titre: "Horaires", contenu: <span>{ENTREPRISE.horaires}</span> },
    {
      Icone: MapPin,
      titre: "Où nous trouver",
      contenu: (
        <span>
          Yoff, Dakar. Nous livrons Dakar et ses environs ; retrait possible à Yoff sur rendez-vous.
        </span>
      ),
    },
  ].filter((c) => Boolean(c)) as {
    Icone: React.ComponentType<{ className?: string; strokeWidth?: number }>;
    titre: string;
    contenu: React.ReactNode;
  }[];

  return (
    <div className="conteneur py-12 sm:py-16">
      <header className="mx-auto mb-12 flex max-w-2xl flex-col gap-3 text-center">
        <p className="titre-espace text-texte-attenue">Contact</p>
        <h1 className={cn(CLASSES_POLICE.princesse, "text-6xl text-primaire sm:text-7xl")}>
          Écrivez-nous
        </h1>
        <p className="text-lg text-texte-attenue">{DESCRIPTION}</p>
      </header>
      <div className="grid gap-10 lg:grid-cols-[1fr_22rem]">
        <FormulaireContact whatsapp={whatsapp} email={ENTREPRISE.email} />
        <aside aria-label="Nos coordonnées" className="flex flex-col gap-6">
          <ul className="flex flex-col gap-5">
            {coordonnees.map(({ Icone, titre, contenu }) => (
              <li key={titre} className="flex gap-4">
                <span
                  aria-hidden
                  className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primaire-doux text-primaire"
                >
                  <Icone className="size-5" strokeWidth={1.5} />
                </span>
                <div className="flex flex-col gap-0.5 text-sm">
                  <span className="font-medium">{titre}</span>
                  {contenu}
                </div>
              </li>
            ))}
          </ul>
          {ENTREPRISE.reseaux.length > 0 && (
            <p className="flex flex-wrap gap-3 text-sm">
              {ENTREPRISE.reseaux.map((r) => (
                <a
                  key={r.nom}
                  href={r.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primaire underline"
                >
                  {r.nom}
                </a>
              ))}
            </p>
          )}
          <p className="rounded-carte bg-surface-douce p-5 text-sm text-texte-attenue">
            Livraison, paiement, retours : réponses rapides dans nos{" "}
            <Link href="/cgv" className="text-primaire underline">
              conditions de vente
            </Link>{" "}
            et sur la page{" "}
            <Link href="/livraison" className="text-primaire underline">
              Livraison et paiement
            </Link>
            .
          </p>
        </aside>
      </div>
    </div>
  );
}
