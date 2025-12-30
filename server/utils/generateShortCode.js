// utils/generateShortCode.js
const crypto = require('crypto');

const generateShortCode = (length = 6) => {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  
  const randomBytes = crypto.randomBytes(length);
  
  for (let i = 0; i < length; i++) {
    result += chars[randomBytes[i] % chars.length];
  }
  
  return result;
};

const validateCustomAlias = (alias) => {
  const regex = /^[a-zA-Z0-9_-]+$/;
  return regex.test(alias) && alias.length >= 3 && alias.length <= 20;
};

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