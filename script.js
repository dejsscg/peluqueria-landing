// Funcionalidad del menú burger
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const menuIcon = document.querySelector('.menu-icon');
    const closeIcon = document.querySelector('.close-icon');

    menuToggle.addEventListener('click', function() {
        navLinks.classList.toggle('active');
        menuIcon.style.display = navLinks.classList.contains('active') ? 'none' : 'block';
        closeIcon.style.display = navLinks.classList.contains('active') ? 'block' : 'none';
    });

    // Cerrar el menú al hacer clic en un enlace
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            menuIcon.style.display = 'block';
            closeIcon.style.display = 'none';
        });
    });
});

// Smooth scrolling para los enlaces de navegación
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Elementos del formulario
const form = document.getElementById('reservationForm');
const fechaInput = document.getElementById('fecha');
const horaSelect = document.getElementById('hora');

// Configurar fecha mínima como hoy
if (fechaInput) {
    const today = new Date().toISOString().split('T')[0];
    fechaInput.min = today;
}

// Verificar disponibilidad cuando se selecciona fecha u hora
async function verificarDisponibilidad() {
    const fecha = fechaInput.value;
    const hora = horaSelect.value;
    
    if (!fecha || !hora) return true;

    try {
        const snapshot = await db.collection('reservas')
            .where('fecha', '==', fecha)
            .where('hora', '==', hora)
            .get();

        if (!snapshot.empty) {
            alert('Lo sentimos, este horario ya está reservado. Por favor, selecciona otro horario.');
            horaSelect.value = '';
            return false;
        }
        return true;
    } catch (error) {
        console.error('Error al verificar disponibilidad:', error);
        return false;
    }
}

// Eventos para verificar disponibilidad
fechaInput.addEventListener('change', verificarDisponibilidad);
horaSelect.addEventListener('change', verificarDisponibilidad);

// Interceptar el envío del formulario
form.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Verificar disponibilidad antes de enviar
    const disponible = await verificarDisponibilidad();
    if (!disponible) {
        return;
    }

    // Si está disponible, guardar en Firebase
    try {
        await db.collection('reservas').add({
            fecha: fechaInput.value,
            hora: horaSelect.value,
            nombre: document.getElementById('nombre').value,
            email: document.getElementById('email').value,
            telefono: document.getElementById('telefono').value,
            servicio: document.getElementById('servicio').value,
            timestamp: new Date().toISOString()
        });

        // Enviar el formulario a Formspree
        this.submit();
    } catch (error) {
        console.error('Error al guardar la reserva:', error);
        alert('Hubo un error al procesar tu reserva. Por favor, intenta nuevamente.');
    }
});

// Menú hamburguesa
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const menuIcon = document.querySelector('.menu-icon');
const closeIcon = document.querySelector('.close-icon');

menuToggle.addEventListener('click', () => {
    console.log('Botón de menú clicado');
    navLinks.classList.toggle('active');
    menuToggle.classList.toggle('active');
    console.log('Estado de navLinks:', navLinks.classList.contains('active')); // Log para verificar el estado
    if (navLinks.classList.contains('active')) {
        menuIcon.style.display = 'none';
        closeIcon.style.display = 'block';
    } else {
        menuIcon.style.display = 'block';
        closeIcon.style.display = 'none';
    }
});

// Cerrar menú al hacer clic en un enlace
navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        menuToggle.classList.remove('active');
        menuIcon.style.display = 'block';
        closeIcon.style.display = 'none';
    });
});

// Botones flotantes
const whatsappButton = document.querySelector('.whatsapp-button');
const scrollTopButton = document.querySelector('.scroll-top-button');

// Mostrar/ocultar botones al hacer scroll
window.addEventListener('scroll', function() {
    const header = document.querySelector('header');
    const scrollPosition = window.scrollY;
    
    // Navbar efecto
    if (scrollPosition > 50) {
        header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
    } else {
        header.style.backgroundColor = 'white';
    }

    // Mostrar/ocultar botón de WhatsApp
    if (scrollPosition > 300) {
        whatsappButton.classList.add('visible');
    } else {
        whatsappButton.classList.remove('visible');
    }

    // Mostrar/ocultar botón de subir
    if (scrollPosition > 500) {
        scrollTopButton.classList.add('visible');
    } else {
        scrollTopButton.classList.remove('visible');
    }
});

// Funcionalidad del botón de subir
scrollTopButton.addEventListener('click', function() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Animaciones de scroll y control de WhatsApp
document.addEventListener('DOMContentLoaded', function() {
    const whatsappButton = document.querySelector('.whatsapp-button');
    const contactSection = document.querySelector('#contacto');
    const serviceCards = document.querySelectorAll('.service-card');
    const galleryItems = document.querySelectorAll('.gallery-item');
    const heroContent = document.querySelector('.hero-content');

    // Agregar clase animate después de que la página haya cargado
    setTimeout(() => {
        serviceCards.forEach(card => card.classList.add('animate'));
        galleryItems.forEach(item => item.classList.add('animate'));
        // Activar animación del hero content
        heroContent.classList.add('visible');
    }, 100);

    // Función para manejar las animaciones al hacer scroll
    function handleScrollAnimations() {
        // Control del botón de WhatsApp
        const contactRect = contactSection.getBoundingClientRect();
        if (contactRect.top <= window.innerHeight && contactRect.bottom >= 0) {
            whatsappButton.classList.add('hidden');
        } else {
            whatsappButton.classList.remove('hidden');
        }

        // Animación del hero content
        const heroRect = heroContent.getBoundingClientRect();
        if (heroRect.top <= window.innerHeight * 0.85 && heroRect.bottom >= 0) {
            heroContent.classList.add('visible');
        } else {
            heroContent.classList.remove('visible');
        }

        // Animación de las tarjetas de servicios
        serviceCards.forEach(card => {
            const cardRect = card.getBoundingClientRect();
            if (cardRect.top <= window.innerHeight * 0.85) {
                card.classList.add('visible');
            }
        });

        // Animación de los items de la galería
        galleryItems.forEach(item => {
            const itemRect = item.getBoundingClientRect();
            if (itemRect.top <= window.innerHeight * 0.85) {
                item.classList.add('visible');
            }
        });
    }

    // Observador de intersección para las animaciones
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.15
    });

    // Observar elementos
    serviceCards.forEach(card => observer.observe(card));
    galleryItems.forEach(item => observer.observe(item));

    // Manejar el scroll para el botón de WhatsApp
    window.addEventListener('scroll', () => {
        handleScrollAnimations();
    });

    // Ejecutar una vez al cargar la página
    handleScrollAnimations();
});
