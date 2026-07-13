import crypto from 'crypto';

/**
 * Hash roll number for anonymous reporting
 */
export const hashRollNumber = (rollNumber) => {
  const salt = process.env.ROLL_HASH_SALT || 'default-salt';
  return crypto
    .createHmac('sha256', salt)
    .update(rollNumber.toString())
    .digest('hex')
    .substring(0, 10);
};

/**
 * Generate anonymous ID
 */
export const generateAnonymousId = () => {
  return `ANON-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
};