// Couverture courte des interactions natives particulièrement sensibles à Safari.
import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
});

test("ouvre une annonce dans un dialog natif et la ferme avec Escape", async ({ page }) => {
  await page.locator("#postes-hospitaliers .job-row").first().click();
  const dialog = page.locator("dialog");

  await expect(dialog).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
});

test("ouvre le menu mobile et le referme après navigation", async ({ page }) => {
  const menu = page.locator("details.mobile-nav");
  await menu.locator("summary").click();
  await expect(menu).toHaveAttribute("open", "");
  await page.getByRole("link", { name: "Soirées", exact: true }).click();

  await expect(menu).not.toHaveAttribute("open", "");
  await expect(page).toHaveURL(/#soirees$/);
});

test("les archives utilisent l’ouverture native de details", async ({ page }) => {
  const archive = page.locator(".archive-wrap details").first();
  const summary = archive.locator("summary");

  await summary.focus();
  await page.keyboard.press("Enter");
  await expect(archive).toHaveAttribute("open", "");
  await page.keyboard.press("Space");
  await expect(archive).not.toHaveAttribute("open", "");
});

test("ne déborde pas horizontalement à 390 px", async ({ page }) => {
  const dimensions = await page.evaluate(() => ({
    documentWidth: document.documentElement.scrollWidth,
    viewportWidth: window.innerWidth,
  }));

  expect(dimensions.documentWidth).toBeLessThanOrEqual(dimensions.viewportWidth);
});

test("le focus clavier reste visible sur le lien d’évitement", async ({ page }) => {
  const skipLink = page.locator(".skip-link");
  await page.keyboard.press("Tab");
  await skipLink.focus();

  await expect(skipLink).toBeFocused();
  const focusStyle = await skipLink.evaluate((element) => ({
    visible: element.matches(":focus-visible"),
    outline: getComputedStyle(element).outlineStyle,
  }));
  expect(focusStyle).toEqual({ visible: true, outline: "solid" });
});
