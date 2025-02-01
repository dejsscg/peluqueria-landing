document.addEventListener('DOMContentLoaded', () => {
    // Elementos DOM
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const scrollTopBtn = document.querySelector('.scroll-top-button');
    const whatsappBtn = document.querySelector('.whatsapp-button');
    const animatedElements = document.querySelectorAll('.animate-on-scroll');

    // Detectar elementos para animar
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -10% 0px'
    });

    animatedElements.forEach(element => {
        observer.observe(element);
    });

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

    // Botón de scroll
    const scrollButton = document.querySelector('.scroll-top-button');
    if (scrollButton) {
        window.addEventListener('scroll', () => {
            // Calcular la posición del scroll en relación al final de la página
            const scrollPosition = window.scrollY;
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            const footerThreshold = documentHeight - windowHeight - 300; // 300px antes del final

            if (scrollPosition > footerThreshold) {
                scrollButton.style.display = 'flex';
            } else {
                scrollButton.style.display = 'none';
            }
        });

        scrollButton.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Función para manejar la visibilidad del botón flotante de WhatsApp
    function handleWhatsAppButtonVisibility() {
        const floatingWhatsApp = document.getElementById('floating-whatsapp');
        const scheduleButton = document.getElementById('schedule-button');
        const scheduleRect = scheduleButton.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        // Si el botón de agendar está visible en la pantalla (o cerca), ocultar el botón flotante
        if (scheduleRect.top < windowHeight + 100 && scheduleRect.bottom > -100) {
            floatingWhatsApp.style.opacity = '0';
            floatingWhatsApp.style.visibility = 'hidden';
        } else {
            floatingWhatsApp.style.opacity = '1';
            floatingWhatsApp.style.visibility = 'visible';
        }
    }

    // Inicializar animaciones
    window.addEventListener('scroll', () => {
        handleWhatsAppButtonVisibility();
    });
});
