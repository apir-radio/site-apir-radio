// Vérifie les garanties SEO, accessibilité et contenu du HTML exporté.
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import fs from "node:fs/promises";
import test from "node:test";

const require = createRequire(import.meta.url);
const siteConfig = require("../site.config.json");
const outputDirectory = new URL("../out/", import.meta.url);
const helloAssoAdhesionUrl = siteConfig.helloAssoUrl;

async function readOutput(relativePath) {
  return fs.readFile(new URL(relativePath, outputDirectory), "utf8");
}

async function outputExists(relativePath) {
  try {
    await fs.access(new URL(relativePath, outputDirectory));
    return true;
  } catch (error) {
    if (error?.code === "ENOENT") return false;
    throw error;
  }
}

test("publishes the canonical page with useful metadata", async () => {
  const html = await readOutput("index.html");
  const robots = await readOutput("robots.txt");
  const sitemap = await readOutput("sitemap.xml");

  assert.match(html, /<title>APIR — Internes en radiologie d’Île-de-France<\/title>/i);
  assert.match(html, /name=["']description["'][^>]*offres de postes hospitaliers/i);
  assert.match(html, /name=["']keywords["'][^>]*internes en radiologie/i);
  assert.match(html, /property=["']og:title["'][^>]*APIR — Internes en radiologie/i);
  assert.match(html, /name=["']twitter:card["'][^>]*summary/i);
  assert.match(html, /<script type=["']application\/ld\+json["']>[\s\S]*Organization[\s\S]*WebSite/i);
  assert.match(html, /src=["'][^"']*apir-logo\.webp/i);
  assert.match(html, /src=["'][^"']*apir-logo-small\.webp/i);
  assert.match(html, /src=["'][^"']*la-medicale-logo\.webp/i);
  assert.match(html, /target=["']_blank["'][^>]*rel=["']noopener noreferrer["']/i);
  assert.doesNotMatch(html, /codex-preview|chatgpt\.site|apir-radio\.notion\.site/i);
  assert.match(robots, /User-Agent:\s*\*/i);
  assert.match(robots, /Sitemap:\s*https:\/\/www\.apir-radio\.fr\/sitemap\.xml/i);
  assert.match(sitemap, /<loc>https:\/\/www\.apir-radio\.fr<\/loc>/i);
  assert.doesNotMatch(sitemap, /\/adhesion\/?<\/loc>/i);
});

test("keeps the accessible job announcements in the static page", async () => {
  const html = await readOutput("index.html");

  assert.match(html, /href=["']mailto:contact@apir-radio\.fr["'][^>]*>Nous contacter/i);
  assert.match(html, /class=["'][^"']*contact-address[^"']*["'][^>]*>contact@apir-radio\.fr/i);
  assert.doesNotMatch(html, /apir\.radiologie@gmail\.com/i);
  assert.match(html, /class=["'][^"']*skip-link[^"']*["'][^>]*href=["']#main-content["'][^>]*>Aller au contenu/i);
  assert.match(html, /<main[^>]*id=["']main-content["'][^>]*tabindex=["']-1["']/i);
  assert.match(html, /<h3[^>]*id=["']jobs-heading["'][^>]*>Offres hospitalières/i);
  assert.match(html, /id=["']postes-hospitaliers["'][^>]*data-nosnippet/i);
  assert.match(html, /JavaScript est désactivé.*annonces sont affichées directement/i);
  assert.match(html, /class=["'][^"']*contact-section[^"']*["'][^>]*id=["']contact["'][^>]*>.*Contactez le bureau\./is);
  assert.match(html, /class=["'][^"']*mission-section[^"']*["']/i);
  assert.match(html, /class=["'][^"']*board-section[^"']*["']/i);
  assert.match(html, /class=["'][^"']*events-section[^"']*["']/i);
  assert.match(html, /class=["'][^"']*resources-section[^"']*["']/i);
  assert.match(html, /class=["'][^"']*resource-card social-card[^"']*["'][^>]*>.*Suivre la vie de l’association/is);
  assert.doesNotMatch(html, />Parlons radio<\/a>|href=["']\/annonces["']/i);
  assert.match(html, /Radiologue en CDI.*Hôpital Saint-Camille.*Pourquoi nous rejoindre.*S\.Sillou@ch-bry\.org/is);
  assert.equal((html.match(/data-job-id=/g) ?? []).length, 9);
  assert.match(html, /Ambroise-Paré.*marie-france\.bellin@aphp\.fr/is);
  assert.match(html, /Jean-Verdier.*olivier\.seror@aphp\.fr/is);
  assert.match(html, /Necker.*nathalie\.boddaert@aphp\.fr/is);
  assert.match(html, /Cochin A UF1.*marie-pierre\.revel@aphp\.fr/is);
  assert.match(html, /Beaujon.*maxime\.ronot@aphp\.fr/is);
  assert.doesNotMatch(html, /values-strip|Formation<\/span>.*Transmission<\/span>.*Convivialité<\/span>.*Réseau<\/span>/is);
  assert.doesNotMatch(html, /timeline-heading|class=["'][^"']*event-row/i);
  assert.match(html, /Archives des soirées.*2025 — 2026/is);
  assert.match(html, /class=["']archive-count["'][^>]*>6[\s\S]*?soirée/is);
  assert.match(html, /Rendez-vous[\s\S]*?16 septembre 2026[\s\S]*?l’hôpital Saint-Joseph[\s\S]*?\./i);
  assert.match(html, /Imagerie neurologique[\s\S]*?Avec[\s\S]*?Giacomo Lucchi[\s\S]*?Hôpital Bicêtre[\s\S]*?S’inscrire à la soirée/i);
  assert.match(html, /href=["']https:\/\/forms\.gle\/aAKgJAYqwx9rAGbo6["']/i);
  assert.equal((html.match(/href=["']\/adhesion["']/g) ?? []).length, 2);
  assert.doesNotMatch(html, new RegExp(`href=["']${helloAssoAdhesionUrl}`));
});

test("keeps the adhesion shortcut as a noindex redirect", async () => {
  const html = await readOutput("adhesion/index.html");

  assert.match(html, /http-equiv=["']refresh["']/i);
  assert.match(html, /name=["']robots["'][^>]*noindex/i);
  assert.ok(html.includes(helloAssoAdhesionUrl));
  assert.doesNotMatch(html, /window\.location\.replace/);
});

test("does not generate the retired annonces route", async () => {
  assert.equal(await outputExists("annonces/index.html"), false);
});
