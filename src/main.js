import './style.css' 
import { getData, getMoviesByDecade } from './data.js'
import { drawStatues } from './statues.js'
import { drawEvolution } from './timeline.js'
import { drawConclusion } from './conclusion.js'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import ScrollToPlugin from 'gsap/ScrollToPlugin'

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)

//L'élément qui se déplacera
const horizontalWrapper = document.querySelector('.horizontal-wrapper');

//Gestion du scroll horizontal
const horizontalTween = gsap.to(horizontalWrapper, {
    x: () => -(window.innerWidth * 2),
    scrollTrigger: {
      trigger: horizontalWrapper,
      pin: true,
      scrub: 1,
      end: () => "+=" + (window.innerWidth * 2),
      invalidateOnRefresh: true
    }
})

window._st = ScrollTrigger.getAll()

let heroUnlocked = false

let guessSubmitted = false
document.addEventListener('guess-submitted', () => { guessSubmitted = true })

document.querySelector('.section-hero__next').addEventListener('click', () => {
  const overlay = document.getElementById('intro-overlay')
  overlay.hidden = false
})

document.querySelector('.intro-overlay__discover').addEventListener('click', () => {
  const overlay = document.getElementById('intro-overlay')
  overlay.hidden = true
  heroUnlocked = true
  // On attend que la modale soit fermée et que GSAP recalcule avant de scroller
  setTimeout(() => {
    ScrollTrigger.refresh()
    window.scrollTo({ top: window.innerWidth * 0.6, behavior: 'smooth' })
  }, 200)
})

window.addEventListener('scroll', () => {
  if (!heroUnlocked) {
    window.scrollTo(0, 0)
    return
  }
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
      drawConclusion()
  }               
  main()