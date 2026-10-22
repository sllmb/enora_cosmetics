// Boutons de mise en forme de l'éditeur : chaque action transforme le texte
// Markdown autour de la sélection et renvoie la nouvelle sélection.

export type ActionMiseEnForme =
  | "titre"
  | "sousTitre"
  | "gras"
  | "italique"
  | "liste"
  | "listeNumerotee"
  | "citation"
  | "lien"
  | "separateur";

export type Edition = { texte: string; debut: number; fin: number };

const ENTOURAGES: Partial<Record<ActionMiseEnForme, [string, string, string]>> = {
  // [avant, après, texte par défaut si rien n'est sélectionné]
  gras: ["**", "**", "texte en gras"],
  italique: ["*", "*", "texte en italique"],
};

const PREFIXES: Partial<Record<ActionMiseEnForme, (n: number) => string>> = {
  titre: () => "## ",
  sousTitre: () => "### ",
  liste: () => "- ",
  listeNumerotee: (n) => `${n + 1}. `,
  citation: () => "> ",
};

export function appliquerMiseEnForme(
  { texte, debut, fin }: Edition,
  action: ActionMiseEnForme,
): Edition {
  const selection = texte.slice(debut, fin);
  const avant = texte.slice(0, debut);
  const apres = texte.slice(fin);

  const entourage = ENTOURAGES[action];
  if (entourage) {
    const [gauche, droite, defaut] = entourage;
    const contenu = selection || defaut;
    return {
      texte: `${avant}${gauche}${contenu}${droite}${apres}`,
      debut: debut + gauche.length,
      fin: debut + gauche.length + contenu.length,
    };
  }

  if (action === "lien") {
    const libelle = selection || "texte du lien";
    const url = "https://";
    const insere = `[${libelle}](${url})`;
    // L'adresse est sélectionnée : il suffit de la coller.
    const debutUrl = debut + libelle.length + 3;
    return { texte: `${avant}${insere}${apres}`, debut: debutUrl, fin: debutUrl + url.length };
  }

  if (action === "separateur") {
    const insere = `${avant && !avant.endsWith("\n\n") ? "\n\n" : ""}---\n\n`;
    const position = debut + insere.length;
    return { texte: `${avant}${insere}${apres}`, debut: position, fin: position };
  }

  // Préfixes de ligne : appliqués à chaque ligne touchée par la sélection.
  const prefixe = PREFIXES[action];
  if (!prefixe) return { texte, debut, fin };
  const debutLigne = avant.lastIndexOf("\n") + 1;
  const finLigne = texte.indexOf("\n", fin) === -1 ? texte.length : texte.indexOf("\n", fin);
  const lignes = texte
    .slice(debutLigne, finLigne)
    .split("\n")
    // Remplace un préfixe existant (« ## » -> « ### », « - » -> « 1. »).
    .map((ligne, i) => prefixe(i) + ligne.replace(/^(#{1,6} |> |- |\d+\. )/, ""));
  const bloc = lignes.join("\n");
  return {
    texte: texte.slice(0, debutLigne) + bloc + texte.slice(finLigne),
    debut: debutLigne + prefixe(0).length,
    fin: debutLigne + bloc.length,
  };
}

/**
 * Plus petite portion qui change entre deux textes : seule cette portion est
 * remplacée dans le champ, comme une frappe, pour garder l'historique Ctrl+Z.
 */
export function ecartMinimal(ancien: string, nouveau: string) {
  let debut = 0;
  const maxDebut = Math.min(ancien.length, nouveau.length);
  while (debut < maxDebut && ancien[debut] === nouveau[debut]) debut++;
  let finAncien = ancien.length;
  let finNouveau = nouveau.length;
  while (
    finAncien > debut &&
    finNouveau > debut &&
    ancien[finAncien - 1] === nouveau[finNouveau - 1]
  ) {
    finAncien--;
    finNouveau--;
  }
  return { debut, fin: finAncien, insere: nouveau.slice(debut, finNouveau) };
}

/** Raccourcis clavier de l'éditeur (Ctrl ou Cmd + touche). */
export const RACCOURCIS: Record<string, ActionMiseEnForme> = {
  b: "gras",
  i: "italique",
  k: "lien",
};

/**
 * Insère un bloc (image, carte produit) à la place de la sélection, isolé par
 * des lignes vides. « choisi » : portion du bloc à sélectionner ensuite.
 */
export function insererBloc(
  { texte, debut, fin }: Edition,
  bloc: string,
  choisi?: { debut: number; fin: number },
): Edition {
  const avant = texte.slice(0, debut);
  const apres = texte.slice(fin);
  const ouverture = !avant || avant.endsWith("\n\n") ? "" : avant.endsWith("\n") ? "\n" : "\n\n";
  const fermeture = apres.startsWith("\n\n") ? "" : apres.startsWith("\n") ? "\n" : "\n\n";
  const origine = debut + ouverture.length;
  return {
    texte: `${avant}${ouverture}${bloc}${fermeture}${apres}`,
    debut: origine + (choisi?.debut ?? bloc.length),
    fin: origine + (choisi?.fin ?? bloc.length),
  };
}
