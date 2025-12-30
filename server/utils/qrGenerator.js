const QRCode = require('qrcode');
const path = require('path');
const fs = require('fs');

const generateQRCode = async (eventCode) => {
    try {
        // Ensure QR codes directory exists
        const qrDir = 'uploads/qrcodes';
        if (!fs.existsSync(qrDir)) {
            fs.mkdirSync(qrDir, { recursive: true });
        }

        // Generate event URL
        const eventUrl = `${process.env.BASE_URL || 'http://localhost:3000'}/event.html?code=${eventCode}`;

        // Generate QR code filename
        const qrFilename = `qr-${eventCode}.png`;
        const qrPath = path.join(qrDir, qrFilename);

        // Generate QR code
        await QRCode.toFile(qrPath, eventUrl, {
            width: 500,
            margin: 2,
            color: {
                dark: '#000000',
                light: '#FFFFFF'
            }
        });

        return {
            filename: qrFilename,
            path: qrPath,
            url: eventUrl
        };
    } catch (error) {
        console.error('QR code generation error:', error);
        throw error;
    }
};

module.exports = { generateQRCode };
