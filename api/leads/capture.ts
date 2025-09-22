import { VercelRequest, VercelResponse } from '@vercel/node';
import { withSecurity, ValidationSchema } from '../_utils/security';

// Configuration de validation pour les leads
const leadValidationSchema: ValidationSchema = {
  name: {
    required: true,
    type: 'string',
    minLength: 2,
    maxLength: 100
  },
  email: {
    required: true,
    type: 'email',
    maxLength: 255
  },
  phone: {
    required: true,
    type: 'phone',
    minLength: 8,
    maxLength: 20
  },
  company: {
    required: false,
    type: 'string',
    maxLength: 100
  },
  message: {
    required: false,
    type: 'string',
    maxLength: 1000
  },
  source: {
    required: false,
    type: 'string',
    maxLength: 50
  }
};

// Interface pour les données de lead
interface LeadData {
  name: string;
  email: string;
  phone: string;
  company?: string;
  message?: string;
  source?: string;
  timestamp: string;
  ip: string;
  userAgent: string;
}

/**
 * Envoyer un email de notification (simulation)
 * En production, intégrez avec SendGrid, Mailgun, etc.
 */
async function sendLeadNotification(leadData: LeadData): Promise<boolean> {
  try {
    // TODO: Intégrer avec votre service d'email
    console.log('📧 Nouveau lead reçu:', {
      name: leadData.name,
      email: leadData.email,
      phone: leadData.phone,
      company: leadData.company,
      timestamp: leadData.timestamp
    });
    
    // Simulation d'envoi d'email
    return true;
  } catch (error) {
    console.error('Erreur envoi email:', error);
    return false;
  }
}

/**
 * Sauvegarder le lead (simulation)
 * En production, intégrez avec votre base de données
 */
async function saveLead(leadData: LeadData): Promise<boolean> {
  try {
    // TODO: Intégrer avec votre base de données (MongoDB, PostgreSQL, etc.)
    console.log('💾 Lead sauvegardé:', leadData);
    
    // Simulation de sauvegarde
    return true;
  } catch (error) {
    console.error('Erreur sauvegarde lead:', error);
    return false;
  }
}

/**
 * Handler principal pour la capture de leads
 */
async function leadCaptureHandler(req: VercelRequest, res: VercelResponse) {
  // Seules les requêtes POST sont autorisées
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Méthode non autorisée',
      message: 'Seules les requêtes POST sont acceptées'
    });
  }

  try {
    // Extraire les données du lead
    const leadData: LeadData = {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      company: req.body.company || '',
      message: req.body.message || '',
      source: req.body.source || 'website',
      timestamp: new Date().toISOString(),
      ip: req.headers['x-forwarded-for'] as string || 'unknown',
      userAgent: req.headers['user-agent'] || 'unknown'
    };

    // Sauvegarder le lead
    const saved = await saveLead(leadData);
    if (!saved) {
      return res.status(500).json({
        error: 'Erreur de sauvegarde',
        message: 'Impossible de sauvegarder vos informations'
      });
    }

    // Envoyer la notification email
    const emailSent = await sendLeadNotification(leadData);
    if (!emailSent) {
      console.warn('⚠️ Email de notification non envoyé pour:', leadData.email);
    }

    // Réponse de succès
    res.status(200).json({
      success: true,
      message: 'Merci ! Nous avons bien reçu votre demande.',
      data: {
        id: `lead_${Date.now()}`,
        timestamp: leadData.timestamp
      }
    });

  } catch (error) {
    console.error('Erreur capture lead:', error);
    
    res.status(500).json({
      error: 'Erreur interne',
      message: 'Une erreur inattendue s\'est produite'
    });
  }
}

// Export du handler avec sécurité
export default withSecurity(leadCaptureHandler, {
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5, // 5 soumissions max par IP
    keyGenerator: (req) => req.headers['x-forwarded-for'] as string || 'unknown'
  },
  allowedOrigins: [
    'https://ecomboost-dz.vercel.app',
    'https://www.ecomboost-dz.com',
    'http://localhost:5173' // Pour le développement
  ],
  validation: leadValidationSchema
});