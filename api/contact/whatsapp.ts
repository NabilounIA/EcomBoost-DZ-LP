import { VercelRequest, VercelResponse } from '@vercel/node';
import { withSecurity, ValidationSchema } from '../_utils/security';

// Configuration de validation pour les demandes WhatsApp
const whatsappValidationSchema: ValidationSchema = {
  name: {
    required: true,
    type: 'string',
    minLength: 2,
    maxLength: 100
  },
  phone: {
    required: true,
    type: 'phone',
    minLength: 8,
    maxLength: 20
  },
  message: {
    required: false,
    type: 'string',
    maxLength: 500
  },
  service: {
    required: false,
    type: 'string',
    maxLength: 100
  }
};

// Interface pour les données de contact WhatsApp
interface WhatsAppContactData {
  name: string;
  phone: string;
  message?: string;
  service?: string;
  timestamp: string;
  ip: string;
  userAgent: string;
}

/**
 * Formater le numéro de téléphone
 */
function formatPhoneNumber(phone: string): string {
  // Supprimer tous les caractères non numériques sauf le +
  let cleaned = phone.replace(/[^\d+]/g, '');
  
  // Si commence par 0, remplacer par +213 (Algérie)
  if (cleaned.startsWith('0')) {
    cleaned = '+213' + cleaned.substring(1);
  }
  
  // Si ne commence pas par +, ajouter +213
  if (!cleaned.startsWith('+')) {
    cleaned = '+213' + cleaned;
  }
  
  return cleaned;
}

/**
 * Générer l'URL WhatsApp
 */
function generateWhatsAppURL(contactData: WhatsAppContactData): string {
  const businessPhone = process.env.WHATSAPP_BUSINESS_NUMBER || '+213XXXXXXXXX';
  
  let message = `Bonjour ! Je suis ${contactData.name}`;
  
  if (contactData.service) {
    message += ` et je suis intéressé(e) par ${contactData.service}`;
  }
  
  if (contactData.message) {
    message += `.\n\nMessage: ${contactData.message}`;
  }
  
  message += `\n\nMon numéro: ${contactData.phone}`;
  message += `\n\nDemande envoyée depuis le site web le ${new Date(contactData.timestamp).toLocaleString('fr-FR')}`;
  
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${businessPhone.replace(/[^\d]/g, '')}?text=${encodedMessage}`;
}

/**
 * Sauvegarder la demande de contact
 */
async function saveContactRequest(contactData: WhatsAppContactData): Promise<boolean> {
  try {
    // TODO: Intégrer avec votre base de données
    console.log('📱 Demande de contact WhatsApp:', {
      name: contactData.name,
      phone: contactData.phone,
      service: contactData.service,
      timestamp: contactData.timestamp
    });
    
    return true;
  } catch (error) {
    console.error('Erreur sauvegarde contact WhatsApp:', error);
    return false;
  }
}

/**
 * Envoyer une notification de nouvelle demande
 */
async function sendContactNotification(contactData: WhatsAppContactData): Promise<boolean> {
  try {
    // TODO: Intégrer avec votre service de notification
    console.log('🔔 Nouvelle demande de contact WhatsApp:', {
      name: contactData.name,
      phone: contactData.phone,
      timestamp: contactData.timestamp
    });
    
    return true;
  } catch (error) {
    console.error('Erreur notification contact:', error);
    return false;
  }
}

/**
 * Handler principal pour les demandes de contact WhatsApp
 */
async function whatsappContactHandler(req: VercelRequest, res: VercelResponse) {
  // Seules les requêtes POST sont autorisées
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Méthode non autorisée',
      message: 'Seules les requêtes POST sont acceptées'
    });
  }

  try {
    // Extraire et formater les données
    const contactData: WhatsAppContactData = {
      name: req.body.name,
      phone: formatPhoneNumber(req.body.phone),
      message: req.body.message || '',
      service: req.body.service || '',
      timestamp: new Date().toISOString(),
      ip: req.headers['x-forwarded-for'] as string || 'unknown',
      userAgent: req.headers['user-agent'] || 'unknown'
    };

    // Sauvegarder la demande
    const saved = await saveContactRequest(contactData);
    if (!saved) {
      return res.status(500).json({
        error: 'Erreur de sauvegarde',
        message: 'Impossible de sauvegarder votre demande'
      });
    }

    // Envoyer la notification
    const notificationSent = await sendContactNotification(contactData);
    if (!notificationSent) {
      console.warn('⚠️ Notification non envoyée pour:', contactData.name);
    }

    // Générer l'URL WhatsApp
    const whatsappURL = generateWhatsAppURL(contactData);

    // Réponse de succès
    res.status(200).json({
      success: true,
      message: 'Demande de contact enregistrée avec succès',
      data: {
        whatsappURL: whatsappURL,
        contactId: `contact_${Date.now()}`,
        timestamp: contactData.timestamp,
        formattedPhone: contactData.phone
      }
    });

  } catch (error) {
    console.error('Erreur demande contact WhatsApp:', error);
    
    res.status(500).json({
      error: 'Erreur interne',
      message: 'Une erreur inattendue s\'est produite'
    });
  }
}

// Export du handler avec sécurité
export default withSecurity(whatsappContactHandler, {
  rateLimit: {
    windowMs: 10 * 60 * 1000, // 10 minutes
    maxRequests: 3, // 3 demandes max par IP
    keyGenerator: (req) => req.headers['x-forwarded-for'] as string || 'unknown'
  },
  allowedOrigins: [
    'https://ecomboost-dz.vercel.app',
    'https://www.ecomboost-dz.com',
    'http://localhost:5173'
  ],
  validation: whatsappValidationSchema
});