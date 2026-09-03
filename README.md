# APIR — site public

Site officiel de l’Association Parisienne des Internes en Radiologie (APIR),
destiné aux internes en radiologie d’Île-de-France.

- Site public : <https://www.apir-radio.fr>
- Dépôt : <https://github.com/apir-radio/site-apir-radio>
- Hébergement : GitHub Pages, avec publication automatique depuis `main`

## Démarrer

Prérequis : Node.js 22 ou une version plus récente.

```bash
npm ci
npm run dev
```

Le serveur de développement régénère les catalogues éditoriaux avant de lancer
Next.js.

## Organisation du dépôt

La cartographie complète se trouve dans
[`docs/architecture.md`](./docs/architecture.md). Le flux principal est :

```text
content/*.md → scripts/generate-*.mjs → app/*.generated.ts → Next.js → out/ → GitHub Pages
```

Les fichiers Markdown de `content/` sont les sources éditoriales. Les fichiers
`app/*.generated.ts` sont produits automatiquement et ne doivent jamais être
modifiés directement.

## Fichiers et dossiers à connaître

| Chemin | Rôle |
| --- | --- |
| `app/` | Pages Next.js, composants d’interface, styles et données générées |
| `content/` | Annonces, soirées, bureau et modèles éditoriaux |
| `scripts/` | Génération du contenu et contrôles de qualité |
| `tests/` | Tests de contenu, HTML rendu et parcours navigateur |
| `public/` | Logos, favicon et configuration du domaine GitHub Pages |
| `.github/` | Workflows, Dependabot et règles de contribution |
| `docs/` | Guides de maintenance et documentation technique |
| `site.config.json` | Configuration publique partagée par le site et les contrôles |
| `next.config.ts` | Configuration de l’export statique GitHub Pages |
| `package.json` | Commandes de développement, test, build et vérification |
| `package-lock.json` | Versions exactes des dépendances installées par CI |
| `.design-rules/` | Sous-module contenant les règles de revue UI/UX |

## Contrôles locaux

Avant une fusion, lancer :

```bash
npm run verify
npm run test:ui
```

Les contrôles disponibles sont les suivants :

- `npm run content:check` vérifie les catalogues générés ;
- `npm run test:content` teste les règles de validation éditoriale ;
- `npm run lint` vérifie le code sans tolérer d’avertissement ;
- `npm run build:pages` produit l’export statique dans `out/` ;
- `npm run anchors:check` vérifie les ancres internes du HTML ;
- `npm run test:ui` vérifie les interactions principales, dont la fermeture des
  annonces, le retour navigateur et le menu mobile ;
- `npm run links:check` contrôle les liens externes après un build ;
- `npm run health:check` vérifie les ressources publiques essentielles ;
- `npm run verify` regroupe les contrôles statiques principaux.

Les liens externes et Lighthouse sont contrôlés périodiquement par GitHub
Actions. Les contrôles de liens restent informatifs, car certains services
publics refusent les requêtes automatisées.

## Publication

Toute modification poussée sur `main` déclenche
`.github/workflows/pages.yml`. Avant de préparer l’artefact, ce workflow vérifie
les catalogues, le contenu, TypeScript et ESLint. Une erreur de qualité empêche
donc la publication.

Le fichier `public/CNAME` associe GitHub Pages à `www.apir-radio.fr`. La zone DNS
du domaine est administrée depuis OVHcloud.

## Modifier le contenu

Consulter [`content/README.md`](./content/README.md), puis le guide
[`docs/maintenir-le-site.md`](./docs/maintenir-le-site.md). Le bureau, les
annonces et les soirées restent édités dans `content/`; les fichiers générés
sont uniquement des sorties de build.

## Mettre à jour avec un assistant de code

Le dépôt peut être travaillé avec Claude Code, ChatGPT Codex ou un autre agent
de développement. Depuis le dossier du projet, lui donner une consigne précise
avec l’objectif, le périmètre et la demande de vérification. Par exemple :

```text
Travaille sur le dépôt GitHub apir-radio/site-apir-radio, branche main.

Objectif : [décrire précisément la modification].

Commence par vérifier l’état du dépôt et les règles de contribution. Modifie les
sources nécessaires, ne modifie pas directement app/*.generated.ts, lance les
contrôles adaptés, puis présente le diff et les résultats des tests. Ne change
pas le contenu éditorial non concerné et ne publie qu’après validation.
```

Pour une mise à jour d’annonce, modifier `content/jobs/*.md`, puis demander
`npm run content:check` et `npm run content:generate`. Pour une évolution du
site, demander au minimum `npm run verify` et `npm run test:ui` si l’interface
ou un parcours utilisateur est concerné.

Avant de fusionner ou de publier, relire le diff, vérifier les coordonnées et
liens publics, puis contrôler les actions **Vérifier le code** et **Publier le
site APIR** dans GitHub. Une pull request est préférable pour conserver une
relecture et l’historique du changement.

## Contribution

Les pull requests utilisent le modèle
`.github/pull_request_template.md`. Toute modification d’interface doit aussi
respecter les règles de revue dans `.design-rules/SKILL.md` et les guides HIG
référencés par ce fichier.
