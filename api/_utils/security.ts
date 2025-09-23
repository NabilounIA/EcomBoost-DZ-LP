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

// Types pour le rate limiting
export interface RateLimitInfo {
  totalHits: number;
  resetTime: number;
}

export interface RateLimitStore {
  increment(key: string): Promise<RateLimitInfo>;
}

// Implémentation en mémoire pour le stockage du rate limiting
// ⚠️ AVERTISSEMENT DE SÉCURITÉ: Cette implémentation est uniquement pour le développement
// En production, utilisez Redis ou une autre solution persistante pour éviter les problèmes suivants:
// 1. Perte des données de rate limiting lors du redémarrage du serveur
// 2. Inefficacité dans un environnement multi-instance
// 3. Consommation excessive de mémoire en cas d'attaque DDoS
class InMemoryStore implements RateLimitStore {
  private store: Map<string, RateLimitInfo>;

  constructor() {
    this.store = new Map();
    
    // Nettoyage périodique pour éviter les fuites de mémoire
    setInterval(() => this.cleanup(), 3600000); // Nettoyage toutes les heures
  }

  async increment(key: string): Promise<RateLimitInfo> {
    const now = Date.now();
    const record = this.store.get(key) || {
      totalHits: 0,
      resetTime: now + 60000, // 1 minute
    };

    // Si le temps de réinitialisation est dépassé, on remet à zéro
    if (now > record.resetTime) {
      record.totalHits = 0;
      record.resetTime = now + 60000; // 1 minute
    }

    record.totalHits += 1;
    this.store.set(key, record);
    return record;
  }
  
  // Méthode pour nettoyer les entrées expirées
  private cleanup(): void {
    const now = Date.now();
    for (const [key, record] of this.store.entries()) {
      if (now > record.resetTime) {
        this.store.delete(key);
      }
    }
  }
}

// Instance par défaut pour le rate limiting
const defaultRateLimitStore = new InMemoryStore();

/**
 * Middleware de rate limiting amélioré
 */
export function rateLimit(config: RateLimitConfig) {
  return async (req: VercelRequest, res: VercelResponse, next: () => void) => {
    const key = config.keyGenerator ? config.keyGenerator(req) : getClientIP(req);
    const store = defaultRateLimitStore;
    
    const info = await store.increment(key);
    
    if (info.totalHits > config.maxRequests) {
      const retryAfter = Math.ceil((info.resetTime - Date.now()) / 1000);
      res.setHeader('Retry-After', String(retryAfter));
      return res.status(429).json({
        error: 'Trop de requêtes',
        message: 'Veuillez patienter avant de réessayer',
        retryAfter: retryAfter
      });
    }
    
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