# Automatisation GitHub

Ce dossier contient uniquement les contrôles et conventions du dépôt GitHub.

- `workflows/ci.yml` est le garde-barrière principal du code et des parcours UI ;
- `workflows/pages.yml` reprend ces contrôles avant de publier l’export statique ;
- `workflows/content.yml` accélère le retour sur les changements éditoriaux ;
- `workflows/health.yml` surveille le site public ;
- `dependabot.yml` regroupe les mises à jour de dépendances ;
- `pull_request_template.md` rappelle les vérifications à effectuer.

Les workflows utilisent des permissions minimales, des limites de durée et des
références d’actions figées sur des commits pour éviter les exécutions bloquées
ou les mises à jour implicites. La protection de la branche `main` est configurée
dans les règles du dépôt GitHub.
