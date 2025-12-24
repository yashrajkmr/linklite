// routes/redirect.js
const express = require('express');
const Link = require('../models/Link');
const useragent = require('useragent');
const axios = require('axios');

const router = express.Router();

// GET /:shortCode - Redirect to original URL and track analytics
router.get('/:shortCode', async (req, res) => {
  try {
    const { shortCode } = req.params;

    // Find link
    const link = await Link.findOne({ shortCode });

    if (!link) {
      return res.status(404).send(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Link Not Found</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
              margin: 0;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
            }
            .container {
              text-align: center;
              padding: 2rem;
              background: rgba(255, 255, 255, 0.1);
              border-radius: 20px;
              backdrop-filter: blur(10px);
            }
            h1 { font-size: 3rem; margin: 0; }
            p { font-size: 1.2rem; margin-top: 1rem; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>404</h1>
            <p>This short link does not exist or has been deleted.</p>
          </div>
        </body>
        </html>
      `);
    }

    // Check if link is active
    if (!link.isActive) {
      return res.status(410).send(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Link Disabled</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
              margin: 0;
              background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
              color: white;
            }
            .container {
              text-align: center;
              padding: 2rem;
              background: rgba(255, 255, 255, 0.1);
              border-radius: 20px;
              backdrop-filter: blur(10px);
            }
            h1 { font-size: 3rem; margin: 0; }
            p { font-size: 1.2rem; margin-top: 1rem; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>⛔ Link Disabled</h1>
            <p>This link has been disabled by its owner.</p>
          </div>
        </body>
        </html>
      `);
    }

    // Check if link is expired
    if (link.isExpired()) {
      return res.status(410).send(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Link Expired</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
              margin: 0;
              background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
              color: white;
            }
            .container {
              text-align: center;
              padding: 2rem;
              background: rgba(255, 255, 255, 0.1);
              border-radius: 20px;
              backdrop-filter: blur(10px);
            }
            h1 { font-size: 3rem; margin: 0; }
            p { font-size: 1.2rem; margin-top: 1rem; }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>⏱️ Link Expired</h1>
            <p>This link has expired and is no longer valid.</p>
          </div>
        </body>
        </html>
      `);
    }

    // TODO: Handle password protected links (future enhancement)

    // Track analytics asynchronously
    trackClick(link, req);

    // Redirect to original URL
    res.redirect(link.originalUrl);
  } catch (error) {
    console.error('Redirect error:', error);
    res.status(500).send('Internal server error');
  }
});

// Function to track click analytics
async function trackClick(link, req) {
  try {
    // Parse user agent
    const agent = useragent.parse(req.headers['user-agent']);
    
    // Get referrer
    const referrer = req.headers.referer || req.headers.referrer || 'Direct';

    // Get country from IP (using free ipapi service)
    let country = 'Unknown';
    try {
      const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.connection.remoteAddress;
      // Skip for localhost/development
      if (ip && !ip.includes('127.0.0.1') && !ip.includes('::1')) {
        const geoResponse = await axios.get(`https://ipapi.co/${ip}/json/`, {
          timeout: 2000 // Don't wait too long
        });
        country = geoResponse.data.country_name || 'Unknown';
      }
    } catch (geoError) {
      // Silently fail geo lookup
      console.log('Geo lookup failed, using Unknown');
    }

    // Update link with click data
    await Link.findByIdAndUpdate(link._id, {
      $inc: { clicks: 1 },
      $push: {
        clicksData: {
          clickedAt: new Date(),
          country,
          referrer,
          browser: agent.family || 'Unknown',
          os: agent.os.family || 'Unknown'
        }
      }
    });
  } catch (error) {
    console.error('Error tracking click:', error);
    // Don't fail the redirect if tracking fails
  }
}

module.exports = router;