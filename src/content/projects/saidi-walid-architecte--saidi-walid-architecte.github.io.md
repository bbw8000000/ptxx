---
title: "saidi-walid-architecte/saidi-walid-architecte.github.io"
owner: "saidi-walid-architecte"
name: "saidi-walid-architecte.github.io"
fullName: "saidi-walid-architecte/saidi-walid-architecte.github.io"
description: "Site de Saidi Walid, architecte agréé et expert judiciaire à Batna"
sourceUrl: "https://github.com/saidi-walid-architecte/saidi-walid-architecte.github.io"
stars: 100
forks: 0
language: "Python"
topics: []
license: "未标注"
defaultBranch: "main"
snapshotDate: "2026-10-07"
pushedAt: "2026-10-06T17:21:41Z"
---

> 本页保存的是公开项目资料快照，阅读过程不需要连接 GitHub。

# Site Saidi Walid, architecte agréé et expert judiciaire (Batna)

Site statique FR / EN / AR, même concept que maktaba-warraqa.github.io.

## Mise en ligne (GitHub Pages, gratuit)
1. Créer l'organisation GitHub `saidi-walid-architecte` puis le dépôt `saidi-walid-architecte.github.io`.
2. Pousser ce dossier sur la branche `main`.
3. Settings > Pages > Source : **GitHub Actions**. Le site se construit à chaque modification.
4. Si le nom d'organisation change, modifier `base_url` dans `data/site.json`.

## Après la mise en ligne
- Search Console : ajouter la propriété, coller le code dans `google_site_verification` (data/site.json), soumettre `/sitemap.xml`.
- Fiche Google Business Profile : renseigner le site (`https://saidi-walid-architecte.github.io/`).
- Remplacer `assets/logo.svg` et `assets/og.png` par le logo final.
- Ajouter le lien Google Maps de la fiche dans `maps_url` et les réseaux sociaux dans `same_as`.

## Modifier sans toucher au code
https://app.pagescms.org > connexion GitHub > choisir le dépôt. Articles, coordonnées et services s'éditent comme un formulaire.

## Local
`python3 build.py` puis ouvrir `_site/index.html` (aucune dépendance).
