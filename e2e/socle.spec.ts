import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

async function sansDefilementHorizontal(page: import("@playwright/test").Page) {
  const debordement = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(debordement).toBeLessThanOrEqual(0);
}

test("l'accueil présente la marque et mène à la boutique", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/Énora Cosmetics/);
  await expect(
    page.getByRole("heading", { name: "Prendre soin de soi, simplement" }),
  ).toBeVisible();
  await sansDefilementHorizontal(page);

  await page.getByRole("link", { name: "Découvrir la boutique" }).click();
  await expect(page).toHaveURL(/\/boutique$/);
  await expect(page.getByRole("heading", { name: "Boutique" })).toBeVisible();
});

test("la navigation mobile s'ouvre et marque la page courante", async ({ page, isMobile }) => {
  test.skip(!isMobile, "Tiroir réservé aux petits écrans");
  await page.goto("/conseils");
  await page.getByRole("button", { name: "Ouvrir le menu" }).click();
  const menu = page.getByRole("dialog", { name: "Menu" });
  await expect(menu.getByRole("link", { name: "Conseils" })).toHaveAttribute(
    "aria-current",
    "page",
  );
  await menu.getByRole("link", { name: "Savons" }).click();
  await expect(page).toHaveURL(/\/boutique\/savons$/);
  await expect(menu).toBeHidden();
});

test("une adresse inconnue affiche la page introuvable", async ({ page }) => {
  const reponse = await page.goto("/cette-page-n-existe-pas");
  expect(reponse?.status()).toBe(404);
  await expect(page.getByRole("heading", { name: "Page introuvable" })).toBeVisible();
});

test("aucune violation d'accessibilité sur l'accueil", async ({ page }) => {
  await page.goto("/");
  const resultats = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag22aa"])
    .analyze();
  expect(resultats.violations).toEqual([]);
});
