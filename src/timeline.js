import * as d3 from 'd3'
import { fuckPositions } from './fuck-positions.js'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

export const drawEvolution = async (films) => {

    // --- DIMENSIONS ---
    const FUCK_WIDTH = 1120
    const FUCK_HEIGHT = 503
    const EXCL_Y_OFFSET = -76
    const GAP = 30
    const TOTAL_WIDTH = FUCK_WIDTH + GAP + 110
    const CONTENT_OFFSET_Y = 80
    const TOTAL_HEIGHT = CONTENT_OFFSET_Y + FUCK_HEIGHT + 40 + 80 + 40
    //                                                    ^      ^   ^
    //                                               timeline  légende  marge bulle

    const letterConfig = [
        { letter: 'F', decadeStart: 1980, decadeEnd: 1990 },
        { letter: 'U', decadeStart: 1990, decadeEnd: 2000 },
        { letter: 'C', decadeStart: 2000, decadeEnd: 2010 },
        { letter: 'K', decadeStart: 2010, decadeEnd: 2020 },
        { letter: '!', decadeStart: 2020, decadeEnd: 2030 },
    ]

    const filmsByDecade = {}
    for (const { letter, decadeStart, decadeEnd } of letterConfig) {
        filmsByDecade[letter] = films.filter(d =>
            d.oscar_year >= decadeStart && d.oscar_year < decadeEnd
        )
    }

    const maxFucks = d3.max(films, d => d.total_count_fucks) || 1
    const rScale = d3.scaleSqrt()
        .domain([0, maxFucks])
        .range([3, 12])

    // Lire les dimensions réelles du conteneur
    const graphNode = d3.select('.section-timeline__graph').node()
    await new Promise(resolve => requestAnimationFrame(resolve))

    const svg = d3.select('.section-timeline__graph')
        .attr('viewBox', `0 0 ${TOTAL_WIDTH} ${TOTAL_HEIGHT}`)
        .attr('height', '70vh')   // hauteur fixe comme statues.js
        .attr('width', 'auto')    // largeur suit automatiquement
        .style('display', 'block')
        .style('margin', '0 auto')

    // Le tooltip (même logique que statues.js)
    const tooltip = document.querySelector('.statue-tooltip')


    // --- LETTRES F, U, C, K ---
    for (const { letter } of letterConfig.filter(l => l.letter !== '!')) {
        const positions = fuckPositions[letter]?.positions || []
        const sortedFilms = [...(filmsByDecade[letter] || [])].sort((a, b) => b.total_count_fucks - a.total_count_fucks)

        const group = svg.append('g')
            .attr('class', `letter-group letter-${letter}`)
            .attr('transform', `translate(0, ${CONTENT_OFFSET_Y})`)

        positions.forEach((pos, i) => {
            const film = sortedFilms[i]
            const circle = group.append('circle').attr('cx', pos.cx).attr('cy', pos.cy)

            if (film) {
                const isWinner = film.won_oscar === 'True' || film.won_oscar === true
                circle
                    .attr('r', rScale(film.total_count_fucks))
                    .attr('fill', isWinner ? '#FFB703' : '#8ECAE6')
                    .attr('opacity', 0.85)
                    .attr('cursor', 'pointer')
                    .on('mouseover', function (event) {
                        d3.select(this).attr('opacity', 1).attr('stroke', '#fff').attr('stroke-width', 2)
                        tooltip.textContent = `${film.movie_title} (${film.oscar_year}) — ${film.total_count_fucks} fucks`
                        tooltip.style.display = 'block'
                    })
                    .on('mousemove', (event) => {
                        tooltip.style.left = (event.clientX + 20) + 'px'
                        tooltip.style.top = (event.clientY + 20) + 'px'
                    })
                    .on('mouseout', function () {
                        d3.select(this).attr('opacity', 0.85).attr('stroke', 'none')
                        tooltip.style.display = 'none'
                    })
            } else {
                // Position vide : bulle fantôme (0 fucks ou pas de film)
                circle.attr('r', pos.r * 0.6).attr('fill', 'rgba(255,255,255,0.08)')
            }
        })
    }


    // --- LETTRE ! ---
    const exclPositions = fuckPositions['!']?.positions || []
    const exclFilms = [...(filmsByDecade['!'] || [])].sort((a, b) => b.total_count_fucks - a.total_count_fucks)

    // translateX : décale à droite après FUCK + GAP
    // translateY : remonte le ! pour aligner sa base avec celle de FUCK
    const exclGroup = svg.append('g')
        .attr('class', 'letter-group letter-!')
        .attr('transform', `translate(${FUCK_WIDTH + GAP}, ${CONTENT_OFFSET_Y + EXCL_Y_OFFSET})`)

    exclPositions.forEach((pos, i) => {
        const film = exclFilms[i]
        const circle = exclGroup.append('circle').attr('cx', pos.cx).attr('cy', pos.cy)

        if (film) {
            const isWinner = film.won_oscar === 'True' || film.won_oscar === true
            
            circle
                .attr('r', rScale(film.total_count_fucks))
                .attr('fill', isWinner ? 'var(--yellow)' : 'var(--accent-color-blue)')
                // 1. AJOUT DE LA CLASSE CSS (active tes effets de hover et ton cursor:pointer !)
                .attr('class', isWinner ? 'timeline-dot' : '')
                
                // 2. AJOUT DU CLIC POUR LA MODALE
                .on('click', (event) => {
                    if (isWinner) {
                        // Assure-toi d'avoir importé ou copié la fonction openGuessModal ici !
                        openGuessModal(film);
                    }
                })
                
                .on('mouseover', function (event) {
                    // 3. On ne fait plus de stroke/opacity ici, ton CSS s'en charge !
                    // On utilise JS uniquement pour injecter le texte
                    tooltip.textContent = `${film.movie_title} (${film.oscar_year}) — ${film.total_count_fucks} fucks`
                    tooltip.style.display = 'block'
                })
                .on('mousemove', (event) => {
                    tooltip.style.left = (event.clientX + 20) + 'px'
                    tooltip.style.top = (event.clientY + 20) + 'px'
                })
                .on('mouseout', function () {
                    tooltip.style.display = 'none'
                })
        }
    })


    // --- TIMELINE ---
    const timelineY = CONTENT_OFFSET_Y + FUCK_HEIGHT + 25
    const letterCenters = {
        1980: 110,
        1990: 385,
        2000: 670,
        2010: 930,
        2020: FUCK_WIDTH + GAP + 55,
    }

    svg.append('line')
        .attr('x1', 0).attr('x2', TOTAL_WIDTH)
        .attr('y1', timelineY).attr('y2', timelineY)
        .attr('stroke', 'rgba(255,255,255,0.2)').attr('stroke-width', 1)

    Object.entries(letterCenters).forEach(([year, x]) => {
        svg.append('line')
            .attr('x1', x).attr('x2', x)
            .attr('y1', timelineY - 5).attr('y2', timelineY + 5)
            .attr('stroke', 'rgba(255,255,255,0.4)').attr('stroke-width', 1)
        svg.append('text')
            .attr('x', x).attr('y', timelineY + 22)
            .attr('text-anchor', 'middle').attr('fill', '#fff')
            .attr('font-size', 16).attr('opacity', 0.6)
            .text(year)
    })


    // Bulles d'échelle dans le SVG HTML (pas dans le grand SVG D3)
    const scaleSvg = d3.select('.timeline-legend__scale')
    const scaleValues = [0.2, 0.5, 1].map(p => Math.round(maxFucks * p))
    let cx = 80
        ;[...scaleValues].reverse().forEach(value => {
            const r = rScale(value)
            cx -= (r + 6)
            scaleSvg.append('circle')
                .attr('cx', cx).attr('cy', 16)
                .attr('r', r).attr('fill', 'rgba(255,255,255,0.25)')
            cx -= r
        })

        // --- FAUX SCROLL HORIZONTAL (GSAP) ---
    
    // On attend un court instant pour s'assurer que D3 a fini de peindre et que les dimensions sont définitives
    setTimeout(() => {
        // Le conteneur qui sera épinglé (remplace par la bonne classe de ta section parent)
        const sectionContainer = document.querySelector('.section-timeline') || svg.node().parentElement;
        const svgElement = svg.node();

        // On calcule la portion de l'image qui dépasse de l'écran à droite
        // getBoundingClientRect().width nous donne la largeur réelle calculée via le 70vh
        const overflowWidth = svgElement.getBoundingClientRect().width - window.innerWidth;

        // On n'active l'effet que si l'image est effectivement plus large que l'écran
        if (overflowWidth > 0) {
            gsap.to(svgElement, {
                x: -overflowWidth - 60, // -60 pour avoir une petite marge respirante à la fin
                ease: "none", // important pour un scroll fluide et linéaire
                scrollTrigger: {
                    trigger: sectionContainer,
                    pin: true, // On épingle la section pendant le scroll
                    scrub: 1,  // L'animation suit la molette avec 1s de lissage
                    // La distance de scroll vertical nécessaire pour parcourir toute l'image
                    end: () => `+=${overflowWidth}`, 
                    invalidateOnRefresh: true
                }
            });
        }
    }, 100);

}