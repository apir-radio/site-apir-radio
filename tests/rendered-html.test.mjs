import assert from "node:assert/strict";
import test from "node:test";

const developmentPreviewMeta =
  /<meta(?=[^>]*\bname=["']codex-preview["'])(?=[^>]*\bcontent=["']development["'])[^>]*>/i;
const helloAssoAdhesionUrl =
  "https://www.helloasso.com/associations/apir-association-parisienne-des-internes-en-radiologie/adhesions/adhesion-apir-2025-2026";

const workerUrl = new URL("../dist/server/index.js", import.meta.url);
workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
const { default: worker } = await import(workerUrl.href);

const env = {
  ASSETS: {
    fetch: async () => new Response("Not found", { status: 404 }),
  },
};

const ctx = {
  waitUntil() {},
  passThroughOnException() {},
};

test("renders development preview metadata", async () => {
  const response = await worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    env,
    ctx,
  );

  assert.equal(response.status, 200);
  assert.match(
    response.headers.get("content-type") ?? "",
    /^text\/html\b/i,
  );
  assert.match(await response.text(), developmentPreviewMeta);
});

test("serves the canonical hostname without redirecting", async () => {
  const response = await worker.fetch(
    new Request("https://www.apir-radio.fr/", {
      headers: { accept: "text/html" },
    }),
    env,
    ctx,
  );

  assert.equal(response.status, 200);
  assert.equal(response.headers.get("location"), null);
  const html = await response.text();
  assert.match(html, /href=["']mailto:contact@apir-radio\.fr["'][^>]*>Nous contacter</i);
  assert.match(html, /class=["'][^"']*contact-address[^"']*["'][^>]*>contact@apir-radio\.fr</i);
  assert.doesNotMatch(html, /apir\.radiologie@gmail\.com/i);
  assert.match(
    html,
    /href=["']#mission["'][^>]*>L’association<\/a>.*href=["']#bureau["'][^>]*>Bureau<\/a>.*href=["']#soirees["'][^>]*>Soirées<\/a>.*href=["']#ressources["'][^>]*>Ressources<\/a>/is,
  );
  assert.doesNotMatch(html, />Parlons radio<\/a>|>Annonces<\/a>|href=["']\/annonces["']/i);
  assert.ok(html.indexOf('id="mission"') < html.indexOf('id="bureau"'));
  assert.ok(html.indexOf('id="bureau"') < html.indexOf('id="soirees"'));
  assert.ok(html.indexOf('id="soirees"') < html.indexOf('id="ressources"'));
  assert.match(html, /class=["'][^"']*jobs-section[^"']*["'][^>]*id=["']postes-hospitaliers["']/i);
  assert.match(html, /class=["'][^"']*contact-section[^"']*["'][^>]*id=["']contact["'][^>]*>.*Contactez le bureau\./is);
  assert.match(html, /class=["'][^"']*mission-section[^"']*["']/i);
  assert.match(html, /class=["'][^"']*board-section[^"']*["']/i);
  assert.match(html, /class=["'][^"']*events-section[^"']*["']/i);
  assert.match(html, /class=["'][^"']*resources-section[^"']*["']/i);
  assert.match(html, /class=["'][^"']*resource-card social-card[^"']*["'][^>]*>.*Suivre la vie de l’association/is);
  assert.match(html, /href=["']https:\/\/apir-radio\.notion\.site\/5d8f70d7adf64035b91657532f316a55["']/i);
  assert.doesNotMatch(html, /values-strip|Formation<\/span>.*Transmission<\/span>.*Convivialité<\/span>.*Réseau<\/span>/is);
  assert.doesNotMatch(html, /timeline-heading|class=["'][^"']*event-row/i);
  assert.match(html, /Archives des soirées.*2025 — 2026/is);
  assert.equal((html.match(/href=["']\/adhesion["']/g) ?? []).length, 2);
  assert.doesNotMatch(html, new RegExp(`href=["']${helloAssoAdhesionUrl}`));
});

test("redirects the adhesion shortcut to HelloAsso", async () => {
  const response = await worker.fetch(
    new Request("https://www.apir-radio.fr/adhesion", {
      headers: { accept: "text/html" },
    }),
    env,
    ctx,
  );

  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /http-equiv=["']refresh["']/i);
  assert.ok(html.includes(helloAssoAdhesionUrl));
  assert.match(html, /window\.location\.replace/);
});

test("removes the internal annonces page", async () => {
  const response = await worker.fetch(
    new Request("https://www.apir-radio.fr/annonces", {
      headers: { accept: "text/html" },
    }),
    env,
    ctx,
  );

  assert.equal(response.status, 404);
  assert.doesNotMatch(await response.text(), /<iframe/i);
});

test("redirects only the legacy hostname while preserving path and query", async () => {
  const response = await worker.fetch(
    new Request("https://apir-radiologie.msq-bui.chatgpt.site/annonces?source=legacy&ref=nav"),
    env,
    ctx,
  );

  assert.equal(response.status, 308);
  assert.equal(
    response.headers.get("location"),
    "https://www.apir-radio.fr/annonces?source=legacy&ref=nav",
  );
});

test("serves the legacy hostname inside the embedded ChatGPT preview", async () => {
  const response = await worker.fetch(
    new Request("https://apir-radiologie.msq-bui.chatgpt.site/", {
      headers: {
        accept: "text/html",
        "sec-fetch-dest": "iframe",
      },
    }),
    env,
    ctx,
  );

  assert.equal(response.status, 200);
  assert.equal(response.headers.get("location"), null);
  assert.match(await response.text(), developmentPreviewMeta);
});
