# NSB Gateway

Page d'accueil de NSB (North Star Business) : des boissons introuvables
en Guadeloupe, choisies avec la communauté.

## Ce que fait le site
- **Carte NFC** (`index.html`) : ouvre directement le questionnaire
  « Premier regard · Drop ». Il existe en 6 versions (G1 à G6) avec
  des produits différents ; chaque visiteur reçoit une version au hasard,
  et son téléphone la garde. Sans `source=qr`, le formulaire demande la commune.
- **QR du flyer** (`blueprint.html`) : même questionnaire.
  `?origine_qr=lieu_a` = flyer déposé, `?origine_qr=lieu_b` = flyer remis en main propre.
- **Lien de partage** (page de remerciement) : `?src=partage`.
- Chaque réponse Tally est marquée par sa source : carte, flyer ou partage.

## Modifier un lien
Tout se change dans `docs/routes.json`, sans toucher au code :
- `premier_regard` → les 6 versions G1 à G6 du questionnaire
- `test_degustation` → le formulaire dégustation
- `whatsapp_groupe` → la communauté Drink Discovery Guadeloupe

## Réglages utiles
- Voir la page NSB au lieu du questionnaire : ajouter `?page=nsb` à l'adresse.
- Couper l'ouverture directe du questionnaire : `"ouverture_directe": false` dans `docs/routes.json`.
- Tester une version précise : ajouter `?groupe=G3` à l'adresse.

## Fichiers à ne pas renommer ni déplacer
`docs/nsb-core.js`, `docs/nsb-app.js`, `docs/routes.json`,
`docs/catalogue.json` : la carte NFC en dépend.

## Adresse
https://samuuniv9.github.io/nsb-gateway/
