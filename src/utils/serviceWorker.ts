// Gestionnaire de Service Worker côté client

interface ServiceWorkerConfig {
  swUrl?: string;
  onUpdate?: (registration: ServiceWorkerRegistration) => void;
  onSuccess?: (registration: ServiceWorkerRegistration) => void;
  onError?: (error: Error) => void;
}

interface CacheInfo {
  bytes: number;
  mb: string;
}

class ServiceWorkerManager {
  private registration: ServiceWorkerRegistration | null = null;
  private config: ServiceWorkerConfig;

  constructor(config: ServiceWorkerConfig = {}) {
    this.config = {
      swUrl: '/sw.js',
      ...config,
    };
  }

  /**
   * Enregistrer le Service Worker
   */
  async register(): Promise<ServiceWorkerRegistration | null> {
    if (!('serviceWorker' in navigator)) {
      console.warn('Service Worker non supporté par ce navigateur');
      return null;
    }

    if (process.env.NODE_ENV !== 'production') {
      console.log('Service Worker désactivé en développement');
      return null;
    }

    try {
      const registration = await navigator.serviceWorker.register(this.config.swUrl!);
      this.registration = registration;

      // Gestion des événements
      this.setupEventListeners(registration);

      console.log('Service Worker enregistré avec succès');
      this.config.onSuccess?.(registration);

      return registration;
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement du Service Worker:', error);
      this.config.onError?.(error as Error);
      return null;
    }
  }

  /**
   * Désenregistrer le Service Worker
   */
  async unregister(): Promise<boolean> {
    if (!this.registration) {
      return false;
    }

    try {
      const result = await this.registration.unregister();
      this.registration = null;
      console.log('Service Worker désenregistré');
      return result;
    } catch (error) {
      console.error('Erreur lors du désenregistrement:', error);
      return false;
    }
  }

  /**
   * Forcer la mise à jour du Service Worker
   */
  async update(): Promise<void> {
    if (!this.registration) {
      throw new Error('Aucun Service Worker enregistré');
    }

    try {
      await this.registration.update();
      console.log('Mise à jour du Service Worker demandée');
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      throw error;
    }
  }

  /**
   * Activer immédiatement le nouveau Service Worker
   */
  async skipWaiting(): Promise<void> {
    if (!this.registration?.waiting) {
      throw new Error('Aucun Service Worker en attente');
    }

    // Envoyer le message au Service Worker
    this.postMessage({ type: 'SKIP_WAITING' });

    // Attendre l'activation
    return new Promise((resolve) => {
      const handleControllerChange = () => {
        navigator.serviceWorker.removeEventListener('controllerchange', handleControllerChange);
        resolve();
      };
      navigator.serviceWorker.addEventListener('controllerchange', handleControllerChange);
    });
  }

  /**
   * Obtenir les informations sur le cache
   */
  async getCacheInfo(): Promise<CacheInfo> {
    return new Promise((resolve, reject) => {
      const messageChannel = new MessageChannel();
      
      messageChannel.port1.onmessage = (event) => {
        if (event.data.type === 'CACHE_SIZE') {
          resolve(event.data.payload);
        } else {
          reject(new Error('Réponse inattendue du Service Worker'));
        }
      };

      this.postMessage(
        { type: 'GET_CACHE_SIZE' },
        [messageChannel.port2]
      );
    });
  }

  /**
   * Vider le cache
   */
  async clearCache(): Promise<void> {
    return new Promise((resolve, reject) => {
      const messageChannel = new MessageChannel();
      
      messageChannel.port1.onmessage = (event) => {
        if (event.data.type === 'CACHE_CLEARED') {
          resolve();
        } else {
          reject(new Error('Erreur lors du vidage du cache'));
        }
      };

      this.postMessage(
        { type: 'CLEAR_CACHE' },
        [messageChannel.port2]
      );
    });
  }

  /**
   * Précharger des routes spécifiques
   */
  async preloadRoutes(routes: string[]): Promise<void> {
    this.postMessage({
      type: 'PRELOAD_ROUTES',
      payload: { routes },
    });
  }

  /**
   * Vérifier si l'application est en mode hors ligne
   */
  isOffline(): boolean {
    return !navigator.onLine;
  }

  /**
   * Obtenir le statut du Service Worker
   */
  getStatus(): {
    supported: boolean;
    registered: boolean;
    active: boolean;
    waiting: boolean;
    installing: boolean;
  } {
    return {
      supported: 'serviceWorker' in navigator,
      registered: !!this.registration,
      active: !!this.registration?.active,
      waiting: !!this.registration?.waiting,
      installing: !!this.registration?.installing,
    };
  }

  /**
   * Configuration des écouteurs d'événements
   */
  private setupEventListeners(registration: ServiceWorkerRegistration): void {
    // Mise à jour disponible
    registration.addEventListener('updatefound', () => {
      const newWorker = registration.installing;
      if (!newWorker) return;

      newWorker.addEventListener('statechange', () => {
        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
          // Nouvelle version disponible
          console.log('Nouvelle version de l\'application disponible');
          this.config.onUpdate?.(registration);
        }
      });
    });

    // Changement de contrôleur
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      console.log('Service Worker activé');
      // Recharger la page pour utiliser la nouvelle version
      window.location.reload();
    });

    // Gestion du mode hors ligne
    window.addEventListener('online', () => {
      console.log('Application en ligne');
      this.notifyOnlineStatus(true);
    });

    window.addEventListener('offline', () => {
      console.log('Application hors ligne');
      this.notifyOnlineStatus(false);
    });
  }

  /**
   * Envoyer un message au Service Worker
   */
  private postMessage(message: any, transfer?: Transferable[]): void {
    if (!navigator.serviceWorker.controller) {
      console.warn('Aucun Service Worker actif pour recevoir le message');
      return;
    }

    navigator.serviceWorker.controller.postMessage(message, transfer);
  }

  /**
   * Notifier le changement de statut en ligne/hors ligne
   */
  private notifyOnlineStatus(isOnline: boolean): void {
    // Émettre un événement personnalisé
    const event = new CustomEvent('sw-online-status', {
      detail: { isOnline },
    });
    window.dispatchEvent(event);
  }
}

// Instance globale
export const serviceWorkerManager = new ServiceWorkerManager({
  onUpdate: (registration) => {
    // Afficher une notification de mise à jour
    const event = new CustomEvent('sw-update-available', {
      detail: { registration },
    });
    window.dispatchEvent(event);
  },
  onSuccess: () => {
    console.log('Service Worker prêt pour le mode hors ligne');
  },
  onError: (error) => {
    console.error('Erreur Service Worker:', error);
  },
});

/**
 * Hook React pour utiliser le Service Worker
 */
export function useServiceWorker() {
  const [status, setStatus] = React.useState(serviceWorkerManager.getStatus());
  const [isOnline, setIsOnline] = React.useState(navigator.onLine);
  const [updateAvailable, setUpdateAvailable] = React.useState(false);

  React.useEffect(() => {
    // Enregistrer le Service Worker
    serviceWorkerManager.register();

    // Écouter les événements
    const handleUpdateAvailable = () => setUpdateAvailable(true);
    const handleOnlineStatus = (event: CustomEvent) => {
      setIsOnline(event.detail.isOnline);
    };

    window.addEventListener('sw-update-available', handleUpdateAvailable);
    window.addEventListener('sw-online-status', handleOnlineStatus as EventListener);

    // Mettre à jour le statut périodiquement
    const interval = setInterval(() => {
      setStatus(serviceWorkerManager.getStatus());
    }, 1000);

    return () => {
      window.removeEventListener('sw-update-available', handleUpdateAvailable);
      window.removeEventListener('sw-online-status', handleOnlineStatus as EventListener);
      clearInterval(interval);
    };
  }, []);

  return {
    status,
    isOnline,
    updateAvailable,
    update: () => serviceWorkerManager.skipWaiting(),
    clearCache: () => serviceWorkerManager.clearCache(),
    getCacheInfo: () => serviceWorkerManager.getCacheInfo(),
    preloadRoutes: (routes: string[]) => serviceWorkerManager.preloadRoutes(routes),
  };
}

export default serviceWorkerManager;