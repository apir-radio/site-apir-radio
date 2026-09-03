# Annonces hospitalières

Chaque fichier Markdown du dossier `content/jobs` correspond à une annonce affichée sur le site.
La commande de build régénère automatiquement les catalogues à partir de ces fichiers.
Pour mettre à jour l’aperçu sans reconstruire tout le site, lance npm run content:generate.

Les soirées sont regroupées dans [events.md](./events.md). La section `À venir`
contient au maximum une soirée courante (date, thème, intervenant, lieu et lien
d’inscription). Les sections par saison regroupent les archives ; chaque ligne
archivée suit le format `Mois · Spécialité — Intervenant, Établissement` et est
transformée automatiquement en données structurées pour l’affichage.

La composition du bureau et la coordination du DES sont gérées dans
[board.md](./board.md). Chaque ligne du bureau suit le format `Nom · Fonction ·
Initiales`.

Le bloc entre les deux lignes `---` contient les champs de gestion :

- `id` : identifiant stable de l’annonce (le nom du fichier doit lui correspondre)
- `order` : ordre d’affichage
- `title` : intitulé court affiché dans la liste
- `place` : établissement et ville
- `status` : `active` ou `archived`
- `href` : URL HTTPS d’une annonce externe sans contenu local (optionnel)

Le texte qui suit est du Markdown simple : paragraphes, titres de niveau 2 ou 3, listes, gras et liens e-mail/téléphone sont pris en charge.

Pour ajouter une offre, crée un nouveau fichier .md dans content/jobs, renseigne les champs ci-dessus et place le texte de l’annonce sous le second séparateur ---.
Pour retirer une offre sans perdre son contenu, passe simplement status à archived.
Une annonce externe peut fournir `href` et laisser le corps vide ; une annonce
avec contenu local ne doit pas fournir `href`.

Un modèle prêt à copier est disponible dans [job-template.md](./job-template.md).
Après une modification, lance `npm run content:check` pour vérifier que les
fichiers générés sont à jour, puis `npm run content:generate` si nécessaire.
