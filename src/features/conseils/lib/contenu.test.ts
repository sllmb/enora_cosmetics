import { describe, expect, it } from "vitest";
import {
  blocImage,
  cheminImage,
  decouperContenu,
  imagesDuContenu,
  ligneProduit,
  slugsProduits,
  urlImage,
} from "./contenu";

const SUPABASE = "https://exemple.supabase.co";

describe("decouperContenu", () => {
  it("place les cartes produit entre les paragraphes", () => {
    const contenu = `## Intro\n\nUn texte.\n\n${ligneProduit("savon-ambre-noir")}\n\nLa suite.`;
    expect(decouperContenu(contenu)).toEqual([
      { type: "texte", texte: "## Intro\n\nUn texte.\n\n" },
      { type: "produit", slug: "savon-ambre-noir" },
      { type: "texte", texte: "\n\nLa suite." },
    ]);
  });

  it("ignore une mention qui n'est pas seule sur sa ligne", () => {
    const contenu = "Voir [[produit:savon]] ici.";
    expect(decouperContenu(contenu)).toEqual([{ type: "texte", texte: contenu }]);
  });

  it("liste les produits cités sans doublon", () => {
    const contenu = [ligneProduit("a"), "texte", ligneProduit("b"), ligneProduit("a")].join("\n");
    expect(slugsProduits(contenu)).toEqual(["a", "b"]);
  });
});

describe("images du texte", () => {
  it("n'accepte que les codes d'images du site", () => {
    expect(cheminImage("image:abc-123.webp")).toBe("articles/contenu/abc-123.webp");
    expect(urlImage("image:abc-123.webp", SUPABASE)).toBe(
      `${SUPABASE}/storage/v1/object/public/produits/articles/contenu/abc-123.webp`,
    );
    expect(cheminImage("https://ailleurs.com/photo.webp")).toBeNull();
    expect(urlImage("image:../secret.webp", SUPABASE)).toBeNull();
    expect(urlImage("image:abc.png", SUPABASE)).toBeNull();
  });

  it("retrouve les images insérées dans le texte", () => {
    const contenu = `Avant

${blocImage("abc-123.webp")}

![x](https://ailleurs.com/y.webp)

${blocImage("abc-123.webp", "Encore")}`;
    expect(imagesDuContenu(contenu)).toEqual(["articles/contenu/abc-123.webp"]);
  });
});
