import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { assertEmail, assertKnownFields, parseFrontmatter, requireFields } from "./content-utils.mjs";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourcePath = path.join(projectRoot, "content", "board.md");
const outputPath = path.join(projectRoot, "app", "board.generated.ts");
const checkMode = process.argv.includes("--check");
const source = fs.readFileSync(sourcePath, "utf8");
const context = "Bureau invalide dans content/board.md";
const { frontmatter, content: rawContent } = parseFrontmatter(source, context);
assertKnownFields(frontmatter, ["season", "description", "coordinationEmail", "coordinationNames"], context);
requireFields(frontmatter, ["season", "description", "coordinationEmail", "coordinationNames"], context);
assertEmail(frontmatter.coordinationEmail, `${context} : coordinationEmail`);

const members = [];
for (const [lineIndex, rawLine] of rawContent.split(/\r?\n/).entries()) {
  const line = rawLine.trim();
  if (!line) continue;
  if (!line.startsWith("- ")) {
    throw new Error(`Bureau invalide dans content/board.md : ligne ${lineIndex + 1} doit commencer par « - ».`);
  }

  const fields = line.slice(2).split(" · ").map((field) => field.trim());
  if (fields.length !== 3 || fields.some((field) => !field)) {
    throw new Error(`Bureau invalide dans content/board.md : ligne ${lineIndex + 1} doit suivre « Nom · Fonction · Initiales ».`);
  }

  const [name, role, initials] = fields;
  if (!/^[\p{L}]{2,4}$/u.test(initials)) {
    throw new Error(`Bureau invalide dans content/board.md : initiales incorrectes à la ligne ${lineIndex + 1}.`);
  }
  members.push({ name, role, initials });
}

if (members.length === 0) {
  throw new Error("Bureau invalide dans content/board.md : aucun membre trouvé.");
}

const coordinationNames = frontmatter.coordinationNames.split("|").map((name) => name.trim()).filter(Boolean);
if (coordinationNames.length === 0) {
  throw new Error("Bureau invalide dans content/board.md : aucun nom de coordination trouvé.");
}

const generated = [
  "// This file is generated from content/board.md. Do not edit it directly.",
  "export type BoardMember = { name: string; role: string; initials: string };",
  "",
  "export type BoardInfo = { season: string; description: string; members: BoardMember[]; coordinationNames: string[]; coordinationEmail: string };",
  "",
  "export const board: BoardInfo = " + JSON.stringify({
    season: frontmatter.season,
    description: frontmatter.description,
    members,
    coordinationNames,
    coordinationEmail: frontmatter.coordinationEmail,
  }, null, 2) + ";",
  "",
].join("\n");

if (checkMode) {
  const current = fs.readFileSync(outputPath, "utf8");
  if (current !== generated) {
    throw new Error("app/board.generated.ts ne correspond pas à content/board.md. Lancez npm run content:generate.");
  }
  console.log("Checked " + members.length + " board members in app/board.generated.ts");
} else {
  fs.writeFileSync(outputPath, generated, "utf8");
  console.log("Generated " + members.length + " board members in app/board.generated.ts");
}
