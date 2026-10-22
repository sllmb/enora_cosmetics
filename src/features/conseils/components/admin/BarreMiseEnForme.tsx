"use client";

import {
  Bold,
  Heading2,
  Heading3,
  ImagePlus,
  Italic,
  Link2,
  List,
  ListOrdered,
  LoaderCircle,
  Minus,
  Quote,
  type LucideIcon,
} from "lucide-react";
import { useRef, useState, type KeyboardEvent, type RefObject } from "react";
import { toast } from "sonner";
import type { Produit } from "@/features/catalogue";
import { compresserImage } from "@/shared/lib/image";
import { clientNavigateur } from "@/shared/supabase/navigateur";
import { IconButton } from "@/shared/ui";
import { blocImage, DOSSIER_IMAGES_CONTENU, ligneProduit } from "../../lib/contenu";
import {
  appliquerMiseEnForme,
  ecartMinimal,
  insererBloc,
  RACCOURCIS,
  type ActionMiseEnForme,
  type Edition,
} from "../../lib/miseEnForme";
import { SelecteurProduit } from "./SelecteurProduit";

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
 * Modifie le texte comme une frappe au clavier (execCommand) : le navigateur
 * garde son historique, donc Ctrl+Z / Ctrl+Y annulent et rétablissent.
 * Repli sur une écriture directe si le navigateur ne le permet pas.
 */
export function useMiseEnForme(zone: Zone, repli: (texte: string) => void) {
  const ecrire = (calculer: (edition: Edition) => Edition) => {
    const champ = zone.current;
    if (!champ) return;
    const resultat = calculer({
      texte: champ.value,
      debut: champ.selectionStart,
      fin: champ.selectionEnd,
    });
    const { debut, fin, insere } = ecartMinimal(champ.value, resultat.texte);
    champ.focus();
    champ.setSelectionRange(debut, fin);
    const natif = insere
      ? document.execCommand("insertText", false, insere)
      : debut === fin || document.execCommand("delete");
    if (!natif || champ.value !== resultat.texte) repli(resultat.texte);
    champ.setSelectionRange(resultat.debut, resultat.fin);
  };

  const appliquer = (action: ActionMiseEnForme) =>
    ecrire((edition) => appliquerMiseEnForme(edition, action));

  const inserer = (bloc: string, choisi?: { debut: number; fin: number }) =>
    ecrire((edition) => insererBloc(edition, bloc, choisi));

  /** Ctrl/Cmd + B, I, K dans la zone de texte. */
  const surTouche = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (!(e.ctrlKey || e.metaKey) || e.altKey || e.shiftKey) return;
    const action = RACCOURCIS[e.key.toLowerCase()];
    if (!action) return;
    e.preventDefault();
    appliquer(action);
  };

  return { appliquer, inserer, surTouche };
}

type Props = {
  miseEnForme: ReturnType<typeof useMiseEnForme>;
  produits: Produit[];
};

/** Barre d'outils au-dessus du texte : plus besoin de connaître le Markdown. */
export function BarreMiseEnForme({ miseEnForme, produits }: Props) {
  const fichier = useRef<HTMLInputElement>(null);
  const [envoi, setEnvoi] = useState(false);

  // Image glissée dans le texte : réduite, envoyée, puis insérée à la position du curseur.
  const deposerImage = async (choisi: File | undefined) => {
    if (!choisi) return;
    setEnvoi(true);
    try {
      const blob = await compresserImage(choisi);
      const nom = `${crypto.randomUUID()}.webp`;
      const { error } = await clientNavigateur()
        .storage.from("produits")
        .upload(`${DOSSIER_IMAGES_CONTENU}${nom}`, blob, {
          contentType: "image/webp",
          cacheControl: "31536000",
        });
      if (error) throw error;
      const description = "Description de l'image";
      // La description est sélectionnée : il suffit de la taper.
      miseEnForme.inserer(blocImage(nom, description), { debut: 2, fin: 2 + description.length });
      toast.success("Image ajoutée. Remplacez « Description de l'image » par quelques mots.");
    } catch {
      toast.error("L'image n'a pas pu être envoyée.");
    } finally {
      setEnvoi(false);
    }
  };

  return (
    <div
      role="toolbar"
      aria-label="Mise en forme"
      className="flex flex-wrap items-center gap-1 rounded-t-controle border border-b-0 border-bordure-forte bg-surface-douce/60 p-1"
    >
      {BOUTONS.map((groupe, i) => (
        <div key={i} className="flex items-center gap-0.5 border-r border-bordure pr-1">
          {groupe.map(({ action, libelle, Icone }) => (
            <IconButton
              key={action}
              libelle={libelle}
              className="size-9 rounded-controle"
              // Garde la sélection du texte au clic.
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => miseEnForme.appliquer(action)}
            >
              <Icone aria-hidden className="size-4" />
            </IconButton>
          ))}
        </div>
      ))}
      <div className="flex items-center gap-0.5">
        <IconButton
          libelle={envoi ? "Envoi de l'image…" : "Insérer une image"}
          className="size-9 rounded-controle"
          disabled={envoi}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => fichier.current?.click()}
        >
          {envoi ? (
            <LoaderCircle aria-hidden className="size-4 animate-spin" />
          ) : (
            <ImagePlus aria-hidden className="size-4" />
          )}
        </IconButton>
        <input
          ref={fichier}
          type="file"
          accept="image/*"
          hidden
          onChange={(e) => {
            void deposerImage(e.target.files?.[0]);
            e.target.value = "";
          }}
        />
        <SelecteurProduit
          produits={produits}
          onChoisir={(slug) => miseEnForme.inserer(ligneProduit(slug))}
        />
      </div>
    </div>
  );
}
