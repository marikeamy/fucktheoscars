import * as d3 from 'd3'
import { positions } from './statuette-positions.js'

export const drawStatues = (decades) => {

    const decadeList = [                                                                                                                                                                                      
    { key: 'movies80s', label: '1980-1990' },
    { key: 'movies90s', label: '1990-2000' },                                                                                                                                                               
    { key: 'movies00s', label: '2000-2010' },
    { key: 'movies10s', label: '2010-2024' },                                                                                                                                                               
    ]          

    decadeList.forEach(({ key, label }) => {
        const data = decades[key].slice(0, positions.length)

        const svg = d3.select(`.decade-column[data-decade="${label}"] .decade-column__films`)
            .append('svg')
            //C'est quoi une viewbox ?
            .attr('viewBox', '0 0 160 430')
            .attr('height', '55vh')
            .attr('width', 'auto')

        //Il nous faut un tableau qui contient positions + data des films pour pouvoir y ajouter
        //un event listener comprenant toutes les données.
        const combined = positions.map((pos, i) => ({ ...pos, movie: data[i] ?? null }))  

        svg.selectAll('circle')
            .data(combined)
            .join('circle')
            .attr('r', 6.5)
            .attr('cx', d => d.cx)
            .attr('cy', d => d.cy)
            .attr('fill', (d, i) => {
                //vérifier que le film existe (pour les cercles inactifs)
                if (!d.movie) return 'rgba(255,255,255,0.12)'
                return d.movie.won_oscar === 'True' ? '#FFB703' : '#8ECAE6' 
                //puis ajout de l'event
            }).on('click', (event, d) => {
                if(!d.movie) return
                openGuessModal(d.movie)
            })
    })

    function openGuessModal(movie) {                                                                                                                    
        const modal = document.getElementById('modal-guess')
        modal.querySelector('.modal-guess__film-title').textContent = movie.movie_title
        modal.querySelector('.modal-guess__meta').textContent = `${movie.oscar_year} · ${movie.director_name}` 
        modal.querySelector('.modal-guess__genre').textContent = movie.genre                                                
        modal.removeAttribute('hidden')  

        //Gestion de la croix pour fermer. Possible de faire un esc aussi plus tard ?       
        modal.querySelector('.modal-guess__close').onclick = () => modal.setAttribute('hidden', '')   
        
    }  
}


