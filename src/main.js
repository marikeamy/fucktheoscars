import './style.css' 
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

//Enregistrer le plugin.
//Gsap utilise un système de plug-ins opt-ing, 
// il faut préciser qu'il faut activer ScrollTrigger pour l'utiliser.
gsap.registerPlugin(ScrollTrigger)

//L'élément qui se déplacera
const element = document.querySelector('.horizontal-wrapper');

gsap.to(element, {     
    //x = de combien on déplace horizontalement                                                                                                                             
    x: -window.innerWidth,                                                                                                                                        
    scrollTrigger: {                                                                                                                                  
      trigger: element,
      pin: true,                                                                                                                                      
      scrub: true,
      //end définit combien de scroll vertical déclenche l'animation.
      end: "+=" + (window.innerWidth)                                                                                                                                
    }             
  })