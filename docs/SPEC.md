# Spécification fonctionnelle – NSB Gateway v2.0

## 🎯 Objectif
Créer une micro-landing page **NORTH★STAR // GATE**, totalement indépendante du template Pwofeel.  
Elle sert de **point d’entrée symbolique et expérientiel** vers l’univers NSB (North Star Business).  
Son rôle n’est pas de vendre, mais d’éveiller — avant de conduire vers la page `/univers` puis le site officiel.

---

## 🧱 Structure générale

1. **Header ultra-compact**
   - Logo NSB (texte ou image)
   - Badge “✔︎ Vérifié”
   - Micro-accroche principale : “Décoder l’intelligence artificielle, ensemble.”
   - Sous-accroche : “Bâtir une culture IA locale.”

2. **Section Héros (Hero)**
   - Titre principal : **NORTH★STAR // GATE ✴︎**
   - Phrase d’intro : “Point d’entrée individuel vers une culture collective.”
   - Image : portrait de dos de Sam (dans un environnement végétal)
   - Nom affiché : “Sam // NSB”
   - Texte narratif :
     > “Tu as croisé ma route — et ce n’est sans doute pas un hasard.  
     > Ici commence une conversation entre toi, l’intelligence artificielle et le monde réel.  
     > Ce n’est pas un programme. Ce n’est pas un réseau.  
     > C’est un mouvement : une façon d’apprendre, de créer et de penser ensemble.  
     > Si tu ressens une forme d’écho, c’est que tu es déjà sur la bonne fréquence.”
   - **CTA principal unique :** “🌠 Entrer dans l’univers NSB” → `/univers`

3. **Barre sociale**
   - Liens vers : LinkedIn, Instagram, (Twitch à venir)

4. **Footer**
   - Mantra : “La donnée devient culture. La culture devient action.”
   - Mention : “© 2025 North Star Business — Guadeloupe.”

---

## 🧩 Page `/univers` (niveau 2 – Éveil)
Page d’orientation indépendante, non indexée dans le site principal.  
Son but : prolonger la Gate, donner du sens, et guider vers la communauté.

### Contenu par blocs :
1. **Bloc 1 – Ce que tu peux faire maintenant**  
   → Rejoindre le flux WhatsApp, ou partager ton intention.  

2. **Bloc 2 – Bientôt**  
   → Présenter les prochaines thématiques (workshops IA locale, culture data, créativité).  

3. **Bloc 3 – Pourquoi NSB existe**  
   → Mission courte : relier la jeunesse, la donnée et le territoire.  

4. **Bloc 4 – Le mouvement**  
   → Micro-preuves (citations, partenaires, images, phrases inspirantes).  

5. **Bloc 5 – CTA final**  
   → “Rejoins le flux NSB” (WhatsApp officiel).

---

## ⚙️ Fonctionnalités techniques

- **Mode indépendant** (`REPLACE_MODE=true`) : remplace le contenu Pwofeel.  
- **Liens centralisés :** tous les URLs sont dans `root.json`.  
- **Multi-langues (i18n) :** FR (par défaut), EN, ES (à venir).  
- **Tracking léger (optionnel) :** clics CTA via `navigator.sendBeacon()`.  
- **Version :** numéro stocké dans `docs/VERSION`.  
- **Responsive complet :** mobile-first, compatible WebView Pwofeel.  
- **Performance :** < 50 Ko au chargement total.  

---

## 📋 États par défaut
- **Langue :** Français.  
- **Mode :** Indépendant.  
- **Audience affichée :** Découverte (par défaut, pas de switch).  
- **CTA :** “Entrer dans l’univers NSB”.  
- **Palette :** Noir, blanc, bleu-cyan.  
- **Police :** Sans-serif légère, moderne, technologique.  

---

## 📁 Fichiers liés

| Fichier | Rôle |
|----------|------|
| `nsb-app.js` | Moteur principal de la Gate (logique, affichage, animation). |
| `nsb-style.css` | Design visuel, transitions, responsive. |
| `root.json` | Liens externes (WhatsApp, site officiel, réseaux sociaux). |
| `copy.fr.md` | Texte complet, version française. |
| `copy.en.md`, `copy.es.md` | Versions à venir. |
| `copy.univers.fr.md` | Contenu textuel complet de la page `/univers`. |
| `spec.md` | Documentation fonctionnelle (ce document). |
| `VERSION` | Numéro de version de la release. |

---

## 📈 Parcours utilisateur
```

Scan de la carte → NORTH★STAR // GATE
↓ (CTA unique)
Page /univers (éveil, sens, lien WhatsApp)
↓
Canal WhatsApp NSB
↓
Site officiel (offres, ressources, communauté)

```

---

## 🎨 Principes visuels & émotionnels
- Minimalisme sacré : chaque élément a une fonction.  
- Sensation de portail / seuil / passage.  
- Couleurs sobres : contraste fort, lueur douce.  
- Émotion dominante : curiosité calme + confiance immédiate.  
- Éviter la surcharge textuelle — exprimer par l’espace et la clarté.

---

## 🚀 Objectifs mesurables

| Axe | Indicateur clé |
|------|----------------|
| Trafic | Nombre de scans et visites sur la Gate |
| Conversion | % clics sur “Entrer dans l’univers NSB” |
| Engagement | % rejoignant le flux WhatsApp |
| Perception | Feedback qualitatif (mystère, cohérence, envie) |

---

## ✅ Prochaines étapes
- [x] Définir la Gate et ses textes (copy.fr.md)  
- [ ] Créer `copy.univers.fr.md`  
- [ ] Intégrer design + logique sur GitHub  
- [ ] Connecter à WordPress (non-indexé)  
- [ ] Tester sur mobile (scan réel)

---

© 2025 — North Star Business / NSB Gateway  
Guadeloupe — IA, Culture & Territoire
