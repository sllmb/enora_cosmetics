import { BoutonWhatsApp } from "../_composants/BoutonWhatsApp";
import { EnTete } from "../_composants/EnTete";
import { PiedDePage } from "../_composants/PiedDePage";

export default function BoutiqueLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <p className="bg-primaire py-2 text-center text-xs tracking-wide text-sur-primaire">
        Livraison à Dakar et environs · Paiement à la livraison, Wave ou Orange Money
      </p>
      <EnTete />
      <main id="contenu" className="flex-1">
        {children}
      </main>
      <PiedDePage />
      <BoutonWhatsApp />
    </>
  );
}
