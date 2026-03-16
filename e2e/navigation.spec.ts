import { test, expect } from "@playwright/test";

test.describe("Navigation & protection des routes", () => {
  test("les pages auth sont accessibles sans connexion", async ({ page }) => {
    await page.goto("/login");
    await expect(page).toHaveURL(/\/login/);

    await page.goto("/register");
    await expect(page).toHaveURL(/\/register/);

    await page.goto("/forgot-password");
    await expect(page).toHaveURL(/\/forgot-password/);
  });

  test("la page d'accueil charge sans erreur", async ({ page }) => {
    const response = await page.goto("/");
    expect(response?.status()).toBe(200);
  });

  test("navigation depuis le hero vers inscription", async ({ page }) => {
    await page.goto("/");

    // Le CTA principal apparaît après le chargement de la session
    const ctaLink = page.getByRole("link", {
      name: "Créer un compte gratuitement",
    });
    await expect(ctaLink).toBeVisible({ timeout: 10000 });
  });
});
