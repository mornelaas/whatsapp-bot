const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const axios = require('axios');

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  }
});

client.on('qr', qr => {
  console.log('🟩 Escanea este QR con WhatsApp:');
  qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
  console.log('✅ Bot conectado y listo.');
});

client.on('message', async message => {
  if (message.from.includes('@g.us')) {
    console.log(`📩 Mensaje recibido en grupo: ${message.body}`);
    console.log(`📦 Tipo de mensaje recibido: ${message.type}`);

    try {
      await axios.post('https://ipade-whatsapp-database-n8n.ujbhin.easypanel.host/webhook-test/mensaje-whatsapp', {
        message: message.body,
        from: message.from,
        type: message.type
      });
      console.log('📤 Enviado a n8n con éxito');
    } catch (error) {
      console.error('❌ Error al enviar a n8n:', error.message);
    }
  }
});
