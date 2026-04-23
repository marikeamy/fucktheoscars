import * as d3 from 'd3'

const getData = async () => {
    const data = await d3.csv("/data/allMovies.csv")

    //d3.group regroupe les éléments et réduit à une valeur par clé (une Map)
    //On évite ainsi les clones
    const movies = d3.group(data, d => d.movie_id);

    //On transforme la map en tableau, tout en appliquant une fonction de transformation sur chaque entrée
    //On extrait les les rows et on garde uniquement la première, qui possède
    //déjà les infos qui nous sont utiles (title, total_count_fucks)
    const uniqueMovies = Array.from(movies, ([id, rows]) => rows[0]);
    return uniqueMovies;
}

const main = async () => {
    const uniqueMovies = await getData()                                                                                                              
    const moviesByDecade = getMoviesByDecade(uniqueMovies)
    console.log(moviesByDecade)                                                                                                                    
}     

function isFromDecade(movie, decadeMin, decadeMax){
    if(movie.oscar_year >= decadeMin && movie.oscar_year <decadeMax){
        return movie;
    }
}

const getMoviesByDecade = (movies) => {
    const movies80s = movies.filter(movie => isFromDecade(movie, 1980, 1990));
    const movies90s = movies.filter(movie => isFromDecade(movie, 1990, 2000));
    const movies00s = movies.filter(movie => isFromDecade(movie, 2000, 2010));
    const movies10s = movies.filter(movie => isFromDecade(movie, 2010, 2020));
    return {movies80s, movies90s, movies00s, movies10s}
}

main()
export {getData, getMoviesByDecade}