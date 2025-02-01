const express = require('express');
const fetch = require('node-fetch');
const app = express();
app.use(express.json());

// Configuración
const config = {
    whatsappApi: {
        version: 'v17.0',
        phoneNumberId: '557696057433362',
        token: 'EAAcx0EIL5uIBO3kNPwK0iKpPP5xEUx9K6E4qZByOqf9TkMdPAoA4dZBorBZBYZAzZCW4CXnXxfU1ZBAtEsgIsIHbisLuSdWBuNFPOzyTlDzSx8ZBdF3ZCdSTF9fvym7IHQ1rleRXBqoWQbEFTHcPQ7vAZBUH29fZCZC1yZAbZBQZAqEPo8bdAdWg4K2HY2iEy0iFksWLuWWi616eX465SuGU4uucM7AnYnZAIgZD'
    },
    verifyToken: 'PELUQUERIA123'
};

// Función para enviar mensajes usando la API de WhatsApp
async function sendWhatsAppMessage(to, message) {
    try {
        const url = `https://graph.facebook.com/${config.whatsappApi.version}/${config.whatsappApi.phoneNumberId}/messages`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${config.whatsappApi.token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                messaging_product: "whatsapp",
                to: to,
                type: "text",
                text: { body: message }
            })
        });
        
        const data = await response.json();
        console.log('Mensaje enviado:', data);
        return data;
    } catch (error) {
        console.error('Error al enviar mensaje:', error);
        throw error;
    }
}

// Función para enviar mensaje de plantilla
async function sendTemplateMessage(to, templateName, language = "es") {
    try {
        const url = `https://graph.facebook.com/${config.whatsappApi.version}/${config.whatsappApi.phoneNumberId}/messages`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${config.whatsappApi.token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                messaging_product: "whatsapp",
                to: to,
                type: "template",
                template: {
                    name: templateName,
                    language: {
                        code: language
                    }
                }
            })
        });
        
        const data = await response.json();
        console.log('Plantilla enviada:', data);
        return data;
    } catch (error) {
        console.error('Error al enviar plantilla:', error);
        throw error;
    }
}

// Función para manejar los mensajes entrantes
async function handleIncomingMessage(from, message) {
    console.log(`Mensaje recibido de ${from}: ${message}`);
    
    let response = "¡Bienvenido/a a Elegance Hair Salon! 💇‍♀️✨\n\n";
    
    // Respuestas automáticas basadas en palabras clave
    message = message.toLowerCase();
    if (message.includes('cita') || message.includes('reservar') || message.includes('agendar')) {
        response += "Para agendar tu cita, necesito los siguientes datos:\n\n" +
                   "1️⃣ ¿Qué servicio te interesa?\n" +
                   "2️⃣ ¿Qué día prefieres?\n" +
                   "3️⃣ ¿Qué horario te conviene más?\n\n" +
                   "Por favor, proporciona estos detalles y te confirmaré la disponibilidad. 📅";
    } else if (message.includes('precio') || message.includes('costo') || message.includes('tarifa')) {
        response += "Nuestros precios son los siguientes:\n\n" +
                   "💇‍♀️ Corte de cabello: desde $30\n" +
                   "🎨 Tinte: desde $50\n" +
                   "👰 Peinado: desde $40\n" +
                   "💆‍♀️ Tratamientos: desde $45\n\n" +
                   "¿Te gustaría agendar una cita para alguno de estos servicios? 😊";
    } else if (message.includes('horario') || message.includes('atienden') || message.includes('abierto')) {
        response += "Nuestro horario de atención es:\n\n" +
                   "📅 Lunes a Sábado:\n" +
                   "   🕐 9:00 AM - 7:00 PM\n\n" +
                   "📅 Domingo:\n" +
                   "   🕐 10:00 AM - 4:00 PM\n\n" +
                   "¿Te gustaría agendar una cita? ✨";
    } else if (message.includes('ubicacion') || message.includes('donde') || message.includes('direccion')) {
        response += "Nos encontramos en:\n\n" +
                   "📍 [Tu dirección aquí]\n\n" +
                   "Referencias:\n" +
                   "- Cerca de [referencia]\n" +
                   "- A [X] cuadras de [lugar conocido]\n\n" +
                   "¿Necesitas más indicaciones o prefieres agendar una cita? 💇‍♀️";
    } else {
        response += "¿Cómo puedo ayudarte hoy? 😊\n\n" +
                   "1️⃣ Agendar una cita\n" +
                   "2️⃣ Consultar precios\n" +
                   "3️⃣ Ver horarios de atención\n" +
                   "4️⃣ Conocer nuestra ubicación\n\n" +
                   "Solo dime qué opción te interesa o escribe tu pregunta. 💫";
    }
    
    await sendWhatsAppMessage(from, response);
}

// Webhook para Meta
app.get('/webhook', (req, res) => {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode && token) {
        if (mode === 'subscribe' && token === config.verifyToken) {
            console.log('Webhook verificado');
            return res.status(200).send(challenge);
        }
    }
    return res.sendStatus(403);
});

// Endpoint para recibir mensajes
app.post('/webhook', async (req, res) => {
    try {
        const { body } = req;
        
        if (body.object === 'whatsapp_business_account') {
            const entry = body.entry[0];
            const changes = entry.changes[0];
            const value = changes.value;

            if (value.messages && value.messages[0]) {
                const phone = value.messages[0].from;
                const message = value.messages[0].text.body;
                
                // Manejar el mensaje de forma asíncrona
                handleIncomingMessage(phone, message)
                    .catch(error => console.error('Error al manejar mensaje:', error));
            }
        }
        
        res.status(200).send('OK');
    } catch (error) {
        console.error('Error en webhook:', error);
        res.sendStatus(500);
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor iniciado en http://localhost:${PORT}`);
});
