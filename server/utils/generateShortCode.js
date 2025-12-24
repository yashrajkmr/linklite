// utils/generateShortCode.js
const crypto = require('crypto');

/**
 * Generates a unique short code for URLs
 * Uses base62 encoding for URL-safe characters
 */
const generateShortCode = (length = 6) => {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  
  // Generate random bytes
  const randomBytes = crypto.randomBytes(length);
  
  for (let i = 0; i < length; i++) {
    result += chars[randomBytes[i] % chars.length];
  }
  
  return result;
};

/**
 * Validates custom alias
 * Must be alphanumeric, dash, underscore only
 */
const validateCustomAlias = (alias) => {
  const regex = /^[a-zA-Z0-9_-]+$/;
  return regex.test(alias) && alias.length >= 3 && alias.length <= 20;
};

/**
 * Validates URL format
 */
const validateUrl = (url) => {
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch (error) {
    return false;
  }
};

module.exports = {
  generateShortCode,
  validateCustomAlias,
  validateUrl
};