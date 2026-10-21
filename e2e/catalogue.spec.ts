import { expect, test } from "@playwright/test";

test("de la catégorie à la fiche produit", async ({ page }) => {
  await page.goto("/boutique/huiles-parfumees");
  await expect(page.getByRole("heading", { level: 1, name: "Huiles parfumées" })).toBeVisible();
  await expect(
    page
      .getByRole("navigation", { name: "Catégories" })
      .getByRole("link", { name: "Huiles parfumées" }),
  ).toHaveAttribute("aria-current", "page");

  await page.getByRole("link", { name: "Huile parfumée Jasmin" }).click();
  await expect(page).toHaveURL(/\/produit\/huile-parfumee-jasmin$/);
  await expect(
    page.getByRole("heading", { level: 1, name: "Huile parfumée Jasmin" }),
  ).toBeVisible();
  await expect(page.getByRole("heading", { name: "Notes olfactives" })).toBeVisible();
  await expect(page.getByText(/6\s500\sFCFA/).first()).toBeVisible();
});

test("un produit épuisé n'est pas commandable (RM-04)", async ({ page }) => {
  await page.goto("/produit/savon-fleur-oranger");
  await expect(page.getByRole("button", { name: "Épuisé" })).toBeDisabled();
  await expect(page.getByRole("button", { name: "Ajouter au panier" })).toHaveCount(0);
});

test("la quantité reste entre 1 et le stock (RM-05)", async ({ page }) => {
  await page.goto("/produit/huile-parfumee-santal-vanille");
  const moins = page.getByRole("button", { name: "Diminuer la quantité" });
  const plus = page.getByRole("button", { name: "Augmenter la quantité" });
  await expect(moins).toBeDisabled();
  for (let i = 0; i < 7; i++) await plus.click();
  await expect(page.getByRole("group", { name: "Quantité" })).toContainText("8");
  await expect(plus).toBeDisabled();
});

// La page étant pré-rendue en partie, le statut reste 200 : Next.js ajoute « noindex »
// pour que les moteurs de recherche ne référencent pas l'adresse.
test("un produit inconnu affiche la page introuvable, non indexée", async ({ page }) => {
  await page.goto("/produit/produit-inexistant");
  await expect(page.getByRole("heading", { name: "Page introuvable" })).toBeVisible();
  await expect(page.locator('meta[name="robots"][content="noindex"]')).toHaveCount(1);
});

test("tri et filtres restent dans l'adresse", async ({ page }) => {
  await page.goto("/boutique");
  await page.getByLabel("Trier par").selectOption("prix-croissant");
  await page.getByRole("button", { name: "Floral" }).click();
  await expect(page).toHaveURL(/\?tri=prix-croissant&famille=floral$/);
  await expect(page.getByText(/^2\sproduits$/)).toBeVisible();

  await page.reload();
  await expect(page.getByRole("button", { name: "Floral" })).toHaveAttribute(
    "aria-pressed",
    "true",
  );
  await page.getByLabel("Disponibles uniquement").check();
  await expect(page.getByText(/^1\sproduit$/)).toBeVisible();

  await page.getByRole("button", { name: "Tout effacer" }).click();
  await expect(page).toHaveURL(/\/boutique$/);
});

test("le plan du site liste les produits", async ({ request }) => {
  const plan = await (await request.get("/sitemap.xml")).text();
  expect(plan).toContain("/produit/huile-parfumee-jasmin");
  expect(plan).toContain("/boutique/savons");
});
