import './style.css' 
import { getData, getMoviesByDecade } from './data.js'
import { drawStatues } from './statues.js'
import { drawEvolution } from './evolution.js'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

//Enregistrer le plugin.
//Gsap utilise un système de plug-ins opt-ing, 
//il faut préciser qu'il faut activer ScrollTrigger pour l'utiliser.
gsap.registerPlugin(ScrollTrigger)

//L'élément qui se déplacera
const horizontalWrapper = document.querySelector('.horizontal-wrapper');

//Gestion du scroll horizontal
gsap.to(horizontalWrapper, {     
    //x = de combien on déplace horizontalement                                                                                                                             
    x: () => -(window.innerWidth * 2),                                                                                                                                        
    scrollTrigger: {                                                                                                                                  
      trigger: horizontalWrapper,
      pin: true,
      scrub: 1,
      anticipatePin: 1,
      //end définit combien de scroll vertical déclenche l'animation.
      end: () => "+=" + (window.innerWidth * 2),
      //Demande à GSAP de recalculer les valeurs si la fenêtre change. Permet d'éviter les problèmes
      //de changement de taille de page.
      //Il faut aussi passer end et x en fonction fléchées pour que ça fonctionne.
      invalidateOnRefresh: true                                                                                                                            
    }             
})

window._st = ScrollTrigger.getAll()

// Bloque le scroll vertical tant qu'aucun guess n'a été soumis
let guessSubmitted = false
document.addEventListener('guess-submitted', () => { guessSubmitted = true })

window.addEventListener('scroll', () => {
    const pinEnd = window.innerWidth * 2
    if (!guessSubmitted && window.scrollY > pinEnd) {
        window.scrollTo(0, pinEnd)
    }
})

const main = async () => {                                                                                                                          
      const uniqueMovies = await getData()                                                                                                            
      const decades = getMoviesByDecade(uniqueMovies)                                                                                                 
      drawStatues(decades) 
      drawEvolution(uniqueMovies)
  }               
  main()