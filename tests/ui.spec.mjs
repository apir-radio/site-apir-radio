// Parcours navigateur critiques sur écran étroit/mobile et retour historique.
import { expect, test } from "@playwright/test";
import { associationEmails } from "./helpers/association-emails.mjs";

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
  const closeButton = page.locator("dialog").getByRole("button", { name: "Fermer l’annonce" });
  await closeButton.hover();
  const closeButtonTransform = await closeButton.evaluate((element) => getComputedStyle(element).transform);
  expect(closeButtonTransform).toBe("none");
  await closeButton.click();

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

test("les sections et la navigation suivent le nouvel ordre éditorial", async ({ page }) => {
  const sectionIds = await page.locator("main > section").evaluateAll((sections) => sections.map((section) => section.id));
  expect(sectionIds).toEqual(["top", "mission", "soirees", "bureau", "ressources", "postes-hospitaliers", "contact"]);

  const mobileLinks = await page.locator(".mobile-nav-popover a").evaluateAll((links) => links.map((link) => [link.getAttribute("href"), link.textContent.trim()]));
  expect(mobileLinks).toEqual([
    ["#mission", "L’association"],
    ["#soirees", "Soirées"],
    ["#bureau", "Bureau"],
    ["#ressources", "Ressources"],
    ["#postes-hospitaliers", "Annonces"],
    ["#contact", "Nous contacter"],
  ]);

  const desktopLinks = await page.locator('nav[aria-label="Navigation principale"] a').evaluateAll((links) => links.map((link) => [link.getAttribute("href"), link.textContent.trim()]));
  expect(desktopLinks).toEqual(mobileLinks.slice(0, 5));
});

test("les numéros de sections reflètent le nouvel ordre", async ({ page }) => {
  await expect(page.locator("#mission .section-kicker")).toHaveText("01 · L’association");
  await expect(page.locator("#soirees .section-kicker")).toHaveText("02 · Les soirées de formation");
  await expect(page.locator("#bureau .section-kicker")).toHaveText(/^03 · Bureau /);
  await expect(page.locator("#ressources .section-kicker")).toHaveText("04 · Ressources");
});

test("affiche les annonces dans la navigation desktop", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 });

  await expect(page.getByRole("navigation", { name: "Navigation principale" }).getByRole("link", { name: "Annonces", exact: true })).toBeVisible();
});

test("garde les noms des coordinateurs dans la famille sans", async ({ page }) => {
  const families = await page.evaluate(() => ({
    body: getComputedStyle(document.body).fontFamily,
    name: getComputedStyle(document.querySelector(".coordination p span")).fontFamily,
    label: getComputedStyle(document.querySelector(".coordination-label")).fontFamily,
  }));

  expect(families.name).toBe(families.body);
  expect(families.label).not.toBe(families.body);
});

test("anime la flèche des liens Ressources sans toucher à la flèche descendante", async ({ page }) => {
  const externalLink = page.locator(".resource-card.featured > a");
  await externalLink.hover();
  const diagonalTransform = await externalLink.locator(".link-arrow").evaluate((element) => getComputedStyle(element).transform);
  expect(diagonalTransform).not.toBe("none");

  const jobsLink = page.locator('.resource-card a[href="#postes-hospitaliers"]');
  await jobsLink.hover();
  const downArrow = jobsLink.locator("span[aria-hidden='true']");
  await expect(downArrow).toHaveText("↓");
  expect(await downArrow.evaluate((element) => getComputedStyle(element).transform)).toBe("none");

  for (const link of [page.locator(".header-cta"), page.locator(".event-signup"), page.locator(".coordination a")]) {
    await link.hover();
    expect(await link.locator(".link-arrow").evaluate((element) => getComputedStyle(element).transform)).not.toBe("none");
  }
});

test("reconstruit les adresses e-mail après le chargement", async ({ page }) => {
  await expect(page.locator(".header-contact")).toHaveAttribute("href", `mailto:${associationEmails.contact}`);
  await expect(page.locator(".coordination a")).toHaveAttribute("href", `mailto:${associationEmails.coordination}`);
  await expect(page.locator(".contact-mail")).toHaveAttribute("href", `mailto:${associationEmails.contact}`);
  await expect(page.locator("footer .footer-links").getByRole("link", { name: "Contact", exact: true })).toHaveAttribute("href", `mailto:${associationEmails.contact}`);
  await expect(page.locator(".contact-address")).toHaveText(associationEmails.contact);
});

test("affiche une date courte et lisible pour la prochaine soirée", async ({ page }) => {
  const heading = page.locator(".event-heading h2");

  await expect(heading).toHaveText("Rendez-vous en septembre");
  await expect(page.locator(".status-pill")).toHaveText("Prochaine soirée");
  await expect(page.locator(".next-card")).toContainText("Mercredi 16 septembre à 19h30");
  await expect(page.locator(".next-card")).toContainText("Hôpital Paris Saint Joseph");
  const fontSize = await heading.evaluate((element) => Number.parseFloat(getComputedStyle(element).fontSize));
  expect(fontSize).toBeLessThan(56);
});

test("conserve des landmarks distincts et le lien d’évitement", async ({ page }) => {
  const landmarks = await page.evaluate(() => {
    const main = document.querySelector("main");
    return {
      mainCount: document.querySelectorAll("main").length,
      headerOutsideMain: !main.contains(document.querySelector(".site-header")),
      footerOutsideMain: !main.contains(document.querySelector("footer")),
      skipLinkTarget: document.querySelector(".skip-link").getAttribute("href"),
    };
  });

  expect(landmarks).toEqual({
    mainCount: 1,
    headerOutsideMain: true,
    footerOutsideMain: true,
    skipLinkTarget: "#main-content",
  });

  const skipLink = page.locator(".skip-link");
  await skipLink.focus();
  await skipLink.click();
  await expect(page).toHaveURL(/#main-content$/);
  await expect(page.locator("#main-content")).toBeFocused();
});

test("présente les archives comme sous-titre et la soirée avec des icônes décoratives", async ({ page }) => {
  await expect(page.getByRole("heading", { level: 3, name: "Archives des soirées" })).toBeVisible();
  const signup = page.locator(".next-card .event-signup");
  await expect(signup).toHaveText("S’inscrire à la soirée ↗");
  const signupTarget = await signup.evaluate((element) => ({
    height: element.getBoundingClientRect().height,
    borderTopStyle: getComputedStyle(element).borderTopStyle,
  }));
  expect(signupTarget.height).toBeGreaterThanOrEqual(44);
  expect(signupTarget.borderTopStyle).toBe("solid");

  const icons = page.locator(".next-card-detail svg");
  await expect(icons).toHaveCount(2);
  for (const icon of await icons.all()) {
    await expect(icon).toHaveAttribute("aria-hidden", "true");
    await expect(icon).toHaveAttribute("focusable", "false");
  }

  const cardDetails = await page.locator(".next-card").innerText();
  expect(cardDetails).not.toContain("📅");
  expect(cardDetails).not.toContain("📍");
});

test("le logo du header garde une cible tactile d’au moins 44 px sur mobile", async ({ page }) => {
  const size = await page.locator(".site-header .brand").evaluate((element) => {
    const rect = element.getBoundingClientRect();
    return { width: rect.width, height: rect.height };
  });

  expect(size.width).toBeGreaterThanOrEqual(44);
  expect(size.height).toBeGreaterThanOrEqual(44);
});

test("les cartes Ressources restent lisibles et actionnables à 390 px", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const cards = page.locator(".resource-card");
  await expect(cards).toHaveCount(4);

  for (const card of await cards.all()) {
    const layout = await card.evaluate((element) => {
      const cardBounds = element.getBoundingClientRect();
      const actionBounds = [...element.querySelectorAll("a")].map((link) => {
        const rect = link.getBoundingClientRect();
        return { top: rect.top, bottom: rect.bottom, height: rect.height };
      });
      return {
        left: cardBounds.left,
        right: cardBounds.right,
        bottom: cardBounds.bottom,
        scrollHeight: element.scrollHeight,
        clientHeight: element.clientHeight,
        actionBounds,
      };
    });

    expect(layout.left).toBeGreaterThanOrEqual(0);
    expect(layout.right).toBeLessThanOrEqual(390);
    expect(layout.scrollHeight).toBeLessThanOrEqual(layout.clientHeight);
    for (const action of layout.actionBounds) {
      expect(action.height).toBeGreaterThanOrEqual(44);
      expect(action.bottom).toBeLessThanOrEqual(layout.bottom);
    }
  }
});

test("les contours de focus restent visibles sur surfaces claires et foncées", async ({ page }) => {
  const focusColor = async (locator) => {
    await page.keyboard.press("Tab");
    await locator.focus();
    const style = await locator.evaluate((element) => ({
      visible: element.matches(":focus-visible"),
      color: getComputedStyle(element).outlineColor,
      style: getComputedStyle(element).outlineStyle,
    }));
    expect(style.visible).toBe(true);
    expect(style.style).toBe("solid");
    return style.color;
  };

  await page.setViewportSize({ width: 1280, height: 900 });
  await page.keyboard.press("Tab");
  const accent = "rgb(185, 210, 255)";
  const navy = "rgb(27, 45, 83)";

  expect(await focusColor(page.locator('nav a[href="#mission"]'))).toBe(accent);
  expect(await focusColor(page.locator(".header-cta"))).toBe(navy);
  expect(await focusColor(page.locator(".event-signup"))).toBe(accent);
  expect(await focusColor(page.locator(".coordination a"))).toBe(navy);
  expect(await focusColor(page.locator(".resource-card.featured > a"))).toBe(accent);
  expect(await focusColor(page.locator(".resource-card.social-card a").first())).toBe(navy);
  expect(await focusColor(page.locator(".job-row").first())).toBe(navy);

  await page.locator(".job-row").first().click();
  expect(await focusColor(page.locator(".job-dialog-header button"))).toBe(navy);
  await page.locator(".job-dialog-header button").click();

  expect(await focusColor(page.locator(".contact-mail"))).toBe(accent);
  expect(await focusColor(page.locator("footer .footer-links a").first())).toBe(accent);
  expect(await focusColor(page.locator(".archive-wrap summary").first())).toBe(accent);

  await page.setViewportSize({ width: 390, height: 844 });
  await page.reload();
  const mobileMenu = page.locator("details.mobile-nav summary");
  await page.keyboard.press("Tab"); // skip link
  await page.keyboard.press("Tab"); // brand
  await page.keyboard.press("Tab"); // mobile navigation trigger
  const mobileFocus = await mobileMenu.evaluate((element) => ({
    visible: element.matches(":focus-visible"),
    color: getComputedStyle(element).outlineColor,
    style: getComputedStyle(element).outlineStyle,
  }));
  expect(mobileFocus.visible).toBe(true);
  expect(mobileFocus.style).toBe("solid");
  expect(mobileFocus.color).toBe(accent);
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

test("le logo de La Médicale ouvre le site du partenaire", async ({ page }) => {
  const partnerLink = page.locator("footer .footer-partner a");

  await expect(partnerLink).toHaveAttribute("href", "https://www.lamedicale.fr/");
  await expect(partnerLink).toHaveAttribute("target", "_blank");
  await expect(partnerLink).toHaveAttribute("rel", "noopener noreferrer");
  await expect(partnerLink).toHaveAccessibleName("Visiter le site de La Médicale par Generali");
});

test("les archives restent utilisables au clavier", async ({ page }) => {
  const archive = page.locator("details").filter({ hasText: "2025 — 2026" }).first();
  const summary = archive.locator("summary");

  await summary.focus();
  await page.keyboard.press("Enter");
  await expect(archive).toHaveAttribute("open", "");

  await page.keyboard.press("Space");
  await expect(archive).not.toHaveAttribute("open", "");
});

test("ne crée pas de débordement horizontal sur un petit écran", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 568 });

  const dimensions = await page.evaluate(() => ({
    documentWidth: document.documentElement.scrollWidth,
    viewportWidth: window.innerWidth,
  }));

  expect(dimensions.documentWidth).toBeLessThanOrEqual(dimensions.viewportWidth);
});

test("reste sans débordement aux principaux formats desktop et mobile", async ({ page }) => {
  for (const viewport of [
    { width: 1440, height: 900 },
    { width: 1440, height: 720 },
    { width: 1440, height: 768 },
    { width: 1280, height: 800 },
    { width: 900, height: 900 },
    { width: 390, height: 844 },
    { width: 320, height: 568 },
  ]) {
    await page.setViewportSize(viewport);
    const dimensions = await page.evaluate(() => ({
      documentWidth: document.documentElement.scrollWidth,
      viewportWidth: window.innerWidth,
    }));

    expect(dimensions.documentWidth, `viewport ${viewport.width}x${viewport.height}`).toBeLessThanOrEqual(dimensions.viewportWidth);
  }
});

test("le hero s’adapte aux hauteurs desktop sans couper son contenu", async ({ page }) => {
  for (const viewport of [
    { width: 1440, height: 720 },
    { width: 1440, height: 768 },
    { width: 1440, height: 900 },
    { width: 1280, height: 800 },
    { width: 900, height: 900 },
  ]) {
    await page.setViewportSize(viewport);
    const layout = await page.locator(".hero").evaluate((hero) => {
      const bounds = (element) => {
        const rect = element.getBoundingClientRect();
        return { top: rect.top, right: rect.right, bottom: rect.bottom, left: rect.left, height: rect.height };
      };
      return {
        hero: bounds(hero),
        copy: bounds(hero.querySelector(".hero-copy")),
        mark: bounds(hero.querySelector(".hero-mark")),
        stats: bounds(hero.querySelector(".hero-stats")),
      };
    });

    expect(layout.hero.height, `hero at ${viewport.width}x${viewport.height}`).toBeGreaterThanOrEqual(viewport.height);
    if (viewport.width === 1440 && viewport.height === 720) {
      expect(layout.hero.height).toBeLessThan(960);
    }
    for (const child of [layout.copy, layout.mark, layout.stats]) {
      expect(child.top).toBeGreaterThanOrEqual(layout.hero.top);
      expect(child.bottom).toBeLessThanOrEqual(layout.hero.bottom);
    }
    const overlaps = (first, second) => first.left < second.right && first.right > second.left && first.top < second.bottom && first.bottom > second.top;
    expect(overlaps(layout.copy, layout.mark)).toBe(false);
    expect(overlaps(layout.copy, layout.stats)).toBe(false);
    expect(overlaps(layout.mark, layout.stats)).toBe(false);
    if (viewport.width > 900) expect(layout.copy.right).toBeLessThanOrEqual(layout.mark.left);
    expect(layout.stats.top).toBeGreaterThanOrEqual(Math.max(layout.copy.bottom, layout.mark.bottom));
  }
});

test("respecte la préférence de réduction des animations", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.reload();

  const motion = await page.evaluate(() => ({
    scrollBehavior: getComputedStyle(document.documentElement).scrollBehavior,
    heroAnimation: getComputedStyle(document.querySelector(".hero-logo")).animationName,
  }));
  expect(motion.scrollBehavior).toBe("auto");
  expect(motion.heroAnimation).toBe("none");

  await page.locator("details.mobile-nav summary").click();
  const menuTransform = await page.locator(".mobile-nav-icon").evaluate((element) => getComputedStyle(element).transform);
  expect(menuTransform).toBe("none");

  const resourceLink = page.locator(".resource-card.featured > a");
  await resourceLink.hover();
  const arrowTransform = await resourceLink.locator(".link-arrow").evaluate((element) => getComputedStyle(element).transform);
  expect(arrowTransform).toBe("none");

  for (const link of [page.locator(".header-cta"), page.locator(".event-signup"), page.locator(".coordination a")]) {
    await link.hover();
    expect(await link.locator(".link-arrow").evaluate((element) => getComputedStyle(element).transform)).toBe("none");
  }

  const archive = page.locator("details").filter({ hasText: "2025 — 2026" }).first();
  await archive.locator("summary").click();
  const archiveTransform = await archive.locator(".plus").evaluate((element) => getComputedStyle(element).transform);
  expect(archiveTransform).toBe("none");

  const contact = page.locator(".contact-mail");
  await contact.hover();
  const contactTransform = await contact.evaluate((element) => getComputedStyle(element).transform);
  expect(contactTransform).toBe("none");

  await page.locator("#postes-hospitaliers .job-row").first().click();
  const panelAnimation = await page.locator(".job-dialog-shell").evaluate((element) => getComputedStyle(element).animationName);
  expect(panelAnimation).toBe("none");
});

test("la carte Contact se soulève à la souris mais reste stable au focus clavier", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  const contact = page.locator(".contact-mail");

  await page.keyboard.press("Tab");
  await contact.focus();
  const focusState = await contact.evaluate((element) => ({
    isFocusVisible: element.matches(":focus-visible"),
    transform: getComputedStyle(element).transform,
    outlineStyle: getComputedStyle(element).outlineStyle,
  }));

  expect(focusState.isFocusVisible).toBe(true);
  expect(focusState.transform).toBe("none");
  expect(focusState.outlineStyle).toBe("solid");

  await page.keyboard.press("Tab");
  await contact.hover();
  const hoverTransform = await contact.evaluate((element) => getComputedStyle(element).transform);
  expect(hoverTransform).not.toBe("none");
});

test("conserve la palette de marque en mode sombre du système", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await page.reload();

  const appearance = await page.evaluate(() => {
    const getBackground = (selector) => getComputedStyle(document.querySelector(selector)).backgroundColor;

    return {
      colorScheme: getComputedStyle(document.documentElement).colorScheme,
      documentWidth: document.documentElement.scrollWidth,
      viewportWidth: window.innerWidth,
      missionBackground: getBackground(".mission-section"),
      eventsBackground: getBackground(".events-section"),
      jobsBackground: getBackground(".jobs-section"),
      boardBackground: getBackground(".board-section"),
      resourcesBackground: getBackground(".resources-section"),
      contactBackground: getBackground(".contact-section"),
      contactCardColor: getComputedStyle(document.querySelector(".contact-mail")).color,
      contactArrowBackground: getComputedStyle(document.querySelector(".contact-mail-arrow")).backgroundColor,
    };
  });

  expect(appearance.colorScheme).toContain("light");
  expect(appearance.documentWidth).toBeLessThanOrEqual(appearance.viewportWidth);
  expect(appearance.missionBackground).toBe("rgb(246, 247, 248)");
  expect(appearance.eventsBackground).toBe("rgb(12, 25, 51)");
  expect(appearance.jobsBackground).toBe("rgb(246, 247, 248)");
  expect(appearance.boardBackground).toBe("rgb(232, 238, 247)");
  expect(appearance.resourcesBackground).toBe("rgb(12, 25, 51)");
  expect(appearance.contactBackground).toBe("rgb(12, 25, 51)");
  expect(appearance.contactCardColor).toBe("rgb(247, 249, 252)");
  expect(appearance.contactArrowBackground).toBe("rgb(185, 210, 255)");
});

test("conserve une archive ouverte après rechargement", async ({ page }) => {
  const archive = page.locator("details").filter({ hasText: "2025 — 2026" }).first();
  await archive.locator("summary").click();
  await expect.poll(() => page.evaluate(() => sessionStorage.getItem("apir-open-archive-years"))).toBe(JSON.stringify(["2025 — 2026"]));
  await page.reload();

  await expect(page.locator("details").filter({ hasText: "2025 — 2026" }).first()).toHaveAttribute("open", "");
});

test("permet de garder plusieurs années d’archives ouvertes", async ({ page }) => {
  const archives = page.locator(".archive-wrap details");
  await archives.nth(0).locator("summary").click();
  await archives.nth(1).locator("summary").click();

  await expect(archives.nth(0)).toHaveAttribute("open", "");
  await expect(archives.nth(1)).toHaveAttribute("open", "");
  await page.reload();
  await expect(page.locator(".archive-wrap details").nth(0)).toHaveAttribute("open", "");
  await expect(page.locator(".archive-wrap details").nth(1)).toHaveAttribute("open", "");
});
