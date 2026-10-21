import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { EnteteAdmin } from "@/app/_composants/EnteteAdmin";
import { DetailCommandeAdmin } from "@/features/commande/admin";
import { lireCommandeAdmin } from "@/features/commande/serveur";

export const metadata: Metadata = { title: "Commande" };

type Props = PageProps<"/admin/commandes/[reference]">;

export default function CommandeAdminPage({ params }: Props) {
  return (
    <div className="px-4 py-8 sm:px-8">
      <Suspense
        fallback={<div aria-busy className="h-96 animate-pulse rounded-carte bg-surface-douce" />}
      >
        <Contenu params={params} />
      </Suspense>
    </div>
  );
}

async function Contenu({ params }: Pick<Props, "params">) {
  const commande = await lireCommandeAdmin((await params).reference);
  if (!commande) notFound();
  return (
    <>
      <EnteteAdmin
        titre={commande.reference}
        retour={
          <Link
            href="/admin/commandes"
            className="inline-flex items-center gap-1 text-sm text-texte-attenue hover:text-primaire"
          >
            <ArrowLeft aria-hidden className="size-4" /> Toutes les commandes
          </Link>
        }
      />
      <DetailCommandeAdmin commande={commande} />
    </>
  );
}
