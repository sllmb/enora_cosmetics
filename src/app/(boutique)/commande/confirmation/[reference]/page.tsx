import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Confirmation } from "@/features/commande";
import { lireCommandeConfirmee } from "@/features/commande/serveur";

// L'adresse contient la clé secrète de la commande : jamais indexée ni transmise à un autre site.
export const metadata: Metadata = {
  title: "Commande confirmée",
  robots: { index: false, follow: false },
  referrer: "no-referrer",
};

type Props = PageProps<"/commande/confirmation/[reference]">;

export default function ConfirmationPage(props: Props) {
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
        <ContenuConfirmation {...props} />
      </Suspense>
    </div>
  );
}

async function ContenuConfirmation({ params, searchParams }: Props) {
  const [{ reference }, { cle }] = await Promise.all([params, searchParams]);
  const commande = await lireCommandeConfirmee(reference, typeof cle === "string" ? cle : "");
  if (!commande) notFound();
  return <Confirmation commande={commande} />;
}
