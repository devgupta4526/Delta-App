import { generateQRCodeFromToken, generateSecureQRToken, verifyQRToken } from '../utils/QrUtils.js';

const generateQRForUserPool = async (req, res) => {
    try {
        const { poolId } = req.body;
        const userId = req.user._id; // from auth middleware

        const token = generateSecureQRToken(userId, poolId);
        const qrImage = await generateQRCodeFromToken(token);

        res.status(200).json({ qrImage, token });
    } catch (err) {
        res.status(500).json({ error: 'QR generation failed', details: err.message });
    }
};

const verifyQRTokenController = async (req, res) => {
    try {
        const { token } = req.body;
        const decoded = verifyQRToken(token);

        res.status(200).json({ valid: true, userId: decoded.userId, poolId: decoded.poolId });
    } catch (err) {
        res.status(400).json({ valid: false, error: 'Invalid or expired QR code' });
    }
};


export {generateQRForUserPool, verifyQRTokenController};