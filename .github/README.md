# Automatisation GitHub

Ce dossier contient uniquement les contrôles et conventions du dépôt GitHub.

- `workflows/ci.yml` est le garde-barrière principal du code et des parcours UI ;
- `workflows/pages.yml` valide puis publie l’export statique ;
- `workflows/content.yml` accélère le retour sur les changements éditoriaux ;
- `workflows/health.yml` surveille le site public ;
- `workflows/links.yml` contrôle périodiquement les liens externes ;
- `workflows/lighthouse.yml` fournit un audit indicatif de qualité web ;
- `dependabot.yml` regroupe les mises à jour de dépendances ;
- `pull_request_template.md` rappelle les vérifications à effectuer.

Les workflows utilisent des permissions minimales et des limites de durée pour
éviter les exécutions bloquées. La protection de la branche `main` est configurée
dans les règles du dépôt GitHub.
