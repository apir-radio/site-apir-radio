import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourcePath = path.join(projectRoot, "content", "events.md");
const outputPath = path.join(projectRoot, "app", "events.generated.ts");
const checkMode = process.argv.includes("--check");
const source = fs.readFileSync(sourcePath, "utf8");
const seasons = [];
const seenYears = new Set();
let currentSeason = null;

for (const rawLine of source.split(/\r?\n/)) {
  const line = rawLine.trim();
  if (!line) continue;

  if (line.startsWith("## ")) {
    const year = line.slice(3).trim();
    if (seenYears.has(year)) {
      throw new Error("Saison dupliquée dans content/events.md : " + year + ".");
    }
    seenYears.add(year);
    currentSeason = { year, events: [] };
    seasons.push(currentSeason);
    continue;
  }

  if (!line.startsWith("- ")) continue;
  if (!currentSeason) {
    throw new Error("Événement invalide dans content/events.md : saison manquante.");
  }

  const value = line.slice(2).trim();
  const match = value.match(/^(.+?)\s+·\s+(.+?)\s+—\s+(.+?),\s+(.+)$/);
  if (!match) {
    throw new Error("Événement invalide dans content/events.md : format attendu « Mois · Thème — Intervenant, Lieu ».");
  }

  const [, month, specialty, speaker, hospital] = match;
  if (currentSeason.events.some((event) => event.label === value)) {
    throw new Error("Événement dupliqué dans content/events.md : " + value + ".");
  }
  currentSeason.events.push({ month, specialty, speaker, hospital, label: value });
}

if (seasons.length === 0 || seasons.some((season) => season.events.length === 0)) {
  throw new Error("Le catalogue des soirées doit contenir au moins un événement par saison.");
}

const generated = [
  "// This file is generated from content/events.md. Do not edit it directly.",
  "export type ArchiveEvent = { month: string; specialty: string; speaker: string; hospital: string; label: string };",
  "",
  "export type ArchiveSeason = { year: string; events: ArchiveEvent[] };",
  "",
  "export const archiveEvents: ArchiveSeason[] = " + JSON.stringify(seasons, null, 2) + ";",
  "",
].join("\n");

if (checkMode) {
  const current = fs.readFileSync(outputPath, "utf8");
  if (current !== generated) {
    throw new Error("app/events.generated.ts ne correspond pas à content/events.md. Lancez npm run content:generate.");
  }
  console.log("Checked " + seasons.reduce((total, season) => total + season.events.length, 0) + " archived events in app/events.generated.ts");
} else {
  fs.writeFileSync(outputPath, generated, "utf8");
  console.log("Generated " + seasons.reduce((total, season) => total + season.events.length, 0) + " archived events in app/events.generated.ts");
}
