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
            .attr('viewBox', '0 0 160 430')
            .attr('height', '55vh')
            .attr('width', 'auto')

        svg.selectAll('circle')
            .data(positions)
            .join('circle')
            .attr('r', 6.5)
            .attr('cx', d => d.cx)
            .attr('cy', d => d.cy)
            .attr('fill', (d, i) => {
                if (i >= data.length) return 'rgba(255,255,255,0.12)'
                return data[i].won_oscar === 'True' ? '#FFB703' : '#8ECAE6'
            })
    })
}


