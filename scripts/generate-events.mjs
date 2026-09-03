import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { assertHttpsUrl } from "./content-utils.mjs";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourcePath = path.join(projectRoot, "content", "events.md");
const outputPath = path.join(projectRoot, "app", "events.generated.ts");
const checkMode = process.argv.includes("--check");
const source = fs.readFileSync(sourcePath, "utf8");
const seasons = [];
const seenYears = new Set();
let currentSeason = null;
let upcomingEvent = null;
let parsingUpcoming = false;

const upcomingLabels = new Map([
  ["Date", "date"],
  ["Thème", "specialty"],
  ["Intervenant", "speaker"],
  ["Établissement de l’intervenant", "speakerHospital"],
  ["Lieu", "venue"],
  ["Inscriptions", "registrationUrl"],
]);

for (const rawLine of source.split(/\r?\n/)) {
  const line = rawLine.trim();
  if (!line) continue;

  if (line === "## À venir") {
    if (upcomingEvent) {
      throw new Error("Section « À venir » dupliquée dans content/events.md.");
    }
    upcomingEvent = {};
    parsingUpcoming = true;
    currentSeason = null;
    continue;
  }

  if (line.startsWith("## ")) {
    parsingUpcoming = false;
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

  if (parsingUpcoming) {
    const value = line.slice(2).trim();
    const separatorIndex = value.indexOf(" : ");
    if (separatorIndex < 1) {
      throw new Error("Événement à venir invalide dans content/events.md : format attendu « Champ : valeur ».");
    }
    const label = value.slice(0, separatorIndex);
    const field = upcomingLabels.get(label);
    if (!field) {
      throw new Error("Champ inconnu pour l’événement à venir dans content/events.md : " + label + ".");
    }
    if (upcomingEvent[field]) {
      throw new Error("Champ dupliqué pour l’événement à venir dans content/events.md : " + label + ".");
    }
    upcomingEvent[field] = value.slice(separatorIndex + 3).trim();
    continue;
  }

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

const upcomingFields = ["date", "specialty", "speaker", "speakerHospital", "venue", "registrationUrl"];
if (upcomingEvent) {
  const missing = upcomingFields.filter((field) => !upcomingEvent[field]);
  if (missing.length > 0) {
    throw new Error("Événement à venir incomplet dans content/events.md : " + missing.join(", ") + ".");
  }
  assertHttpsUrl(upcomingEvent.registrationUrl, "Lien d’inscription invalide dans content/events.md");
}

const generated = [
  "// This file is generated from content/events.md. Do not edit it directly.",
  "export type ArchiveEvent = { month: string; specialty: string; speaker: string; hospital: string; label: string };",
  "",
  "export type ArchiveSeason = { year: string; events: ArchiveEvent[] };",
  "",
  "export type UpcomingEvent = { date: string; specialty: string; speaker: string; speakerHospital: string; venue: string; registrationUrl: string };",
  "",
  "export const upcomingEvent: UpcomingEvent | null = " + JSON.stringify(upcomingEvent, null, 2) + ";",
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
