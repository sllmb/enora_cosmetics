import { expect, test, type Page } from "@playwright/test";

// Administration (P4) sur un vrai projet Supabase, en lecture seule : aucun
// enregistrement n'est modifié. Nécessite E2E_ADMIN_* (compte administrateur
// de test) et E2E_COMPTE_* (compte cliente) ; ignoré sans eux (CI).
const admin = {
  email: process.env.E2E_ADMIN_EMAIL,
  motDePasse: process.env.E2E_ADMIN_MOT_DE_PASSE,
};
const cliente = {
  email: process.env.E2E_COMPTE_EMAIL,
  motDePasse: process.env.E2E_COMPTE_MOT_DE_PASSE,
};

async function seConnecter(page: Page, email: string, motDePasse: string, suite: string) {
  await page.goto(`/compte/connexion?suite=${encodeURIComponent(suite)}`);
  await page.getByLabel("Email").fill(email);
  await page.getByLabel(/^Mot de passe/).fill(motDePasse);
  await page.getByRole("button", { name: "Se connecter" }).click();
}

test.describe("administration", () => {
  test.skip(!admin.email || !cliente.email, "Identifiants de test absents");

  test("un visiteur est envoyé vers la connexion", async ({ page }) => {
    await page.goto("/admin/commandes");
    await expect(page).toHaveURL(/\/compte\/connexion\?suite=%2Fadmin%2Fcommandes$/);
  });

  test("une cliente n'a pas accès à l'administration", async ({ page }) => {
    // Après la connexion : renvoyée à l'accueil par le proxy, ou « introuvable »
    // si la page est rendue directement (exigerAdmin) ; jamais l'administration.
    await seConnecter(page, cliente.email!, cliente.motDePasse!, "/admin");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      /Page introuvable|Le soin du corps/,
    );
    await expect(page.getByRole("heading", { name: "Tableau de bord" })).toHaveCount(0);

    // Adresse ouverte directement : le proxy renvoie à l'accueil.
    await page.goto("/admin/produits");
    await expect(page).toHaveURL(/localhost:\d+\/$/);
    await expect(page.getByRole("heading", { level: 1, name: "Produits" })).toHaveCount(0);
  });

  test("l'administratrice parcourt toutes les sections", async ({ page }) => {
    await seConnecter(page, admin.email!, admin.motDePasse!, "/admin");
    await expect(page.getByRole("heading", { level: 1, name: "Tableau de bord" })).toBeVisible();
    await expect(page.getByText("À traiter")).toBeVisible();

    const sections = [
      ["Commandes", "Commandes"],
      ["Produits", "Produits"],
      ["Catégories", "Catégories"],
      ["Livraison", "Zones de livraison"],
    ] as const;
    for (const [lien, titre] of sections) {
      await page
        .getByRole("navigation", { name: "Administration" })
        .getByRole("link", { name: lien })
        .click();
      await expect(page.getByRole("heading", { level: 1, name: titre })).toBeVisible();
    }

    await page.goto("/admin/produits");
    await page.getByRole("link", { name: /Savon Ambre noir/ }).click();
    await expect(page.getByRole("heading", { level: 1, name: "Savon Ambre noir" })).toBeVisible();
    await expect(page.getByLabel("Prix (FCFA)")).toHaveValue("3000");
    await expect(page.getByText("Ajouter des photos")).toBeVisible();
  });
});
