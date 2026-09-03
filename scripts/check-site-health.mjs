import { createRequire } from "node:module";
import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const siteConfig = require("../site.config.json");
const baseUrl = process.argv[2] || siteConfig.siteUrl;
const expectedDomain = siteConfig.domain;
const expectedHttpsOrigin = `https://${expectedDomain}`;
const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const timeoutMs = Number(process.env.SITE_HEALTH_TIMEOUT_MS || 15_000);
const userAgent = `APIR-site-health-check/1.0 (+${siteConfig.siteUrl})`;
const base = new URL(baseUrl);
const resources = [
  { path: "/", expectedText: "APIR", ...(base.hostname === expectedDomain && base.protocol === "https:" ? { expectedUrl: `${expectedHttpsOrigin}/` } : {}) },
  { path: "/robots.txt" },
  { path: "/sitemap.xml" },
  { path: "/apir-logo.webp" },
];

async function checkResource(resource) {
  const url = new URL(resource.path, baseUrl).toString();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      headers: { "user-agent": userAgent },
      redirect: "follow",
      signal: controller.signal,
    });
    const body = resource.expectedText ? await response.text() : null;
    if (response.status >= 400) {
      return { url, state: "broken", reason: `HTTP ${response.status}` };
    }
    if (resource.expectedText && !body?.includes(resource.expectedText)) {
      return { url, state: "broken", reason: `texte attendu absent : ${resource.expectedText}` };
    }
    if (resource.expectedUrl && new URL(response.url).toString() !== resource.expectedUrl) {
      return { url, state: "broken", reason: `destination finale inattendue : ${response.url}` };
    }
    return { url, state: "ok", status: response.status };
  } catch (error) {
    return { url, state: "broken", reason: error instanceof Error ? error.message : String(error) };
  } finally {
    clearTimeout(timeout);
  }
}

const results = [];
const configuredDomain = (await fs.readFile(path.join(projectRoot, "public", "CNAME"), "utf8")).trim();
if (configuredDomain === expectedDomain) {
  results.push({ url: "public/CNAME", state: "ok", status: "configured" });
} else {
  results.push({ url: "public/CNAME", state: "broken", reason: `domaine configuré : ${configuredDomain || "vide"} (attendu : ${expectedDomain})` });
}

if (base.hostname === expectedDomain && base.protocol === "https:") {
  resources.push({
    path: "/",
    expectedUrl: `${expectedHttpsOrigin}/`,
    sourceUrl: `http://${expectedDomain}/`,
  });
}

console.log(`Vérification de disponibilité de ${baseUrl}…`);
results.push(...await Promise.all(resources.map((resource) => resource.sourceUrl ? checkResource({ ...resource, path: resource.sourceUrl }) : checkResource(resource))));
for (const result of results) {
  if (result.state === "ok") {
    console.log(`✅ ${result.url} (${result.status})`);
  } else {
    console.error(`❌ ${result.url} — ${result.reason}`);
  }
}

const failures = results.filter((result) => result.state === "broken");
if (failures.length > 0) {
  console.error(`${failures.length} ressource(s) indisponible(s).`);
  process.exitCode = 1;
} else {
  console.log("Toutes les ressources principales répondent correctement.");
}
