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
import type { KeyboardEvent, RefObject } from "react";
import { IconButton } from "@/shared/ui";
import {
  appliquerMiseEnForme,
  ecartMinimal,
  RACCOURCIS,
  type ActionMiseEnForme,
} from "../../lib/miseEnForme";

const BOUTONS: { action: ActionMiseEnForme; libelle: string; Icone: LucideIcon }[][] = [
  [
    { action: "titre", libelle: "Titre de partie", Icone: Heading2 },
    { action: "sousTitre", libelle: "Sous-titre", Icone: Heading3 },
  ],
  [
    { action: "gras", libelle: "Gras (Ctrl+B)", Icone: Bold },
    { action: "italique", libelle: "Italique (Ctrl+I)", Icone: Italic },
    { action: "lien", libelle: "Lien (Ctrl+K)", Icone: Link2 },
  ],
  [
    { action: "liste", libelle: "Liste à puces", Icone: List },
    { action: "listeNumerotee", libelle: "Liste numérotée", Icone: ListOrdered },
    { action: "citation", libelle: "Citation (écrite dans la police du titre)", Icone: Quote },
    { action: "separateur", libelle: "Séparateur", Icone: Minus },
  ],
];

type Zone = RefObject<HTMLTextAreaElement | null>;

/**
 * Applique une mise en forme comme une frappe au clavier (execCommand) : le
 * navigateur garde son historique, donc Ctrl+Z / Ctrl+Y annulent et rétablissent.
 * Repli sur une écriture directe si le navigateur ne le permet pas.
 */
export function useMiseEnForme(zone: Zone, repli: (texte: string) => void) {
  const appliquer = (action: ActionMiseEnForme) => {
    const champ = zone.current;
    if (!champ) return;
    const resultat = appliquerMiseEnForme(
      { texte: champ.value, debut: champ.selectionStart, fin: champ.selectionEnd },
      action,
    );
    const { debut, fin, insere } = ecartMinimal(champ.value, resultat.texte);
    champ.focus();
    champ.setSelectionRange(debut, fin);
    const natif = insere
      ? document.execCommand("insertText", false, insere)
      : debut === fin || document.execCommand("delete");
    if (!natif || champ.value !== resultat.texte) repli(resultat.texte);
    champ.setSelectionRange(resultat.debut, resultat.fin);
  };

  /** Ctrl/Cmd + B, I, K dans la zone de texte. */
  const surTouche = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (!(e.ctrlKey || e.metaKey) || e.altKey || e.shiftKey) return;
    const action = RACCOURCIS[e.key.toLowerCase()];
    if (!action) return;
    e.preventDefault();
    appliquer(action);
  };

  return { appliquer, surTouche };
}

/** Barre d'outils au-dessus du texte : plus besoin de connaître le Markdown. */
export function BarreMiseEnForme({
  appliquer,
}: {
  appliquer: (action: ActionMiseEnForme) => void;
}) {
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
