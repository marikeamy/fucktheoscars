import * as d3 from 'd3'

// DATA LOADING AND CLEANING
const raw = await d3.csv('./data/allMovies.csv')

const filmsMap = new Map()
for (const row of raw) {
    if (!filmsMap.has(row.movie_id) && row.won_oscar === 'True') {
        filmsMap.set(row.movie_id, {
            ...row,
            oscar_year: +row.oscar_year,
            won_oscar: true,
            total_count_fucks: +row.total_count_fucks
        })
    }
}
const films = [...filmsMap.values()]


// filter the winners only, and in chronological order
const oscarWinners = films
    .filter(d => d.won_oscar === true)
    .sort((a, b) => a.oscar_year - b.oscar_year);

console.log(oscarWinners.filter(d => d.oscar_year < 1990))

// SVG, SCALES AND AXES

// create the svgs
const timelineSvg = d3.select('.section-exploration__timeline');
const brushSvg = d3.select('.section-exploration__brush');

// Largeur basée sur le conteneur pour être responsive
// On lit la largeur via l'attribut HTML ou on fallback sur la fenêtre

// On force le recalcul du layout avant de lire la largeur
await new Promise(resolve => requestAnimationFrame(resolve))

const svgNode = timelineSvg.node()

const width = svgNode.clientWidth || svgNode.parentElement.clientWidth || window.innerWidth - 80; 
const timelineHeight = 300;
const brushHeight = 40;
const margin = { top: 20, right: 40, bottom: 30, left: 40 };


const xDomain = d3.extent(oscarWinners, d => d.oscar_year);

// main scale, the dots we see on the screen
const xMain = d3.scaleLinear()
    .domain(xDomain)
    .range([margin.left, width - margin.right]);

// secondary scale, the scroll bar (represents all the years)
const xBrush = d3.scaleLinear()
    .domain(xDomain)
    .range([margin.left, width - margin.right]);

// to display the labels of the decades (1980, 1990...) under the dots
// d3.range generates a list of nb : d3.range(start, end, jump between values)
// Math.floor rounds to the decades
const tickValues = d3.range(Math.floor(xDomain[0] / 10) * 10, xDomain[1] + 10, 10);

// creates horizontal axis based on the temporal values defined above, and with the right format (not american duh)
const xAxisMain = d3.axisBottom(xMain).tickValues(tickValues).tickFormat(d3.format('d'));


const axisGroup = timelineSvg.append('g')
    .attr('transform', `translate(0, ${timelineHeight / 2 + 30})`)
    .attr('color', '#fff') // Axe en blanc pour contraster sur le bleu nuit
    .call(xAxisMain);


// --- 5. MAIN TIMELINE (DOTS) ---
// Masque pour cacher les points qui sortent de l'écran lors du zoom
const defs = timelineSvg.append("defs");
const clipPath = defs.append("clipPath").attr("id", "clip");
clipPath.append("rect")
    .attr("x", margin.left)
    .attr("width", width - margin.left - margin.right)
    .attr("height", timelineHeight);

const dotsGroup = timelineSvg.append('g').attr("clip-path", "url(#clip)");

// Une ligne fine pour servir de "fil" à notre ligne du temps
const timelineLine = dotsGroup.append('line')
    .attr('x1', margin.left)
    .attr('x2', width - margin.right)
    .attr('y1', timelineHeight / 2)
    .attr('y2', timelineHeight / 2)
    .attr('stroke', 'rgba(255,255,255,0.2)');

// Dessin des points jaunes
const dots = dotsGroup.selectAll('.film-dot')
    .data(oscarWinners)
    .join('circle')
    .attr('class', 'film-dot')
    .attr('cx', d => xMain(d.oscar_year))
    .attr('cy', timelineHeight / 2)
    .attr('r', 8)
    .attr('fill', 'var(--yellow)')
    .attr('opacity', 0.9)
    .attr('cursor', 'pointer');

// --- 6. TOOLTIP INTERACTION ---
const tooltip = d3.select('#film-card');

dots
    .on('mouseover', function (event, d) {
        console.log('hover', d) // ← ajoute ça temporairement

        // Le point est entouré de blanc et grossit
        d3.select(this)
            .attr('stroke', '#fff')
            .attr('stroke-width', 3)
            .attr('r', 10);

        // Injection des données dans la carte html
        tooltip.select('.film-card__img').attr('src', d.poster_url || '');
        tooltip.select('.film-card__title').text(`${d.movie_title || 'Unknown'} (${d.oscar_year})`);
        tooltip.select('.film-card__meta').text(`★ Winner | Dir: ${d.director_name || 'Unknown'}`);
        tooltip.select('.film-card__synopsis').text(d.synopsis || '');

        // Génération des tags pour les genres
        const genresContainer = tooltip.select('.film-card__genres');
        genresContainer.html('');
        // trim() pour éviter que les strings vides passent le if
        if (d.genre?.trim()) {
            d.genre.split(',').forEach(g => {
                genresContainer.append('span')
                    .attr('class', 'film-card__genre-tag')
                    .text(g.trim());
            });
        }

        tooltip.style('display', 'block')
    })
    .on('mousemove', (event) => {
        const viz = document.querySelector('.section-exploration__viz')
        const rect = viz.getBoundingClientRect()
        tooltip
            .style('left', (event.clientX - rect.left + 20) + 'px')
            .style('top', (event.clientY - rect.top + 20) + 'px')
    })

    .on('mouseout', function () {
        // Le point redevient normal
        d3.select(this)
            .attr('stroke', 'none')
            .attr('r', 8);

        tooltip.style('display', 'none')
    });

// --- 7. BRUSH (SCROLLBAR DE NAVIGATION) ---
// Ajout de minuscules repères dans la barre de défilement
brushSvg.selectAll('.brush-dot')
    .data(oscarWinners)
    .join('circle')
    .attr('cx', d => xBrush(d.oscar_year))
    .attr('cy', brushHeight / 2 - 10)
    .attr('r', 2)
    .attr('fill', 'var(--yellow)')
    .attr('opacity', 0.5);

const brush = d3.brushX()
    .extent([[margin.left, 0], [width - margin.right, brushHeight - 20]])
    .on('brush end', brushed);

// On sélectionne par défaut un tiers du domaine au chargement
const defaultSpan = (xDomain[1] - xDomain[0]) / 3;
brushSvg.append('g')
    .attr('class', 'brush')
    .call(brush)
    .call(brush.move, [xDomain[0], xDomain[0] + defaultSpan].map(xBrush));

function brushed(event) {
    const selection = event.selection;
    if (!selection) return;

    // Met à jour le zoom et décale les points
    xMain.domain(selection.map(xBrush.invert, xBrush));
    axisGroup.call(xAxisMain);
    dots.attr('cx', d => xMain(d.oscar_year));

    // Met à jour le "fil" pour qu'il reste aligné avec les points
    timelineLine
        .attr('x1', margin.left)
        .attr('x2', width - margin.right);
}

// --- 8. NEXT PAGE NAVIGATION (HORIZONTAL SCROLL) ---
const nextBtn = document.querySelector('.section-exploration__next');

if (nextBtn) {
    nextBtn.addEventListener('click', () => {
        // Avance de 100% de la largeur de la fenêtre (Scroll horizontal pur)
        window.scrollBy({
            left: window.innerWidth,
            behavior: 'smooth'
        });
    });
}

console.log('oscarWinners', oscarWinners)
console.log('xDomain', xDomain)
console.log('width', width)