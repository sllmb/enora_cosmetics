import { beforeEach, describe, expect, it } from "vitest";
import {
  brouillonDiffere,
  cleBrouillon,
  ecrireBrouillon,
  effacerBrouillon,
  lireBrouillon,
  type ValeursBrouillon,
} from "./brouillon";

const valeurs: ValeursBrouillon = {
  titre: "Bien choisir son parfum",
  extrait: "",
  contenu: "Un long texte en cours d'écriture…",
  publie: false,
  policeTitre: "princesse",
};

// Stockage en mémoire : le localStorage natif de Node 25 masque celui de jsdom.
function stockageMemoire(): Storage {
  const donnees = new Map<string, string>();
  return {
    get length() {
      return donnees.size;
    },
    clear: () => donnees.clear(),
    getItem: (cle) => donnees.get(cle) ?? null,
    key: (i) => [...donnees.keys()][i] ?? null,
    removeItem: (cle) => void donnees.delete(cle),
    setItem: (cle, valeur) => void donnees.set(cle, String(valeur)),
  };
}

describe("brouillon d'article", () => {
  beforeEach(() => {
    Object.defineProperty(window, "localStorage", {
      value: stockageMemoire(),
      configurable: true,
    });
  });

  it("distingue un nouvel article d'un article existant", () => {
    expect(cleBrouillon(null)).not.toBe(cleBrouillon(3));
  });

  it("enregistre, relit puis efface le brouillon", () => {
    const cle = cleBrouillon(null);
    ecrireBrouillon(cle, valeurs, 1000);
    expect(lireBrouillon(cle)).toEqual({ le: 1000, valeurs });
    effacerBrouillon(cle);
    expect(lireBrouillon(cle)).toBeNull();
  });

  it("ignore un brouillon abîmé", () => {
    window.localStorage.setItem(cleBrouillon(null), "{pas du json");
    expect(lireBrouillon(cleBrouillon(null))).toBeNull();
    window.localStorage.setItem(cleBrouillon(null), JSON.stringify({ le: 1, valeurs: {} }));
    expect(lireBrouillon(cleBrouillon(null))).toBeNull();
  });

  it("ne propose pas un brouillon identique à l'article enregistré", () => {
    expect(brouillonDiffere(valeurs, { ...valeurs })).toBe(false);
    expect(brouillonDiffere({ ...valeurs, contenu: "Autre" }, valeurs)).toBe(true);
    expect(brouillonDiffere({ ...valeurs, extrait: undefined }, valeurs)).toBe(false);
  });
});
