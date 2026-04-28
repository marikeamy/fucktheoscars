import * as d3 from 'd3'
import { fuckPositions } from './fuck-positions.js'

export const drawEvolution = (films) => {

    // Le SVG source fait 1268x503 — on garde ce ratio pour le scaling
    const SOURCE_WIDTH = 1268
    const SOURCE_HEIGHT = 503
    

    // Quelle décennie va dans quelle lettre
    const letterConfig = [
        { letter: 'F', decadeStart: 1980, decadeEnd: 1990 },
        { letter: 'U', decadeStart: 1990, decadeEnd: 2000 },
        { letter: 'C', decadeStart: 2000, decadeEnd: 2010 },
        { letter: 'K', decadeStart: 2010, decadeEnd: 2020 },
        { letter: '!', decadeStart: 2020, decadeEnd: 2030 },
    ]

    // Filtrer les films par décennie
    const filmsByDecade = {}
    for (const { letter, decadeStart, decadeEnd } of letterConfig) {
        filmsByDecade[letter] = films.filter(d =>
            d.oscar_year >= decadeStart && d.oscar_year < decadeEnd
        )
    }

    // Scale pour la taille des bulles : basée sur total_count_fucks
    const maxFucks = d3.max(films, d => d.total_count_fucks) || 1
    const rScale = d3.scaleSqrt()
        .domain([0, maxFucks])
        .range([3, 12]) // rayon min/max en px (dans l'espace source 1268px)

    // Conteneur principal
    const container = d3.select('.section-timeline__graph')

    // On crée un SVG qui prend toute la largeur, avec le bon ratio
    const svgNode = container.node()
    const containerWidth = svgNode.getBoundingClientRect().width || window.innerWidth - 80

    const svg = container
        .attr('viewBox', `0 0 ${SOURCE_WIDTH} ${SOURCE_HEIGHT + 80}`) // +80 pour la timeline en bas
        .attr('width', '100%')
        .attr('preserveAspectRatio', 'xMidYMid meet')

    // --- LETTRES (bulles de données) ---
    for (const { letter, decadeStart } of letterConfig) {
        const positions = fuckPositions[letter]?.positions || []
        const decadeFilms = filmsByDecade[letter] || []

        // On trie les films par nb de fucks desc pour mettre les plus gros en premier
        const sortedFilms = [...decadeFilms].sort((a, b) => b.total_count_fucks - a.total_count_fucks)

        const group = svg.append('g').attr('class', `letter-group letter-${letter}`)

        // On place autant de bulles qu'il y a de positions dans le SVG source
        positions.forEach((pos, i) => {
            const film = sortedFilms[i] // undefined si plus de films que de positions

            const circle = group.append('circle')
                .attr('cx', pos.cx)
                .attr('cy', pos.cy)

            if (film) {
                // Bulle réelle : taille relative au nb de fucks
                const r = rScale(film.total_count_fucks)
                const isWinner = film.won_oscar === 'True' || film.won_oscar === true

                circle
                    .attr('r', r)
                    .attr('fill', isWinner ? '#FFB703' : '#8ECAE6')
                    .attr('opacity', 0.85)
                    .attr('cursor', 'pointer')
                    .on('mouseover', function (event, d) {
                        d3.select(this).attr('opacity', 1).attr('stroke', '#fff').attr('stroke-width', 2)
                        // TODO: afficher un tooltip si besoin
                    })
                    .on('mouseout', function () {
                        d3.select(this).attr('opacity', 0.85).attr('stroke', 'none')
                    })

                // Tooltip title natif pour l'instant
                circle.append('title').text(`${film.movie_title} (${film.oscar_year}) — ${film.total_count_fucks} fucks`)
            } else {
                // Position vide : bulle fantôme discrète
                circle
                    .attr('r', pos.r * 0.6)
                    .attr('fill', 'rgba(255,255,255,0.08)')
            }
        })
    }

    // --- TIMELINE EN BAS ---
    // Les lettres couvrent x: 0 à 1268, on place les labels de décennies dessous
    const decades = [1980, 1990, 2000, 2010, 2020]

    // Positions X approximatives du centre de chaque lettre dans le viewBox
    const letterCenters = {
        1980: 40,   // F
        1990: 385,   // U
        2000: 670,   // C
        2010: 975,   // K
        2020: 1210,  // !
    }

    const timelineY = SOURCE_HEIGHT + 40

    // Ligne horizontale
    svg.append('line')
        .attr('x1', 0)
        .attr('x2', SOURCE_WIDTH)
        .attr('y1', timelineY)
        .attr('y2', timelineY)
        .attr('stroke', 'rgba(255,255,255,0.2)')
        .attr('stroke-width', 1)

    // Labels des décennies
    decades.forEach(year => {
        const x = letterCenters[year]

        // Tick
        svg.append('line')
            .attr('x1', x)
            .attr('x2', x)
            .attr('y1', timelineY - 6)
            .attr('y2', timelineY + 6)
            .attr('stroke', 'rgba(255,255,255,0.4)')
            .attr('stroke-width', 1)

        // Label
        svg.append('text')
            .attr('x', x)
            .attr('y', timelineY + 28)
            .attr('text-anchor', 'middle')
            .attr('fill', '#fff')
            .attr('font-size', 14)
            .attr('opacity', 0.6)
            .text(year)
    })

    // --- LÉGENDE ---
    const legendX = SOURCE_WIDTH - 220
    const legendY = SOURCE_HEIGHT + 15

    // Oscar winner
    svg.append('circle').attr('cx', legendX).attr('cy', legendY).attr('r', 7).attr('fill', '#FFB703')
    svg.append('text').attr('x', legendX + 14).attr('y', legendY + 5).attr('fill', '#fff').attr('font-size', 13).text('Oscar winner')

    // Nominé
    svg.append('circle').attr('cx', legendX + 130).attr('cy', legendY).attr('r', 7).attr('fill', '#8ECAE6')
    svg.append('text').attr('x', legendX + 144).attr('y', legendY + 5).attr('fill', '#fff').attr('font-size', 13).text('Nominated')
}
