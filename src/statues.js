import * as d3 from 'd3'

export const drawStatues = (decades) => {
    console.log("decades", decades)

    //On extrait le tableau des films des années 80 (pour l'instant)
    const data = decades.movies80s;
    //Calcul du rayon de chaque cercle pour que tout tienne dans le viewport
    const r = window.innerHeight / (3 * data.length - 1)

    //Créer le SVG dans le conteneur HTML de la colonne 80s, avec les bonnes dimensions
    const svg = d3.select('.decade-column[data-decade="1980-1990"] .decade-column__films')
    .append('svg')
    .attr('height', r * (3 * data.length - 1))
    .attr('width', r * 2)

    //Pattern D3 binding : associer chaque film du tableau à un élément <circle>
    svg.selectAll('circle')                                                                                                                                 
    .data(data)                                                                                                                                  
    .join('circle')                                                                                                                                      
    .attr('class', 'film-bubble')
    .attr('r', r)                                                                                                                                      
    .attr('cx', r) 
    .attr('cy', (d, i) => r + i * (3 * r))
} 


