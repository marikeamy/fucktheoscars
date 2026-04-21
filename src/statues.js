import * as d3 from 'd3'

export const drawStatues = (decades) => {
    console.log(decades)

    //Créer les bulles des statuettes
    d3.select('.decade-column[data-decade="1980-1990"] .decade-column__films')
    .append('svg')
    .selectAll('circle')                                                                                                                                 
    .data(decades.movies80s)                                                                                                                                  
    .join('circle')                                                                                                                                      
    .attr('class', 'film-bubble')
    .attr('r', 10)                                                                                                                                      
    .attr('cx', 10) 
    .attr('cy', (d, i) => i * 25)
} 


