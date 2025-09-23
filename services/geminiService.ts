// Service pour interagir avec l'API Gemini de manière sécurisée

export interface GeminiRequest {
  prompt: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
  systemInstruction?: string;
}

export interface GeminiResponse {
  success: boolean;
  data?: {
    text: string;
    model: string;
    usage: any;
  };
  error?: string;
  details?: any;
  timestamp?: string;
}

/**
 * Appeler l'API Gemini via notre API serverless sécurisée
 */
export async function generateContent(request: GeminiRequest): Promise<string> {
  try {
    const response = await fetch('/api/ai/gemini', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    const data: GeminiResponse = await response.json();

    if (!data.success) {
      throw new Error(data.error || 'Erreur lors de la génération de contenu');
    }

    return data.data?.text || '';
  } catch (error) {
    console.error('Erreur lors de l\'appel à Gemini:', error);
    throw error;
  }
}

/**
 * Générer du contenu publicitaire avec Gemini
 */
export async function generateAdContent(productName: string, targetAudience: string, platform: string): Promise<string> {
  const prompt = `Créez un contenu publicitaire accrocheur pour ${productName} destiné à ${targetAudience} sur ${platform}. 
  Le contenu doit être en français, adapté au marché algérien, et optimisé pour maximiser l'engagement et les conversions.
  Incluez un call-to-action fort.`;

  const systemInstruction = `Tu es un expert en marketing digital spécialisé dans le marché algérien. 
  Tu crées des contenus publicitaires qui convertissent, en utilisant les codes culturels et linguistiques appropriés.`;

  return generateContent({
    prompt,
    systemInstruction,
    temperature: 0.8,
    maxTokens: 500,
  });
}

/**
 * Générer des réponses de chatbot avec Gemini
 */
export async function generateChatbotResponse(userMessage: string, context: string): Promise<string> {
  const prompt = `L'utilisateur dit: "${userMessage}"
  Contexte de la conversation: ${context}
  
  Réponds de manière professionnelle et utile en tant qu'assistant e-commerce pour EcomBoost DZ.`;

  const systemInstruction = `Tu es un assistant virtuel pour EcomBoost DZ, une entreprise d'automatisation e-commerce en Algérie.
  Tu aides les clients avec leurs questions sur nos services d'automatisation WhatsApp, création de publicités, et outils marketing.
  Réponds toujours en français, sois professionnel mais chaleureux, et guide vers une prise de contact si approprié.`;

  return generateContent({
    prompt,
    systemInstruction,
    temperature: 0.7,
    maxTokens: 300,
  });
}

/**
 * Générer des descriptions de produits avec Gemini
 */
export async function generateProductDescription(productName: string, features: string[], category: string): Promise<string> {
  const prompt = `Créez une description de produit convaincante pour "${productName}" dans la catégorie ${category}.
  Caractéristiques: ${features.join(', ')}
  
  La description doit être optimisée pour le e-commerce, mettre en avant les bénéfices, et inciter à l'achat.`;

  const systemInstruction = `Tu es un rédacteur e-commerce expert. Tu crées des descriptions de produits qui convertissent,
  en mettant l'accent sur les bénéfices plutôt que les caractéristiques techniques.`;

  return generateContent({
    prompt,
    systemInstruction,
    temperature: 0.6,
    maxTokens: 400,
  });
}

/**
 * Générer du contenu pour les réseaux sociaux avec Gemini
 */
export async function generateSocialMediaContent(topic: string, platform: string, tone: 'professional' | 'casual' | 'engaging'): Promise<string> {
  const toneInstructions = {
    professional: 'ton professionnel et informatif',
    casual: 'ton décontracté et amical',
    engaging: 'ton engageant et accrocheur'
  };

  const prompt = `Créez un post pour ${platform} sur le sujet: ${topic}
  Utilisez un ${toneInstructions[tone]}.
  Incluez des hashtags pertinents pour le marché algérien.`;

  const systemInstruction = `Tu es un community manager expert en réseaux sociaux pour le marché algérien.
  Tu crées du contenu viral et engageant qui génère de l'interaction et des conversions.`;

  return generateContent({
    prompt,
    systemInstruction,
    temperature: 0.8,
    maxTokens: 300,
  });
}

// Export par défaut du service principal
export default {
  generateContent,
  generateAdContent,
  generateChatbotResponse,
  generateProductDescription,
  generateSocialMediaContent,
};