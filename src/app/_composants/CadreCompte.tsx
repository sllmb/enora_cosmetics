import type { ReactNode } from "react";

type Props = { titre: string; description?: string; children: ReactNode };

/** Mise en page étroite et centrée des écrans de connexion / inscription. */
export function CadreCompte({ titre, description, children }: Props) {
  return (
    <div className="conteneur flex justify-center py-12 sm:py-16">
      <div className="flex w-full max-w-md flex-col gap-8">
        <header className="flex flex-col gap-2 text-center">
          <p className="titre-espace text-texte-attenue">Mon compte</p>
          <h1 className="text-4xl sm:text-5xl">{titre}</h1>
          {description && <p className="text-texte-attenue">{description}</p>}
        </header>
        <div className="rounded-carte border border-bordure bg-surface p-6 shadow-carte sm:p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
