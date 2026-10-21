import type { Metadata } from "next";
import { Suspense } from "react";
import { ListeCommandes } from "@/app/_composants/ListeCommandes";
import { listerCommandesUtilisatrice } from "@/features/commande/serveur";

export const metadata: Metadata = { title: "Mes commandes" };

export default function MesCommandesPage() {
  return (
    <div className="conteneur max-w-3xl py-12 sm:py-16">
      <p className="titre-espace text-texte-attenue">Mon compte</p>
      <h1 className="mt-2 mb-10 text-5xl">Mes commandes</h1>
      <Suspense
        fallback={<div aria-busy className="h-64 animate-pulse rounded-carte bg-surface-douce" />}
      >
        <Liste />
      </Suspense>
    </div>
  );
}

async function Liste() {
  return <ListeCommandes commandes={await listerCommandesUtilisatrice()} />;
}
