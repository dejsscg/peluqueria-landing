document.addEventListener('DOMContentLoaded', () => {
    // Elementos DOM
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    const scrollTopBtn = document.querySelector('.scroll-top-button');
    const whatsappBtn = document.querySelector('.whatsapp-button');

    // Función para manejar las animaciones de scroll
    const handleScrollAnimations = () => {
        const triggerBottom = window.innerHeight * 0.85;
        
        animatedElements.forEach((element, index) => {
            const elementTop = element.getBoundingClientRect().top;
            
            if (elementTop < triggerBottom) {
                // Añadir delay progresivo para elementos en la misma sección
                setTimeout(() => {
                    element.classList.add('visible');
                }, index * 150); // 150ms de delay entre cada elemento
            }
        });
    };

    // Función para manejar el scroll
    const handleScroll = () => {
        const scrolled = window.scrollY;

        // Mostrar/ocultar botones flotantes
        if (scrolled > 300) {
            scrollTopBtn?.classList.remove('hidden');
            whatsappBtn?.classList.remove('hidden');
        } else {
            scrollTopBtn?.classList.add('hidden');
            whatsappBtn?.classList.add('hidden');
        }

        // Manejar animaciones
        requestAnimationFrame(handleScrollAnimations);
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

    // Smooth scroll para enlaces internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Inicialización
    setTimeout(handleScrollAnimations, 100); // Animar elementos visibles al cargar
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScrollAnimations);
});
