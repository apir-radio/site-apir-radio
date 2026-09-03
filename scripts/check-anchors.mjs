// Contrôle les ancres internes présentes dans l’export HTML.
import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { collectIds, collectInternalAnchors, listHtmlFiles } from "./html-utils.mjs";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outputDirectory = path.resolve(projectRoot, process.argv[2] || "out");

let htmlFiles;
try {
  htmlFiles = await listHtmlFiles(outputDirectory);
} catch (error) {
  console.error(`Impossible de lire ${outputDirectory}. Lancez d'abord npm run build:pages.`);
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
  process.exit();
}

const anchorsByFile = new Map();
const internalAnchors = [];
for (const filePath of htmlFiles) {
  const html = await fs.readFile(filePath, "utf8");
  anchorsByFile.set(filePath, collectIds(html));
  internalAnchors.push(...collectInternalAnchors(html, filePath));
}

const brokenAnchors = internalAnchors.filter(({ anchor, filePath, malformed }) => {
  return malformed || !anchorsByFile.get(filePath)?.has(anchor);
});

console.log(`Vérification de ${internalAnchors.length} ancre(s) dans ${htmlFiles.length} page(s) HTML…`);
for (const { anchor, filePath, malformed } of brokenAnchors) {
  const reason = malformed ? "encodage invalide" : "ancre introuvable";
  console.error(`❌ #${anchor} — ${reason} (${path.relative(projectRoot, filePath)})`);
}

if (brokenAnchors.length > 0) {
  console.error(`${brokenAnchors.length} ancre(s) cassée(s) détectée(s).`);
  process.exitCode = 1;
} else {
  console.log("Aucune ancre interne cassée détectée.");
}
