"use client";

import { useEffect, useState } from "react";
import {
  brouillonDiffere,
  ecrireBrouillon,
  effacerBrouillon,
  lireBrouillon,
  type Brouillon,
  type ValeursBrouillon,
} from "../../lib/brouillon";

const DELAI_SAUVEGARDE = 800;

type Options = {
  cle: string;
  /** Saisie en cours. */
  valeurs: ValeursBrouillon;
  /** Valeurs déjà enregistrées (article existant) ou de départ (nouvel article). */
  enregistre: ValeursBrouillon;
  modifie: boolean;
};

/**
 * Sauvegarde automatique de la saisie dans le navigateur, proposition de
 * restauration au retour sur la page et alerte avant de la quitter.
 */
export function useBrouillonArticle({ cle, valeurs, enregistre, modifie }: Options) {
  // Brouillon trouvé à l'ouverture, en attente d'une décision (restaurer ou ignorer).
  const [enAttente, setEnAttente] = useState<Brouillon | null>(null);
  const [decide, setDecide] = useState(false);

  // Lecture une seule fois, après le chargement (le stockage n'existe pas côté serveur).
  useEffect(() => {
    const trouve = lireBrouillon(cle);
    const utile = trouve && brouillonDiffere(trouve.valeurs, enregistre);
    if (!utile) effacerBrouillon(cle);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- lecture unique d'un stockage externe
    setEnAttente(utile ? trouve : null);
    setDecide(!utile);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- seulement à l'ouverture
  }, [cle]);

  // Sauvegarde peu après chaque frappe ; jamais par-dessus un brouillon non traité.
  const empreinte = JSON.stringify(valeurs);
  useEffect(() => {
    if (!decide || !modifie) return;
    const minuteur = setTimeout(
      () => ecrireBrouillon(cle, JSON.parse(empreinte)),
      DELAI_SAUVEGARDE,
    );
    return () => clearTimeout(minuteur);
  }, [cle, empreinte, decide, modifie]);

  // Alerte du navigateur (rechargement, fermeture) tant que rien n'est enregistré.
  useEffect(() => {
    if (!modifie) return;
    const avertir = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", avertir);
    return () => window.removeEventListener("beforeunload", avertir);
  }, [modifie]);

  return {
    brouillon: enAttente,
    /** Rend la main : la sauvegarde automatique reprend. */
    traiter(garder: boolean) {
      if (!garder) effacerBrouillon(cle);
      setEnAttente(null);
      setDecide(true);
    },
    /** À appeler une fois l'article enregistré. */
    oublier() {
      effacerBrouillon(cle);
    },
  };
}
