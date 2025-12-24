// models/Link.js
const mongoose = require('mongoose');

const linkSchema = new mongoose.Schema({
  originalUrl: {
    type: String,
    required: [true, 'Original URL is required'],
    trim: true
  },
  shortCode: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  customAlias: {
    type: String,
    trim: true,
    sparse: true // Allows multiple null values but unique non-null values
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  clicks: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  expiryDate: {
    type: Date,
    default: null
  },
  password: {
    type: String,
    default: null // For protected links
  },
  clicksData: [{
    clickedAt: { type: Date, default: Date.now },
    country: String,
    referrer: String,
    browser: String,
    os: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for faster queries
linkSchema.index({ shortCode: 1 });
linkSchema.index({ userId: 1, createdAt: -1 });

// Check if link is expired
linkSchema.methods.isExpired = function() {
  if (!this.expiryDate) return false;
  return new Date() > this.expiryDate;
};

module.exports = mongoose.model('Link', linkSchema);