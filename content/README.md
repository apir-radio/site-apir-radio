# Sources éditoriales

Ce dossier contient les sources lisibles par l’équipe : il décrit ce qui doit
être publié, pas le rendu technique de la page.

## Répartition

- `jobs/*.md` : une annonce hospitalière par fichier ;
- `events.md` : la soirée à venir et les archives des soirées ;
- `board.md` : la composition du bureau et la coordination du DES ;
- `job-template.md` : modèle de nouvelle annonce.

Le build lit ces fichiers, les valide, puis produit les catalogues TypeScript
dans `app/*.generated.ts`. Ne modifie jamais directement ces sorties générées.

## Format d’une annonce

Le bloc entre les deux lignes `---` contient les champs de gestion :

- `id` : identifiant stable, identique au nom du fichier ;
- `order` : ordre d’affichage, unique et positif ;
- `title` : intitulé court affiché dans la liste ;
- `place` : établissement et ville ;
- `status` : `active` ou `archived` ;
- `href` : URL HTTPS d’une annonce externe sans contenu local, optionnelle.

Le corps accepte des paragraphes, des titres de niveau 2 ou 3, des listes, du
gras et des liens e-mail ou téléphone. Une annonce utilise soit un corps local,
soit `href`, jamais les deux.

Pour ajouter une offre, copie `job-template.md`, renseigne les champs et lance :

```bash
npm run content:check
npm run content:generate
```

Pour retirer une offre sans perdre son historique, passe son `status` à
`archived`.
