import * as d3 from 'd3'
import { fuckPositions } from './fuck-positions.js'

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
    const containerW = graphNode.getBoundingClientRect().width || window.innerWidth
    const containerH = graphNode.getBoundingClientRect().height || window.innerHeight

    const svg = d3.select('.section-timeline__graph')
        .attr('viewBox', `0 0 ${TOTAL_WIDTH} ${TOTAL_HEIGHT}`)
        .attr('width', containerW)
        .attr('height', containerH)
        .attr('preserveAspectRatio', 'xMidYMid meet')
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
                        tooltip.style.top  = (event.clientY + 20) + 'px'
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
                    tooltip.style.top  = (event.clientY + 20) + 'px'
                })
                .on('mouseout', function () {
                    d3.select(this).attr('opacity', 0.85).attr('stroke', 'none')
                    tooltip.style.display = 'none'
                })
        } else {
            circle.attr('r', pos.r * 0.6).attr('fill', 'rgba(255,255,255,0.08)')
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
            .attr('font-size', 20).attr('opacity', 0.6)
            .text(year)
    })


    // --- LÉGENDE ---
    // Plus d'écart sous la timeline
    const legendY = timelineY + 80
    const FONT = 20
    const R = 8

    // GAUCHE — couleurs (aligné à x=0)
    const leftItems = [
        { fill: '#FFB703',                  label: 'Oscar winner' },
        { fill: '#8ECAE6',                  label: 'Nominated'    },
        { fill: 'rgba(255,255,255,0.08)',    label: 'No data'      },
    ]
    leftItems.forEach((item, i) => {
        const x = i * 220
        svg.append('circle')
            .attr('cx', x + R).attr('cy', legendY)
            .attr('r', R).attr('fill', item.fill)
        svg.append('text')
            .attr('x', x + R * 2 + 6).attr('y', legendY + 6)
            .attr('fill', '#fff').attr('font-size', FONT).attr('opacity', 0.7)
            .text(item.label)
    })

    // DROITE — échelle de taille, bulles puis label à leur gauche
    const scaleValues = [0.2, 0.5, 1].map(p => Math.round(maxFucks * p))
    let cursorX = TOTAL_WIDTH - 10

    ;[...scaleValues].reverse().forEach(value => {
        const r = rScale(value)
        cursorX -= (r + 8)
        svg.append('circle')
            .attr('cx', cursorX).attr('cy', legendY)
            .attr('r', r).attr('fill', 'rgba(255,255,255,0.25)')
        cursorX -= r
    })

    svg.append('text')
        .attr('x', cursorX - 10).attr('y', legendY + 6)
        .attr('text-anchor', 'end')
        .attr('fill', '#fff').attr('font-size', FONT).attr('opacity', 0.5)
        .text('size = total nb of fucks')
}