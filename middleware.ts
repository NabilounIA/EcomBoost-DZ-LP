import { NextRequest, NextResponse } from 'next/server';

// Configuration des domaines autorisés
const ALLOWED_ORIGINS = [
  'https://ecomboost-dz.vercel.app',
  'https://www.ecomboost-dz.com',
  'http://localhost:5173',
  'http://localhost:3000'
];

// Configuration du rate limiting global
const RATE_LIMIT_CONFIG = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 100 // 100 requêtes max par IP
};

// Store en mémoire pour le rate limiting
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

/**
 * Obtenir l'IP du client
 */
function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (realIP) {
    return realIP;
  }
  
  return 'unknown';
}

/**
 * Vérifier le rate limiting
 */
function checkRateLimit(ip: string): { allowed: boolean; retryAfter?: number } {
  const now = Date.now();
  
  // Nettoyer les entrées expirées
  for (const [key, value] of rateLimitStore.entries()) {
    if (value.resetTime < now) {
      rateLimitStore.delete(key);
    }
  }
  
  const current = rateLimitStore.get(ip);
  
  if (!current) {
    rateLimitStore.set(ip, {
      count: 1,
      resetTime: now + RATE_LIMIT_CONFIG.windowMs
    });
    return { allowed: true };
  }
  
  if (current.resetTime < now) {
    rateLimitStore.set(ip, {
      count: 1,
      resetTime: now + RATE_LIMIT_CONFIG.windowMs
    });
    return { allowed: true };
  }
  
  if (current.count >= RATE_LIMIT_CONFIG.maxRequests) {
    return {
      allowed: false,
      retryAfter: Math.ceil((current.resetTime - now) / 1000)
    };
  }
  
  current.count++;
  return { allowed: true };
}

/**
 * Vérifier si l'origine est autorisée
 */
function isOriginAllowed(origin: string | null): boolean {
  if (!origin) return false;
  
  // En développement, autoriser localhost
  if (process.env.NODE_ENV === 'development' && origin.includes('localhost')) {
    return true;
  }
  
  return ALLOWED_ORIGINS.includes(origin);
}

/**
 * Détecter les requêtes suspectes
 */
function isSuspiciousRequest(request: NextRequest): boolean {
  const userAgent = request.headers.get('user-agent') || '';
  const path = request.nextUrl.pathname;
  
  // Bloquer les bots malveillants
  const suspiciousBots = [
    'sqlmap',
    'nikto',
    'nmap',
    'masscan',
    'zap',
    'burp',
    'acunetix'
  ];
  
  if (suspiciousBots.some(bot => userAgent.toLowerCase().includes(bot))) {
    return true;
  }
  
  // Bloquer les tentatives d'accès à des fichiers sensibles
  const suspiciousPaths = [
    '/.env',
    '/wp-admin',
    '/admin',
    '/.git',
    '/config',
    '/backup',
    '/.htaccess',
    '/phpinfo',
    '/shell'
  ];
  
  if (suspiciousPaths.some(suspiciousPath => path.includes(suspiciousPath))) {
    return true;
  }
  
  return false;
}

/**
 * Middleware principal
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const origin = request.headers.get('origin');
  const ip = getClientIP(request);
  
  // Détecter les requêtes suspectes
  if (isSuspiciousRequest(request)) {
    console.warn(`🚨 Requête suspecte bloquée: ${ip} -> ${pathname}`);
    return new NextResponse('Forbidden', { status: 403 });
  }
  
  // Appliquer le rate limiting pour les API
  if (pathname.startsWith('/api/')) {
    const rateLimitResult = checkRateLimit(ip);
    
    if (!rateLimitResult.allowed) {
      console.warn(`⚠️ Rate limit dépassé: ${ip} -> ${pathname}`);
      return new NextResponse(
        JSON.stringify({
          error: 'Trop de requêtes',
          message: 'Veuillez patienter avant de réessayer',
          retryAfter: rateLimitResult.retryAfter
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': rateLimitResult.retryAfter?.toString() || '900'
          }
        }
      );
    }
  }
  
  // Créer la réponse avec les headers de sécurité
  const response = NextResponse.next();
  
  // Headers de sécurité globaux
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  
  // CSP pour les pages
  if (!pathname.startsWith('/api/')) {
    response.headers.set(
      'Content-Security-Policy',
      "default-src 'self'; " +
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com; " +
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
      "font-src 'self' https://fonts.gstatic.com; " +
      "img-src 'self' data: https: blob:; " +
      "connect-src 'self' https://www.google-analytics.com https://analytics.google.com; " +
      "frame-src 'none'; " +
      "object-src 'none'; " +
      "base-uri 'self';"
    );
  }
  
  // CORS pour les API
  if (pathname.startsWith('/api/')) {
    if (isOriginAllowed(origin)) {
      response.headers.set('Access-Control-Allow-Origin', origin || '*');
    }
    
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    response.headers.set('Access-Control-Max-Age', '86400');
    
    // Gérer les requêtes OPTIONS (preflight)
    if (request.method === 'OPTIONS') {
      return new NextResponse(null, { status: 200, headers: response.headers });
    }
  }
  
  // Log des requêtes API en développement
  if (process.env.NODE_ENV === 'development' && pathname.startsWith('/api/')) {
    console.log(`📡 API Request: ${request.method} ${pathname} from ${ip}`);
  }
  
  return response;
}

// Configuration du matcher
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
};