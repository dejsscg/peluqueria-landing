const express = require('express');
const app = express();
app.use(express.json());

// Token que usarás para verificar el webhook (cámbialo por uno seguro)
const VERIFY_TOKEN = "peluqueria_verify_token";

// Endpoint para verificar el webhook
app.get('/webhook', (req, res) => {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];
    
    if (mode && token) {
        if (mode === 'subscribe' && token === VERIFY_TOKEN) {
            console.log('Webhook verificado');
            return res.status(200).send(challenge);
        }
        res.sendStatus(403);
    }
});

// Endpoint para recibir mensajes
app.post('/webhook', (req, res) => {
    const body = req.body;

    if (body.object === 'whatsapp_business_account') {
        const entry = body.entry[0];
        const changes = entry.changes[0];
        const value = changes.value;

        if (value.messages && value.messages[0]) {
            const phone = value.messages[0].from;
            const message = value.messages[0].text.body;

            console.log('Mensaje recibido:', {
                de: phone,
                mensaje: message
            });

            // Aquí puedes agregar tu lógica para agendar citas
            // Por ahora solo enviamos una respuesta automática
            sendWhatsAppMessage(phone, "Gracias por contactarnos. ¿En qué horario te gustaría agendar tu cita?");
        }
    }

    res.status(200).send('OK');
});

// Función para enviar mensajes (necesitarás configurar esto con tu token de WhatsApp)
async function sendWhatsAppMessage(to, message) {
    // Aquí irá el código para enviar mensajes
    // Necesitarás:
    // 1. Token de WhatsApp Business API
    // 2. ID de número de teléfono
    console.log('Enviando mensaje a:', to, 'Mensaje:', message);
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});
