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

Le workflow `.github/workflows/pages.yml` construit et publie automatiquement
le site après chaque modification de la branche `main`.

Avant le rattachement du domaine officiel, le site est construit pour l’adresse
de projet GitHub Pages. Dès qu’un fichier `public/CNAME` est ajouté, le build
bascule automatiquement vers le domaine personnalisé.

## Hébergement historique

La configuration ChatGPT Sites est conservée pendant la migration afin que le
site public actuel continue de fonctionner jusqu’à la bascule DNS.
