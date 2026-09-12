import { createRequire } from "node:module";
import fs from "node:fs/promises";

const require = createRequire(import.meta.url);
const siteConfig = require("../../site.config.json");
const boardSource = await fs.readFile(new URL("../../content/board.md", import.meta.url), "utf8");
const coordinationCodeMatch = boardSource.match(/^coordinationEmailCode:\s*\[([\d,\s]+)\]$/m);

if (!coordinationCodeMatch) {
  throw new Error("Impossible de lire le code de l’adresse de coordination dans content/board.md.");
}

function decodeEmailCode(code) {
  if (!Array.isArray(code) || code.some((character) => !Number.isInteger(character))) {
    throw new Error("Code d’adresse e-mail invalide.");
  }

  return String.fromCharCode(...code);
}

export const associationEmails = Object.freeze({
  contact: decodeEmailCode(siteConfig.emailCode),
  coordination: decodeEmailCode(coordinationCodeMatch[1].split(",").map((character) => Number(character.trim()))),
});
