// Service Worker avancé pour EcomBoost DZ
// Version 1.0.0

const CACHE_NAME = 'ecomboost-dz-v1.0.0';
const STATIC_CACHE = 'ecomboost-static-v1.0.0';
const DYNAMIC_CACHE = 'ecomboost-dynamic-v1.0.0';
const API_CACHE = 'ecomboost-api-v1.0.0';

// Ressources à mettre en cache immédiatement
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  '/logo192.png',
  '/logo512.png',
  // CSS et JS seront ajoutés dynamiquement
];

// Stratégies de cache
const CACHE_STRATEGIES = {
  // Cache First - pour les assets statiques
  CACHE_FIRST: 'cache-first',
  // Network First - pour les API et contenu dynamique
  NETWORK_FIRST: 'network-first',
  // Stale While Revalidate - pour les images et fonts
  STALE_WHILE_REVALIDATE: 'stale-while-revalidate',
  // Network Only - pour les analytics
  NETWORK_ONLY: 'network-only',
};

// Configuration des routes et stratégies
const ROUTE_STRATEGIES = [
  {
    pattern: /\.(js|css|woff2?|ttf|eot)$/,
    strategy: CACHE_STRATEGIES.CACHE_FIRST,
    cache: STATIC_CACHE,
    maxAge: 365 * 24 * 60 * 60 * 1000, // 1 an
  },
  {
    pattern: /\.(png|jpg|jpeg|gif|svg|webp|avif)$/,
    strategy: CACHE_STRATEGIES.STALE_WHILE_REVALIDATE,
    cache: STATIC_CACHE,
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 jours
  },
  {
    pattern: /^https:\/\/api\./,
    strategy: CACHE_STRATEGIES.NETWORK_FIRST,
    cache: API_CACHE,
    maxAge: 5 * 60 * 1000, // 5 minutes
  },
  {
    pattern: /analytics|gtag|google-analytics/,
    strategy: CACHE_STRATEGIES.NETWORK_ONLY,
  },
];

// Installation du Service Worker
self.addEventListener('install', (event) => {
  console.log('[SW] Installation en cours...');
  
  event.waitUntil(
    Promise.all([
      // Cache des ressources statiques
      caches.open(STATIC_CACHE).then((cache) => {
        return cache.addAll(STATIC_ASSETS);
      }),
      // Forcer l'activation immédiate
      self.skipWaiting(),
    ])
  );
});

// Activation du Service Worker
self.addEventListener('activate', (event) => {
  console.log('[SW] Activation en cours...');
  
  event.waitUntil(
    Promise.all([
      // Nettoyer les anciens caches
      cleanupOldCaches(),
      // Prendre le contrôle immédiatement
      self.clients.claim(),
    ])
  );
});

// Interception des requêtes
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignorer les requêtes non-HTTP
  if (!request.url.startsWith('http')) return;

  // Ignorer les requêtes Chrome extension
  if (url.protocol === 'chrome-extension:') return;

  // Trouver la stratégie appropriée
  const routeConfig = findRouteStrategy(request.url);
  
  if (routeConfig) {
    event.respondWith(handleRequest(request, routeConfig));
  }
});

// Gestion des messages du client
self.addEventListener('message', (event) => {
  const { type, payload } = event.data;

  switch (type) {
    case 'SKIP_WAITING':
      self.skipWaiting();
      break;
      
    case 'GET_CACHE_SIZE':
      getCacheSize().then((size) => {
        event.ports[0].postMessage({ type: 'CACHE_SIZE', payload: size });
      });
      break;
      
    case 'CLEAR_CACHE':
      clearAllCaches().then(() => {
        event.ports[0].postMessage({ type: 'CACHE_CLEARED' });
      });
      break;
      
    case 'PRELOAD_ROUTES':
      preloadRoutes(payload.routes);
      break;
  }
});

// Fonctions utilitaires

/**
 * Nettoyer les anciens caches
 */
async function cleanupOldCaches() {
  const cacheNames = await caches.keys();
  const currentCaches = [CACHE_NAME, STATIC_CACHE, DYNAMIC_CACHE, API_CACHE];
  
  return Promise.all(
    cacheNames
      .filter(cacheName => !currentCaches.includes(cacheName))
      .map(cacheName => {
        console.log('[SW] Suppression du cache obsolète:', cacheName);
        return caches.delete(cacheName);
      })
  );
}

/**
 * Trouver la stratégie de route appropriée
 */
function findRouteStrategy(url) {
  return ROUTE_STRATEGIES.find(route => route.pattern.test(url));
}

/**
 * Gérer les requêtes selon la stratégie
 */
async function handleRequest(request, config) {
  const { strategy, cache: cacheName, maxAge } = config;

  switch (strategy) {
    case CACHE_STRATEGIES.CACHE_FIRST:
      return cacheFirst(request, cacheName, maxAge);
      
    case CACHE_STRATEGIES.NETWORK_FIRST:
      return networkFirst(request, cacheName, maxAge);
      
    case CACHE_STRATEGIES.STALE_WHILE_REVALIDATE:
      return staleWhileRevalidate(request, cacheName, maxAge);
      
    case CACHE_STRATEGIES.NETWORK_ONLY:
      return fetch(request);
      
    default:
      return fetch(request);
  }
}

/**
 * Stratégie Cache First
 */
async function cacheFirst(request, cacheName, maxAge) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);

  if (cachedResponse && !isExpired(cachedResponse, maxAge)) {
    return cachedResponse;
  }

  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    // Retourner la version en cache même expirée si le réseau échoue
    if (cachedResponse) {
      return cachedResponse;
    }
    throw error;
  }
}

/**
 * Stratégie Network First
 */
async function networkFirst(request, cacheName, maxAge) {
  const cache = await caches.open(cacheName);

  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    const cachedResponse = await cache.match(request);
    if (cachedResponse && !isExpired(cachedResponse, maxAge)) {
      return cachedResponse;
    }
    throw error;
  }
}

/**
 * Stratégie Stale While Revalidate
 */
async function staleWhileRevalidate(request, cacheName, maxAge) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);

  // Mise à jour en arrière-plan
  const fetchPromise = fetch(request).then((networkResponse) => {
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  }).catch(() => {
    // Ignorer les erreurs réseau en mode SWR
  });

  // Retourner immédiatement la version en cache si disponible
  if (cachedResponse) {
    return cachedResponse;
  }

  // Sinon attendre la réponse réseau
  return fetchPromise;
}

/**
 * Vérifier si une réponse en cache est expirée
 */
function isExpired(response, maxAge) {
  if (!maxAge) return false;
  
  const dateHeader = response.headers.get('date');
  if (!dateHeader) return false;
  
  const responseDate = new Date(dateHeader);
  const now = new Date();
  
  return (now.getTime() - responseDate.getTime()) > maxAge;
}

/**
 * Obtenir la taille totale du cache
 */
async function getCacheSize() {
  const cacheNames = await caches.keys();
  let totalSize = 0;

  for (const cacheName of cacheNames) {
    const cache = await caches.open(cacheName);
    const requests = await cache.keys();
    
    for (const request of requests) {
      const response = await cache.match(request);
      if (response) {
        const blob = await response.blob();
        totalSize += blob.size;
      }
    }
  }

  return {
    bytes: totalSize,
    mb: (totalSize / (1024 * 1024)).toFixed(2),
  };
}

/**
 * Vider tous les caches
 */
async function clearAllCaches() {
  const cacheNames = await caches.keys();
  return Promise.all(cacheNames.map(cacheName => caches.delete(cacheName)));
}

/**
 * Précharger des routes spécifiques
 */
async function preloadRoutes(routes) {
  const cache = await caches.open(DYNAMIC_CACHE);
  
  for (const route of routes) {
    try {
      const response = await fetch(route);
      if (response.ok) {
        await cache.put(route, response);
        console.log('[SW] Route préchargée:', route);
      }
    } catch (error) {
      console.warn('[SW] Échec du préchargement:', route, error);
    }
  }
}

// Gestion des erreurs globales
self.addEventListener('error', (event) => {
  console.error('[SW] Erreur:', event.error);
});

self.addEventListener('unhandledrejection', (event) => {
  console.error('[SW] Promise rejetée:', event.reason);
});

console.log('[SW] Service Worker EcomBoost DZ initialisé');