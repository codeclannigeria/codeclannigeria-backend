import { randomBytes } from 'crypto';

export const generateRandomToken = (size: number): string =>
  randomBytes(size).toString('hex');
