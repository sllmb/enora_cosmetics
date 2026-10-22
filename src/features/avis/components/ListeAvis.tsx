import { formaterDate, pluriel } from "@/shared/lib/format";
import { formaterNote, resumerAvis } from "../lib/avis";
import type { Avis } from "../types";
import { Etoiles } from "./Etoiles";

export function ListeAvis({ avis }: { avis: Avis[] }) {
  const resume = resumerAvis(avis);
  if (resume.nombre === 0) {
    return <p className="text-texte-attenue">Aucun avis pour le moment.</p>;
  }
  return (
    <div className="flex flex-col gap-6">
      <p className="flex items-center gap-3">
        <span className="font-titre text-4xl">{formaterNote(resume.moyenne)}</span>
        <span className="flex flex-col">
          <Etoiles note={resume.moyenne} taille="md" />
          <span className="text-sm text-texte-attenue">
            {pluriel(resume.nombre, "avis", "avis")}
          </span>
        </span>
      </p>
      <ul className="flex flex-col divide-y divide-bordure border-y border-bordure">
        {avis.map((a) => (
          <li key={a.id} className="flex flex-col gap-2 py-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <Etoiles note={a.note} />
              <span className="text-xs text-texte-attenue">
                {a.auteur} · {formaterDate(a.creeLe)}
              </span>
            </div>
            {a.commentaire && <p className="leading-relaxed">{a.commentaire}</p>}
          </li>
        ))}
      </ul>
    </div>
  );
}
