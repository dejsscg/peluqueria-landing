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
