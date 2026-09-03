// Fonctions partagées pour inspecter les fichiers HTML générés.
import fs from "node:fs/promises";
import path from "node:path";

export async function listHtmlFiles(directory) {
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

  return files.sort();
}

export function collectInternalAnchors(html, filePath) {
  const links = [];
  const attributePattern = /\bhref\s*=\s*["']([^"']+)["']/gi;
  let match;

  while ((match = attributePattern.exec(html))) {
    const value = match[1].trim();
    if (!value.startsWith("#") || value === "#") continue;
    try {
      links.push({ anchor: decodeURIComponent(value.slice(1)), filePath });
    } catch {
      links.push({ anchor: value.slice(1), filePath, malformed: true });
    }
  }

  return links;
}

export function collectIds(html) {
  return new Set([...html.matchAll(/\bid\s*=\s*["']([^"']+)["']/gi)].map((match) => match[1]));
}
