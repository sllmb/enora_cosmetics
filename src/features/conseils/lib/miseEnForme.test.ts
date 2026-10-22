import { describe, expect, it } from "vitest";
import { appliquerMiseEnForme, ecartMinimal, type Edition } from "./miseEnForme";

const sel = (texte: string, choisi: string): Edition => {
  const debut = texte.indexOf(choisi);
  return { texte, debut, fin: debut + choisi.length };
};
const selectionne = ({ texte, debut, fin }: Edition) => texte.slice(debut, fin);

describe("appliquerMiseEnForme", () => {
  it("met la sélection en gras et la garde sélectionnée", () => {
    const r = appliquerMiseEnForme(sel("Une peau douce", "douce"), "gras");
    expect(r.texte).toBe("Une peau **douce**");
    expect(selectionne(r)).toBe("douce");
  });

  it("insère un texte d'exemple sans sélection", () => {
    const r = appliquerMiseEnForme({ texte: "", debut: 0, fin: 0 }, "italique");
    expect(r.texte).toBe("*texte en italique*");
    expect(selectionne(r)).toBe("texte en italique");
  });

  it("transforme la ligne courante en titre, et remplace un titre existant", () => {
    const texte = "Intro\nLe geste clé\nSuite";
    const r = appliquerMiseEnForme(sel(texte, "geste"), "titre");
    expect(r.texte).toBe("Intro\n## Le geste clé\nSuite");
    const r2 = appliquerMiseEnForme(sel(r.texte, "geste"), "sousTitre");
    expect(r2.texte).toBe("Intro\n### Le geste clé\nSuite");
  });

  it("numérote chaque ligne sélectionnée", () => {
    const texte = "un\ndeux\ntrois";
    const r = appliquerMiseEnForme({ texte, debut: 0, fin: texte.length }, "listeNumerotee");
    expect(r.texte).toBe("1. un\n2. deux\n3. trois");
  });

  it("prépare un lien avec l'adresse sélectionnée", () => {
    const r = appliquerMiseEnForme(sel("Voir la boutique", "la boutique"), "lien");
    expect(r.texte).toBe("Voir [la boutique](https://)");
    expect(selectionne(r)).toBe("https://");
  });

  it("ajoute un séparateur sur sa propre ligne", () => {
    const r = appliquerMiseEnForme({ texte: "Fin", debut: 3, fin: 3 }, "separateur");
    expect(r.texte).toBe("Fin\n\n---\n\n");
  });
});

describe("ecartMinimal", () => {
  const verifier = (ancien: string, nouveau: string) => {
    const { debut, fin, insere } = ecartMinimal(ancien, nouveau);
    expect(ancien.slice(0, debut) + insere + ancien.slice(fin)).toBe(nouveau);
    return { debut, fin, insere };
  };

  it("ne remplace que ce qui change", () => {
    expect(verifier("Une peau douce", "Une peau **douce**")).toEqual({
      debut: 9,
      fin: 14,
      insere: "**douce**",
    });
    expect(verifier("ligne\nsuite", "## ligne\nsuite")).toEqual({
      debut: 0,
      fin: 0,
      insere: "## ",
    });
  });

  it("gère les suppressions et les textes identiques", () => {
    expect(verifier("### Titre", "## Titre").insere).toBe("");
    expect(verifier("abc", "abc")).toEqual({ debut: 3, fin: 3, insere: "" });
    verifier("aaa", "aaaa");
    verifier("", "texte");
  });
});
