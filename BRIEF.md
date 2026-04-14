# BRIEF — Fuck the Oscars
## Contexte du projet

Projet académique HEIG-VD, cours VisualDon.  
Scrollytelling data visualization analysant les occurrences du mot "fuck" dans les films nominés aux Oscars Best Picture (1980–2024).

**Question centrale :** Les Oscars favorisent-ils les films "bien élevés" ?

---

## Stack technique

- **D3.js** pour toutes les visualisations
- **Vanilla JS** (pas de framework)
- **HTML/CSS** scrollytelling (Intersection Observer API ou Scrollama)
- **Données** : JSON préparé en amont (films, fuck count, genres, timestamps, synopsis, poster URLs)

---

## Palette & identité visuelle

| Élément | Valeur |
|---|---|
| Fond principal | `#0D3349` (bleu nuit) |
| Accent jaune | `#F5C518` (or Oscar) |
| Bleu clair | `#7DB8C8` (bulles/dots) |
| Texte | `#FFFFFF` |
| Fond jaune (sections) | `#F5C518` |
| Texte sur jaune | `#0D3349` |

**Typographie :**
- Titres : fonte impact/condensed (style affiches de cinéma)
- Body : fonte sans-serif lisible
- Titres de section en jaune, labels en blanc

---

## Structure des sections (ordre scrollytelling)
Le scrollytelling peut être horizontal, vertical, et peut être activé via une interaction utilisateur.

### 1. INTRO
**Fond :** jaune (`#F5C518`)  
**Layout :** titre à gauche, colonne d'images de films à droite (stacked verticalement)

**Contenu :**
- Titre principal : *"Are Oscars favoring well behaved movies?"*
- Sous-titre : *"An exploration, explication, fuckation of the word fuck in Oscar Best Pictures nominees."*
- Images : 5–6 stills de films Oscarisés (Pulp Fiction, Parasite, Forrest Gump, etc.)

**Interactions :** flèche qui mène vers la prochaine page, ou scroll horizontal.

---

### 2. EXPLORE MOVIES
**Fond :** bleu nuit (#0D3349) 
**Layout :** texte intro en haut à gauche, timeline de dots en bas, fiche film à droite au hover

**Contenu :**
- Intro text : *"The Oscars have always been a statement about what cinema should look like. Here are every oscar winning movies, from 1980 to 2024."*
- Timeline horizontale : 1 dot = 1 film, répartis sur l'axe X (1980→2024)
- Axe X avec labels décennaux (1980, 1990, 2000…)
- Scrollbar/brush en dessous pour naviguer

**Hover sur un dot → fiche film :**
- Image du film (poster ou still)
- ★ Titre + année + réalisateur (étoile si oscarisé)
- Synopsis court (en jaune)
- Tag genre (pills/badges)

**D3 :** `scaleTime()` sur X, dots positionnés, tooltip custom

**Prochaine page:** Flèche qui mène vers la prochaine page en scroll horizontal. On évite le scroll ici parce que la barre de découverte est déjà en scroll.

---

### 3. STATUETTES (intro au jeu)
**Fond :** bleu nuit  
**Layout :** texte intro en haut, 4 statuettes en dots côte à côte

**Contenu :**
- Titre : *"So, is cinema supposed to be well-behaved? Try to guess the number of fucks in the Oscars."*
- Sous-titre : *"Every oscars and nominees of each decade. Hover the Oscars to explore."*
- 4 statuettes Oscar faites de dots, une par décennie : 1980–1990 / 1990–2000 / 2000–2010 / 2010–2020
- Chaque dot = un film. Couleur : jaune = winner, bleu clair = nominee
- Légende en bas

**Interaction :** clic sur un dot oscarisé (jaune) → ouvre le modal GUESS. On ne va pas à la prochaine page avant d'avoir take a guess.

---

### 4. GUESS MODAL
**Style :** fond jaune, texte bleu foncé — contraste total, rupture visuelle

**Contenu du modal :**
- Titre film + réalisateur + année
- Synopsis court
- Tag genre
- Image du film
- Grand champ numérique : "160" (valeur saisie par l'utilisateur dans le bar chart)
- Bouton **Check**
- Bar chart vide à droite (axe Y : 0–400), qui se remplit avec le curseur

**Comportement :**
- L'utilisateur remplit le bar chart
- Clic Check → ferme le modal → ouvre la section RÉPONSE

---

### 5. RÉPONSE
**Fond :** bleu nuit  
**Layout :** deux colonnes

**Colonne gauche :**
- Titre film + année
- Label *"Actual Total Fucks"*
- Tag genre
- Grand chiffre jaune = réponse réelle
- *"Your guess : [X]"*
- Feedback textuel selon proximité :
  - Exact → *"Perfect."*
  - Proche → *"Close. You clearly have a feel for this."*
  - Loin → *"Not even close. Cinema surprised you."*
- CTA : *"Now, we need to compare it."*

**Colonne droite :**
- Grille de stills du film (2×3 ou 3×3)
- 2–3 extraits de dialogues contenant "fuck" avec timestamp (format `xx:xx:xx – xx:xx:xx`)
- Extraits en jaune (highlight)

**Prochaine page:** Scroll vertical.

---

### 6. FUCK TIMELINE
**Fond :** bleu nuit  
**Question :** *"But how did the number of fucks evolve with time?"*

**Visualisation — Option 1 (PRIORITAIRE) :**
- Les bulles (une par film, taille = fuck count) sont disposées pour former le mot **"FUCK"**
- Axe X temporel en dessous (1980 → 2020+)
- Chaque lettre = une colonne de films d'une période
- Bulles bleues claires, quelques-unes en jaune (winners)

**Visualisation — Option 2 (fallback) :**
- Bubble chart classique sur axe temporel
- Taille des bulles ∝ nombre de "fucks"
- Baseline en bas, bulles "poussent" vers le haut

**D3 :** `forceSimulation()` avec `forceX` sur l'axe temporel, `forceCollide()` pour éviter overlap

**Prochaine page:** Scroll vertical.

---

### 7. CONCLUSION
**Fond :** jaune ou bleu (à définir)  
**Contenu :** à décider à la fin suivant nos trouvailles

Suggestions :
- Stat finale globale (ex: total fucks toutes années confondues)
- Réponse éditoriale à la question centrale
- CTA vers les données / GitHub

---

## Section optionnelle (en standby — ne pas implémenter en priorité)

### INFOS PAR GENRE
Diagramme radial (soleil) : cercle central avec total global, branches = genres, cercles externes proportionnels au nombre de fucks par genre.
- D3 : positions calculées manuellement en coordonnées polaires
- Risque d'être coupée du projet final

---

## Structure de fichiers suggérée

```
fuck-the-oscars/
├── index.html
├── css/
│   └── style.css
├── js/
│   ├── main.js           ← orchestration scroll + sections
│   ├── explore.js        ← section 2 timeline
│   ├── statuettes.js     ← section 3 dot statuettes
│   ├── guess.js          ← modal + interaction
│   ├── response.js       ← section réponse
│   └── timeline.js       ← section fuck timeline D3
├── data/
│   └── movies.csv       ← données films
└── assets/
    └── images/           ← stills de films
```

---

## Format des données (movies.csv)

```csv
à compléter
```

---

## Instructions pour Claude Code

Tu es mon professeur pour ce projet. Ton rôle :
- Me guider étape par étape, sans tout faire à ma place
- Me poser des questions pour vérifier ma compréhension avant de passer à l'étape suivante
- Me donner des pistes et des snippets D3 ciblés quand je bloque
- Valider mon code avant qu'on avance
- Me signaler les pièges classiques (scales, data binding, scroll events)

**Par où commencer :** Structure HTML de base + CSS variables + données JSON mockées pour les 3–4 premiers films.
