import { test, expect } from "@playwright/test";

test.describe("Page de connexion", () => {
  test("affiche le formulaire de connexion", async ({ page }) => {
    await page.goto("/login");

    await expect(
      page.getByRole("heading", { name: "Se connecter" }),
    ).toBeVisible();
    await expect(page.getByLabel("Email")).toBeVisible();
    await expect(page.getByLabel("Mot de passe")).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Se connecter" }),
    ).toBeVisible();
  });

  test("contient un lien vers l'inscription", async ({ page }) => {
    await page.goto("/login");

    const link = page.getByRole("link", { name: "Créer un compte" });
    await expect(link).toBeVisible();
    await link.click();

    await expect(page).toHaveURL(/\/register/);
  });

  test("contient un lien mot de passe oublié", async ({ page }) => {
    await page.goto("/login");

    const link = page.getByRole("link", { name: "Mot de passe oublié ?" });
    await expect(link).toBeVisible();
    await link.click();

    await expect(page).toHaveURL(/\/forgot-password/);
  });
});

test.describe("Page d'inscription", () => {
  test("affiche le formulaire d'inscription", async ({ page }) => {
    await page.goto("/register");

    await expect(
      page.getByRole("heading", { name: "Créer un compte" }),
    ).toBeVisible();
    await expect(page.getByLabel("Nom")).toBeVisible();
    await expect(page.getByLabel("Email")).toBeVisible();
    await expect(page.getByLabel("Mot de passe")).toBeVisible();
    await expect(
      page.getByRole("button", { name: "M'inscrire" }),
    ).toBeVisible();
  });

  test("contient un lien vers la connexion", async ({ page }) => {
    await page.goto("/register");

    const link = page.getByRole("link", { name: "Se connecter" });
    await expect(link).toBeVisible();
    await link.click();

    await expect(page).toHaveURL(/\/login/);
  });
});

test.describe("Page mot de passe oublié", () => {
  test("affiche le formulaire", async ({ page }) => {
    await page.goto("/forgot-password");

    await expect(page.getByLabel("Email")).toBeVisible();
  });
});
