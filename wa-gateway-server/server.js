const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion } = require('@whiskeysockets/baileys');
const express = require('express');
const cors = require('cors');
const qrcode = require('qrcode-terminal');
const pino = require('pino');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let sock = null;
let qrCodeString = null;
let isConnected = false;

// Format Phone Number to WhatsApp JID format (628xxxxxxxxxx@s.whatsapp.net)
function formatJid(phone) {
    if (!phone) return null;
    let cleaned = String(phone).replace(/[^0-9]/g, '');
    if (cleaned.startsWith('0')) {
        cleaned = '62' + cleaned.substring(1);
    }
    if (!cleaned.endsWith('@s.whatsapp.net')) {
        cleaned = cleaned + '@s.whatsapp.net';
    }
    return cleaned;
}

// Initialize Baileys WhatsApp Connection
async function connectToWhatsApp() {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys');
    const { version } = await fetchLatestBaileysVersion();

    console.log(`[WA Gateway] Memulai WhatsApp Baileys v${version.join('.')}...`);

    sock = makeWASocket({
        version,
        logger: pino({ level: 'silent' }),
        printQRInTerminal: false,
        auth: state,
        browser: ['Tabungan Siswa XII BR1', 'Chrome', '1.0.0']
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect, qr } = update;

        if (qr) {
            qrCodeString = qr;
            isConnected = false;
            console.log('\n======================================================');
            console.log('SCAN QR CODE DI BAWAH INI MENGGUNAKAN WHATSAPP HP ANDA:');
            console.log('======================================================\n');
            qrcode.generate(qr, { small: true });
            console.log('\nAtau buka browser ke http://localhost:3000 untuk scan QR.');
        }

        if (connection === 'close') {
            const shouldReconnect = (lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut);
            console.log('[WA Gateway] Koneksi terputus. Reconnecting:', shouldReconnect);
            isConnected = false;
            if (shouldReconnect) {
                setTimeout(connectToWhatsApp, 3000);
            }
        } else if (connection === 'open') {
            isConnected = true;
            qrCodeString = null;
            console.log('\n======================================================');
            console.log('✅ BERHASIL TERHUBUNG KE WHATSAPP!');
            console.log(`🚀 WA Gateway Server Siap Melayani Pengiriman Notifikasi!`);
            console.log(`🌐 API Endpoint: http://localhost:3000/send-message`);
            console.log('======================================================\n');
        }
    });
}

// Server Dashboard Status Page
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="id">
        <head>
            <meta charset="UTF-8">
            <title>WA Gateway Server - Tabungan XII BR 1</title>
            <style>
                body { font-family: sans-serif; background: #0f172a; color: #fff; padding: 2rem; text-align: center; }
                .card { background: #1e293b; padding: 2rem; border-radius: 12px; max-width: 500px; margin: auto; box-shadow: 0 4px 20px rgba(0,0,0,0.5); }
                .status-online { color: #10b981; font-weight: bold; font-size: 1.2rem; }
                .status-offline { color: #f43f5e; font-weight: bold; font-size: 1.2rem; }
                code { background: rgba(255,255,255,0.1); padding: 4px 8px; border-radius: 4px; color: #38bdf8; }
            </style>
        </head>
        <body>
            <div class="card">
                <h2>🟢 WA Gateway Baileys Server</h2>
                <p>Status Koneksi WA: ${isConnected ? '<span class="status-online">CONNECTED (TERHUBUNG)</span>' : '<span class="status-offline">DISCONNECTED (BELUM SCAN QR)</span>'}</p>
                <hr style="border-color: rgba(255,255,255,0.1);">
                <p>Endpoint API Notifikasi Otomatis:</p>
                <p><code>POST http://localhost:3000/send-message</code></p>
                <p><small>Gunakan endpoint di atas pada Website Tabungan Siswa untuk pengiriman background instant!</small></p>
            </div>
        </body>
        </html>
    `);
});

// Single Message Dispatch API
app.post('/send-message', async (req, res) => {
    try {
        const target = req.body.target || req.body.number || req.body.phone;
        const message = req.body.message || req.body.msg;

        if (!target || !message) {
            return res.status(400).json({ status: false, error: 'Parameter target dan message wajib diisi!' });
        }

        if (!sock || !isConnected) {
            return res.status(503).json({ status: false, error: 'WA Gateway belum terhubung ke WhatsApp. Silakan scan QR code terlebih dahulu!' });
        }

        const jid = formatJid(target);
        await sock.sendMessage(jid, { text: message });

        console.log(`[POST /send-message] Pesan terkirim ke: ${target}`);
        return res.json({ status: true, message: 'Pesan WhatsApp berhasil terkirim!', target: target });
    } catch (err) {
        console.error('[POST /send-message Error]:', err);
        return res.status(500).json({ status: false, error: err.message });
    }
});

// Alias POST /send
app.post('/send', (req, res) => {
    return app._router.handle(req, res, () => {});
});

// Batch Message Dispatch API
app.post('/send-batch', async (req, res) => {
    try {
        const items = req.body.items || req.body.messages || [];

        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ status: false, error: 'Array items pesan wajib diisi!' });
        }

        if (!sock || !isConnected) {
            return res.status(503).json({ status: false, error: 'WA Gateway belum terhubung ke WhatsApp.' });
        }

        let sentCount = 0;
        for (const item of items) {
            const jid = formatJid(item.target || item.phone || item.number);
            if (jid && item.message) {
                await sock.sendMessage(jid, { text: item.message });
                sentCount++;
                // Small delay to prevent spam flagging
                await new Promise(resolve => setTimeout(resolve, 800));
            }
        }

        console.log(`[POST /send-batch] Berhasil memproses ${sentCount} dari ${items.length} pesan masal.`);
        return res.json({ status: true, totalSent: sentCount, message: `Berhasil mengirim ${sentCount} pesan WhatsApp masal!` });
    } catch (err) {
        console.error('[POST /send-batch Error]:', err);
        return res.status(500).json({ status: false, error: err.message });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`\n======================================================`);
    console.log(`🚀 WA Gateway Baileys Node.js Server berjalan di port ${PORT}`);
    console.log(`🌐 Buka di browser: http://localhost:${PORT}`);
    console.log(`======================================================\n`);
    connectToWhatsApp();
});
