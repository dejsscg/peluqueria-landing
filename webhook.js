require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch');
const OpenAI = require('openai');
const app = express();
app.use(express.json());

// Configuración
const config = {
    whatsappApi: {
        version: 'v17.0',
        phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID,
        token: process.env.WHATSAPP_TOKEN
    },
    verifyToken: process.env.VERIFY_TOKEN,
    openai: {
        apiKey: process.env.OPENAI_API_KEY
    }
};

// Inicializar OpenAI
const openai = new OpenAI({
    apiKey: config.openai.apiKey
});

// Sistema de contexto para OpenAI
const SYSTEM_PROMPT = `Eres el asistente virtual de Elegance Hair Salon, una peluquería exclusiva en Miraflores, Lima.
Tu trabajo es ayudar a los clientes con:
1. Agendar citas (cortes, tintes, peinados, tratamientos)
2. Informar sobre precios
3. Proporcionar horarios de atención
4. Dar la ubicación del local

Horarios:
- Lunes a Sábado: 9:00 AM - 7:00 PM
- Domingo: 10:00 AM - 4:00 PM

Precios:
- Corte de cabello: desde $30
- Tinte: desde $50
- Peinado: desde $40
- Tratamientos: desde $45

Ubicación:
Av. Arequipa 123, Miraflores - Lima
(A 2 cuadras del Parque Kennedy, frente al Centro Comercial Miraflores)

Reglas importantes:
1. SOLO responde preguntas relacionadas con la peluquería
2. Si la pregunta no está relacionada con la peluquería, responde amablemente que solo puedes ayudar con temas del salón
3. Mantén un tono amigable y profesional
4. Usa emojis ocasionalmente para dar calidez
5. Sé conciso en tus respuestas`;

// Función para obtener respuesta de OpenAI
async function getAIResponse(userMessage) {
    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: SYSTEM_PROMPT },
                { role: "user", content: userMessage }
            ],
            max_tokens: 200,
            temperature: 0.7
        });

        return completion.choices[0].message.content;
    } catch (error) {
        console.error('Error con OpenAI:', error);
        return getFallbackResponse(userMessage);
    }
}

// Respuesta de respaldo en caso de error con OpenAI
function getFallbackResponse(message) {
    message = message.toLowerCase();
    if (message.includes('cita') || message.includes('reservar') || message.includes('agendar')) {
        return "Para agendar tu cita, necesito los siguientes datos:\n\n" +
               "1️⃣ ¿Qué servicio te interesa?\n" +
               "2️⃣ ¿Qué día prefieres?\n" +
               "3️⃣ ¿Qué horario te conviene más?\n\n" +
               "Por favor, proporciona estos detalles y te confirmaré la disponibilidad. 📅";
    } else if (message.includes('precio') || message.includes('costo') || message.includes('tarifa')) {
        return "Nuestros precios son los siguientes:\n\n" +
               "💇‍♀️ Corte de cabello: desde $30\n" +
               "🎨 Tinte: desde $50\n" +
               "👰 Peinado: desde $40\n" +
               "💆‍♀️ Tratamientos: desde $45\n\n" +
               "¿Te gustaría agendar una cita para alguno de estos servicios? 😊";
    } else if (message.includes('horario') || message.includes('atienden') || message.includes('abierto')) {
        return "Nuestro horario de atención es:\n\n" +
               "📅 Lunes a Sábado:\n" +
               "   🕐 9:00 AM - 7:00 PM\n\n" +
               "📅 Domingo:\n" +
               "   🕐 10:00 AM - 4:00 PM\n\n" +
               "¿Te gustaría agendar una cita? ✨";
    } else if (message.includes('ubicacion') || message.includes('donde') || message.includes('direccion')) {
        return "Nos encontramos en:\n\n" +
               "📍 Av. Arequipa 123, Miraflores - Lima\n\n" +
               "Referencias:\n" +
               "- A 2 cuadras del Parque Kennedy\n" +
               "- Frente al Centro Comercial Miraflores\n\n" +
               "¿Necesitas más indicaciones o prefieres agendar una cita? 💇‍♀️";
    } else {
        return "¿Cómo puedo ayudarte hoy? 😊\n\n" +
               "1️⃣ Agendar una cita\n" +
               "2️⃣ Consultar precios\n" +
               "3️⃣ Ver horarios de atención\n" +
               "4️⃣ Conocer nuestra ubicación\n\n" +
               "Solo dime qué opción te interesa o escribe tu pregunta. 💫";
    }
}

// Función para manejar los mensajes entrantes
async function handleIncomingMessage(from, message) {
    console.log(`Mensaje recibido de ${from}: ${message}`);
    
    try {
        // Intentar obtener respuesta de OpenAI
        const response = await getAIResponse(message);
        await sendWhatsAppMessage(from, response);
    } catch (error) {
        console.error('Error al procesar mensaje:', error);
        // Usar respuesta de respaldo en caso de error
        const fallbackResponse = getFallbackResponse(message);
        await sendWhatsAppMessage(from, fallbackResponse);
    }
}

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
