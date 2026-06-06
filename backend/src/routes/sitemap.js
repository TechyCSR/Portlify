import express from 'express';
import Profile from '../models/Profile.js';

const router = express.Router();

const getFrontendUrl = () => {
    const url = process.env.FRONTEND_URL || 'https://portlify.techycsr.dev';
    return url.replace(/\/$/, '');
};

// GET /api/sitemap.xml — Dynamic sitemap for all public portfolios
router.get('/', async (req, res) => {
    const baseUrl = getFrontendUrl();

    try {
        const profiles = await Profile.find(
            { isPublic: { $ne: false } },
            'username updatedAt'
        ).lean();

        const today = new Date().toISOString().split('T')[0];

        let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Static Pages -->
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/premium</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/sign-in</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>${baseUrl}/sign-up</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>`;

        for (const profile of profiles) {
            if (!profile.username) continue;
            const lastmod = profile.updatedAt
                ? new Date(profile.updatedAt).toISOString().split('T')[0]
                : today;
            xml += `
  <url>
    <loc>${baseUrl}/${encodeURIComponent(profile.username)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`;
        }

        xml += `\n</urlset>\n`;

        res.set('Content-Type', 'application/xml');
        res.set('Cache-Control', 'public, max-age=3600, s-maxage=3600');
        res.send(xml);
    } catch (error) {
        console.error('Sitemap generation error:', error);
        res.set('Content-Type', 'application/xml');
        res.send(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`);
    }
});

export default router;