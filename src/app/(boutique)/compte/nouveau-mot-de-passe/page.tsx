import type { Metadata } from "next";
import { CadreCompte } from "@/app/_composants/CadreCompte";
import { FormulaireNouveauMotDePasse } from "@/features/compte";

export const metadata: Metadata = { title: "Nouveau mot de passe" };

// Atteinte via le lien reçu par email (session ouverte par /auth/callback).
export default function NouveauMotDePassePage() {
  return (
    <CadreCompte titre="Nouveau mot de passe">
      <FormulaireNouveauMotDePasse />
    </CadreCompte>
  );
}
