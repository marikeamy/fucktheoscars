import * as d3 from 'd3'
import middleFingerSvg from './assets/middle-finger.svg?raw'

const allImages = import.meta.glob('./assets/images/*/*.{jpg,jpeg,png,webp}', { eager: true })
const normalize = str => str.toLowerCase().replace(/[^a-z0-9]/g, '')

function getMovieImages(movieTitle) {
    const folderNorm = normalize(movieTitle)
    return Object.entries(allImages)
        .filter(([path]) => normalize(path.split('/images/')[1]?.split('/')[0] || '') === folderNorm)
        .map(([, mod]) => mod.default)
}

export function openGuessModal(movie) {
    const modal = document.getElementById('modal-guess')
    modal.querySelector('.modal-guess__film-title').textContent = movie.movie_title
    modal.querySelector('.modal-guess__meta').textContent = `${movie.oscar_year} · ${movie.director_name}`
    modal.querySelector('.modal-guess__genre').textContent = movie.genre
    modal.querySelector('.modal-guess__description').textContent = movie.synopsis

    const guessImgs = getMovieImages(movie.movie_title)
    modal.querySelectorAll('.modal-guess__img-placeholder').forEach((el, i) => {
        el.innerHTML = ''
        if (guessImgs[i]) {
            const img = document.createElement('img')
            img.src = guessImgs[i]
            img.alt = ''
            el.appendChild(img)
        }
    })

    modal.removeAttribute('hidden')

    const hintEl = modal.querySelector('.modal-guess__hint')
    hintEl.style.opacity = '1'

    modal.querySelector('.modal-guess__arrow-hint')?.remove()
    const hintArrow = document.createElement('div')
    hintArrow.className = 'modal-guess__arrow-hint'
    hintArrow.textContent = '↑'

    const container = modal.querySelector('.modal-guess__svg-container')
    container.innerHTML = `
        <div class="finger-base">${middleFingerSvg}</div>
        <div class="finger-fill">${middleFingerSvg}</div>
    `
    container.appendChild(hintArrow)

    const fingerFill = container.querySelector('.finger-fill')
    const countEl = modal.querySelector('.modal-guess__count')
    let fillRatio = 0
    let hintDismissed = false

    const max = Math.max(20, Math.round(+movie.total_count_fucks * (1.1 + Math.random() * 0.2)))
    modal.dataset.maxFucks = max

    const drag = d3.drag()
        .on('drag', (event) => {
            if (!hintDismissed) {
                hintDismissed = true
                hintEl.style.opacity = '0'
                hintArrow.style.opacity = '0'
            }
            const h = container.getBoundingClientRect().height
            fillRatio = Math.max(0, Math.min(1, fillRatio - event.dy / h))
            fingerFill.style.clipPath = `inset(${(1 - fillRatio) * 100}% 0 0 0)`
            countEl.textContent = Math.round(fillRatio * +modal.dataset.maxFucks)
        })

    d3.select(container).call(drag)

    modal.querySelector('.modal-guess__check').onclick = () => {
        const guess = Math.round(fillRatio * +modal.dataset.maxFucks)
        const actual = +movie.total_count_fucks
        modal.setAttribute('hidden', '')
        openResultModal(movie, guess, actual)
    }

    modal.querySelector('.modal-guess__close').onclick = () => modal.setAttribute('hidden', '')

    async function openResultModal(movie, guess, actual) {
        const modal = document.getElementById('modal-result')

        modal.querySelector('.modal-result__film-title').textContent = `${movie.movie_title} - ${movie.oscar_year}`

        const genresEl = modal.querySelector('.modal-result__genres')
        genresEl.innerHTML = ''
        if (movie.genre?.trim()) {
            movie.genre.split(',').forEach(g => {
                const tag = document.createElement('span')
                tag.className = 'modal-result__genre-tag'
                tag.textContent = g.trim()
                genresEl.appendChild(tag)
            })
        }

        const placeholders = modal.querySelectorAll('.modal-result__img-placeholder')
        const imgs = getMovieImages(movie.movie_title)
        placeholders.forEach((el, i) => {
            el.innerHTML = ''
            if (imgs[i]) {
                const img = document.createElement('img')
                img.src = imgs[i]
                img.alt = ''
                el.appendChild(img)
            }
        })

        modal.querySelector('.modal-result__actual-value').textContent = actual
        modal.querySelector('.modal-result__guess-value').textContent = guess

        const diff = Math.abs(guess - actual)
        const pct = actual > 0 ? diff / actual : 1

        let reaction, comment
        if (diff === 0) {
            reaction = 'PERFECT.'
            comment = 'You nailed it exactly. Did you really count?'
        } else if (pct <= 0.2) {
            reaction = 'SO CLOSE.'
            comment = `Only ${diff} fucks off. You clearly have a feel for it.`
        } else if (pct <= 0.6) {
            reaction = 'NOT BAD.'
            comment = `You were ${diff} fucks away. Could be worse.`
        } else {
            reaction = 'NOT EVEN CLOSE.'
            comment = `You missed by ${diff} fucks. Maybe watch the movie first.`
        }

        modal.querySelector('.modal-result__reaction').textContent = reaction
        modal.querySelector('.modal-result__comment').textContent = comment

        const quotesEl = modal.querySelector('.modal-result__quotes')
        const quoteEls = modal.querySelectorAll('.modal-result__quote')
        quotesEl.hidden = true
        quoteEls.forEach(el => {
            el.hidden = true
            el.querySelector('.modal-result__quote-text').textContent = ''
            el.querySelector('.modal-result__quote-timestamp').textContent = ''
        })

        if (actual > 0) {
            const allFucks = await d3.csv('/data/allFucks.csv')
            const fucks = allFucks.filter(f => +f.movie_id === +movie.movie_id).slice(0, 2)
            if (fucks.length > 0) {
                quotesEl.hidden = false
                fucks.forEach((f, i) => {
                    quoteEls[i].hidden = false
                    quoteEls[i].querySelector('.modal-result__quote-text').textContent = f.surrounding_text
                    quoteEls[i].querySelector('.modal-result__quote-timestamp').textContent = f.timestamp
                })
            }
        }

        modal.removeAttribute('hidden')
        document.documentElement.style.overflow = 'hidden'
        document.dispatchEvent(new CustomEvent('guess-submitted'))

        modal.querySelector('.modal-result__continue').onclick = () => {
            modal.classList.add('modal-result--closing')
            setTimeout(() => {
                modal.classList.remove('modal-result--closing')
            modal.setAttribute('hidden', '')
                document.documentElement.style.overflow = ''
            document.querySelector('.section-timeline').scrollIntoView({ behavior: 'smooth' })
            }, 400)
        }
    }
}
