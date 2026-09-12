// Vérifie les garanties SEO, accessibilité et contenu du HTML exporté.
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { createRequire } from "node:module";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { associationEmails } from "./helpers/association-emails.mjs";

const require = createRequire(import.meta.url);
const siteConfig = require("../site.config.json");
const outputDirectory = new URL("../out/", import.meta.url);
const projectRoot = fileURLToPath(new URL("../", import.meta.url));
const helloAssoAdhesionUrl = siteConfig.helloAssoUrl;
const laMedicaleUrl = siteConfig.partners.laMedicale;

async function listFilesRecursively(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const files = await Promise.all(entries.map(async (entry) => {
    const entryPath = path.join(directory, entry.name);
    return entry.isDirectory() ? listFilesRecursively(entryPath) : [entryPath];
  }));

  return files.flat();
}

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
  assert.match(html, new RegExp(`class=["'][^"']*footer-partner[\\s\\S]*?href=["']${laMedicaleUrl.replace(/[.*+?^${}()|[\\]\\\\]/g, "\\\\$&")}(["'])`, "i"));
  assert.match(html, /target=["']_blank["'][^>]*rel=["']noopener noreferrer["']/i);
  assert.doesNotMatch(html, /codex-preview|chatgpt\.site|apir-radio\.notion\.site/i);
  assert.match(robots, /User-Agent:\s*\*/i);
  assert.match(robots, /Sitemap:\s*https:\/\/www\.apir-radio\.fr\/sitemap\.xml/i);
  assert.match(sitemap, /<loc>https:\/\/www\.apir-radio\.fr<\/loc>/i);
  assert.doesNotMatch(sitemap, /\/adhesion\/?<\/loc>/i);
});

test("keeps public content and hides association e-mails from static HTML", async () => {
  const html = await readOutput("index.html");

  assert.match(html, /class=["'][^"']*header-contact[^"']*["'][^>]*>Nous contacter/i);
  assert.match(html, /class=["'][^"']*contact-mail[^"']*["'][^>]*>.*Écrire à l’APIR/is);
  assert.doesNotMatch(html, /apir\.radiologie@gmail\.com/i);
  assert.match(html, /class=["'][^"']*skip-link[^"']*["'][^>]*href=["']#main-content["'][^>]*>Aller au contenu/i);
  assert.match(html, /<main[^>]*id=["']main-content["'][^>]*tabindex=["']-1["']/i);
  assert.match(html, /<h2[^>]*id=["']jobs-heading["'][^>]*>Offres hospitalières/i);
  assert.match(html, /<section(?=[^>]*\bid=["']postes-hospitaliers["'])(?=[^>]*\baria-labelledby=["']jobs-heading["'])(?=[^>]*\bdata-nosnippet)[^>]*>/i);
  assert.match(html, /JavaScript est désactivé.*annonces sont affichées directement/i);
  assert.match(html, /class=["'][^"']*contact-section[^"']*["'][^>]*id=["']contact["'][^>]*>.*Contactez le bureau<\/h2>/is);
  assert.match(html, /<h1>L’APIR, par et pour les <em>internes en radiologie<\/em><\/h1>/i);
  assert.match(html, /<h2>Des soirées de formation pour tous les semestres<\/h2>/i);
  assert.match(html, /<h2>Les informations utiles pendant l’internat<\/h2>/i);
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
  assert.match(html, /<h2>Rendez-vous en\s*(?:<!-- -->)?\s*septembre<\/h2>/i);
  assert.match(html, /Mercredi 16 septembre[\s\S]*?19h30/i);
  assert.match(html, /Hôpital Paris Saint Joseph/i);
  assert.match(html, /Imagerie neurologique[\s\S]*?avec[\s\S]*?Giacomo Lucchi[\s\S]*?Hôpital Bicêtre[\s\S]*?S’inscrire à la soirée/i);
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

test("keeps the event heading month data-driven", async () => {
  const pageSource = await fs.readFile(new URL("../app/page.tsx", import.meta.url), "utf8");

  assert.match(pageSource, /getFrenchEventMonth\(upcomingEvent\.date\)/);
  assert.match(pageSource, /Rendez-vous en \{upcomingEventMonth\}/);
  assert.doesNotMatch(pageSource, /Rendez-vous en septembre/i);
  assert.match(pageSource, /On se retrouve<br \/>à la rentrée\./);
});

test("keeps one complete quality pipeline on pushes to main", async () => {
  const ciWorkflow = await fs.readFile(new URL("../.github/workflows/ci.yml", import.meta.url), "utf8");
  const pagesWorkflow = await fs.readFile(new URL("../.github/workflows/pages.yml", import.meta.url), "utf8");
  const healthWorkflow = await fs.readFile(new URL("../.github/workflows/health.yml", import.meta.url), "utf8");

  assert.match(ciWorkflow, /\bpull_request:/);
  assert.match(ciWorkflow, /\bworkflow_dispatch:/);
  assert.doesNotMatch(ciWorkflow, /^\s{2}push:\s*\n\s{4}branches:\s*\[main\]/m);
  assert.match(pagesWorkflow, /^\s{2}push:\s*\n\s{4}branches:\s*\[main\]/m);

  for (const requiredCheck of [
    "npm run content:check",
    "npm run test:content",
    "npx tsc --noEmit --incremental false",
    "npm run lint",
    "npm audit --omit=dev --audit-level=high",
    "npm run build:pages",
    "node --test tests/rendered-html.test.mjs",
    "npm run anchors:check",
    "npm run test:ui",
    "actions/deploy-pages@",
  ]) {
    assert.ok(pagesWorkflow.includes(requiredCheck), `pages.yml must retain ${requiredCheck}`);
  }

  assert.match(healthWorkflow, /cron: ["']17 6 \* \* \*["']/);
  assert.match(healthWorkflow, /timezone: ["']Europe\/Paris["']/);
  assert.match(healthWorkflow, /npm run content:freshness/);
  assert.match(healthWorkflow, /if: \$\{\{ !cancelled\(\) && steps\.checkout\.outcome == 'success' && steps\.node\.outcome == 'success' \}\}/);
  assert.match(pagesWorkflow, /playwright install --with-deps chromium webkit/);
  assert.match(ciWorkflow, /playwright install --with-deps chromium webkit/);
});

test("keeps the association e-mail strings out of tracked sources and public build files", async () => {
  const trackedPaths = execFileSync("git", ["ls-files", "-z"], { cwd: projectRoot, encoding: "utf8" }).split("\0").filter(Boolean);
  const trackedFiles = (await Promise.all(trackedPaths.map(async (filePath) => {
    const details = await fs.stat(path.join(projectRoot, filePath));
    return details.isFile() ? filePath : null;
  }))).filter(Boolean);
  const publicFiles = await listFilesRecursively(fileURLToPath(outputDirectory));
  const emailBytes = Object.fromEntries(
    Object.entries(associationEmails).map(([relativePath, email]) => [relativePath, Buffer.from(email, "utf8")]),
  );

  for (const filePath of trackedFiles) {
    const source = await fs.readFile(path.join(projectRoot, filePath));
    for (const [relativePath, email] of Object.entries(emailBytes)) {
      assert.equal(source.includes(email), false, `${filePath} contains the clear ${relativePath} address`);
    }
  }

  for (const filePath of publicFiles) {
    const asset = await fs.readFile(filePath);
    for (const [relativePath, email] of Object.entries(emailBytes)) {
      assert.equal(asset.includes(email), false, `${path.relative(fileURLToPath(outputDirectory), filePath)} contains the clear ${relativePath} address`);
    }
  }
});
