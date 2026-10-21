import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { listerProduits } from "@/features/catalogue/serveur";
import { FormulaireCommande } from "@/features/commande";
import { listerZones } from "@/features/commande/serveur";
import { lireUtilisatrice } from "@/features/compte/serveur";

export const metadata: Metadata = { title: "Commande", robots: { index: false } };

export default function CommandePage() {
  return (
    <div className="conteneur py-12 sm:py-16">
      <h1 className="mb-10 text-5xl sm:text-6xl">Finaliser la commande</h1>
      <Suspense
        fallback={<div aria-busy className="h-96 animate-pulse rounded-carte bg-surface-douce" />}
      >
        <Formulaire />
      </Suspense>
    </div>
  );
}

async function Formulaire() {
  const [produits, zones, utilisatrice] = await Promise.all([
    listerProduits(),
    listerZones(),
    lireUtilisatrice(),
  ]);
  return (
    <>
      {!utilisatrice && (
        <p className="mb-8 text-sm text-texte-attenue">
          Vous avez un compte ?{" "}
          <Link
            href="/compte/connexion?suite=/commande"
            className="font-medium text-primaire hover:underline"
          >
            Connectez-vous
          </Link>{" "}
          pour retrouver vos coordonnées et suivre votre commande.
        </p>
      )}
      <FormulaireCommande
        produits={produits}
        zones={zones}
        valeursInitiales={
          utilisatrice
            ? {
                nom: utilisatrice.nom,
                telephone: utilisatrice.telephone,
                email: utilisatrice.email,
                adresse: utilisatrice.adresse,
                ...(utilisatrice.zoneId && { zoneId: String(utilisatrice.zoneId) }),
              }
            : undefined
        }
      />
    </>
  );
}
