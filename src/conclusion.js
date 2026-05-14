import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

export const drawConclusion = () => {
    
    // 1. Animation d'apparition des éléments (titre, texte, bouton) en cascade
    gsap.from('.section-conclusion__content > *', {
        y: 50,            // Départ 50px plus bas
        opacity: 0,       // Départ invisible
        duration: 1,      // Durée de l'animation
        stagger: 0.2,     // Décalage de 0.2s entre chaque élément
        scrollTrigger: {
            trigger: '.section-conclusion',
            start: "top 70%", // L'animation se lance quand le haut de la section atteint 70% de la fenêtre
            toggleActions: "play none none reverse" 
        }
    });

    // POUR LINSTANT MARCHE PAS
    // 2. Bouton "Back to top"
    const backBtn = document.querySelector('.section-conclusion__back-to-top');
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            console.log("Clic détecté !"); // Pour vérifier que le bouton marche bien
            
            // 2. On rafraîchit la page pour remettre à zéro l'intro et les animations GSAP
            window.location.reload();
        });
    }
}