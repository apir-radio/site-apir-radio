import process from "node:process";

const baseUrl = process.argv[2] || "https://www.apir-radio.fr";
const timeoutMs = Number(process.env.SITE_HEALTH_TIMEOUT_MS || 15_000);
const userAgent = "APIR-site-health-check/1.0 (+https://www.apir-radio.fr)";
const resources = [
  { path: "/", expectedText: "APIR" },
  { path: "/robots.txt" },
  { path: "/sitemap.xml" },
  { path: "/apir-logo.webp" },
];

async function checkResource(resource) {
  const url = new URL(resource.path, baseUrl).toString();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      headers: { "user-agent": userAgent },
      redirect: "follow",
      signal: controller.signal,
    });
    const body = resource.expectedText ? await response.text() : null;
    if (response.status >= 400) {
      return { url, state: "broken", reason: `HTTP ${response.status}` };
    }
    if (resource.expectedText && !body?.includes(resource.expectedText)) {
      return { url, state: "broken", reason: `texte attendu absent : ${resource.expectedText}` };
    }
    return { url, state: "ok", status: response.status };
  } catch (error) {
    return { url, state: "broken", reason: error instanceof Error ? error.message : String(error) };
  } finally {
    clearTimeout(timeout);
  }
}

console.log(`Vérification de disponibilité de ${baseUrl}…`);
const results = await Promise.all(resources.map(checkResource));
for (const result of results) {
  if (result.state === "ok") {
    console.log(`✅ ${result.url} (${result.status})`);
  } else {
    console.error(`❌ ${result.url} — ${result.reason}`);
  }
}

const failures = results.filter((result) => result.state === "broken");
if (failures.length > 0) {
  console.error(`${failures.length} ressource(s) indisponible(s).`);
  process.exitCode = 1;
} else {
  console.log("Toutes les ressources principales répondent correctement.");
}
