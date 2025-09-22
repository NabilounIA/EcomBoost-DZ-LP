import { VercelRequest, VercelResponse } from '@vercel/node';

// Configuration du sitemap
const SITE_URL = process.env.VITE_SITE_URL || 'https://ecomboost-dz.vercel.app';

// Pages statiques du site
const STATIC_PAGES = [
  {
    url: '/',
    changefreq: 'weekly',
    priority: '1.0',
    lastmod: new Date().toISOString().split('T')[0]
  },
  {
    url: '/services',
    changefreq: 'monthly',
    priority: '0.8',
    lastmod: new Date().toISOString().split('T')[0]
  },
  {
    url: '/pricing',
    changefreq: 'monthly',
    priority: '0.8',
    lastmod: new Date().toISOString().split('T')[0]
  },
  {
    url: '/about',
    changefreq: 'monthly',
    priority: '0.6',
    lastmod: new Date().toISOString().split('T')[0]
  },
  {
    url: '/contact',
    changefreq: 'monthly',
    priority: '0.7',
    lastmod: new Date().toISOString().split('T')[0]
  },
  {
    url: '/blog',
    changefreq: 'weekly',
    priority: '0.7',
    lastmod: new Date().toISOString().split('T')[0]
  }
];

/**
 * Générer le XML du sitemap
 */
function generateSitemapXML(pages: typeof STATIC_PAGES): string {
  const urls = pages.map(page => `
  <url>
    <loc>${SITE_URL}${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls}
</urlset>`;
}

/**
 * Handler pour le sitemap
 */
export default function sitemapHandler(req: VercelRequest, res: VercelResponse) {
  try {
    // Seules les requêtes GET sont autorisées
    if (req.method !== 'GET') {
      return res.status(405).json({
        error: 'Méthode non autorisée',
        message: 'Seules les requêtes GET sont acceptées'
      });
    }

    // Générer le sitemap XML
    const sitemapXML = generateSitemapXML(STATIC_PAGES);

    // Headers pour le XML
    res.setHeader('Content-Type', 'application/xml');
    res.setHeader('Cache-Control', 'public, max-age=86400'); // Cache 24h
    
    // Retourner le sitemap
    res.status(200).send(sitemapXML);

  } catch (error) {
    console.error('Erreur génération sitemap:', error);
    
    res.status(500).json({
      error: 'Erreur interne',
      message: 'Impossible de générer le sitemap'
    });
  }
}