# Maintenir le site APIR

Ce guide reste dans le dépôt GitHub : il n’est pas publié sur le site.

## Modifier le contenu

- Annonces hospitalières : modifier ou ajouter un fichier dans `content/jobs/`.
  Copier la structure de `content/job-template.md` et conserver un `id` égal au
  nom du fichier.
- Bureau : modifier `content/board.md`.
- Soirée à venir et archives : modifier `content/events.md`. Après une soirée,
  retirer sa section `À venir`, ajouter la ligne correspondante à la saison
  d’archives, puis renseigner la prochaine soirée lorsqu’elle est connue.

Ne pas modifier directement `app/*.generated.ts` : ces fichiers sont régénérés
à partir de `content/`.

## Vérifier avant un commit

```bash
npm ci
npm run content:check
npm run test:content
npm run build:pages
node --test tests/rendered-html.test.mjs
npm run anchors:check
npm run lint
npm run test:ui
```

Pour un contrôle supplémentaire après le build :

```bash
npm run links:check
npm run health:check
```

Pour lancer les contrôles statiques principaux en une seule commande :

```bash
npm run verify
```

## Publier

1. Créer un commit sur une branche de travail.
2. Relire le contenu et vérifier les coordonnées publiques.
3. Fusionner ou pousser sur `main`.
4. Consulter l’action **Publier le site APIR** dans l’onglet *Actions* de GitHub.

Les contrôles de liens, Lighthouse et disponibilité sont planifiés séparément
et ne bloquent pas les publications normales.
