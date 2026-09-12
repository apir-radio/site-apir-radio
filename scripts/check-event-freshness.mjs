import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { getParisCalendarDate, isFrenchEventDatePast, parseFrenchEventDate } from "../app/event-date.mjs";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const eventsPath = path.join(projectRoot, "content", "events.md");
const source = await fs.readFile(eventsPath, "utf8");
let hasUpcomingSection = false;
let isParsingUpcoming = false;
let upcomingDate = null;

for (const rawLine of source.split(/\r?\n/)) {
  const line = rawLine.trim();

  if (line === "## À venir") {
    if (hasUpcomingSection) {
      throw new Error("Section « À venir » dupliquée dans content/events.md.");
    }
    hasUpcomingSection = true;
    isParsingUpcoming = true;
    continue;
  }
  if (line.startsWith("## ")) {
    isParsingUpcoming = false;
    continue;
  }
  if (!isParsingUpcoming || !line.startsWith("- Date :")) continue;
  if (upcomingDate !== null) {
    throw new Error("Champ « Date » dupliqué pour l’événement à venir dans content/events.md.");
  }
  upcomingDate = line.slice("- Date :".length).trim();
}

if (!hasUpcomingSection) {
  console.log("Aucune soirée « À venir » renseignée ; rien à contrôler.");
} else if (!upcomingDate) {
  throw new Error("Champ « Date » manquant dans la section « À venir » de content/events.md.");
} else {
  const today = getParisCalendarDate();
  const event = parseFrenchEventDate(upcomingDate);

  if (isFrenchEventDatePast(upcomingDate, today)) {
    throw new Error(`La soirée du ${event.day} ${event.month} ${event.year} est passée mais figure toujours dans « À venir ». Archivez-la dans content/events.md et renseignez la prochaine soirée si elle est connue.`);
  }

  console.log(`La soirée du ${event.day} ${event.month} ${event.year} est à venir (date de référence : ${today}, Europe/Paris).`);
}
