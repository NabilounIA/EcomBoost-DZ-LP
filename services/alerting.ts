import { trackBusinessError } from './monitoring';

// Types pour les alertes
interface Alert {
  id: string;
  type: 'performance' | 'error' | 'business' | 'security';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  timestamp: Date;
  data?: any;
  resolved?: boolean;
}

interface AlertThresholds {
  performance: {
    lcp: number; // Largest Contentful Paint (ms)
    fid: number; // First Input Delay (ms)
    cls: number; // Cumulative Layout Shift
    memoryUsage: number; // Memory usage (MB)
  };
  error: {
    errorRate: number; // Errors per minute
    consecutiveErrors: number;
  };
  business: {
    conversionDropThreshold: number; // % drop in conversions
    bounceRateThreshold: number; // % bounce rate
  };
}

class AlertingService {
  private alerts: Alert[] = [];
  private thresholds: AlertThresholds;
  private alertCallbacks: ((alert: Alert) => void)[] = [];
  private lastMetrics: any = {};

  constructor() {
    this.thresholds = {
      performance: {
        lcp: 2500, // 2.5s
        fid: 100,  // 100ms
        cls: 0.1,  // 0.1
        memoryUsage: 100, // 100MB
      },
      error: {
        errorRate: 5, // 5 errors per minute
        consecutiveErrors: 3,
      },
      business: {
        conversionDropThreshold: 50, // 50% drop
        bounceRateThreshold: 80, // 80% bounce rate
      },
    };

    this.initPerformanceMonitoring();
  }

  // Initialisation du monitoring des performances
  private initPerformanceMonitoring() {
    // Vérification périodique des métriques
    setInterval(() => {
      this.checkPerformanceThresholds();
      this.checkMemoryUsage();
    }, 30000); // Toutes les 30 secondes

    // Monitoring des erreurs
    window.addEventListener('error', (event) => {
      this.handleError({
        type: 'javascript',
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        stack: event.error?.stack,
      });
    });

    window.addEventListener('unhandledrejection', (event) => {
      this.handleError({
        type: 'promise',
        message: event.reason?.message || 'Unhandled promise rejection',
        reason: event.reason,
      });
    });
  }

  // Vérification des seuils de performance
  private checkPerformanceThresholds() {
    try {
      // Vérifier LCP
      const lcpEntries = performance.getEntriesByType('largest-contentful-paint');
      if (lcpEntries.length > 0) {
        const lcp = lcpEntries[lcpEntries.length - 1].startTime;
        if (lcp > this.thresholds.performance.lcp) {
          this.createAlert({
            type: 'performance',
            severity: lcp > this.thresholds.performance.lcp * 2 ? 'critical' : 'high',
            message: `LCP élevé détecté: ${Math.round(lcp)}ms`,
            data: { metric: 'lcp', value: lcp, threshold: this.thresholds.performance.lcp },
          });
        }
      }

      // Vérifier les layout shifts
      const clsEntries = performance.getEntriesByType('layout-shift');
      let totalCLS = 0;
      clsEntries.forEach((entry: any) => {
        if (!entry.hadRecentInput) {
          totalCLS += entry.value;
        }
      });

      if (totalCLS > this.thresholds.performance.cls) {
        this.createAlert({
          type: 'performance',
          severity: totalCLS > this.thresholds.performance.cls * 2 ? 'high' : 'medium',
          message: `CLS élevé détecté: ${totalCLS.toFixed(3)}`,
          data: { metric: 'cls', value: totalCLS, threshold: this.thresholds.performance.cls },
        });
      }

    } catch (error) {
      console.warn('Erreur lors de la vérification des performances:', error);
    }
  }

  // Vérification de l'utilisation mémoire
  private checkMemoryUsage() {
    try {
      const memoryInfo = (performance as any).memory;
      if (memoryInfo) {
        const usedMB = memoryInfo.usedJSHeapSize / (1024 * 1024);
        if (usedMB > this.thresholds.performance.memoryUsage) {
          this.createAlert({
            type: 'performance',
            severity: usedMB > this.thresholds.performance.memoryUsage * 2 ? 'critical' : 'high',
            message: `Utilisation mémoire élevée: ${Math.round(usedMB)}MB`,
            data: { 
              metric: 'memory', 
              value: usedMB, 
              threshold: this.thresholds.performance.memoryUsage,
              total: memoryInfo.totalJSHeapSize / (1024 * 1024),
              limit: memoryInfo.jsHeapSizeLimit / (1024 * 1024),
            },
          });
        }
      }
    } catch (error) {
      console.warn('Erreur lors de la vérification mémoire:', error);
    }
  }

  // Gestion des erreurs
  private handleError(errorData: any) {
    this.createAlert({
      type: 'error',
      severity: 'high',
      message: `Erreur ${errorData.type}: ${errorData.message}`,
      data: errorData,
    });

    // Tracker l'erreur dans Sentry
    trackBusinessError(`${errorData.type} error: ${errorData.message}`, errorData);
  }

  // Création d'une alerte
  private createAlert(alertData: Omit<Alert, 'id' | 'timestamp'>) {
    const alert: Alert = {
      id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      ...alertData,
    };

    // Éviter les doublons récents (même type et message dans les 5 dernières minutes)
    const recentDuplicate = this.alerts.find(a => 
      a.type === alert.type && 
      a.message === alert.message && 
      !a.resolved &&
      (Date.now() - a.timestamp.getTime()) < 5 * 60 * 1000
    );

    if (recentDuplicate) {
      return; // Ignorer les doublons récents
    }

    this.alerts.push(alert);
    
    // Limiter le nombre d'alertes stockées
    if (this.alerts.length > 100) {
      this.alerts = this.alerts.slice(-50);
    }

    // Notifier les callbacks
    this.alertCallbacks.forEach(callback => {
      try {
        callback(alert);
      } catch (error) {
        console.error('Erreur dans callback d\'alerte:', error);
      }
    });

    // Log pour debug
    console.warn(`🚨 Alerte ${alert.severity}:`, alert.message, alert.data);

    // Envoyer à Sentry pour les alertes critiques
    if (alert.severity === 'critical') {
      trackBusinessError(`Critical Alert: ${alert.message}`, alert.data);
    }
  }

  // Méthodes publiques
  public onAlert(callback: (alert: Alert) => void) {
    this.alertCallbacks.push(callback);
  }

  public getAlerts(filter?: { 
    type?: Alert['type']; 
    severity?: Alert['severity']; 
    resolved?: boolean;
    since?: Date;
  }): Alert[] {
    let filtered = this.alerts;

    if (filter) {
      if (filter.type) {
        filtered = filtered.filter(a => a.type === filter.type);
      }
      if (filter.severity) {
        filtered = filtered.filter(a => a.severity === filter.severity);
      }
      if (filter.resolved !== undefined) {
        filtered = filtered.filter(a => !!a.resolved === filter.resolved);
      }
      if (filter.since) {
        filtered = filtered.filter(a => a.timestamp >= filter.since!);
      }
    }

    return filtered.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  public resolveAlert(alertId: string) {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert) {
      alert.resolved = true;
    }
  }

  public getAlertSummary() {
    const now = new Date();
    const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const recentAlerts = this.getAlerts({ since: last24h, resolved: false });

    return {
      total: recentAlerts.length,
      critical: recentAlerts.filter(a => a.severity === 'critical').length,
      high: recentAlerts.filter(a => a.severity === 'high').length,
      medium: recentAlerts.filter(a => a.severity === 'medium').length,
      low: recentAlerts.filter(a => a.severity === 'low').length,
      byType: {
        performance: recentAlerts.filter(a => a.type === 'performance').length,
        error: recentAlerts.filter(a => a.type === 'error').length,
        business: recentAlerts.filter(a => a.type === 'business').length,
        security: recentAlerts.filter(a => a.type === 'security').length,
      },
    };
  }

  // Méthodes de configuration
  public updateThresholds(newThresholds: Partial<AlertThresholds>) {
    this.thresholds = { ...this.thresholds, ...newThresholds };
  }

  public getThresholds(): AlertThresholds {
    return { ...this.thresholds };
  }

  // Simulation d'alertes pour test
  public simulateAlert(type: Alert['type'], severity: Alert['severity'] = 'medium') {
    this.createAlert({
      type,
      severity,
      message: `Alerte de test ${type} (${severity})`,
      data: { simulated: true, timestamp: new Date().toISOString() },
    });
  }
}

// Instance singleton
export const alertingService = new AlertingService();

export default AlertingService;