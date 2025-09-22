import { trackCustomMetric, trackPerformance, trackBusinessError } from './monitoring';

// Interface pour les métriques
interface PerformanceMetrics {
  pageLoadTime: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
  firstInputDelay: number;
  timeToInteractive: number;
}

interface BusinessMetrics {
  leadConversions: number;
  formSubmissions: number;
  demoRequests: number;
  whatsappClicks: number;
  scrollDepth: number;
  sessionDuration: number;
}

class AdvancedMonitoring {
  private startTime: number;
  private metrics: Partial<PerformanceMetrics & BusinessMetrics> = {};
  private observers: PerformanceObserver[] = [];

  constructor() {
    this.startTime = Date.now();
    this.initPerformanceObservers();
    this.initBusinessTracking();
  }

  // Initialisation des observateurs de performance
  private initPerformanceObservers() {
    try {
      // Observer pour les Core Web Vitals
      const vitalsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          switch (entry.entryType) {
            case 'paint':
              if (entry.name === 'first-contentful-paint') {
                this.metrics.firstContentfulPaint = entry.startTime;
                trackPerformance('fcp', entry.startTime);
              }
              break;
            case 'largest-contentful-paint':
              this.metrics.largestContentfulPaint = entry.startTime;
              trackPerformance('lcp', entry.startTime);
              break;
            case 'layout-shift':
              if (!(entry as any).hadRecentInput) {
                this.metrics.cumulativeLayoutShift = 
                  (this.metrics.cumulativeLayoutShift || 0) + (entry as any).value;
                trackPerformance('cls', this.metrics.cumulativeLayoutShift);
              }
              break;
            case 'first-input':
              this.metrics.firstInputDelay = (entry as any).processingStart - entry.startTime;
              trackPerformance('fid', this.metrics.firstInputDelay);
              break;
          }
        }
      });

      // Enregistrer les observateurs
      vitalsObserver.observe({ entryTypes: ['paint', 'largest-contentful-paint', 'layout-shift', 'first-input'] });
      this.observers.push(vitalsObserver);

      // Observer pour les ressources
      const resourceObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const resource = entry as PerformanceResourceTiming;
          if (resource.duration > 1000) { // Ressources lentes > 1s
            trackBusinessError(`Slow resource: ${resource.name}`, {
              duration: resource.duration,
              size: resource.transferSize,
              type: resource.initiatorType,
            });
          }
        }
      });

      resourceObserver.observe({ entryTypes: ['resource'] });
      this.observers.push(resourceObserver);

    } catch (error) {
      console.warn('Performance observers not supported:', error);
    }
  }

  // Initialisation du tracking business
  private initBusinessTracking() {
    // Tracking de la profondeur de scroll
    let maxScrollDepth = 0;
    const trackScrollDepth = () => {
      const scrollPercent = Math.round(
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      );
      if (scrollPercent > maxScrollDepth) {
        maxScrollDepth = scrollPercent;
        this.metrics.scrollDepth = maxScrollDepth;
        
        // Milestones de scroll
        if ([25, 50, 75, 90].includes(scrollPercent)) {
          trackCustomMetric('scroll_depth', scrollPercent, {
            milestone: `${scrollPercent}%`,
          });
        }
      }
    };

    window.addEventListener('scroll', trackScrollDepth, { passive: true });

    // Tracking de la durée de session
    setInterval(() => {
      this.metrics.sessionDuration = Date.now() - this.startTime;
      trackCustomMetric('session_duration', this.metrics.sessionDuration, {
        unit: 'milliseconds',
      });
    }, 30000); // Toutes les 30 secondes

    // Tracking des erreurs JavaScript
    window.addEventListener('error', (event) => {
      trackBusinessError('JavaScript Error', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        stack: event.error?.stack,
      });
    });

    // Tracking des promesses rejetées
    window.addEventListener('unhandledrejection', (event) => {
      trackBusinessError('Unhandled Promise Rejection', {
        reason: event.reason,
        promise: event.promise,
      });
    });
  }

  // Méthodes publiques pour le tracking business
  trackLeadConversion(source: string, value?: number) {
    this.metrics.leadConversions = (this.metrics.leadConversions || 0) + 1;
    trackCustomMetric('lead_conversion', 1, {
      source,
      value: value?.toString() || '0',
    });
  }

  trackFormSubmission(formType: string, success: boolean) {
    this.metrics.formSubmissions = (this.metrics.formSubmissions || 0) + 1;
    trackCustomMetric('form_submission', 1, {
      form_type: formType,
      success: success.toString(),
    });
  }

  trackDemoRequest(demoType: string) {
    this.metrics.demoRequests = (this.metrics.demoRequests || 0) + 1;
    trackCustomMetric('demo_request', 1, {
      demo_type: demoType,
    });
  }

  trackWhatsAppClick(context: string) {
    this.metrics.whatsappClicks = (this.metrics.whatsappClicks || 0) + 1;
    trackCustomMetric('whatsapp_click', 1, {
      context,
    });
  }

  // Méthodes de diagnostic
  async runHealthCheck(): Promise<{
    status: 'healthy' | 'warning' | 'critical';
    metrics: any;
    issues: string[];
  }> {
    const issues: string[] = [];
    let status: 'healthy' | 'warning' | 'critical' = 'healthy';

    // Vérifier les Core Web Vitals
    if (this.metrics.largestContentfulPaint && this.metrics.largestContentfulPaint > 2500) {
      issues.push('LCP trop élevé (>2.5s)');
      status = 'warning';
    }

    if (this.metrics.firstInputDelay && this.metrics.firstInputDelay > 100) {
      issues.push('FID trop élevé (>100ms)');
      status = 'warning';
    }

    if (this.metrics.cumulativeLayoutShift && this.metrics.cumulativeLayoutShift > 0.1) {
      issues.push('CLS trop élevé (>0.1)');
      status = 'warning';
    }

    // Vérifier la mémoire
    const memoryInfo = (performance as any).memory;
    if (memoryInfo && memoryInfo.usedJSHeapSize > 50 * 1024 * 1024) { // 50MB
      issues.push('Utilisation mémoire élevée');
      status = status === 'healthy' ? 'warning' : status;
    }

    // Vérifier les erreurs récentes
    const errorCount = await this.getRecentErrorCount();
    if (errorCount > 5) {
      issues.push(`Trop d'erreurs récentes (${errorCount})`);
      status = 'critical';
    }

    return {
      status,
      metrics: this.metrics,
      issues,
    };
  }

  private async getRecentErrorCount(): Promise<number> {
    // Simulation - en production, ceci viendrait de Sentry
    return 0;
  }

  // Génération de rapport
  generateReport(): {
    performance: Partial<PerformanceMetrics>;
    business: Partial<BusinessMetrics>;
    timestamp: string;
  } {
    return {
      performance: {
        pageLoadTime: this.metrics.pageLoadTime,
        firstContentfulPaint: this.metrics.firstContentfulPaint,
        largestContentfulPaint: this.metrics.largestContentfulPaint,
        cumulativeLayoutShift: this.metrics.cumulativeLayoutShift,
        firstInputDelay: this.metrics.firstInputDelay,
        timeToInteractive: this.metrics.timeToInteractive,
      },
      business: {
        leadConversions: this.metrics.leadConversions,
        formSubmissions: this.metrics.formSubmissions,
        demoRequests: this.metrics.demoRequests,
        whatsappClicks: this.metrics.whatsappClicks,
        scrollDepth: this.metrics.scrollDepth,
        sessionDuration: this.metrics.sessionDuration,
      },
      timestamp: new Date().toISOString(),
    };
  }

  // Nettoyage
  destroy() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }
}

// Instance singleton
export const advancedMonitoring = new AdvancedMonitoring();

export default AdvancedMonitoring;