// Valide content/jobs/*.md et génère le catalogue TypeScript des annonces.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  assertHttpsUrl,
  assertKnownFields,
  parseFrontmatter as parseSimpleFrontmatter,
  requireFields,
  validateMarkdownLinks,
} from "./content-utils.mjs";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const jobsDirectory = path.join(projectRoot, "content", "jobs");
const outputPath = path.join(projectRoot, "app", "jobs.generated.ts");
const checkMode = process.argv.includes("--check");

function parseFrontmatter(source, fileName) {
  const context = `Annonce invalide dans content/jobs/${fileName}`;
  const parsed = parseSimpleFrontmatter(source, context);
  const { frontmatter, content } = parsed;
  assertKnownFields(frontmatter, ["id", "order", "title", "place", "status", "href"], context);
  requireFields(frontmatter, ["id", "order", "title", "place"], context);

  const idFromFile = path.basename(fileName, path.extname(fileName));
  if (frontmatter.id !== idFromFile) {
    throw new Error(`${context} : id différent du nom de fichier.`);
  }
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(frontmatter.id)) {
    throw new Error(`${context} : id doit contenir uniquement des minuscules, chiffres et tirets.`);
  }

  const order = Number(frontmatter.order);
  if (!Number.isInteger(order) || order < 1) {
    throw new Error(`${context} : order doit être un entier positif.`);
  }

  const status = frontmatter.status || "active";
  if (status !== "active" && status !== "archived") {
    throw new Error(`${context} : status doit être active ou archived.`);
  }

  if (frontmatter.href) assertHttpsUrl(frontmatter.href, `${context} : href`);
  validateMarkdownLinks(content, context);

  if (!content && !frontmatter.href) {
    throw new Error(`${context} : le contenu ou le champ href doit être renseigné.`);
  }
  if (content && frontmatter.href) {
    throw new Error(`${context} : content et href ne peuvent pas être utilisés ensemble.`);
  }

  return {
    id: frontmatter.id,
    order,
    title: frontmatter.title,
    place: frontmatter.place,
    status,
    ...(frontmatter.href ? { href: frontmatter.href } : {}),
    ...(content ? { content } : {}),
  };
}

const jobs = fs
  .readdirSync(jobsDirectory)
  .filter((fileName) => fileName.endsWith(".md"))
  .map((fileName) => parseFrontmatter(fs.readFileSync(path.join(jobsDirectory, fileName), "utf8"), fileName))
  .sort((a, b) => a.order - b.order);

const ids = new Set();
const orders = new Set();
for (const job of jobs) {
  if (ids.has(job.id)) {
    throw new Error("Annonces dupliquées dans content/jobs : id " + job.id + ".");
  }
  if (orders.has(job.order)) {
    throw new Error("Ordre d’affichage dupliqué dans content/jobs : " + job.order + ".");
  }
  ids.add(job.id);
  orders.add(job.order);
}

const generated = [
  "// Fichier généré depuis content/jobs/*.md. Ne pas le modifier directement.",
  "export type JobStatus = \"active\" | \"archived\";",
  "",
  "export type HospitalJob = {",
  "  id: string;",
  "  order: number;",
  "  title: string;",
  "  place: string;",
  "  status: JobStatus;",
  "  href?: string;",
  "  content?: string;",
  "};",
  "",
  "export const allHospitalJobs: HospitalJob[] = " + JSON.stringify(jobs, null, 2) + ";",
  "",
  "export const hospitalJobs = allHospitalJobs.filter((job) => job.status === \"active\");",
  "",
].join("\n");

if (checkMode) {
  const current = fs.readFileSync(outputPath, "utf8");
  if (current !== generated) {
    throw new Error("app/jobs.generated.ts ne correspond pas aux sources content/jobs/*.md. Lancez npm run content:generate.");
  }
  console.log("Checked " + jobs.length + " job announcements in app/jobs.generated.ts");
} else {
  fs.writeFileSync(outputPath, generated, "utf8");
  console.log("Generated " + jobs.length + " job announcements in app/jobs.generated.ts");
}
