import { describe, expect, it } from "vitest";
import { articleSchema, resumeArticle } from "./article";

describe("articleSchema", () => {
  it("accepte un article et vide l'extrait absent", () => {
    expect(
      articleSchema.parse({
        titre: " Bien choisir son déodorant ",
        extrait: "",
        contenu: "## Introduction\n\nUn texte suffisamment long pour l'article.",
        publie: true,
        policeTitre: "princesse",
      }),
    ).toMatchObject({ titre: "Bien choisir son déodorant", extrait: null, publie: true });
  });

  it("refuse un titre ou un texte trop courts", () => {
    expect(
      articleSchema.safeParse({
        titre: "A",
        contenu: "x".repeat(30),
        publie: false,
        policeTitre: "classique",
      }).success,
    ).toBe(false);
    expect(
      articleSchema.safeParse({
        titre: "Titre",
        contenu: "court",
        publie: false,
        policeTitre: "classique",
      }).success,
    ).toBe(false);
  });

  it("refuse une police inconnue", () => {
    const article = { titre: "Titre", contenu: "x".repeat(30), publie: false };
    expect(articleSchema.safeParse({ ...article, policeTitre: "comic" }).success).toBe(false);
  });
});

describe("resumeArticle", () => {
  it("utilise l'extrait s'il existe", () => {
    expect(resumeArticle({ extrait: "Mon résumé", contenu: "..." })).toBe("Mon résumé");
  });

  it("sinon nettoie le Markdown et coupe proprement", () => {
    const resume = resumeArticle(
      {
        extrait: "",
        contenu: "## Titre\n\n**Gras** et [un lien](https://x.sn) puis une suite de mots",
      },
      30,
    );
    expect(resume).toBe("Titre Gras et un lien puis…");
  });
});
