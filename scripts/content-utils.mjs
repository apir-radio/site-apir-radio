// Règles communes de lecture et de validation des sources éditoriales Markdown.
export function parseFrontmatter(source, context) {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)([\s\S]*)$/);
  if (!match) {
    throw new Error(`${context} : bloc frontmatter manquant.`);
  }

  const [, rawFrontmatter, content] = match;
  const frontmatter = {};

  for (const [lineIndex, rawLine] of rawFrontmatter.split(/\r?\n/).entries()) {
    const line = rawLine.trim();
    if (!line) continue;

    const separator = line.indexOf(":");
    if (separator < 1) {
      throw new Error(`${context} : ligne ${lineIndex + 1} du frontmatter invalide.`);
    }

    const key = line.slice(0, separator).trim();
    if (!/^[A-Za-z][A-Za-z0-9]*$/.test(key)) {
      throw new Error(`${context} : nom de champ invalide « ${key} ».`);
    }
    if (Object.hasOwn(frontmatter, key)) {
      throw new Error(`${context} : champ dupliqué « ${key} ».`);
    }

    frontmatter[key] = parseFrontmatterValue(line.slice(separator + 1), context, key);
  }

  return { frontmatter, content: content.trim() };
}

function parseFrontmatterValue(rawValue, context, key) {
  const value = rawValue.trim();
  if (!value) return "";

  const quote = value[0];
  if (quote !== '"' && quote !== "'") return value;
  if (value.at(-1) !== quote) {
    throw new Error(`${context} : valeur non terminée pour le champ « ${key} ».`);
  }

  if (quote === '"') {
    try {
      return JSON.parse(value);
    } catch {
      throw new Error(`${context} : valeur entre guillemets invalide pour le champ « ${key} ».`);
    }
  }

  return value.slice(1, -1).replace(/''/g, "'");
}

export function assertKnownFields(frontmatter, allowedFields, context) {
  const allowed = new Set(allowedFields);
  const unknownFields = Object.keys(frontmatter).filter((key) => !allowed.has(key));
  if (unknownFields.length > 0) {
    throw new Error(`${context} : champ(s) inconnu(s) : ${unknownFields.join(", ")}.`);
  }
}

export function requireFields(frontmatter, fields, context) {
  for (const field of fields) {
    if (typeof frontmatter[field] !== "string" || !frontmatter[field].trim()) {
      throw new Error(`${context} : champ ${field} manquant.`);
    }
  }
}

export function assertEmail(value, context) {
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value)) {
    throw new Error(`${context} : ${value} doit être une adresse e-mail.`);
  }
}

export function assertHttpsUrl(value, context) {
  try {
    const url = new URL(value);
    if (url.protocol !== "https:") throw new Error();
  } catch {
    throw new Error(`${context} : URL HTTPS invalide « ${value} ».`);
  }
}

export function validateMarkdownLinks(source, context) {
  const linkPattern = /\[[^\]]+\]\(([^)]+)\)/g;
  for (const match of source.matchAll(linkPattern)) {
    const href = match[1].trim();
    if (!/^(https:\/\/|mailto:|tel:)/i.test(href)) {
      throw new Error(`${context} : lien Markdown non pris en charge « ${href} ».`);
    }
  }
}
