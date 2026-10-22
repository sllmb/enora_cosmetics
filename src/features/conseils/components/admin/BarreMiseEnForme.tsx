"use client";

import {
  Bold,
  Heading2,
  Heading3,
  Italic,
  Link2,
  List,
  ListOrdered,
  Minus,
  Quote,
  type LucideIcon,
} from "lucide-react";
import type { RefObject } from "react";
import { IconButton } from "@/shared/ui";
import { appliquerMiseEnForme, type ActionMiseEnForme } from "../../lib/miseEnForme";

const BOUTONS: { action: ActionMiseEnForme; libelle: string; Icone: LucideIcon }[][] = [
  [
    { action: "titre", libelle: "Titre de partie", Icone: Heading2 },
    { action: "sousTitre", libelle: "Sous-titre", Icone: Heading3 },
  ],
  [
    { action: "gras", libelle: "Gras", Icone: Bold },
    { action: "italique", libelle: "Italique", Icone: Italic },
    { action: "lien", libelle: "Lien", Icone: Link2 },
  ],
  [
    { action: "liste", libelle: "Liste à puces", Icone: List },
    { action: "listeNumerotee", libelle: "Liste numérotée", Icone: ListOrdered },
    { action: "citation", libelle: "Citation (écrite dans la police du titre)", Icone: Quote },
    { action: "separateur", libelle: "Séparateur", Icone: Minus },
  ],
];

type Props = {
  zone: RefObject<HTMLTextAreaElement | null>;
  onChange: (texte: string) => void;
};

/** Barre d'outils au-dessus du texte : plus besoin de connaître le Markdown. */
export function BarreMiseEnForme({ zone, onChange }: Props) {
  const appliquer = (action: ActionMiseEnForme) => {
    const champ = zone.current;
    if (!champ) return;
    const resultat = appliquerMiseEnForme(
      { texte: champ.value, debut: champ.selectionStart, fin: champ.selectionEnd },
      action,
    );
    onChange(resultat.texte);
    // La valeur est mise à jour au rendu suivant : on replace ensuite la sélection.
    requestAnimationFrame(() => {
      champ.focus();
      champ.setSelectionRange(resultat.debut, resultat.fin);
    });
  };

  return (
    <div
      role="toolbar"
      aria-label="Mise en forme"
      className="flex flex-wrap items-center gap-1 rounded-t-controle border border-b-0 border-bordure-forte bg-surface-douce/60 p-1"
    >
      {BOUTONS.map((groupe, i) => (
        <div key={i} className="flex items-center gap-0.5 border-bordure pr-1 not-last:border-r">
          {groupe.map(({ action, libelle, Icone }) => (
            <IconButton
              key={action}
              libelle={libelle}
              className="size-9 rounded-controle"
              // Garde la sélection du texte au clic.
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => appliquer(action)}
            >
              <Icone aria-hidden className="size-4" />
            </IconButton>
          ))}
        </div>
      ))}
    </div>
  );
}
