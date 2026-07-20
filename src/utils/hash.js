import { createHash } from 'crypto';
export function hash(text) {
  return createHash('sha256').update(text).digest('hex');
}
