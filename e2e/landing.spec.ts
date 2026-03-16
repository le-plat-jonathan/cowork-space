import { test, expect } from "@playwright/test";

test.describe("Page d'accueil (marketing)", () => {
  test("affiche le hero et les sections principales", async ({ page }) => {
    await page.goto("/");

    // Hero
    await expect(
      page.getByRole("heading", { name: /réinventé/i }),
    ).toBeVisible();
    await expect(
      page.getByText("Réservez vos postes de travail"),
    ).toBeVisible();

    // Sections
    await expect(
      page.getByRole("heading", { name: "Tout ce dont vous avez besoin" }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Prêt en 3 étapes" }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Des espaces pensés pour vous" }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Ils nous font confiance" }),
    ).toBeVisible();
  });

  test("la navbar contient les liens de navigation", async ({ page }) => {
    await page.goto("/");

    const navbar = page.getByRole("banner");
    await expect(navbar.getByRole("link", { name: "Cowork" })).toBeVisible();
    await expect(
      navbar.getByRole("link", { name: "Fonctionnalités" }),
    ).toBeVisible();
    await expect(
      navbar.getByRole("link", { name: "Nos espaces" }),
    ).toBeVisible();
  });

  test("affiche les témoignages", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByText("Sophie Martin")).toBeVisible();
    await expect(page.getByText("Thomas Dupont")).toBeVisible();
    await expect(page.getByText("Marie Leroy")).toBeVisible();
  });

  test("le footer est présent", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByText("© 2026 Cowork")).toBeVisible();
  });
});
