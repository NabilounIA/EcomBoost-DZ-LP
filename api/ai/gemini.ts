import { VercelRequest, VercelResponse } from '@vercel/node';
import { z } from 'zod';

// Configuration de validation pour les requêtes Gemini
const geminiRequestSchema = z.object({
  prompt: z.string().min(1).max(10000),
  model: z.string().optional().default('gemini-pro'),
  temperature: z.number().min(0).max(2).optional().default(0.7),
  maxTokens: z.number().min(1).max(8192).optional().default(1000),
  systemInstruction: z.string().optional(),
});

// Interface pour les données de requête Gemini
interface GeminiRequest {
  prompt: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
  systemInstruction?: string;
}

/**
 * Appeler l'API Gemini de manière sécurisée
 */
async function callGeminiAPI(requestData: GeminiRequest): Promise<any> {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY non configurée');
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${requestData.model}:generateContent?key=${apiKey}`;
    
    const payload = {
      contents: [{
        parts: [{
          text: requestData.prompt
        }]
      }],
      generationConfig: {
        temperature: requestData.temperature,
        maxOutputTokens: requestData.maxTokens,
      },
      ...(requestData.systemInstruction && {
        systemInstruction: {
          parts: [{
            text: requestData.systemInstruction
          }]
        }
      })
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`Erreur API Gemini: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erreur lors de l\'appel à Gemini:', error);
    throw error;
  }
}

/**
 * Middleware de sécurité pour l'API Gemini
 */
function securityMiddleware(req: VercelRequest): boolean {
  // Vérifier la méthode HTTP
  if (req.method !== 'POST') {
    return false;
  }

  // Vérifier l'origine (optionnel, pour plus de sécurité)
  const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:5173',
    'https://ecomboost-dz.vercel.app',
    'https://ecomboost-dz.com'
  ];
  
  const origin = req.headers.origin;
  if (origin && !allowedOrigins.includes(origin)) {
    console.warn(`Origine non autorisée: ${origin}`);
    // En développement, on peut être plus permissif
    if (process.env.NODE_ENV === 'production') {
      return false;
    }
  }

  return true;
}

/**
 * API Handler principal pour Gemini
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Middleware de sécurité
  if (!securityMiddleware(req)) {
    return res.status(405).json({ 
      error: 'Méthode non autorisée ou origine non valide',
      success: false 
    });
  }

  try {
    // Validation des données d'entrée
    const validatedData = geminiRequestSchema.parse(req.body);

    // Appel sécurisé à l'API Gemini
    const result = await callGeminiAPI(validatedData);

    // Extraction de la réponse
    const generatedText = result.candidates?.[0]?.content?.parts?.[0]?.text || '';

    // Réponse structurée
    res.status(200).json({
      success: true,
      data: {
        text: generatedText,
        model: validatedData.model,
        usage: result.usageMetadata || {},
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Erreur API Gemini:', error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'Données de requête invalides',
        details: error.errors,
        success: false
      });
    }

    res.status(500).json({
      error: 'Erreur interne du serveur',
      message: error instanceof Error ? error.message : 'Erreur inconnue',
      success: false
    });
  }
}