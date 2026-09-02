import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const jobsDirectory = path.join(projectRoot, "content", "jobs");
const outputPath = path.join(projectRoot, "app", "jobs.generated.ts");
const checkMode = process.argv.includes("--check");

function parseFrontmatter(source, fileName) {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) {
    throw new Error("Annonce invalide dans content/jobs/" + fileName + " : bloc frontmatter manquant.");
  }

  const [, rawFrontmatter, rawContent] = match;
  const frontmatter = {};

  for (const line of rawFrontmatter.split(/\r?\n/)) {
    const separator = line.indexOf(":");
    if (separator < 0) continue;
    const key = line.slice(0, separator).trim();
    const value = line
      .slice(separator + 1)
      .trim()
      .replace(/^["']|["']$/g, "");
    frontmatter[key] = value;
  }

  for (const key of ["id", "order", "title", "place"]) {
    if (!frontmatter[key]) {
      throw new Error("Annonce invalide dans content/jobs/" + fileName + " : champ " + key + " manquant.");
    }
  }

  const idFromFile = path.basename(fileName, path.extname(fileName));
  if (frontmatter.id !== idFromFile) {
    throw new Error("Annonce invalide dans content/jobs/" + fileName + " : id différent du nom de fichier.");
  }

  const order = Number(frontmatter.order);
  if (!Number.isInteger(order) || order < 1) {
    throw new Error("Annonce invalide dans content/jobs/" + fileName + " : order doit être un entier positif.");
  }

  const status = frontmatter.status || "active";
  if (status !== "active" && status !== "archived") {
    throw new Error("Annonce invalide dans content/jobs/" + fileName + " : status doit être active ou archived.");
  }

  return {
    id: frontmatter.id,
    order,
    title: frontmatter.title,
    place: frontmatter.place,
    status,
    ...(frontmatter.publishedAt ? { publishedAt: frontmatter.publishedAt } : {}),
    ...(frontmatter.expiresAt ? { expiresAt: frontmatter.expiresAt } : {}),
    content: rawContent.trim(),
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
  "// This file is generated from content/jobs/*.md. Do not edit it directly.",
  "export type JobStatus = \"active\" | \"archived\";",
  "",
  "export type HospitalJob = {",
  "  id: string;",
  "  order: number;",
  "  title: string;",
  "  place: string;",
  "  status: JobStatus;",
  "  publishedAt?: string;",
  "  expiresAt?: string;",
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
