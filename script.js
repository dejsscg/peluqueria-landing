document.addEventListener('DOMContentLoaded', () => {
    // Elementos DOM
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    const scrollTopBtn = document.querySelector('.scroll-top-button');
    const whatsappBtn = document.querySelector('.whatsapp-button');

    // Funciones
    const handleScroll = () => {
        const scrolled = window.scrollY;
        const triggerBottom = window.innerHeight * 0.85;

        // Mostrar/ocultar botones flotantes
        if (scrolled > 300) {
            scrollTopBtn?.classList.remove('hidden');
            whatsappBtn?.classList.remove('hidden');
        } else {
            scrollTopBtn?.classList.add('hidden');
            whatsappBtn?.classList.add('hidden');
        }

        // Animar elementos al hacer scroll
        animatedElements.forEach(el => {
            const elementTop = el.getBoundingClientRect().top;
            if (elementTop < triggerBottom) {
                el.classList.add('visible');
            }
        });
    };

    // Event Listeners
    menuToggle?.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        navLinks?.classList.toggle('active');
    });

    navLinks?.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            menuToggle?.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    scrollTopBtn?.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Inicialización
    setTimeout(handleScroll, 100);
    window.addEventListener('scroll', () => {
        requestAnimationFrame(handleScroll);
    });
});
