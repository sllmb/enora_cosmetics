import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { ListeCommandes } from "@/app/_composants/ListeCommandes";
import { listerCommandesUtilisatrice, listerZones } from "@/features/commande/serveur";
import { BoutonDeconnexion, FormulaireProfil } from "@/features/compte";
import { lireUtilisatrice } from "@/features/compte/serveur";

export const metadata: Metadata = { title: "Mon compte" };

type Props = PageProps<"/compte">;

export default function ComptePage({ searchParams }: Props) {
  return (
    <div className="conteneur py-12 sm:py-16">
      <Suspense
        fallback={<div aria-busy className="h-96 animate-pulse rounded-carte bg-surface-douce" />}
      >
        <ContenuCompte searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function ContenuCompte({ searchParams }: Pick<Props, "searchParams">) {
  const utilisatrice = await lireUtilisatrice();
  if (!utilisatrice) redirect("/compte/connexion?suite=/compte");
  const [{ motDePasse }, zones, commandes] = await Promise.all([
    searchParams,
    listerZones(),
    listerCommandesUtilisatrice(),
  ]);
  const prenom = utilisatrice.nom.split(" ")[0];

  return (
    <div className="flex flex-col gap-12">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="titre-espace text-texte-attenue">Mon compte</p>
          <h1 className="mt-2 text-5xl">Bonjour{prenom ? ` ${prenom}` : ""}</h1>
          <p className="mt-2 text-texte-attenue">{utilisatrice.email}</p>
        </div>
        <BoutonDeconnexion />
      </header>

      {motDePasse === "modifie" && (
        <p role="status" className="rounded-controle bg-succes-doux p-4 text-sm text-succes">
          Votre mot de passe a été modifié.
        </p>
      )}

      <div className="grid gap-12 lg:grid-cols-[1fr_24rem] lg:items-start">
        <section aria-labelledby="mes-commandes" className="flex flex-col gap-4">
          <h2 id="mes-commandes" className="text-3xl">
            Mes dernières commandes
          </h2>
          <ListeCommandes commandes={commandes.slice(0, 5)} />
          {commandes.length > 5 && (
            <Link
              href="/compte/commandes"
              className="text-sm font-medium text-primaire hover:underline"
            >
              Voir toutes mes commandes
            </Link>
          )}
        </section>

        <section
          aria-labelledby="mes-infos"
          className="flex flex-col gap-4 rounded-carte border border-bordure bg-surface p-6"
        >
          <h2 id="mes-infos" className="text-3xl">
            Mes coordonnées
          </h2>
          <p className="text-sm text-texte-attenue">
            Elles pré-remplissent vos prochaines commandes.
          </p>
          <FormulaireProfil utilisatrice={utilisatrice} zones={zones} />
        </section>
      </div>
    </div>
  );
}
