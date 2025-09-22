import { VercelRequest, VercelResponse } from '@vercel/node';

// Types pour la sécurité
export interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  keyGenerator?: (req: VercelRequest) => string;
}

export interface ValidationSchema {
  [key: string]: {
    required?: boolean;
    type?: 'string' | 'number' | 'email' | 'phone';
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
  };
}

// Store en mémoire pour le rate limiting (en production, utilisez Redis)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

/**
 * Middleware de rate limiting
 */
export function rateLimit(config: RateLimitConfig) {
  return (req: VercelRequest, res: VercelResponse, next: () => void) => {
    const key = config.keyGenerator ? config.keyGenerator(req) : getClientIP(req);
    const now = Date.now();
    
    // Nettoyer les entrées expirées
    for (const [k, v] of rateLimitStore.entries()) {
      if (v.resetTime < now) {
        rateLimitStore.delete(k);
      }
    }
    
    const current = rateLimitStore.get(key);
    
    if (!current) {
      rateLimitStore.set(key, {
        count: 1,
        resetTime: now + config.windowMs
      });
      return next();
    }
    
    if (current.resetTime < now) {
      rateLimitStore.set(key, {
        count: 1,
        resetTime: now + config.windowMs
      });
      return next();
    }
    
    if (current.count >= config.maxRequests) {
      return res.status(429).json({
        error: 'Trop de requêtes',
        message: 'Veuillez patienter avant de réessayer',
        retryAfter: Math.ceil((current.resetTime - now) / 1000)
      });
    }
    
    current.count++;
    next();
  };
}

/**
 * Middleware CORS sécurisé
 */
export function corsMiddleware(allowedOrigins: string[] = []) {
  return (req: VercelRequest, res: VercelResponse, next: () => void) => {
    const origin = req.headers.origin as string;
    
    // En développement, autoriser localhost
    const isDev = process.env.NODE_ENV === 'development';
    const isAllowedOrigin = allowedOrigins.includes(origin) || 
                           (isDev && origin?.includes('localhost'));
    
    if (isAllowedOrigin) {
      res.setHeader('Access-Control-Allow-Origin', origin);
    }
    
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Max-Age', '86400'); // 24h
    
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }
    
    next();
  };
}

/**
 * Validation des données d'entrée
 */
export function validateInput(data: any, schema: ValidationSchema): string[] {
  const errors: string[] = [];
  
  for (const [field, rules] of Object.entries(schema)) {
    const value = data[field];
    
    // Vérifier si le champ est requis
    if (rules.required && (!value || value.toString().trim() === '')) {
      errors.push(`Le champ ${field} est requis`);
      continue;
    }
    
    // Si pas de valeur et pas requis, passer
    if (!value) continue;
    
    // Vérifier le type
    if (rules.type) {
      switch (rules.type) {
        case 'email':
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            errors.push(`${field} doit être une adresse email valide`);
          }
          break;
        case 'phone':
          if (!/^[\d\s\-\+\(\)]{8,}$/.test(value.replace(/\s/g, ''))) {
            errors.push(`${field} doit être un numéro de téléphone valide`);
          }
          break;
        case 'number':
          if (isNaN(Number(value))) {
            errors.push(`${field} doit être un nombre`);
          }
          break;
        case 'string':
          if (typeof value !== 'string') {
            errors.push(`${field} doit être une chaîne de caractères`);
          }
          break;
      }
    }
    
    // Vérifier la longueur
    if (rules.minLength && value.toString().length < rules.minLength) {
      errors.push(`${field} doit contenir au moins ${rules.minLength} caractères`);
    }
    
    if (rules.maxLength && value.toString().length > rules.maxLength) {
      errors.push(`${field} ne peut pas dépasser ${rules.maxLength} caractères`);
    }
    
    // Vérifier le pattern
    if (rules.pattern && !rules.pattern.test(value)) {
      errors.push(`${field} ne respecte pas le format requis`);
    }
  }
  
  return errors;
}

/**
 * Obtenir l'IP du client
 */
export function getClientIP(req: VercelRequest): string {
  return (
    req.headers['x-forwarded-for'] as string ||
    req.headers['x-real-ip'] as string ||
    req.connection?.remoteAddress ||
    'unknown'
  ).split(',')[0].trim();
}

/**
 * Sanitiser les données d'entrée
 */
export function sanitizeInput(data: any): any {
  if (typeof data === 'string') {
    return data.trim().replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  }
  
  if (Array.isArray(data)) {
    return data.map(sanitizeInput);
  }
  
  if (typeof data === 'object' && data !== null) {
    const sanitized: any = {};
    for (const [key, value] of Object.entries(data)) {
      sanitized[key] = sanitizeInput(value);
    }
    return sanitized;
  }
  
  return data;
}

/**
 * Headers de sécurité pour les API
 */
export function setSecurityHeaders(res: VercelResponse): void {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Content-Security-Policy', "default-src 'none'");
}

/**
 * Middleware de sécurité complet
 */
export function securityMiddleware(config: {
  rateLimit?: RateLimitConfig;
  allowedOrigins?: string[];
  validation?: ValidationSchema;
}) {
  return async (req: VercelRequest, res: VercelResponse, next: () => void) => {
    // Headers de sécurité
    setSecurityHeaders(res);
    
    // CORS
    if (config.allowedOrigins) {
      corsMiddleware(config.allowedOrigins)(req, res, () => {});
    }
    
    // Rate limiting
    if (config.rateLimit) {
      rateLimit(config.rateLimit)(req, res, () => {});
    }
    
    // Validation si POST/PUT
    if ((req.method === 'POST' || req.method === 'PUT') && config.validation) {
      const sanitizedBody = sanitizeInput(req.body);
      const errors = validateInput(sanitizedBody, config.validation);
      
      if (errors.length > 0) {
        return res.status(400).json({
          error: 'Données invalides',
          details: errors
        });
      }
      
      req.body = sanitizedBody;
    }
    
    next();
  };
}

/**
 * Wrapper pour les handlers d'API avec gestion d'erreur
 */
export function withSecurity(
  handler: (req: VercelRequest, res: VercelResponse) => Promise<void>,
  config: Parameters<typeof securityMiddleware>[0] = {}
) {
  return async (req: VercelRequest, res: VercelResponse) => {
    try {
      // Appliquer les middlewares de sécurité
      await new Promise<void>((resolve) => {
        securityMiddleware(config)(req, res, resolve);
      });
      
      // Exécuter le handler
      await handler(req, res);
    } catch (error) {
      console.error('API Error:', error);
      
      if (!res.headersSent) {
        res.status(500).json({
          error: 'Erreur interne du serveur',
          message: 'Une erreur inattendue s\'est produite'
        });
      }
    }
  };
}