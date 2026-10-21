import { expect, test } from "@playwright/test";

// Parcours P1 jusqu'au formulaire. L'envoi réel n'est pas testé ici : il
// créerait une commande et décrémenterait le stock de la base.

test("ajouter au panier, ajuster et aller jusqu'au formulaire", async ({ page }) => {
  await page.goto("/produit/huile-parfumee-jasmin");
  await page.getByRole("button", { name: "Augmenter la quantité" }).click();
  await page.getByRole("button", { name: "Ajouter au panier" }).click();
  await expect(page.getByText("Ajouté au panier")).toBeVisible();
  await expect(page.getByRole("link", { name: "Panier, 2 articles" })).toBeVisible();

  await page.goto("/panier");
  await expect(page.getByText(/^Sous-total \(2\sarticles\)$/)).toBeVisible();
  await page
    .getByRole("group", { name: "Quantité de Huile parfumée Jasmin" })
    .getByRole("button", { name: "Augmenter la quantité" })
    .click();
  await expect(page.getByText(/^19\s500\sFCFA$/).first()).toBeVisible();

  await page.getByRole("link", { name: "Passer la commande" }).click();
  await expect(
    page.getByRole("heading", { level: 1, name: "Finaliser la commande" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Valider la commande" }).click();
  await expect(page.getByText("Choisissez une zone de livraison.")).toBeVisible();
  await expect(page.getByText("Le numéro de téléphone est obligatoire.")).toBeVisible();

  await page.getByText("Dakar (centre et Plateau)").click();
  await expect(page.getByText(/^21\s000\sFCFA$/)).toBeVisible(); // 19 500 + 1 500 de livraison
});

test("un produit épuisé bloque la commande (RM-04)", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() =>
    localStorage.setItem(
      "enora:panier:v1",
      JSON.stringify([{ slug: "savon-fleur-oranger", quantite: 1 }]),
    ),
  );
  await page.goto("/panier");
  await expect(page.getByText("Ce produit vient d'être épuisé.", { exact: false })).toBeVisible();
  await expect(page.getByRole("link", { name: "Passer la commande" })).toHaveCount(0);

  await page.getByRole("button", { name: "Retirer Savon Fleur d'oranger du panier" }).click();
  await expect(page.getByRole("heading", { name: "Votre panier est vide" })).toBeVisible();
});

test("un panier trafiqué est ignoré", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() =>
    localStorage.setItem("enora:panier:v1", '[{"slug":"x","quantite":999}]'),
  );
  await page.goto("/panier");
  await expect(page.getByRole("heading", { name: "Votre panier est vide" })).toBeVisible();
});

test("la page de confirmation exige la clé de la commande", async ({ page }) => {
  await page.goto("/commande/confirmation/ENR-2026-00001");
  await expect(page.getByRole("heading", { name: "Page introuvable" })).toBeVisible();
});
