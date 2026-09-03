import { createRequire } from "node:module";
import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { collectExternalLinks, listHtmlFiles } from "./html-utils.mjs";

const require = createRequire(import.meta.url);
const siteConfig = require("../site.config.json");
const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputDirectory = path.resolve(projectRoot, process.argv[2] || "out");
const timeoutMs = positiveInteger(process.env.LINK_CHECK_TIMEOUT_MS, 10_000);
const maxAttempts = positiveInteger(process.env.LINK_CHECK_ATTEMPTS, 3);
const retryDelayMs = positiveInteger(process.env.LINK_CHECK_RETRY_DELAY_MS, 300);
const concurrency = positiveInteger(process.env.LINK_CHECK_CONCURRENCY, 4);
const userAgent = `APIR-site-link-check/1.0 (+${siteConfig.siteUrl})`;
const retryableStatuses = new Set([408, 425, 429, 500, 502, 503, 504]);

function positiveInteger(value, fallback) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

function wait(delay) {
  return new Promise((resolve) => setTimeout(resolve, delay));
}

async function request(url, method) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      method,
      headers: { "user-agent": userAgent },
      redirect: "follow",
      signal: controller.signal,
    });
    return { status: response.status, finalUrl: response.url };
  } finally {
    clearTimeout(timeout);
  }
}

async function requestWithRetry(url, method) {
  let lastError;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      const result = await request(url, method);
      if (attempt === maxAttempts || !retryableStatuses.has(result.status)) return result;
      lastError = new Error(`HTTP ${result.status}`);
    } catch (error) {
      lastError = error;
      if (attempt === maxAttempts) throw error;
    }
    await wait(retryDelayMs * attempt);
  }

  throw lastError;
}

async function checkLink(url) {
  let headResult;
  try {
    headResult = await requestWithRetry(url, "HEAD");
    if (headResult.status < 400) return { state: "ok", ...headResult };
  } catch (error) {
    headResult = { error };
  }

  try {
    const getResult = await requestWithRetry(url, "GET");
    if (getResult.status < 400) return { state: "ok", ...getResult };
    if (getResult.status === 403 || getResult.status === 429) {
      return { state: "warning", ...getResult };
    }
    return { state: "broken", ...getResult };
  } catch (error) {
    if (headResult?.status === 403 || headResult?.status === 429) {
      return { state: "warning", status: headResult.status };
    }
    return { state: "broken", error };
  }
}

async function mapWithConcurrency(items, limit, mapper) {
  const results = new Array(items.length);
  let nextIndex = 0;
  const workerCount = Math.min(limit, items.length);

  await Promise.all(Array.from({ length: workerCount }, async () => {
    while (nextIndex < items.length) {
      const index = nextIndex;
      nextIndex += 1;
      results[index] = await mapper(items[index]);
    }
  }));

  return results;
}

let htmlFiles;
try {
  htmlFiles = await listHtmlFiles(outputDirectory);
} catch (error) {
  console.error(`Impossible de lire ${outputDirectory}. Lancez d'abord npm run build:pages.`);
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
  process.exit();
}

const linksByUrl = new Map();
for (const filePath of htmlFiles) {
  const html = await fs.readFile(filePath, "utf8");
  for (const link of collectExternalLinks(html, filePath)) {
    const locations = linksByUrl.get(link.url) || new Set();
    locations.add(path.relative(projectRoot, link.filePath));
    linksByUrl.set(link.url, locations);
  }
}

const urls = [...linksByUrl.keys()].sort();
console.log(`Vérification de ${urls.length} lien(s) externe(s) dans ${htmlFiles.length} page(s) HTML…`);
const results = await mapWithConcurrency(urls, concurrency, async (url) => ({ url, ...(await checkLink(url)) }));
const broken = results.filter((result) => result.state === "broken");
const warnings = results.filter((result) => result.state === "warning");

for (const result of warnings) {
  const location = [...linksByUrl.get(result.url)].join(", ");
  console.warn(`⚠️  Non vérifiable (${result.status}) : ${result.url} (${location})`);
}
for (const result of broken) {
  const location = [...linksByUrl.get(result.url)].join(", ");
  const reason = result.status ? `HTTP ${result.status}` : result.error?.message || "erreur réseau";
  console.error(`❌ ${result.url} — ${reason} (${location})`);
}

if (broken.length > 0) {
  console.error(`${broken.length} lien(s) externe(s) cassé(s) détecté(s).`);
  process.exitCode = 1;
} else {
  console.log(`Aucun lien externe cassé détecté${warnings.length ? ` (${warnings.length} non vérifiable(s))` : ""}.`);
}
