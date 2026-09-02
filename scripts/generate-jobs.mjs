import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const jobsDirectory = path.join(projectRoot, "content", "jobs");
const outputPath = path.join(projectRoot, "app", "jobs.generated.ts");

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

  return {
    id: frontmatter.id,
    order,
    title: frontmatter.title,
    place: frontmatter.place,
    status: frontmatter.status === "archived" ? "archived" : "active",
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

fs.writeFileSync(outputPath, generated, "utf8");
console.log("Generated " + jobs.length + " job announcements in app/jobs.generated.ts");
