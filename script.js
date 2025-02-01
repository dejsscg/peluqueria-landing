document.addEventListener('DOMContentLoaded', () => {
    // Elementos DOM
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const scrollTopBtn = document.querySelector('.scroll-top-button');
    const whatsappBtn = document.querySelector('.whatsapp-button');
    const animatedElements = document.querySelectorAll('.animate-on-scroll');

    // Función para manejar las animaciones
    const handleAnimations = () => {
        const triggerBottom = window.innerHeight * 0.8;
        
        animatedElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            if (elementTop < triggerBottom) {
                element.classList.add('visible');
            }
        });
    };

    // Manejar menú móvil
    menuToggle?.addEventListener('click', () => {
        navLinks?.classList.toggle('active');
        menuToggle.classList.toggle('active');
    });

    // Scroll suave para links de navegación
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Cerrar menú móvil si está abierto
                navLinks?.classList.remove('active');
                menuToggle?.classList.remove('active');
            }
        });
    });

    // Scroll al inicio
    scrollTopBtn?.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Inicializar animaciones
    handleAnimations();
    window.addEventListener('scroll', () => {
        requestAnimationFrame(handleAnimations);
    });
});
