/**
 * Exemples d'utilisation des API serverless sécurisées
 * Ce fichier montre comment appeler les API serverless au lieu d'utiliser directement les services externes
 */

// Exemple d'envoi d'email via l'API serverless (au lieu d'utiliser SendGrid directement)
export async function sendEmail(to: string, subject: string, content: string) {
  try {
    const response = await fetch('/api/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to,
        subject,
        html: content,
      }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email:', error);
    throw error;
  }
}

// Exemple d'interaction avec MongoDB via l'API serverless
export async function getLeads() {
  try {
    const response = await fetch('/api/database/connect', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        collection: 'leads',
        operation: 'find',
        query: { status: 'active' },
      }),
    });

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des leads:', error);
    throw error;
  }
}

// Exemple d'envoi d'événement analytics via l'API serverless existante
export async function trackEvent(eventName: string, eventData: any) {
  try {
    const response = await fetch('/api/analytics/track', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        event: eventName,
        ...eventData,
      }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erreur lors du tracking de l\'événement:', error);
    throw error;
  }
}