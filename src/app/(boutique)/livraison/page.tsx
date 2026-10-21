import type { Metadata } from "next";
import { MODES_PAIEMENT } from "@/features/commande";
import { listerZones } from "@/features/commande/serveur";
import { formaterPrix } from "@/shared/lib/format";
import { ButtonLink } from "@/shared/ui";

export const metadata: Metadata = {
  title: "Livraison et paiement",
  description:
    "Zones, délais et frais de livraison Énora au Sénégal, et moyens de paiement acceptés.",
  alternates: { canonical: "/livraison" },
};

export default async function LivraisonPage() {
  const zones = await listerZones();
  return (
    <div className="conteneur max-w-3xl py-12 sm:py-16">
      <header className="mb-12 flex flex-col gap-3 text-center">
        <p className="titre-espace text-texte-attenue">Aide</p>
        <h1 className="text-5xl sm:text-6xl">Livraison et paiement</h1>
      </header>

      <section aria-labelledby="zones" className="mb-14">
        <h2 id="zones" className="mb-6 text-3xl">
          Zones et délais
        </h2>
        <table className="w-full text-left text-sm">
          <thead className="border-b border-bordure-forte text-texte-attenue">
            <tr>
              <th scope="col" className="py-3 font-medium">
                Zone
              </th>
              <th scope="col" className="py-3 font-medium">
                Délai
              </th>
              <th scope="col" className="py-3 text-right font-medium">
                Frais
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-bordure">
            {zones.map((zone) => (
              <tr key={zone.id}>
                <td className="py-3 pr-3">{zone.nom}</td>
                <td className="py-3 pr-3 whitespace-nowrap">{zone.delai}</td>
                <td className="py-3 text-right font-medium whitespace-nowrap">
                  {formaterPrix(zone.frais)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-4 text-sm text-texte-attenue">
          Le livreur vous appelle avant de passer. Les délais courent à partir de la confirmation de
          la commande.
        </p>
      </section>

      <section aria-labelledby="paiement" className="mb-14">
        <h2 id="paiement" className="mb-6 text-3xl">
          Moyens de paiement
        </h2>
        <dl className="grid gap-4 sm:grid-cols-2">
          {Object.values(MODES_PAIEMENT).map(({ libelle, aide }) => (
            <div key={libelle} className="rounded-carte border border-bordure p-5">
              <dt className="font-medium">{libelle}</dt>
              <dd className="mt-1 text-sm text-texte-attenue">{aide}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-4 text-sm text-texte-attenue">
          Avec Wave ou Orange Money, la commande est préparée dès réception du paiement.
        </p>
      </section>

      <div className="text-center">
        <ButtonLink href="/boutique" taille="lg">
          Découvrir la boutique
        </ButtonLink>
      </div>
    </div>
  );
}
