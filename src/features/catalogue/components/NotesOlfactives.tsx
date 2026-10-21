import type { NotesOlfactives as Notes } from "../types";

const NIVEAUX = [
  { cle: "tete", libelle: "Tête", aide: "La première impression" },
  { cle: "coeur", libelle: "Cœur", aide: "La personnalité" },
  { cle: "fond", libelle: "Fond", aide: "Le sillage qui reste" },
] as const;

export function NotesOlfactives({ notes }: { notes: Notes }) {
  return (
    <section aria-labelledby="notes-olfactives" className="rounded-carte bg-surface-douce p-6">
      <h2 id="notes-olfactives" className="font-sans titre-espace text-texte-attenue">
        Notes olfactives
      </h2>
      <dl className="mt-4 grid grid-cols-3 gap-4 text-center">
        {NIVEAUX.map(({ cle, libelle, aide }) => (
          <div key={cle} className="flex flex-col gap-1">
            <dt className="font-titre text-2xl text-primaire">{libelle}</dt>
            <dd className="text-sm font-medium">{notes[cle].join(", ")}</dd>
            <dd className="text-xs text-texte-attenue">{aide}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
