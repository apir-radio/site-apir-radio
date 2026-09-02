# Annonces hospitalières

Chaque fichier Markdown du dossier `content/jobs` correspond à une annonce affichée sur le site.
La commande de build régénère automatiquement les catalogues à partir de ces fichiers.
Pour mettre à jour l’aperçu sans reconstruire tout le site, lance npm run content:generate.

Les archives des soirées sont regroupées dans [events.md](./events.md). Chaque
ligne suit le format `Mois · Spécialité — Intervenant, Établissement` et est
transformée automatiquement en données structurées pour l’affichage.

Le bloc entre les deux lignes `---` contient les champs de gestion :

- `id` : identifiant stable de l’annonce (le nom du fichier doit lui correspondre)
- `order` : ordre d’affichage
- `title` : intitulé court affiché dans la liste
- `place` : établissement et ville
- `status` : `active` ou `archived`
- `publishedAt` et `expiresAt` : champs optionnels pour le suivi

Le texte qui suit est du Markdown simple : paragraphes, titres de niveau 2 ou 3, listes, gras et liens e-mail/téléphone sont pris en charge.

Pour ajouter une offre, crée un nouveau fichier .md dans content/jobs, renseigne les champs ci-dessus et place le texte de l’annonce sous le second séparateur ---.
Pour retirer une offre sans perdre son contenu, passe simplement status à archived.
