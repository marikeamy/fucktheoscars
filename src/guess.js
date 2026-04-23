const MAX_FUCKS = 400

const modal = document.getElementById('modal-guess')
const barFill = modal.querySelector('.modal-guess__bar-fill')
const input = modal.querySelector('.modal-guess__number-input')
const submitBtn = modal.querySelector('.modal-guess__submit')
const overlay = modal.querySelector('.modal-guess__overlay')

let currentFilm = null

// Ouvre la modal avec les données d'un film
export function openGuessModal(film) {
  currentFilm = film

  modal.querySelector('.modal-guess__film-title').textContent = film.movie_title
  modal.querySelector('.modal-guess__meta').textContent = `${film.director_name} · ${film.oscar_year}`
  modal.querySelector('.modal-guess__description').textContent = film.synopsis || ''
  modal.querySelector('.modal-guess__img').src = film.poster_url || ''

  // Genres
  const genresContainer = modal.querySelector('.modal-guess__genres')
  genresContainer.innerHTML = ''
  if (film.genre?.trim()) {
    film.genre.split(',').forEach(g => {
      const tag = document.createElement('span')
      tag.className = 'modal-guess__genre-tag'
      tag.textContent = g.trim()
      genresContainer.appendChild(tag)
    })
  }

  // Reset
  input.value = ''
  barFill.style.height = '0%'

  modal.removeAttribute('hidden')
}

function closeGuessModal() {
  modal.setAttribute('hidden', true)
  currentFilm = null
}

// La barre suit l'input en temps réel
input.addEventListener('input', () => {
  const val = Math.min(Math.max(0, +input.value), MAX_FUCKS)
  const pct = (val / MAX_FUCKS) * 100
  barFill.style.height = `${pct}%`
})

// Check → ferme et ouvre la page résultat (à brancher)
submitBtn.addEventListener('click', () => {
  if (!currentFilm) return
  const guess = +input.value
  closeGuessModal()
  // TODO: openResultPage(currentFilm, guess)
  console.log('guess:', guess, 'réel:', currentFilm.total_count_fucks)
})

// Clic sur l'overlay = ferme
overlay.addEventListener('click', closeGuessModal)



// A METTRE DANS STATUES.JS
import { openGuessModal } from './guess.js'

// Dans la création des dots, ajoute :
dots.on('click', (event, d) => {
  openGuessModal(d)
})