import * as d3 from 'd3'
import { positions } from './statuette-positions.js'
//Le raw permet de demander à Vite d'importer le SVG en tant qu'image, et pas en tant
//que ref. Utile pour l'utilisation dans le DOM + la gestion D3.
import middleFingerSvg from './assets/middle-finger.svg?raw'

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
            .data(combined)
            .join('circle')
            .attr('r', 6.5)
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

    function openGuessModal(movie) {                                                                                                                    
        const modal = document.getElementById('modal-guess')
        modal.querySelector('.modal-guess__film-title').textContent = movie.movie_title
        modal.querySelector('.modal-guess__meta').textContent = `${movie.oscar_year} · ${movie.director_name}` 
        modal.querySelector('.modal-guess__genre').textContent = movie.genre      
        modal.querySelector('.modal-guess__description').textContent = movie.synopsis                                           
        modal.removeAttribute('hidden')  

        const container = modal.querySelector('.modal-guess__svg-container')
        container.innerHTML=`
            <div class= "finger-base">${middleFingerSvg}</div>
            <div class= "finger-fill">${middleFingerSvg}</div>
        `

        const fingerFill = container.querySelector('.finger-fill')                                                                                                                                                     
        const countEl = modal.querySelector('.modal-guess__count')                                                                                                                                                     
        let fillRatio = 0                                                                                                                                                                                              
                
        //Définir un max de + ou - 20% supp. que le nombre total de fucks dans un film. 
        //Pourcentage calculé de manière random.
        const max = Math.round(movie.total_count_fucks * (1.1 + Math.random() * 0.2))                                                                                                                                  
        modal.dataset.maxFucks = max     

        //Gestion du drag interne au fuck.
        const drag = d3.drag()                                                                                                                                                                                         
            .on('drag', (event) => {
                //getBoundingClientRect() ?
                const h = container.getBoundingClientRect().height  
                //claude chariabia et des maths, un vrai plaisir                                                                                                                                                   
                fillRatio = Math.max(0, Math.min(1, fillRatio - event.dy / h))                                                                                                                                         
                fingerFill.style.clipPath = `inset(${(1 - fillRatio) * 100}% 0 0 0)`
                countEl.textContent = Math.round(fillRatio * +modal.dataset.maxFucks)                                                                                                                                  
            })

        d3.select(container).call(drag)

        //Gestion bouton "check"
        modal.querySelector('.modal-guess__check').onclick = () => {
            const guess = Math.round(fillRatio * +modal.dataset.maxFucks)                                                                                                                                              
            const actual = +movie.total_count_fucks                                                                                                                                                                    
            modal.setAttribute('hidden', '')                                                                                                                                                                           
            openResultModal(movie, guess, actual)                                                                                                                                                                      
        } 

        //Ouvrir la page de résultat
          function openResultModal(movie, guess, actual) {
            const modal = document.getElementById('modal-result')
            modal.querySelector('.modal-result__film-title').textContent = movie.movie_title
            modal.querySelector('.modal-result__guess-value').textContent = guess
            modal.querySelector('.modal-result__response').textContent = actual

            const diff = Math.abs(guess - actual)
            const pct = actual > 0 ? diff / actual : 1

            let reaction, comment
            if (diff === 0) {
                reaction = 'PERFECT.'
                comment = 'You nailed it exactly. Are you sure you haven\'t seen this movie?'
            } else if (pct <= 0.15) {
                reaction = 'SO CLOSE.'
                comment = `Only ${diff} fucks off. You clearly have a feel for it.`
            } else if (pct <= 0.4) {
                reaction = 'NOT BAD.'
                comment = `You were ${diff} fucks away. Could be worse.`
            } else {
                reaction = 'NOT EVEN CLOSE.'
                comment = `You missed by ${diff} fucks. Maybe watch the movie first.`
            }

            modal.querySelector('.modal-result__reaction').textContent = reaction
            modal.querySelector('.modal-result__comment').textContent = comment
            modal.removeAttribute('hidden')
            modal.scrollIntoView({ behavior: 'smooth' })
            document.dispatchEvent(new CustomEvent('guess-submitted'))

            modal.querySelector('.modal-result__continue').onclick = () => {
                modal.setAttribute('hidden', '')
                document.querySelector('.section-timeline').scrollIntoView({ behavior: 'smooth' })
            }
        }          

        //Gestion de la croix pour fermer. Possible de faire un esc aussi plus tard ?       
        modal.querySelector('.modal-guess__close').onclick = () => modal.setAttribute('hidden', '')   
        
    }  
}




