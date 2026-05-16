import * as d3 from 'd3'
import { positions } from './statuette-positions.js'
import { openGuessModal } from './modal.js'

export const drawStatues = (decades) => {

    const decadeList = [                                                                                                                                                                                      
    { key: 'movies80s', label: '1980-1990' },
    { key: 'movies90s', label: '1990-2000' },                                                                                                                                                               
    { key: 'movies00s', label: '2000-2010' },
    { key: 'movies10s', label: '2010-2024' },                                                                                                                                                               
    ]          


    //Le tooltip (petit pop-up qui vient au hover des oscarisés dans les statues)
    const tooltip = document.querySelector(".statue-tooltip")

    decadeList.forEach(({ key, label }) => {
        const data = decades[key].slice(0, positions.length)

        const svg = d3.select(`.decade-column[data-decade="${label}"] .decade-column__films`)
            .append('svg')
            //C'est quoi une viewbox ?
            .attr('viewBox', '0 0 160 430')
            .attr('height', '50vh')
            .attr('width', 'auto')

        //Il nous faut un tableau qui contient positions + data des films pour pouvoir y ajouter
        //un event listener comprenant toutes les données.
        const combined = positions.map((pos, i) => ({ ...pos, movie: data[i] ?? null }))

        //Création des cercles
        svg.selectAll('circle')
            .data(combined.slice().sort((a, b) => (a.movie?.won_oscar === 'True' ? 1 : 0) - (b.movie?.won_oscar === 'True' ? 1 : 0)))
            .join('circle')
            .attr('r', 5)
            .attr('cx', d => d.cx)
            .attr('cy', d => d.cy)
            .attr('class', d => d.movie?.won_oscar === 'True' ? 'circle--winner' : '')
            .attr('fill', (d, i) => {
                //vérifier que le film existe (pour les cercles inactifs)
                if (!d.movie) return 'rgba(255,255,255,0.12)'
                return d.movie.won_oscar === 'True' ? '#FFB703' : '#8ECAE6' 
                //puis ajout de l'event
            }).on('click', (event, d) => {
                if(!d.movie || d.movie.won_oscar !== 'True') return
                openGuessModal(d.movie)
            })  .on('mouseover', (event, d) => {
                //Mouseover sur le cercle, affiche le petit tooltip
                if (!d.movie || d.movie.won_oscar !== 'True') return                                                                                                 
                tooltip.textContent = d.movie.movie_title                                                                                                            
                tooltip.style.display = 'block'                                                                                                                      
            })                                                                                                                                                       
            .on('mousemove', (event) => {    
                //Afficher le tooltip selon une position donnée
                tooltip.style.left = (event.clientX + 20) + 'px';
                tooltip.style.top = (event.clientY + 20) + 'px';                                                                                
            })                                                                                                                                                       
            .on('mouseout', () => {
                //désactivation
                tooltip.style.display = 'none'                                                                                                                            
            })       

    })

}




