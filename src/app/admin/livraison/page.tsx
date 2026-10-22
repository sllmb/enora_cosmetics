import type { Metadata } from "next";
import { Suspense } from "react";
import { EnteteAdmin } from "@/app/_composants/EnteteAdmin";
import { GestionZones } from "@/features/commande/admin";
import { listerZonesAdmin } from "@/features/commande/serveur";

export const metadata: Metadata = { title: "Zones de livraison" };

export default function LivraisonAdminPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-8">
      <EnteteAdmin
        titre="Zones de livraison"
        description="Frais et délais proposés au moment de la commande."
      />
      <Suspense
        fallback={<div aria-busy className="h-96 animate-pulse rounded-carte bg-surface-douce" />}
      >
        <Liste />
      </Suspense>
    </div>
  );
}

async function Liste() {
  return <GestionZones zones={await listerZonesAdmin()} />;
}
