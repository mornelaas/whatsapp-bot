const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

const client = new Client({
    authStrategy: new LocalAuth(), // Guarda la sesión
    puppeteer: {
        headless: true, // Cambia a false si quieres ver el navegador
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});

// Solo mostrar QR si la sesión no está guardada
client.on('qr', qr => {
    console.log('Escanea este QR con WhatsApp:');
    qrcode.generate(qr, { small: true });
});

// Mensaje cuando el bot se conecta correctamente
client.on('ready', () => {
    console.log('✅ Bot de WhatsApp conectado y listo.');
});

// Capturar mensajes en grupos
client.on('message', async message => {
    if (message.from.includes('@g.us')) {
        console.log(`📩 Mensaje recibido en grupo: ${message.body}`);
    }
});

client.initialize();

