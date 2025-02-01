const axios = require('axios');

async function sendTemplateMessage() {
    try {
        const response = await axios({
            method: 'post',
            url: 'https://graph.facebook.com/v17.0/557696057433362/messages',
            headers: {
                'Authorization': 'Bearer EAAcx0EIL5uIBO3kNPwK0iKpPP5xEUx9K6E4qZByOqf9TkMdPAoA4dZBorBZBYZAzZCW4CXnXxfU1ZBAtEsgIsIHbisLuSdWBuNFPOzyTlDzSx8ZBdF3ZCdSTF9fvym7IHQ1rleRXBqoWQbEFTHcPQ7vAZBUH29fZCZC1yZAbZBQZAqEPo8bdAdWg4K2HY2iEy0iFksWLuWWi616eX465SuGU4uucM7AnYnZAIgZD',
                'Content-Type': 'application/json'
            },
            data: {
                messaging_product: "whatsapp",
                to: "51963330931",
                type: "template",
                template: {
                    name: "bienvenida_salon",
                    language: {
                        code: "es"
                    }
                }
            }
        });
        
        console.log('Mensaje enviado exitosamente:', response.data);
    } catch (error) {
        console.error('Error al enviar mensaje:', error.response ? error.response.data : error.message);
    }
}

// También mantenemos la función para enviar mensajes de texto normales
async function sendTextMessage(message) {
    try {
        const response = await axios({
            method: 'post',
            url: 'https://graph.facebook.com/v17.0/557696057433362/messages',
            headers: {
                'Authorization': 'Bearer EAAcx0EIL5uIBO3kNPwK0iKpPP5xEUx9K6E4qZByOqf9TkMdPAoA4dZBorBZBYZAzZCW4CXnXxfU1ZBAtEsgIsIHbisLuSdWBuNFPOzyTlDzSx8ZBdF3ZCdSTF9fvym7IHQ1rleRXBqoWQbEFTHcPQ7vAZBUH29fZCZC1yZAbZBQZAqEPo8bdAdWg4K2HY2iEy0iFksWLuWWi616eX465SuGU4uucM7AnYnZAIgZD',
                'Content-Type': 'application/json'
            },
            data: {
                messaging_product: "whatsapp",
                recipient_type: "individual",
                to: "51963330931",
                type: "text",
                text: {
                    preview_url: false,
                    body: message
                }
            }
        });
        
        console.log('Mensaje enviado exitosamente:', response.data);
    } catch (error) {
        console.error('Error al enviar mensaje:', error.response ? error.response.data : error.message);
    }
}

// Cuando la plantilla esté aprobada, usa esta función
sendTemplateMessage();
