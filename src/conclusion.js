import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

export const drawConclusion = () => {
    
    const backBtn = document.querySelector('.section-conclusion__back-to-top');
    
    if (backBtn) {
        backBtn.addEventListener('click', (e) => {
            e.preventDefault();
            
            // 1. On crée un "rideau" bleu nuit par-dessus tout le site
            const rideau = document.createElement('div');
            rideau.style.position = 'fixed';
            rideau.style.inset = '0';
            rideau.style.backgroundColor = 'var(--night-blue)';
            rideau.style.zIndex = '99999'; // Par dessus tout
            rideau.style.opacity = '0';
            rideau.style.transition = 'opacity 0.8s ease-in-out'; // Durée du fondu
            document.body.appendChild(rideau);

            // 2. On lance l'animation du fondu
            // (Le petit délai de 10ms permet à la transition CSS de s'activer)
            setTimeout(() => {
                rideau.style.opacity = '1';
            }, 10);

            // 3. Une fois que l'écran est tout bleu (après 800ms), on remonte et on recharge
            setTimeout(() => {
                window.scrollTo(0, 0);
                window.location.href = window.location.pathname;
            }, 850);
        });
    }
}