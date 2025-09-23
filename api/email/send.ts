import { VercelRequest, VercelResponse } from '@vercel/node';
import { withSecurity, ValidationSchema } from '../_utils/security';

// Configuration de validation pour les emails
const emailValidationSchema: ValidationSchema = {
  to: {
    required: true,
    type: 'string',
    minLength: 5,
    maxLength: 100,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  subject: {
    required: true,
    type: 'string',
    minLength: 1,
    maxLength: 150
  },
  text: {
    required: false,
    type: 'string',
    maxLength: 5000
  },
  html: {
    required: false,
    type: 'string',
    maxLength: 50000
  },
  from: {
    required: false,
    type: 'string',
    maxLength: 100
  },
  templateId: {
    required: false,
    type: 'string',
    maxLength: 100
  },
  dynamicTemplateData: {
    required: false,
    type: 'object'
  }
};

// Interface pour les données d'email
interface EmailData {
  to: string;
  subject: string;
  text?: string;
  html?: string;
  from?: string;
  templateId?: string;
  dynamicTemplateData?: Record<string, any>;
}

/**
 * API pour envoyer des emails via SendGrid
 * Cette fonction serverless protège votre clé API SendGrid
 */
async function sendEmail(req: VercelRequest, res: VercelResponse) {
  try {
    const { to, subject, text, html, from, templateId, dynamicTemplateData } = req.body as EmailData;
    
    // Vérification que l'un des corps d'email est fourni
    if (!text && !html && !templateId) {
      return res.status(400).json({
        error: 'Contenu manquant',
        message: 'Vous devez fournir soit text, html, ou templateId'
      });
    }

    // Récupération de la clé API depuis les variables d'environnement
    const apiKey = process.env.SENDGRID_API_KEY;
    if (!apiKey) {
      console.error('SENDGRID_API_KEY non configurée');
      return res.status(500).json({
        error: 'Configuration manquante',
        message: 'Le service d\'email n\'est pas correctement configuré'
      });
    }

    // Configuration de SendGrid
    const sgMail = require('@sendgrid/mail');
    sgMail.setApiKey(apiKey);

    // Préparation du message
    const msg = {
      to,
      subject,
      from: from || process.env.SENDGRID_FROM_EMAIL || 'noreply@ecomboost-dz.com',
    };

    // Ajout du contenu selon ce qui est fourni
    if (text) msg.text = text;
    if (html) msg.html = html;
    if (templateId) {
      msg.templateId = templateId;
      if (dynamicTemplateData) msg.dynamicTemplateData = dynamicTemplateData;
    }

    // Envoi de l'email
    await sgMail.send(msg);

    return res.status(200).json({
      success: true,
      message: 'Email envoyé avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email:', error);
    return res.status(500).json({
      error: 'Échec de l\'envoi',
      message: 'Une erreur est survenue lors de l\'envoi de l\'email'
    });
  }
}

// Export de la fonction avec middleware de sécurité
export default withSecurity(sendEmail, {
  allowedMethods: ['POST'],
  validationSchema: emailValidationSchema
});