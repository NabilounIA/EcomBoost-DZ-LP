import * as Sentry from '@sentry/react';

// Configuration Sentry pour le monitoring
export const initSentry = () => {
  if (!import.meta.env.VITE_SENTRY_DSN) {
    console.warn('Sentry DSN not configured, skipping initialization');
    return;
  }

  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    environment: import.meta.env.MODE,
    integrations: [
      // Intégrations de base disponibles
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration({
        // Enregistrement des sessions pour debug
        maskAllText: false,
        blockAllMedia: false,
      }),
    ],
    
    // Performance monitoring
    tracesSampleRate: import.meta.env.PROD ? 0.1 : 1.0,
    
    // Session replay
    replaysSessionSampleRate: import.meta.env.PROD ? 0.01 : 0.1,
    replaysOnErrorSampleRate: 1.0,
    
    // Configuration avancée
    beforeSend(event) {
      // Filtrer les erreurs non critiques en production
      if (import.meta.env.PROD) {
        if (event.exception) {
          const error = event.exception.values?.[0];
          if (error?.type === 'ChunkLoadError' || 
              error?.value?.includes('Loading chunk')) {
            return null; // Ignorer les erreurs de chunk loading
          }
        }
      }
      return event;
    },
    
    // Tags personnalisés
    initialScope: {
      tags: {
        component: 'ecomboost-landing',
        version: '1.0.0',
      },
      user: {
        segment: 'visitor',
      },
    },
  });
};

// Métriques personnalisées
export const trackCustomMetric = (name: string, value: number, tags?: Record<string, string>) => {
  // Utiliser les breadcrumbs pour les métriques personnalisées
  Sentry.addBreadcrumb({
    category: 'metric',
    message: `Metric: ${name}`,
    level: 'info',
    data: {
      name,
      value,
      tags,
      timestamp: new Date().toISOString(),
    },
  });
  
  // Optionnel: envoyer comme événement personnalisé
  Sentry.captureMessage(`Metric: ${name} = ${value}`, {
    level: 'info',
    tags: {
      metric_name: name,
      ...tags,
    },
    extra: {
      value,
      timestamp: new Date().toISOString(),
    },
  });
};

// Tracking des conversions
export const trackConversion = (type: 'lead' | 'contact' | 'demo', value?: number) => {
  Sentry.addBreadcrumb({
    category: 'conversion',
    message: `Conversion: ${type}`,
    level: 'info',
    data: {
      type,
      value,
      timestamp: new Date().toISOString(),
    },
  });
  
  trackCustomMetric(`conversion.${type}`, 1, {
    conversion_type: type,
  });
};

// Monitoring des performances
export const trackPerformance = (metric: string, duration: number) => {
  Sentry.addBreadcrumb({
    category: 'performance',
    message: `Performance: ${metric}`,
    level: 'info',
    data: {
      metric,
      duration,
      timestamp: new Date().toISOString(),
    },
  });
  
  trackCustomMetric(`performance.${metric}`, duration, {
    metric_type: 'duration',
  });
};

// Monitoring des erreurs business
export const trackBusinessError = (error: string, context?: Record<string, any>) => {
  Sentry.captureException(new Error(error), {
    tags: {
      type: 'business_error',
    },
    extra: context,
  });
};

// Monitoring de la santé de l'application
export const trackHealthCheck = () => {
  const metrics = {
    memory: (performance as any).memory?.usedJSHeapSize || 0,
    timing: performance.timing.loadEventEnd - performance.timing.navigationStart,
    connections: (navigator as any).connection?.effectiveType || 'unknown',
  };
  
  Object.entries(metrics).forEach(([key, value]) => {
    trackCustomMetric(`health.${key}`, typeof value === 'number' ? value : 0, {
      health_metric: key,
    });
  });
  
  return metrics;
};

export default {
  initSentry,
  trackCustomMetric,
  trackConversion,
  trackPerformance,
  trackBusinessError,
  trackHealthCheck,
};