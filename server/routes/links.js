// routes/links.js
const express = require('express');
const Link = require('../models/Link');
const authMiddleware = require('../middleware/auth');
const { generateShortCode, validateCustomAlias, validateUrl } = require('../utils/generateShortCode');
const QRCode = require('qrcode');

const router = express.Router();

// All routes are protected
router.use(authMiddleware);

// POST /api/links - Create new short link
router.post('/', async (req, res) => {
  try {
    const { originalUrl, customAlias, expiryDate, password } = req.body;

    // Validate URL
    if (!originalUrl || !validateUrl(originalUrl)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid URL'
      });
    }

    // Generate or validate short code
    let shortCode;
    if (customAlias) {
      if (!validateCustomAlias(customAlias)) {
        return res.status(400).json({
          success: false,
          message: 'Custom alias must be 3-20 characters (letters, numbers, dash, underscore only)'
        });
      }

      // Check if custom alias already exists
      const existingLink = await Link.findOne({ shortCode: customAlias });
      if (existingLink) {
        return res.status(400).json({
          success: false,
          message: 'This custom alias is already taken'
        });
      }
      shortCode = customAlias;
    } else {
      // Generate unique short code
      let attempts = 0;
      do {
        shortCode = generateShortCode();
        const exists = await Link.findOne({ shortCode });
        if (!exists) break;
        attempts++;
      } while (attempts < 5);

      if (attempts === 5) {
        return res.status(500).json({
          success: false,
          message: 'Unable to generate unique short code. Please try again.'
        });
      }
    }

    // Create link
    const link = await Link.create({
      originalUrl,
      shortCode,
      customAlias: customAlias || null,
      userId: req.userId,
      expiryDate: expiryDate || null,
      password: password || null
    });

    // Generate QR code
    const shortUrl = `${process.env.BASE_URL || 'http://localhost:5000'}/${shortCode}`;
    const qrCodeDataUrl = await QRCode.toDataURL(shortUrl);

    res.status(201).json({
      success: true,
      message: 'Link created successfully',
      link: {
        id: link._id,
        originalUrl: link.originalUrl,
        shortUrl,
        shortCode: link.shortCode,
        qrCode: qrCodeDataUrl,
        clicks: link.clicks,
        isActive: link.isActive,
        expiryDate: link.expiryDate,
        createdAt: link.createdAt
      }
    });
  } catch (error) {
    console.error('Create link error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating link'
    });
  }
});

// GET /api/links - Get all user's links
router.get('/', async (req, res) => {
  try {
    const { search, sortBy = 'createdAt', order = 'desc' } = req.query;

    // Build query
    const query = { userId: req.userId };
    if (search) {
      query.$or = [
        { originalUrl: { $regex: search, $options: 'i' } },
        { shortCode: { $regex: search, $options: 'i' } }
      ];
    }

    // Fetch links
    const links = await Link.find(query)
      .sort({ [sortBy]: order === 'desc' ? -1 : 1 })
      .select('-clicksData'); // Exclude detailed clicks data from list

    res.json({
      success: true,
      count: links.length,
      links: links.map(link => ({
        id: link._id,
        originalUrl: link.originalUrl,
        shortUrl: `${process.env.BASE_URL || 'http://localhost:5000'}/${link.shortCode}`,
        shortCode: link.shortCode,
        clicks: link.clicks,
        isActive: link.isActive,
        expiryDate: link.expiryDate,
        createdAt: link.createdAt
      }))
    });
  } catch (error) {
    console.error('Get links error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching links'
    });
  }
});

// GET /api/links/:id - Get single link with analytics
router.get('/:id', async (req, res) => {
  try {
    const link = await Link.findOne({
      _id: req.params.id,
      userId: req.userId
    });

    if (!link) {
      return res.status(404).json({
        success: false,
        message: 'Link not found'
      });
    }

    // Process analytics data
    const last7Days = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const recentClicks = link.clicksData.filter(
      click => new Date(click.clickedAt) > last7Days
    );

    // Group clicks by date
    const clicksByDate = {};
    recentClicks.forEach(click => {
      const date = new Date(click.clickedAt).toLocaleDateString();
      clicksByDate[date] = (clicksByDate[date] || 0) + 1;
    });

    // Get last clicked time
    const lastClicked = link.clicksData.length > 0
      ? link.clicksData[link.clicksData.length - 1].clickedAt
      : null;

    // Generate QR code
    const shortUrl = `${process.env.BASE_URL || 'http://localhost:5000'}/${link.shortCode}`;
    const qrCodeDataUrl = await QRCode.toDataURL(shortUrl);

    res.json({
      success: true,
      link: {
        id: link._id,
        originalUrl: link.originalUrl,
        shortUrl,
        shortCode: link.shortCode,
        qrCode: qrCodeDataUrl,
        clicks: link.clicks,
        isActive: link.isActive,
        expiryDate: link.expiryDate,
        createdAt: link.createdAt,
        lastClicked,
        analytics: {
          clicksByDate,
          recentClicks: recentClicks.length,
          topCountries: getTopItems(recentClicks, 'country', 5),
          topBrowsers: getTopItems(recentClicks, 'browser', 3),
          topReferrers: getTopItems(recentClicks, 'referrer', 5)
        }
      }
    });
  } catch (error) {
    console.error('Get link error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching link'
    });
  }
});

// PATCH /api/links/:id - Update link
router.patch('/:id', async (req, res) => {
  try {
    const { isActive, expiryDate } = req.body;

    const link = await Link.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { isActive, expiryDate },
      { new: true, runValidators: true }
    );

    if (!link) {
      return res.status(404).json({
        success: false,
        message: 'Link not found'
      });
    }

    res.json({
      success: true,
      message: 'Link updated successfully',
      link: {
        id: link._id,
        isActive: link.isActive,
        expiryDate: link.expiryDate
      }
    });
  } catch (error) {
    console.error('Update link error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating link'
    });
  }
});

// DELETE /api/links/:id - Delete link
router.delete('/:id', async (req, res) => {
  try {
    const link = await Link.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId
    });

    if (!link) {
      return res.status(404).json({
        success: false,
        message: 'Link not found'
      });
    }

    res.json({
      success: true,
      message: 'Link deleted successfully'
    });
  } catch (error) {
    console.error('Delete link error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting link'
    });
  }
});

// Helper function to get top items from clicks data
function getTopItems(clicksData, field, limit) {
  const counts = {};
  clicksData.forEach(click => {
    const value = click[field] || 'Unknown';
    counts[value] = (counts[value] || 0) + 1;
  });

  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([name, count]) => ({ name, count }));
}

module.exports = router;