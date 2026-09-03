// Tests unitaires des règles communes appliquées aux sources éditoriales.
import assert from "node:assert/strict";
import test from "node:test";
import {
  assertHttpsUrl,
  assertKnownFields,
  parseFrontmatter,
  validateMarkdownLinks,
} from "../scripts/content-utils.mjs";

test("parse le frontmatter en conservant les deux-points dans les valeurs", () => {
  const parsed = parseFrontmatter(
    `---\nid: "annonce-test"\ntitle: "Titre : radiologie"\n---\n\nContenu de l’annonce.`,
    "fixture",
  );

  assert.deepEqual(parsed.frontmatter, {
    id: "annonce-test",
    title: "Titre : radiologie",
  });
  assert.equal(parsed.content, "Contenu de l’annonce.");
});

test("rejette les champs dupliqués, inconnus et les lignes mal formées", () => {
  assert.throws(
    () => parseFrontmatter("---\nid: test\nid: autre\n---\ncontenu", "fixture"),
    /champ dupliqué « id »/,
  );
  assert.throws(
    () => assertKnownFields({ id: "test", extra: "non" }, ["id"], "fixture"),
    /champ\(s\) inconnu\(s\) : extra/,
  );
  assert.throws(
    () => parseFrontmatter("---\nid test\n---\ncontenu", "fixture"),
    /frontmatter invalide/,
  );
});

test("valide les URL HTTPS et les liens Markdown pris en charge", () => {
  assert.doesNotThrow(() => assertHttpsUrl("https://example.org/inscription", "fixture"));
  assert.doesNotThrow(() => validateMarkdownLinks("[mail](mailto:test@example.org) [téléphone](tel:+33123456789)", "fixture"));

  assert.throws(() => assertHttpsUrl("http://example.org", "fixture"), /URL HTTPS invalide/);
  assert.throws(() => validateMarkdownLinks("[lien](javascript:alert(1))", "fixture"), /lien Markdown non pris en charge/);
});
