import type { ReactNode } from "react";

type Section = { id: string; titre: string; contenu: ReactNode };

type Props = {
  surtitre: string;
  titre: string;
  introduction?: ReactNode;
  miseAJour?: string;
  sections: Section[];
};

/** Texte long (CGV, mentions légales) : sommaire cliquable puis articles numérotés. */
export function PageTexte({ surtitre, titre, introduction, miseAJour, sections }: Props) {
  return (
    <div className="conteneur max-w-3xl py-12 sm:py-16">
      <header className="mb-10 flex flex-col gap-3 text-center">
        <p className="titre-espace text-texte-attenue">{surtitre}</p>
        <h1 className="text-4xl sm:text-5xl">{titre}</h1>
        {miseAJour && <p className="text-sm text-texte-attenue">Mise à jour : {miseAJour}</p>}
      </header>
      {introduction && <div className="mb-10 text-lg text-texte/90">{introduction}</div>}
      <nav aria-label="Sommaire" className="mb-12 rounded-carte bg-surface-douce p-6">
        <p className="mb-3 font-titre text-2xl">Sommaire</p>
        <ol className="grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
          {sections.map((s, i) => (
            <li key={s.id}>
              <a href={`#${s.id}`} className="hover:text-primaire hover:underline">
                {i + 1}. {s.titre}
              </a>
            </li>
          ))}
        </ol>
      </nav>
      <div className="flex flex-col gap-10">
        {sections.map((s, i) => (
          <section key={s.id} id={s.id} aria-labelledby={`${s.id}-titre`} className="scroll-mt-28">
            <h2 id={`${s.id}-titre`} className="mb-4 text-3xl">
              {i + 1}. {s.titre}
            </h2>
            <div className="flex flex-col gap-3 leading-relaxed text-texte/90 [&_a]:text-primaire [&_a]:underline [&_li]:ml-5 [&_li]:list-disc [&_ul]:flex [&_ul]:flex-col [&_ul]:gap-1.5">
              {s.contenu}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
