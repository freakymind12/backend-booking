require('dotenv').config();
const crypto = require('crypto');
const dayjs = require('dayjs');

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY; // 32-byte key
if (!ENCRYPTION_KEY || ENCRYPTION_KEY.length !== 32) {
  throw new Error('ENCRYPTION_KEY must be 32 characters long');
}

// Enkripsi dengan expired pakai dayjs (default 1 jam)
function encryptJSON(data, expiresInSeconds = 1800) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);

  const payload = {
    ...data,
    exp: dayjs().add(expiresInSeconds, 'second').toISOString(), // ISO format
  };

  const jsonString = JSON.stringify(payload);
  let encrypted = cipher.update(jsonString, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  return {
    iv: iv.toString('hex'),
    data: encrypted,
  };
}

// Dekripsi dan cek expired pakai dayjs
function decryptJSON(encryptedData, ivHex) {
  const iv = Buffer.from(ivHex, 'hex');
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);

  let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  const payload = JSON.parse(decrypted);

  // Cek expired dengan dayjs
  if (payload.exp && dayjs().isAfter(dayjs(payload.exp))) {
    throw new Error('Token has expired');
  }

  // Buang exp sebelum return (optional)
  const { exp, ...dataWithoutExp } = payload;
  return dataWithoutExp;
}

module.exports = { encryptJSON, decryptJSON };
