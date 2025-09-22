import { lazy, ComponentType, LazyExoticComponent } from 'react';

// Types pour le lazy loading
interface LazyLoadOptions {
  fallback?: ComponentType;
  preload?: boolean;
  delay?: number;
  retries?: number;
}

interface ComponentModule {
  default: ComponentType<any>;
}

// Cache pour les composants préchargés
const preloadCache = new Map<string, Promise<ComponentModule>>();

/**
 * Lazy loading avancé avec préchargement et gestion d'erreurs
 */
export function createLazyComponent<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  options: LazyLoadOptions = {}
): LazyExoticComponent<T> & { preload: () => Promise<{ default: T }> } {
  const { retries = 3, delay = 1000 } = options;

  // Fonction de retry avec délai exponentiel
  const importWithRetry = async (attempt = 1): Promise<{ default: T }> => {
    try {
      return await importFn();
    } catch (error) {
      if (attempt >= retries) {
        console.error(`Failed to load component after ${retries} attempts:`, error);
        throw error;
      }
      
      // Délai exponentiel : 1s, 2s, 4s...
      const retryDelay = delay * Math.pow(2, attempt - 1);
      await new Promise(resolve => setTimeout(resolve, retryDelay));
      
      return importWithRetry(attempt + 1);
    }
  };

  // Fonction de préchargement
  const preload = () => {
    const cacheKey = importFn.toString();
    if (!preloadCache.has(cacheKey)) {
      preloadCache.set(cacheKey, importWithRetry());
    }
    return preloadCache.get(cacheKey)!;
  };

  // Créer le composant lazy
  const LazyComponent = lazy(() => {
    const cacheKey = importFn.toString();
    if (preloadCache.has(cacheKey)) {
      return preloadCache.get(cacheKey)!;
    }
    return importWithRetry();
  }) as LazyExoticComponent<T> & { preload: () => Promise<{ default: T }> };

  // Ajouter la méthode preload
  LazyComponent.preload = preload;

  // Préchargement automatique si activé
  if (options.preload) {
    // Précharger après un court délai pour ne pas bloquer le rendu initial
    setTimeout(() => preload(), 100);
  }

  return LazyComponent;
}

/**
 * Hook pour le lazy loading basé sur l'intersection observer
 */
export function useIntersectionObserver(
  callback: () => void,
  options: IntersectionObserverInit = {}
) {
  const defaultOptions: IntersectionObserverInit = {
    root: null,
    rootMargin: '50px',
    threshold: 0.1,
    ...options,
  };

  return (element: Element | null) => {
    if (!element) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          callback();
          observer.unobserve(entry.target);
        }
      });
    }, defaultOptions);

    observer.observe(element);

    return () => observer.unobserve(element);
  };
}

/**
 * Préchargement intelligent basé sur les interactions utilisateur
 */
export class SmartPreloader {
  private static instance: SmartPreloader;
  private preloadQueue: Array<() => Promise<any>> = [];
  private isPreloading = false;
  private userInteracted = false;

  static getInstance(): SmartPreloader {
    if (!SmartPreloader.instance) {
      SmartPreloader.instance = new SmartPreloader();
    }
    return SmartPreloader.instance;
  }

  constructor() {
    this.setupUserInteractionListeners();
  }

  private setupUserInteractionListeners() {
    const events = ['mousedown', 'touchstart', 'keydown', 'scroll'];
    
    const handleInteraction = () => {
      this.userInteracted = true;
      this.startPreloading();
      
      // Nettoyer les listeners après la première interaction
      events.forEach(event => {
        document.removeEventListener(event, handleInteraction);
      });
    };

    events.forEach(event => {
      document.addEventListener(event, handleInteraction, { passive: true });
    });

    // Démarrer le préchargement après 3 secondes si aucune interaction
    setTimeout(() => {
      if (!this.userInteracted) {
        this.startPreloading();
      }
    }, 3000);
  }

  addToQueue(preloadFn: () => Promise<any>) {
    this.preloadQueue.push(preloadFn);
    
    if (this.userInteracted && !this.isPreloading) {
      this.startPreloading();
    }
  }

  private async startPreloading() {
    if (this.isPreloading || this.preloadQueue.length === 0) return;
    
    this.isPreloading = true;

    // Précharger un composant à la fois pour éviter de surcharger le réseau
    while (this.preloadQueue.length > 0) {
      const preloadFn = this.preloadQueue.shift();
      if (preloadFn) {
        try {
          await preloadFn();
          // Petit délai entre les préchargements
          await new Promise(resolve => setTimeout(resolve, 100));
        } catch (error) {
          console.warn('Preload failed:', error);
        }
      }
    }

    this.isPreloading = false;
  }
}

/**
 * Composants lazy avec préchargement intelligent
 */
export const LazyComponents = {
  // Sections principales
  Hero: createLazyComponent(
    () => import('../components/sections/Hero'),
    { preload: true }
  ),
  
  Services: createLazyComponent(
    () => import('../components/sections/Services'),
    { preload: false }
  ),
  
  About: createLazyComponent(
    () => import('../components/sections/About'),
    { preload: false }
  ),
  
  Portfolio: createLazyComponent(
    () => import('../components/sections/Portfolio'),
    { preload: false }
  ),
  
  Testimonials: createLazyComponent(
    () => import('../components/sections/Testimonials'),
    { preload: false }
  ),
  
  Contact: createLazyComponent(
    () => import('../components/sections/Contact'),
    { preload: false }
  ),
  
  // Composants utilitaires
  WhatsAppButton: createLazyComponent(
    () => import('../components/ui/WhatsAppButton'),
    { preload: true }
  ),
  
  ScrollToTop: createLazyComponent(
    () => import('../components/ui/ScrollToTop'),
    { preload: false }
  ),
};

// Initialiser le préchargeur intelligent
export const smartPreloader = SmartPreloader.getInstance();

// Ajouter les composants à la queue de préchargement
Object.values(LazyComponents).forEach(component => {
  if ('preload' in component) {
    smartPreloader.addToQueue(component.preload);
  }
});