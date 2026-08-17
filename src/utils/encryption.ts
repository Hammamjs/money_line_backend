import 'dotenv/config';
import crypto from 'node:crypto';

const algorithm = process.env.ALGORITHM!;
const key = Buffer.from(process.env.ENCRYPTION_KEY!, 'hex');

export function cipher(text: string) {
  const iv = crypto.randomBytes(12);

  const cipher = crypto.createCipheriv(algorithm, key, iv) as crypto.CipherGCM;

  const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);

  const authTag = cipher.getAuthTag();

  return [
    iv.toString('hex'),
    authTag.toString('hex'),
    encrypted.toString('hex'),
  ].join(':');
}

export function decipher(data: string) {
  if (typeof data !== 'string' || !data) {
    throw new Error(`Cannot decrypt invalid value: ${data}`);
  }

  const [ivHex, authTagHex, encryptedHex] = data.split(':');

  const decipher = crypto.createDecipheriv(
    algorithm,
    key,
    Buffer.from(ivHex!, 'hex'),
  ) as crypto.DecipherGCM;

  decipher.setAuthTag(Buffer.from(authTagHex!, 'hex'));

  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(encryptedHex!, 'hex')),
    decipher.final(),
  ]);

  return decrypted.toString('utf8');
}
