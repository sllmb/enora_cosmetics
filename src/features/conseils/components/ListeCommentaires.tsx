import { formaterDate } from "@/shared/lib/format";
import type { Commentaire } from "../types";

export function ListeCommentaires({ commentaires }: { commentaires: Commentaire[] }) {
  if (commentaires.length === 0) {
    return <p className="text-texte-attenue">Soyez la première à partager votre avis.</p>;
  }
  return (
    <ul className="flex flex-col gap-4">
      {commentaires.map((c) => (
        <li key={c.id} className="flex gap-4">
          <span
            aria-hidden
            className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primaire-doux font-titre text-lg text-primaire"
          >
            {c.auteur.charAt(0).toUpperCase()}
          </span>
          <div className="flex flex-1 flex-col gap-1 rounded-carte bg-surface-douce/70 px-5 py-4">
            <p className="text-sm">
              <span className="font-medium">{c.auteur}</span>
              <span className="text-texte-attenue">
                {" "}
                · <time dateTime={c.creeLe}>{formaterDate(c.creeLe)}</time>
              </span>
            </p>
            <p className="leading-relaxed whitespace-pre-line">{c.contenu}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
