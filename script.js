// Configuración
const CONFIG = {
    SCROLL: {
        FOOTER_THRESHOLD: 300, // px antes del final
        BEHAVIOR: 'smooth',
        BLOCK: 'start'
    },
    ANIMATION: {
        THRESHOLD: 0.15,
        ROOT_MARGIN: '0px 0px -10% 0px'
    },
    WHATSAPP: {
        BUTTON_MARGIN: 100 // px de margen para mostrar/ocultar
    }
};

// Utilidades
const DOM = {
    get: selector => document.querySelector(selector),
    getAll: selector => document.querySelectorAll(selector),
    addClass: (element, className) => element?.classList.add(className),
    removeClass: (element, className) => element?.classList.remove(className),
    toggleClass: (element, className) => element?.classList.toggle(className),
    scrollTo: (options = {}) => window.scrollTo({ behavior: CONFIG.SCROLL.BEHAVIOR, ...options })
};

// Inicialización cuando el DOM está listo
document.addEventListener('DOMContentLoaded', () => {
    initializeAnimations();
    initializeMobileMenu();
    initializeScrollLinks();
    initializeScrollButton();
    initializeWhatsAppButton();
});

// Inicialización de animaciones
function initializeAnimations() {
    const observer = new IntersectionObserver(
        entries => entries.forEach(entry => {
            if (entry.isIntersecting) {
                DOM.addClass(entry.target, 'visible');
            }
        }),
        {
            threshold: CONFIG.ANIMATION.THRESHOLD,
            rootMargin: CONFIG.ANIMATION.ROOT_MARGIN
        }
    );

    DOM.getAll('.animate-on-scroll').forEach(element => observer.observe(element));
}

// Inicialización del menú móvil
function initializeMobileMenu() {
    const menuToggle = DOM.get('.menu-toggle');
    const navLinks = DOM.get('.nav-links');

    menuToggle?.addEventListener('click', () => {
        DOM.toggleClass(navLinks, 'active');
        DOM.toggleClass(menuToggle, 'active');
    });
}

// Inicialización de links con scroll suave
function initializeScrollLinks() {
    DOM.getAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', e => {
            e.preventDefault();
            const targetElement = DOM.get(anchor.getAttribute('href'));
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: CONFIG.SCROLL.BEHAVIOR,
                    block: CONFIG.SCROLL.BLOCK
                });

                // Cerrar menú móvil
                const navLinks = DOM.get('.nav-links');
                const menuToggle = DOM.get('.menu-toggle');
                DOM.removeClass(navLinks, 'active');
                DOM.removeClass(menuToggle, 'active');
            }
        });
    });
}

// Inicialización del botón de scroll
function initializeScrollButton() {
    const scrollButton = DOM.get('.scroll-top-button');
    if (!scrollButton) return;

    window.addEventListener('scroll', () => {
        const { scrollY, innerHeight } = window;
        const documentHeight = document.documentElement.scrollHeight;
        const footerThreshold = documentHeight - innerHeight - CONFIG.SCROLL.FOOTER_THRESHOLD;

        scrollButton.style.display = scrollY > footerThreshold ? 'flex' : 'none';
    });

    scrollButton.addEventListener('click', () => DOM.scrollTo({ top: 0 }));
}

// Inicialización del botón de WhatsApp
function initializeWhatsAppButton() {
    const handleVisibility = () => {
        const floatingWhatsApp = DOM.get('#floating-whatsapp');
        const scheduleButton = DOM.get('#schedule-button');
        if (!floatingWhatsApp || !scheduleButton) return;

        const { top, bottom } = scheduleButton.getBoundingClientRect();
        const { innerHeight } = window;
        const isNearButton = top < innerHeight + CONFIG.WHATSAPP.BUTTON_MARGIN && 
                           bottom > -CONFIG.WHATSAPP.BUTTON_MARGIN;

        floatingWhatsApp.style.opacity = isNearButton ? '0' : '1';
        floatingWhatsApp.style.visibility = isNearButton ? 'hidden' : 'visible';
    };

    window.addEventListener('scroll', handleVisibility);
}
