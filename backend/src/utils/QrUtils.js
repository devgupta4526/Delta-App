import jwt from 'jsonwebtoken';
import QRCode from 'qrcode';

const generateSecureQRToken = (userId, poolId) => {
    const payload = { userId, poolId };
    return jwt.sign(payload, process.env.QR_SECRET_KEY, { expiresIn: '3d' });
  };
  
  const verifyQRToken = (token) => {
    return jwt.verify(token, process.env.QR_SECRET_KEY);
  };
  
  const generateQRCodeFromToken = async (token) => {
    return await QRCode.toDataURL(token); // base64 string of QR image
  };
  

  export {generateQRCodeFromToken,verifyQRToken,generateSecureQRToken};