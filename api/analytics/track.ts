import { VercelRequest, VercelResponse } from '@vercel/node';
import { withSecurity, ValidationSchema } from '../_utils/security';

// Configuration de validation pour les événements analytics
const analyticsValidationSchema: ValidationSchema = {
  event: {
    required: true,
    type: 'string',
    minLength: 1,
    maxLength: 100,
    pattern: /^[a-zA-Z0-9_-]+$/
  },
  category: {
    required: false,
    type: 'string',
    maxLength: 50
  },
  label: {
    required: false,
    type: 'string',
    maxLength: 100
  },
  value: {
    required: false,
    type: 'number'
  },
  page: {
    required: false,
    type: 'string',
    maxLength: 200
  },
  userId: {
    required: false,
    type: 'string',
    maxLength: 100
  }
};

// Interface pour les données d'événement
interface AnalyticsEvent {
  event: string;
  category?: string;
  label?: string;
  value?: number;
  page?: string;
  userId?: string;
  timestamp: string;
  ip: string;
  userAgent: string;
  sessionId?: string;
}

/**
 * Envoyer les données à Google Analytics 4
 */
async function sendToGA4(eventData: AnalyticsEvent): Promise<boolean> {
  try {
    const measurementId = process.env.VITE_GA_MEASUREMENT_ID;
    const apiSecret = process.env.GA4_API_SECRET;
    
    if (!measurementId || !apiSecret) {
      console.warn('⚠️ Configuration GA4 manquante');
      return false;
    }
    
    const url = `https://www.google-analytics.com/mp/collect?measurement_id=${measurementId}&api_secret=${apiSecret}`;
    
    const payload = {
      client_id: eventData.userId || eventData.sessionId || 'anonymous',
      events: [{
        name: eventData.event,
        params: {
          event_category: eventData.category,
          event_label: eventData.label,
          value: eventData.value,
          page_location: eventData.page,
          custom_timestamp: eventData.timestamp
        }
      }]
    };
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });
    
    return response.ok;
  } catch (error) {
    console.error('Erreur envoi GA4:', error);
    return false;
  }
}

/**
 * Sauvegarder l'événement localement
 */
async function saveAnalyticsEvent(eventData: AnalyticsEvent): Promise<boolean> {
  try {
    // TODO: Intégrer avec votre base de données
    console.log('📊 Événement analytics:', {
      event: eventData.event,
      category: eventData.category,
      timestamp: eventData.timestamp,
      ip: eventData.ip.substring(0, 8) + '...' // IP partielle pour la confidentialité
    });
    
    return true;
  } catch (error) {
    console.error('Erreur sauvegarde analytics:', error);
    return false;
  }
}

/**
 * Générer un ID de session basique
 */
function generateSessionId(req: VercelRequest): string {
  const ip = req.headers['x-forwarded-for'] as string || 'unknown';
  const userAgent = req.headers['user-agent'] || 'unknown';
  const timestamp = Math.floor(Date.now() / (1000 * 60 * 30)); // 30 minutes
  
  return Buffer.from(`${ip}-${userAgent}-${timestamp}`).toString('base64').substring(0, 16);
}

/**
 * Handler principal pour le tracking analytics
 */
async function analyticsTrackHandler(req: VercelRequest, res: VercelResponse) {
  // Seules les requêtes POST sont autorisées
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Méthode non autorisée',
      message: 'Seules les requêtes POST sont acceptées'
    });
  }

  try {
    // Extraire les données de l'événement
    const eventData: AnalyticsEvent = {
      event: req.body.event,
      category: req.body.category || 'general',
      label: req.body.label,
      value: req.body.value ? Number(req.body.value) : undefined,
      page: req.body.page,
      userId: req.body.userId,
      timestamp: new Date().toISOString(),
      ip: req.headers['x-forwarded-for'] as string || 'unknown',
      userAgent: req.headers['user-agent'] || 'unknown',
      sessionId: generateSessionId(req)
    };

    // Sauvegarder localement
    const saved = await saveAnalyticsEvent(eventData);
    
    // Envoyer à GA4 (optionnel)
    const sentToGA4 = await sendToGA4(eventData);

    // Réponse de succès
    res.status(200).json({
      success: true,
      message: 'Événement enregistré',
      data: {
        eventId: `evt_${Date.now()}`,
        timestamp: eventData.timestamp,
        saved: saved,
        sentToGA4: sentToGA4
      }
    });

  } catch (error) {
    console.error('Erreur tracking analytics:', error);
    
    res.status(500).json({
      error: 'Erreur interne',
      message: 'Impossible d\'enregistrer l\'événement'
    });
  }
}

// Export du handler avec sécurité
export default withSecurity(analyticsTrackHandler, {
  rateLimit: {
    windowMs: 1 * 60 * 1000, // 1 minute
    maxRequests: 30, // 30 événements max par minute par IP
    keyGenerator: (req) => req.headers['x-forwarded-for'] as string || 'unknown'
  },
  allowedOrigins: [
    'https://ecomboost-dz.vercel.app',
    'https://www.ecomboost-dz.com',
    'http://localhost:5173'
  ],
  validation: analyticsValidationSchema
});