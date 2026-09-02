import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputDirectory = path.resolve(projectRoot, process.argv[2] || "out");
const timeoutMs = Number(process.env.LINK_CHECK_TIMEOUT_MS || 10_000);
const userAgent = "APIR-site-link-check/1.0 (+https://www.apir-radio.fr)";

async function listHtmlFiles(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await listHtmlFiles(entryPath)));
    } else if (entry.isFile() && entry.name.endsWith(".html")) {
      files.push(entryPath);
    }
  }

  return files;
}

function collectExternalLinks(html, filePath) {
  const links = [];
  const attributePattern = /\b(?:href|src)\s*=\s*["']([^"']+)["']/gi;
  let match;

  while ((match = attributePattern.exec(html))) {
    const value = match[1].trim();
    if (!/^https?:\/\//i.test(value)) continue;

    try {
      const url = new URL(value);
      url.hash = "";
      links.push({ url: url.toString(), filePath });
    } catch {
      console.warn(`URL ignorée dans ${path.relative(projectRoot, filePath)} : ${value}`);
    }
  }

  return links;
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

async function checkLink(url) {
  let headResult;
  try {
    headResult = await request(url, "HEAD");
    if (headResult.status < 400) return { state: "ok", ...headResult };
  } catch (error) {
    headResult = { error };
  }

  try {
    const getResult = await request(url, "GET");
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

const results = await Promise.all(urls.map(async (url) => ({ url, ...(await checkLink(url)) })));
const broken = results.filter((result) => result.state === "broken");
const warnings = results.filter((result) => result.state === "warning");

for (const result of warnings) {
  console.warn(`⚠️  Non vérifiable (${result.status}) : ${result.url}`);
}
for (const result of broken) {
  const location = [...linksByUrl.get(result.url)].join(", ");
  const reason = result.status ? `HTTP ${result.status}` : result.error?.message || "erreur réseau";
  console.error(`❌ ${result.url} — ${reason} (${location})`);
}

if (broken.length > 0) {
  console.error(`${broken.length} lien(s) cassé(s) détecté(s).`);
  process.exitCode = 1;
} else {
  console.log(`Aucun lien cassé détecté${warnings.length ? ` (${warnings.length} non vérifiable(s))` : ""}.`);
}
