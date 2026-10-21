import { expect, test } from "@playwright/test";

// Parcours P3 sur un vrai projet Supabase. Nécessite un compte de test
// confirmé : E2E_COMPTE_EMAIL et E2E_COMPTE_MOT_DE_PASSE (jamais versionnés).
// Sans eux (CI), ces tests sont ignorés.
const email = process.env.E2E_COMPTE_EMAIL;
const motDePasse = process.env.E2E_COMPTE_MOT_DE_PASSE;

test.describe("compte cliente", () => {
  test.skip(!email || !motDePasse, "Identifiants de test absents");
  test.describe.configure({ mode: "serial" });

  test("une page du compte renvoie vers la connexion", async ({ page }) => {
    await page.goto("/compte/commandes");
    await expect(page).toHaveURL(/\/compte\/connexion\?suite=%2Fcompte%2Fcommandes$/);
  });

  test("mauvais mot de passe : message clair", async ({ page }) => {
    await page.goto("/compte/connexion");
    await page.getByLabel("Email").fill(email!);
    await page.getByLabel(/^Mot de passe/).fill("mauvais-mot-de-passe-1");
    await page.getByRole("button", { name: "Se connecter" }).click();
    await expect(page.getByText("Email ou mot de passe incorrect.")).toBeVisible();
  });

  test("connexion, profil, pré-remplissage, déconnexion", async ({ page }) => {
    await page.goto("/compte/connexion");
    await page.getByLabel("Email").fill(email!);
    await page.getByLabel(/^Mot de passe/).fill(motDePasse!);
    await page.getByRole("button", { name: "Se connecter" }).click();
    await expect(page).toHaveURL(/\/compte$/);
    await expect(page.getByRole("heading", { level: 1, name: /Bonjour/ })).toBeVisible();

    await page.getByLabel("Téléphone").fill("77 000 00 00");
    await page.getByLabel("Zone de livraison habituelle").selectOption({ index: 1 });
    await page.getByLabel("Adresse de livraison").fill("Adresse de test, ne pas livrer");
    await page.getByRole("button", { name: "Enregistrer", exact: true }).click();
    await expect(page.getByText("Vos informations sont enregistrées.")).toBeVisible();

    // Les coordonnées pré-remplissent la commande.
    await page.goto("/");
    await page.evaluate(() =>
      localStorage.setItem(
        "enora:panier:v1",
        JSON.stringify([{ slug: "savon-ambre-noir", quantite: 1 }]),
      ),
    );
    await page.goto("/commande");
    await expect(page.getByLabel("Téléphone")).toHaveValue("770000000");
    await expect(page.getByLabel("Email (facultatif)")).toHaveValue(email!);

    await page.goto("/compte");
    await page.getByRole("button", { name: "Se déconnecter" }).click();
    await expect(page).toHaveURL(/\/$/);
    await page.goto("/compte");
    await expect(page).toHaveURL(/\/compte\/connexion/);
  });
});
