import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
});

test("ferme une annonce sans revenir à la page précédente", async ({ page }) => {
  const job = page.locator("#postes-hospitaliers .job-row").first();

  await job.click();
  await expect(page.locator("dialog")).toBeVisible();
  await expect(page).toHaveURL(/#poste-/);

  await page.locator("dialog").click({ position: { x: 10, y: 10 } });
  await expect(page.locator("dialog")).toBeHidden();
  await expect(page).toHaveURL(/\/$/);

  await job.click();
  await page.keyboard.press("Escape");
  await expect(page.locator("dialog")).toBeHidden();
  await expect(page).toHaveURL(/\/$/);
});

test("le bouton Retour du navigateur ferme la fiche sans quitter le site", async ({ page }) => {
  await page.locator("#postes-hospitaliers .job-row").first().click();
  await page.goBack();

  await expect(page.locator("dialog")).toBeHidden();
  await expect(page).toHaveURL(/\/$/);
});

test("le menu mobile se referme après une navigation", async ({ page }) => {
  await page.locator("details.mobile-nav summary").click();
  await page.getByRole("link", { name: "Postes hospitaliers", exact: true }).click();

  await expect(page.locator("details.mobile-nav")).not.toHaveAttribute("open", "");
  await expect(page).toHaveURL(/#postes-hospitaliers$/);
});

test("les archives s’ouvrent et les liens du pied de page restent tactiles", async ({ page }) => {
  const archive = page.locator("details").filter({ hasText: "2025 — 2026" }).first();
  await archive.locator("summary").click();
  await expect(archive).toHaveAttribute("open", "");

  const footerLinks = page.locator("footer .footer-links a");
  for (const link of await footerLinks.all()) {
    const size = await link.evaluate((element) => {
      const rect = element.getBoundingClientRect();
      return { width: rect.width, height: rect.height };
    });
    expect(size.width).toBeGreaterThanOrEqual(44);
    expect(size.height).toBeGreaterThanOrEqual(44);
  }
});
