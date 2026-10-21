import { ArrowLeft, ExternalLink } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { EnteteAdmin } from "@/app/_composants/EnteteAdmin";
import { FormulaireProduit, GestionPhotos, SuppressionProduit } from "@/features/catalogue/admin";
import { lireProduitAdmin, listerCategoriesAdmin } from "@/features/catalogue/serveur";

export const metadata: Metadata = { title: "Modifier le produit" };

type Props = PageProps<"/admin/produits/[id]">;

export default function ProduitAdminPage({ params }: Props) {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-8">
      <Suspense
        fallback={<div aria-busy className="h-96 animate-pulse rounded-carte bg-surface-douce" />}
      >
        <Contenu params={params} />
      </Suspense>
    </div>
  );
}

async function Contenu({ params }: Pick<Props, "params">) {
  const id = Number((await params).id);
  if (!Number.isInteger(id) || id <= 0) notFound();
  const [produit, categories] = await Promise.all([lireProduitAdmin(id), listerCategoriesAdmin()]);
  if (!produit) notFound();

  return (
    <>
      <EnteteAdmin
        titre={produit.nom}
        retour={
          <Link
            href="/admin/produits"
            className="inline-flex items-center gap-1 text-sm text-texte-attenue hover:text-primaire"
          >
            <ArrowLeft aria-hidden className="size-4" /> Produits
          </Link>
        }
        action={
          produit.actif && (
            <Link
              href={`/produit/${produit.slug}`}
              target="_blank"
              className="inline-flex items-center gap-2 text-sm text-primaire hover:underline"
            >
              <ExternalLink aria-hidden className="size-4" /> Voir dans la boutique
            </Link>
          )
        }
      />
      <section
        aria-labelledby="photos"
        className="mb-6 rounded-carte border border-bordure bg-surface p-6"
      >
        <h2 id="photos" className="mb-4 font-titre text-2xl">
          Photos
        </h2>
        <GestionPhotos produitId={produit.id} nomProduit={produit.nom} images={produit.images} />
      </section>
      <FormulaireProduit produit={produit} categories={categories} />
      <div className="mt-6 flex justify-end">
        <SuppressionProduit id={produit.id} nom={produit.nom} />
      </div>
    </>
  );
}
