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
