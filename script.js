document.addEventListener('DOMContentLoaded', () => {
    // Elementos DOM
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const scrollTopBtn = document.querySelector('.scroll-top-button');
    const whatsappBtn = document.querySelector('.whatsapp-button');
    const animatedTitles = document.querySelectorAll('.section-title.animate-on-scroll, .hero-content h1.animate-on-scroll');
    const serviceBoxes = document.querySelectorAll('.service-box.animate-on-scroll');

    // Función para manejar las animaciones de títulos
    const handleTitleAnimations = () => {
        const triggerBottom = window.innerHeight * 0.85;
        
        animatedTitles.forEach(title => {
            const elementTop = title.getBoundingClientRect().top;
            if (elementTop < triggerBottom) {
                title.classList.add('visible');
            }
        });
    };

    // Función para manejar las animaciones de cajas de servicios
    const handleServiceBoxAnimations = () => {
        const triggerBottom = window.innerHeight * 0.8;
        
        serviceBoxes.forEach(box => {
            const elementTop = box.getBoundingClientRect().top;
            if (elementTop < triggerBottom) {
                box.classList.add('visible');
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
    setTimeout(handleTitleAnimations, 100); // Animar títulos visibles al cargar
    setTimeout(handleServiceBoxAnimations, 100); // Animar cajas de servicios visibles al cargar
    window.addEventListener('scroll', () => {
        requestAnimationFrame(handleTitleAnimations);
        requestAnimationFrame(handleServiceBoxAnimations);
    });
});
