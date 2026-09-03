import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.evaluate(() => sessionStorage.removeItem("apir-open-archive-years"));
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

test("restaure le focus après la fermeture d’une annonce", async ({ page }) => {
  const job = page.locator("#postes-hospitaliers .job-row").first();

  await job.click();
  await page.locator("dialog").getByRole("button", { name: "Fermer l’annonce" }).click();

  await expect(job).toBeFocused();
});

test("ouvre une annonce depuis son ancre", async ({ page }) => {
  await page.goto("/#poste-ambroise-pare-cca-assistant");

  await expect(page.locator("dialog")).toBeVisible();
  await expect(page.locator("#job-dialog-title")).toHaveText("CCA ou Assistant");
});

test("le bouton Retour du navigateur ferme la fiche sans quitter le site", async ({ page }) => {
  await page.locator("#postes-hospitaliers .job-row").first().click();
  await page.goBack();

  await expect(page.locator("dialog")).toBeHidden();
  await expect(page).toHaveURL(/\/$/);
});

test("le menu mobile se referme après une navigation", async ({ page }) => {
  await page.locator("details.mobile-nav summary").click();
  await page.getByRole("link", { name: "Annonces", exact: true }).click();

  await expect(page.locator("details.mobile-nav")).not.toHaveAttribute("open", "");
  await expect(page).toHaveURL(/#postes-hospitaliers$/);
});

test("le menu mobile reste entièrement visible sur un écran étroit", async ({ page }) => {
  await page.locator("details.mobile-nav summary").click();

  const bounds = await page.locator(".mobile-nav-popover").evaluate((popover) => {
    const popoverBounds = popover.getBoundingClientRect();
    const links = [...popover.querySelectorAll("a")].map((link) => {
      const linkBounds = link.getBoundingClientRect();
      return { left: linkBounds.left, right: linkBounds.right, height: linkBounds.height };
    });
    return {
      popover: { left: popoverBounds.left, right: popoverBounds.right },
      links,
      viewportWidth: window.innerWidth,
    };
  });

  expect(bounds.popover.left).toBeGreaterThanOrEqual(0);
  expect(bounds.popover.right).toBeLessThanOrEqual(bounds.viewportWidth);
  for (const link of bounds.links) {
    expect(link.left).toBeGreaterThanOrEqual(bounds.popover.left);
    expect(link.right).toBeLessThanOrEqual(bounds.popover.right);
    expect(link.height).toBeGreaterThanOrEqual(44);
  }
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

test("conserve une archive ouverte après rechargement", async ({ page }) => {
  const archive = page.locator("details").filter({ hasText: "2025 — 2026" }).first();
  await archive.locator("summary").click();
  await page.reload();

  await expect(page.locator("details").filter({ hasText: "2025 — 2026" }).first()).toHaveAttribute("open", "");
});
