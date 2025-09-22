import { VercelRequest, VercelResponse } from '@vercel/node';

// Configuration robots.txt
const SITE_URL = process.env.VITE_SITE_URL || 'https://ecomboost-dz.vercel.app';

/**
 * Générer le contenu robots.txt
 */
function generateRobotsTxt(): string {
  const isProduction = process.env.NODE_ENV === 'production';
  
  if (!isProduction) {
    // En développement, bloquer tous les robots
    return `User-agent: *
Disallow: /

# Site en développement
# Accès interdit aux robots`;
  }

  // En production, configuration SEO optimisée
  return `User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin/
Disallow: /_next/
Disallow: /404
Disallow: /500

# Bots spécifiques
User-agent: Googlebot
Allow: /
Disallow: /api/

User-agent: Bingbot
Allow: /
Disallow: /api/

# Bloquer les bots malveillants
User-agent: AhrefsBot
Disallow: /

User-agent: MJ12bot
Disallow: /

User-agent: DotBot
Disallow: /

User-agent: SemrushBot
Disallow: /

# Sitemap
Sitemap: ${SITE_URL}/sitemap.xml

# Délai entre les requêtes (en secondes)
Crawl-delay: 1`;
}

/**
 * Handler pour robots.txt
 */
export default function robotsHandler(req: VercelRequest, res: VercelResponse) {
  try {
    // Seules les requêtes GET sont autorisées
    if (req.method !== 'GET') {
      return res.status(405).json({
        error: 'Méthode non autorisée',
        message: 'Seules les requêtes GET sont acceptées'
      });
    }

    // Générer le contenu robots.txt
    const robotsContent = generateRobotsTxt();

    // Headers pour le fichier texte
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Cache-Control', 'public, max-age=86400'); // Cache 24h
    
    // Retourner le robots.txt
    res.status(200).send(robotsContent);

  } catch (error) {
    console.error('Erreur génération robots.txt:', error);
    
    res.status(500).send('# Erreur lors de la génération du robots.txt');
  }
}