# BRIEF — Fuck the Oscars
## Project Context

Academic project at HEIG-VD, VisualDon course.
Scrollytelling data visualization analyzing occurrences of the word "fuck" in Oscar Best Picture nominees (1980–2024).

**Central question:** Do the Oscars favor "well-behaved" movies?

---

## Tech Stack

- **D3.js** for all visualizations
- **Vanilla JS** (no framework)
- **HTML/CSS** scrollytelling (Intersection Observer API or Scrollama)
- **Data**: JSON prepared upstream (films, fuck count, genres, timestamps, synopsis, poster URLs)

---

## Palette & Visual Identity

| Element | Value |
|---|---|
| Main background | `#0D3349` (midnight blue) |
| Yellow accent | `#F5C518` (Oscar gold) |
| Light blue | `#7DB8C8` (bubbles/dots) |
| Text | `#FFFFFF` |
| Yellow background (sections) | `#F5C518` |
| Text on yellow | `#0D3349` |

**Typography:**
- Titles: impact/condensed font (movie poster style)
- Body: readable sans-serif font
- Section titles in yellow, labels in white

---

## Section Structure (scrollytelling order)
The scrollytelling can be horizontal, vertical, and can be triggered by user interaction.

### 1. INTRO
**Background:** yellow (`#F5C518`)
**Layout:** title on the left, column of film images on the right (stacked vertically)

**Content:**
- Main title: *"Are Oscars favoring well behaved movies?"*
- Subtitle: *"An exploration, explication, fuckation of the word fuck in Oscar Best Pictures nominees."*
- Images: 5–6 stills from Oscar-winning films (Pulp Fiction, Parasite, Forrest Gump, etc.)

**Interactions:** arrow leading to the next page, or horizontal scroll.

---

### 2. EXPLORE MOVIES
**Background:** midnight blue (#0D3349)
**Layout:** intro text top left, dot timeline at the bottom, film card on the right on hover

**Content:**
- Intro text: *"The Oscars have always been a statement about what cinema should look like. Here are every oscar winning movies, from 1980 to 2024."*
- Horizontal timeline: 1 dot = 1 film, spread across the X axis (1980→2024)
- X axis with decade labels (1980, 1990, 2000…)
- Scrollbar/brush below for navigation

**Hover on a dot → film card:**
- Film image (poster or still)
- ★ Title + year + director (star if Oscar winner)
- Short synopsis (in yellow)
- Genre tag (pills/badges)

**D3:** `scaleTime()` on X, positioned dots, custom tooltip

**Next page:** Arrow leading to the next page via horizontal scroll. We avoid scroll here because the discovery bar already uses scroll.

---

### 3. STATUETTES (game intro)
**Background:** midnight blue
**Layout:** intro text at the top, 4 dot statuettes side by side

**Content:**
- Title: *"So, is cinema supposed to be well-behaved? Try to guess the number of fucks in the Oscars."*
- Subtitle: *"Every oscars and nominees of each decade. Hover the Oscars to explore."*
- 4 Oscar statuettes made of dots, one per decade: 1980–1990 / 1990–2000 / 2000–2010 / 2010–2020
- Each dot = one film. Color: yellow = winner, light blue = nominee
- Legend at the bottom

**Interaction:** click on an Oscar-winning dot (yellow) → opens the GUESS modal. We don't go to the next page before taking a guess.

---

### 4. GUESS MODAL
**Style:** yellow background, dark blue text — total contrast, visual break

**Modal content:**
- Film title + director + year
- Short synopsis
- Genre tag
- Film image
- Large numeric field: "160" (value entered by the user in the bar chart)
- **Check** button
- Empty bar chart on the right (Y axis: 0–400), filled with the cursor

**Behavior:**
- The user fills the bar chart
- Click Check → closes the modal → opens the ANSWER section

---

### 5. ANSWER
**Background:** midnight blue
**Layout:** two columns

**Left column:**
- Film title + year
- Label *"Actual Total Fucks"*
- Genre tag
- Large yellow number = real answer
- *"Your guess: [X]"*
- Text feedback based on accuracy:
  - Exact → *"Perfect."*
  - Close → *"Close. You clearly have a feel for this."*
  - Far off → *"Not even close. Cinema surprised you."*
- CTA: *"Now, we need to compare it."*

**Right column:**
- Grid of film stills (2×3 or 3×3)
- 2–3 dialogue excerpts containing "fuck" with timestamp (format `xx:xx:xx – xx:xx:xx`)
- Excerpts highlighted in yellow

**Next page:** Vertical scroll.

---

### 6. FUCK TIMELINE
**Background:** midnight blue
**Question:** *"But how did the number of fucks evolve with time?"*

**Visualization — Option 1 (PRIORITY):**
- Bubbles (one per film, size = fuck count) are arranged to form the word **"FUCK"**
- Temporal X axis below (1980 → 2020+)
- Each letter = a column of films from a given period
- Light blue bubbles, a few in yellow (winners)

**Visualization — Option 2 (fallback):**
- Classic bubble chart on a temporal axis
- Bubble size ∝ number of "fucks"
- Baseline at the bottom, bubbles "grow" upward

**D3:** `forceSimulation()` with `forceX` on the temporal axis, `forceCollide()` to avoid overlap

**Next page:** Vertical scroll.

---

### 7. CONCLUSION
**Background:** yellow or blue (TBD)
**Content:** to be decided at the end based on our findings

Suggestions:
- Final global stat (e.g. total fucks across all years)
- Editorial answer to the central question
- CTA toward the data / GitHub

---

## Optional Section (on standby — not a priority to implement)

### INFO BY GENRE
Radial (sunburst) diagram: central circle with global total, branches = genres, outer circles proportional to the number of fucks per genre.
- D3: positions calculated manually in polar coordinates
- Risk of being cut from the final project

---

## Suggested File Structure

```
fuck-the-oscars/
├── index.html
├── css/
│   └── style.css
├── js/
│   ├── main.js           ← scroll orchestration + sections
│   ├── explore.js        ← section 2 timeline
│   ├── statuettes.js     ← section 3 dot statuettes
│   ├── guess.js          ← modal + interaction
│   ├── response.js       ← answer section
│   └── timeline.js       ← fuck timeline D3 section
├── data/
│   └── movies.csv        ← film data
└── assets/
    └── images/           ← film stills
```

---

## Data Format (movies.csv)

```csv
to be completed
```