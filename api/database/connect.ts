import { VercelRequest, VercelResponse } from '@vercel/node';
import { withSecurity, ValidationSchema } from '../_utils/security';
import { MongoClient, Db } from 'mongodb';

// Cache de connexion pour éviter de créer une nouvelle connexion à chaque requête
let cachedDb: Db | null = null;
let cachedClient: MongoClient | null = null;

// Configuration de validation pour les requêtes de base de données
const dbValidationSchema: ValidationSchema = {
  collection: {
    required: true,
    type: 'string',
    minLength: 1,
    maxLength: 100,
    pattern: /^[a-zA-Z0-9_-]+$/
  },
  operation: {
    required: true,
    type: 'string',
    enum: ['find', 'findOne', 'insertOne', 'updateOne', 'deleteOne', 'count']
  },
  query: {
    required: false,
    type: 'object'
  },
  document: {
    required: false,
    type: 'object'
  },
  options: {
    required: false,
    type: 'object'
  }
};

// Interface pour les requêtes de base de données
interface DatabaseRequest {
  collection: string;
  operation: 'find' | 'findOne' | 'insertOne' | 'updateOne' | 'deleteOne' | 'count';
  query?: Record<string, any>;
  document?: Record<string, any>;
  options?: Record<string, any>;
}

/**
 * Connexion à MongoDB
 * Cette fonction réutilise la connexion si elle existe déjà
 */
async function connectToDatabase() {
  // Si nous avons déjà une connexion, on la réutilise
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  // Récupération de l'URI depuis les variables d'environnement
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI non configurée dans les variables d\'environnement');
  }

  // Création d'une nouvelle connexion
  const client = new MongoClient(uri);
  await client.connect();
  
  // Extraction du nom de la base de données depuis l'URI
  const dbName = uri.split('/').pop()?.split('?')[0] || 'ecomboost';
  const db = client.db(dbName);

  // Mise en cache de la connexion
  cachedClient = client;
  cachedDb = db;

  return { client, db };
}

/**
 * API pour interagir avec MongoDB
 * Cette fonction serverless protège vos identifiants MongoDB
 */
async function handleDatabaseRequest(req: VercelRequest, res: VercelResponse) {
  try {
    const { collection, operation, query = {}, document, options = {} } = req.body as DatabaseRequest;

    // Connexion à la base de données
    const { db } = await connectToDatabase();

    // Exécution de l'opération demandée
    let result;
    const coll = db.collection(collection);

    switch (operation) {
      case 'find':
        result = await coll.find(query, options).toArray();
        break;
      case 'findOne':
        result = await coll.findOne(query, options);
        break;
      case 'insertOne':
        if (!document) {
          return res.status(400).json({
            error: 'Document manquant',
            message: 'Un document est requis pour l\'opération insertOne'
          });
        }
        result = await coll.insertOne(document);
        break;
      case 'updateOne':
        if (!document) {
          return res.status(400).json({
            error: 'Document manquant',
            message: 'Un document est requis pour l\'opération updateOne'
          });
        }
        result = await coll.updateOne(query, { $set: document }, options);
        break;
      case 'deleteOne':
        result = await coll.deleteOne(query);
        break;
      case 'count':
        result = await coll.countDocuments(query);
        break;
      default:
        return res.status(400).json({
          error: 'Opération non supportée',
          message: `L'opération ${operation} n'est pas supportée`
        });
    }

    return res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Erreur lors de l\'opération sur la base de données:', error);
    return res.status(500).json({
      error: 'Erreur de base de données',
      message: 'Une erreur est survenue lors de l\'opération sur la base de données'
    });
  }
}

// Export de la fonction avec middleware de sécurité
export default withSecurity(handleDatabaseRequest, {
  allowedMethods: ['POST'],
  validationSchema: dbValidationSchema
});