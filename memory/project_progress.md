---
name: Project progress
description: État d'avancement du projet fucktheoscars par section
type: project
---

Section 3 (statuettes) terminée pour l'instant :
- 4 colonnes de décennies (80s, 90s, 00s, 2010-2024) dessinées en D3
- Positions extraites dans `statuette-positions.js` (70 points, viewBox 0 0 160 430)
- Cercles : jaune = oscarisé (`won_oscar === 'True'`), bleu = nominé, fantôme = slots vides
- Hover : agrandissement ×2 en CSS
- Layout : `section-statues` en flex colonne, 4 colonnes en flex row

**Prochaine étape :** clic sur un dot → ouvrir la modal "Guess the fucks" (`#modal-guess`)
