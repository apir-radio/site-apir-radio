# Architecture du dépôt

Cette page explique à quoi sert chaque zone du dépôt et où intervenir pour une
modification donnée.

## Flux de publication

```text
Sources Markdown
  ↓ validation et génération
Catalogues TypeScript générés
  ↓ rendu Next.js
Export statique out/
  ↓ artefact GitHub Pages
Site public www.apir-radio.fr
```

## Arborescence

### Application (`app/`)

| Fichier | Responsabilité |
| --- | --- |
| `page.tsx` | Page d’accueil et données structurées SEO |
| `layout.tsx` | Layout global, polices et métadonnées communes |
| `site-nav.tsx` | Navigation desktop/mobile et section active |
| `job-list.tsx` | Liste des annonces, fiches modales et historique navigateur |
| `archive-list.tsx` | Archives de soirées et persistance des années ouvertes |
| `adhesion/page.tsx` | Route technique de redirection vers HelloAsso |
| `globals.css` | Styles globaux, responsive et états d’accessibilité |
| `site-config.ts` | Helpers TypeScript pour la configuration publique |
| `robots.ts` | Génération de `robots.txt` |
| `sitemap.ts` | Génération du sitemap |
| `board.ts`, `events.ts`, `jobs.ts` | Points d’accès aux catalogues générés |
| `board.generated.ts` | Sortie de `content/board.md` |
| `events.generated.ts` | Sortie de `content/events.md` |
| `jobs.generated.ts` | Sortie de `content/jobs/*.md` |
| `fonts/` | Fichiers de polices locaux, non générés |

### Sources (`content/`)

| Chemin | Responsabilité |
| --- | --- |
| `jobs/*.md` | Annonces individuelles |
| `events.md` | Soirée à venir et archives |
| `board.md` | Bureau et coordination |
| `job-template.md` | Modèle d’annonce |
| `README.md` | Règles de contribution éditoriale |

### Scripts (`scripts/`)

| Fichier | Responsabilité |
| --- | --- |
| `content-utils.mjs` | Parseur frontmatter et validations communes |
| `generate-jobs.mjs` | Validation et génération des annonces |
| `generate-events.mjs` | Validation et génération des soirées |
| `generate-board.mjs` | Validation et génération du bureau |
| `html-utils.mjs` | Lecture HTML et collecte des liens/ancres |
| `check-anchors.mjs` | Contrôle des ancres internes du build |
| `check-links.mjs` | Contrôle des liens externes avec retries limités |
| `check-site-health.mjs` | Contrôle des ressources publiques essentielles |

### Tests (`tests/`)

| Fichier | Responsabilité |
| --- | --- |
| `content-utils.test.mjs` | Tests unitaires des validations éditoriales |
| `rendered-html.test.mjs` | Assertions sur les fichiers HTML générés |
| `ui.spec.mjs` | Parcours Chromium desktop/mobile |
| `static-server.mjs` | Serveur local minimal pour Playwright |

### Publication et qualité (`.github/`)

| Fichier | Responsabilité |
| --- | --- |
| `workflows/ci.yml` | Vérification complète avant fusion ou publication |
| `workflows/content.yml` | Vérification ciblée des changements éditoriaux |
| `workflows/pages.yml` | Build validé et déploiement GitHub Pages |
| `workflows/health.yml` | Surveillance hebdomadaire de disponibilité |
| `workflows/links.yml` | Surveillance hebdomadaire des liens externes |
| `workflows/lighthouse.yml` | Audit hebdomadaire indicatif performance/accessibilité/SEO |
| `dependabot.yml` | Mises à jour groupées des dépendances |
| `pull_request_template.md` | Checklist commune des contributions |

### Fichiers racine

| Fichier | Responsabilité |
| --- | --- |
| `site.config.json` | URL, identité, contacts, réseaux et partenaires publics |
| `next.config.ts` | Export statique et chemin GitHub Pages |
| `package.json` | Dépendances et commandes du projet |
| `package-lock.json` | Verrouillage exact des dépendances |
| `eslint.config.mjs` | Règles ESLint Next.js/TypeScript |
| `playwright.config.mjs` | Configuration des tests navigateur |
| `postcss.config.mjs` | Intégration PostCSS/Tailwind |
| `tsconfig.json` | Compilation et vérification TypeScript |
| `.npmrc` | Réglages npm non interactifs pour CI |
| `.gitignore` | Fichiers locaux ou générés exclus du dépôt |
| `.gitattributes` | Normalisation Git et fichiers binaires |
| `.editorconfig` | Formatage commun aux éditeurs |
| `public/CNAME` | Domaine personnalisé GitHub Pages |
| `public/*.{webp,png}` | Logos et favicon livrés au navigateur |
| `.gitmodules` | Référence du sous-module `.design-rules/` |
| `AGENTS.md` | Règles locales de travail pour l’agent de développement |

Les dossiers `.next/`, `out/`, `node_modules/` et `test-results/` sont des
sorties locales ignorées par Git. Ils ne doivent jamais être ajoutés à un
commit.
