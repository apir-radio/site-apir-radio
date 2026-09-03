# Tests

Ce dossier contient les contrôles qui garantissent le contenu, le HTML exporté
et les parcours interactifs du site.

- `content-utils.test.mjs` teste les règles communes des sources éditoriales ;
- `rendered-html.test.mjs` vérifie les pages produites dans `out/` ;
- `ui.spec.mjs` exécute les parcours dans Chromium, dont le menu mobile et les
  fiches d’annonces ;
- `static-server.mjs` sert `out/` pendant les tests navigateur.

Le build doit être exécuté avant les tests HTML et UI :

```bash
npm run build:pages
node --test tests/rendered-html.test.mjs
npm run test:ui
```
