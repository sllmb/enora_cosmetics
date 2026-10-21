import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Confirmation } from "@/features/commande";
import { lireCommandeUtilisatrice } from "@/features/commande/serveur";

export const metadata: Metadata = { title: "Détail de la commande" };

type Props = PageProps<"/compte/commandes/[reference]">;

export default function DetailCommandePage({ params }: Props) {
  return (
    <div className="conteneur py-12 sm:py-16">
      <Suspense
        fallback={
          <div
            aria-busy
            className="mx-auto h-96 max-w-2xl animate-pulse rounded-carte bg-surface-douce"
          />
        }
      >
        <Detail params={params} />
      </Suspense>
    </div>
  );
}

async function Detail({ params }: Pick<Props, "params">) {
  // La RLS ne renvoie la commande que si elle appartient à l'utilisatrice connectée.
  const commande = await lireCommandeUtilisatrice((await params).reference);
  if (!commande) notFound();
  return <Confirmation commande={commande} contexte="historique" />;
}
