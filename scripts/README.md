# Scripts de maintenance

Les scripts de ce dossier sont des outils de génération et de contrôle exécutés
par les commandes npm et GitHub Actions. Ils ne sont pas importés par le site
public, à l’exception des catalogues qu’ils génèrent dans `app/`.

- `generate-*.mjs` transforme les sources `content/` en TypeScript ;
- `content-utils.mjs` contient les règles partagées de validation ;
- `check-anchors.mjs` contrôle les liens internes du HTML exporté ;
- `check-links.mjs` contrôle les liens externes avec un nombre limité de retries ;
- `check-site-health.mjs` vérifie la disponibilité des ressources publiques ;
- `html-utils.mjs` fournit les fonctions communes d’inspection HTML.

Les scripts de génération acceptent `--check` pour comparer les sorties sans les
réécrire. C’est ce mode qui protège les fichiers générés en CI.
