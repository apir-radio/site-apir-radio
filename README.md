# Site officiel de l’APIR

Version **1.0.0** du site de l’Association Parisienne des Internes en Radiologie.

## Adresses

- Site officiel : <https://www.apir-radio.fr>
- Dépôt : <https://github.com/apir-radio/site-apir-radio>

## Développement

Prérequis : Node.js 22 ou une version plus récente.

```bash
npm ci
npm run dev
```

## Publication sur GitHub Pages

Le site est hébergé sur GitHub Pages et publié à l’adresse
<https://www.apir-radio.fr>.

Le workflow `.github/workflows/pages.yml` construit et publie automatiquement
le site après chaque modification de la branche `main`.

Le fichier `public/CNAME` associe le déploiement au domaine officiel. La zone DNS
du domaine est administrée depuis OVHcloud.

Le site est autonome et géré uniquement via GitHub Pages. Les annonces et les
archives sont gérées dans `content/`, puis intégrées au site lors de chaque
build GitHub Pages.

## Contrôles automatiques

- `npm run content:check` vérifie que les données TypeScript générées sont bien
  synchronisées avec les fichiers Markdown éditoriaux.
- `npm run links:check` cherche les liens externes cassés dans le dossier `out`
  après un build. Le contrôle est relancé chaque semaine par
  `.github/workflows/links.yml` et reste informatif : il ne bloque pas la
  publication.
- `.github/workflows/lighthouse.yml` lance chaque semaine un audit Lighthouse
  de performance, accessibilité et SEO. Les seuils sont des avertissements, pas
  un garde-barrière de déploiement.
- `npm run health:check` vérifie la disponibilité de la page d’accueil, du
  sitemap, de `robots.txt` et du logo. Le même contrôle est lancé chaque semaine
  par `.github/workflows/health.yml`.

Le bureau est également éditorialisé dans `content/board.md`, au même titre que
les annonces et les archives. Les offres hospitalières ne reçoivent aucune
donnée structurée `JobPosting` ; leur section est marquée `data-nosnippet` pour
éviter qu’elle soit utilisée comme extrait de résultat de recherche.

Les mises à jour Dependabot mineures et correctives sont regroupées dans les
fichiers `.github/dependabot.yml` afin de réduire le nombre de pull requests.

## Modifier le site avec Codex

Le guide de maintenance quotidien est disponible dans
[`docs/maintenir-le-site.md`](./docs/maintenir-le-site.md), directement dans le
dépôt GitHub.

Dans une nouvelle conversation Codex/Work, utiliser la consigne suivante :

> Travaille sur le dépôt GitHub `apir-radio/site-apir-radio`, branche `main`.
> Modifie [décris la modification], teste le site, enregistre le changement et
> vérifie la publication GitHub Pages.
