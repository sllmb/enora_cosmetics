import { ChevronDown } from "lucide-react";
import type { Produit } from "../types";

type Props = { produit: Pick<Produit, "description" | "conseilsUtilisation" | "composition"> };

export function DetailsProduit({ produit }: Props) {
  const sections = [
    { titre: "Description", texte: produit.description, ouvert: true },
    { titre: "Conseils d'utilisation", texte: produit.conseilsUtilisation, ouvert: false },
    { titre: "Composition", texte: produit.composition, ouvert: false },
  ].filter((s): s is typeof s & { texte: string } => Boolean(s.texte));

  return (
    <div className="divide-y divide-bordure border-y border-bordure">
      {sections.map(({ titre, texte, ouvert }) => (
        <details key={titre} open={ouvert} className="group">
          <summary className="flex cursor-pointer list-none items-center justify-between py-4 font-medium [&::-webkit-details-marker]:hidden">
            {titre}
            <ChevronDown
              aria-hidden
              className="size-5 text-texte-attenue transition-transform duration-220 group-open:rotate-180"
            />
          </summary>
          <p className="pb-5 leading-relaxed whitespace-pre-line text-texte-attenue">{texte}</p>
        </details>
      ))}
    </div>
  );
}
