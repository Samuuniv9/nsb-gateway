# Spécification fonctionnelle – NSB Gateway

## 🎯 Objectif
Créer une micro-landing page NSB indépendante du template Pwofeel.
Elle doit présenter : ton identité, tes CTA principaux, et les valeurs NSB.

---

## 🧱 Structure générale

1. **Header compact**
   - Logo NSB (texte ou image)
   - Badge "vérifié"
   - Micro-accroche : une ligne (ex. “connecter la jeunesse et la data”)

2. **Section Héros (hero)**
   - Titre principal
   - Phrase d’intro courte (micro-story)
   - 3 boutons de public cible ("Découvrir", "Pro", "Partenaires")
   - 2 CTA dépendants du public choisi

3. **Fusion visuelle**
   - 2 cartes côte à côte :
     - Carte 1 : Dernier article
     - Carte 2 : Projet éco
   - Chaque carte = image (optionnelle), titre, 1 phrase, bouton “en savoir plus”

4. **Section Données / Thèmes du moment**
   - Titre “Thèmes du moment”
   - 5 tags de mots-clés (sans chiffres, sans anxiété)

5. **Barre sociale**
   - Liens vers tes comptes LinkedIn, Instagram (et Twitch plus tard)

6. **Footer**
   - Mantra (“Relier les personnes, les données et les idées — localement”)
   - Mention légale / © NSB Insight / ton site

---

## ⚙️ Fonctionnalités techniques

- **Mode indépendant** (`REPLACE_MODE=true`) : remplace tout le contenu Pwofeel.
- **i18n (multi-langues)** : FR (par défaut), EN, ES.
- **Liens centralisés** : tous les URLs dans `routes.json`.
- **Tracking léger (optionnel)** : clics sur CTA via `navigator.sendBeacon()`.
- **Version** : numéro stocké dans `docs/VERSION`.

---

## 📋 États par défaut

- Langue par défaut : Français.
- Audience par défaut : “Découvrir”.
- Thèmes du moment : “IA locale”, “Jeunesse”, “Données utiles”, “Écologie”, “Entrepreneuriat”.

---

## 📁 Fichiers liés
- `COPY.fr.md`, `COPY.en.md`, `COPY.es.md` → Contenu textuel.
- `routes.json` → Liens externes.
- `nsb-app.js` → Moteur.
- `nsb-style.css` → Design.
