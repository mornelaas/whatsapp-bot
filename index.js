const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const playwright = require('playwright'); // Importamos playwright

// Creamos una clase personalizada para usar Playwright en lugar de Puppeteer
class CustomPlaywrightLauncher {
    async launch() {
        const browser = await playwright.chromium.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });
        return {
            puppeteer: browser, // whatsapp-web.js espera un objeto tipo puppeteer
        };
    }
}

// Instancia del cliente usando el launcher de Playwright
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: new CustomPlaywrightLauncher(), // Usamos nuestro propio launcher
});

// Mostrar QR si no hay sesión guardada
client.on('qr', qr => {
    console.log('Escanea este QR con WhatsApp:');
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('✅ Bot de WhatsApp conectado y listo.');
});

client.on('message', async message => {
    if (message.from.includes('@g.us')) {
        console.log(`📩 Mensaje recibido en grupo: ${message.body}`);
    }
});

client.initialize();
