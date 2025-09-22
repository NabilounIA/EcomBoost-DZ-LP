// Performance Monitoring Service
export interface PerformanceMetrics {
  pageLoadTime: number;
  domContentLoaded: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
  firstInputDelay: number;
  timeToInteractive: number;
}

export interface ErrorReport {
  message: string;
  stack?: string;
  url: string;
  lineNumber?: number;
  columnNumber?: number;
  timestamp: number;
  userAgent: string;
  userId?: string;
  sessionId: string;
}

export interface UserInteraction {
  type: 'click' | 'scroll' | 'form_submit' | 'page_view';
  element?: string;
  timestamp: number;
  url: string;
  sessionId: string;
}

class PerformanceMonitoringService {
  private isEnabled: boolean;
  private sessionId: string;
  private performanceObserver?: PerformanceObserver;
  private errorQueue: ErrorReport[] = [];
  private interactionQueue: UserInteraction[] = [];
  private batchSize = 10;
  private flushInterval = 30000; // 30 seconds

  constructor() {
    this.isEnabled = import.meta.env.VITE_ENABLE_PERFORMANCE_MONITORING === 'true';
    this.sessionId = this.generateSessionId();
    
    if (this.isEnabled && typeof window !== 'undefined') {
      this.initialize();
    }
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private initialize(): void {
    // Monitor performance metrics
    this.setupPerformanceObserver();
    
    // Monitor JavaScript errors
    this.setupErrorTracking();
    
    // Monitor user interactions
    this.setupInteractionTracking();
    
    // Setup periodic data flushing
    this.setupDataFlushing();
    
    // Monitor page visibility changes
    this.setupVisibilityTracking();
  }

  private setupPerformanceObserver(): void {
    if ('PerformanceObserver' in window) {
      this.performanceObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          this.processPerformanceEntry(entry);
        });
      });

      // Observe different types of performance entries
      try {
        this.performanceObserver.observe({ entryTypes: ['navigation', 'paint', 'largest-contentful-paint', 'layout-shift', 'first-input'] });
      } catch (error) {
        console.warn('Performance Observer not fully supported:', error);
      }
    }
  }

  private processPerformanceEntry(entry: PerformanceEntry): void {
    const metrics: Partial<PerformanceMetrics> = {};

    switch (entry.entryType) {
      case 'navigation':
        const navEntry = entry as PerformanceNavigationTiming;
        metrics.pageLoadTime = navEntry.loadEventEnd - navEntry.navigationStart;
        metrics.domContentLoaded = navEntry.domContentLoadedEventEnd - navEntry.navigationStart;
        break;
        
      case 'paint':
        if (entry.name === 'first-contentful-paint') {
          metrics.firstContentfulPaint = entry.startTime;
        }
        break;
        
      case 'largest-contentful-paint':
        metrics.largestContentfulPaint = entry.startTime;
        break;
        
      case 'layout-shift':
        const layoutEntry = entry as any;
        if (!layoutEntry.hadRecentInput) {
          metrics.cumulativeLayoutShift = (metrics.cumulativeLayoutShift || 0) + layoutEntry.value;
        }
        break;
        
      case 'first-input':
        metrics.firstInputDelay = entry.processingStart - entry.startTime;
        break;
    }

    if (Object.keys(metrics).length > 0) {
      this.reportPerformanceMetrics(metrics);
    }
  }

  private setupErrorTracking(): void {
    // Global error handler
    window.addEventListener('error', (event) => {
      const errorReport: ErrorReport = {
        message: event.message,
        stack: event.error?.stack,
        url: event.filename || window.location.href,
        lineNumber: event.lineno,
        columnNumber: event.colno,
        timestamp: Date.now(),
        userAgent: navigator.userAgent,
        sessionId: this.sessionId
      };
      
      this.reportError(errorReport);
    });

    // Unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      const errorReport: ErrorReport = {
        message: `Unhandled Promise Rejection: ${event.reason}`,
        stack: event.reason?.stack,
        url: window.location.href,
        timestamp: Date.now(),
        userAgent: navigator.userAgent,
        sessionId: this.sessionId
      };
      
      this.reportError(errorReport);
    });
  }

  private setupInteractionTracking(): void {
    // Track clicks
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      const interaction: UserInteraction = {
        type: 'click',
        element: this.getElementSelector(target),
        timestamp: Date.now(),
        url: window.location.href,
        sessionId: this.sessionId
      };
      
      this.reportInteraction(interaction);
    });

    // Track scroll events (throttled)
    let scrollTimeout: NodeJS.Timeout;
    document.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        const interaction: UserInteraction = {
          type: 'scroll',
          timestamp: Date.now(),
          url: window.location.href,
          sessionId: this.sessionId
        };
        
        this.reportInteraction(interaction);
      }, 100);
    });

    // Track form submissions
    document.addEventListener('submit', (event) => {
      const target = event.target as HTMLFormElement;
      const interaction: UserInteraction = {
        type: 'form_submit',
        element: this.getElementSelector(target),
        timestamp: Date.now(),
        url: window.location.href,
        sessionId: this.sessionId
      };
      
      this.reportInteraction(interaction);
    });
  }

  private getElementSelector(element: HTMLElement): string {
    if (element.id) return `#${element.id}`;
    
    // Safely handle className - it can be a string or DOMTokenList
    if (element.className) {
      const className = typeof element.className === 'string' 
        ? element.className 
        : element.className.toString();
      
      if (className.trim()) {
        return `.${className.split(' ')[0]}`;
      }
    }
    
    return element.tagName.toLowerCase();
  }

  private setupDataFlushing(): void {
    setInterval(() => {
      this.flushData();
    }, this.flushInterval);

    // Flush data before page unload
    window.addEventListener('beforeunload', () => {
      this.flushData();
    });
  }

  private setupVisibilityTracking(): void {
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.flushData();
      }
    });
  }

  private reportPerformanceMetrics(metrics: Partial<PerformanceMetrics>): void {
    if (!this.isEnabled) return;

    // Send to analytics service
    if (window.gtag) {
      Object.entries(metrics).forEach(([key, value]) => {
        window.gtag('event', 'performance_metric', {
          metric_name: key,
          metric_value: Math.round(value),
          session_id: this.sessionId
        });
      });
    }

    // Check for performance issues and send alerts
    this.checkPerformanceThresholds(metrics);
  }

  private checkPerformanceThresholds(metrics: Partial<PerformanceMetrics>): void {
    const thresholds = {
      pageLoadTime: 3000, // 3 seconds
      firstContentfulPaint: 1800, // 1.8 seconds
      largestContentfulPaint: 2500, // 2.5 seconds
      cumulativeLayoutShift: 0.1,
      firstInputDelay: 100 // 100ms
    };

    Object.entries(metrics).forEach(([key, value]) => {
      const threshold = thresholds[key as keyof typeof thresholds];
      if (threshold && value > threshold) {
        this.sendPerformanceAlert(key, value, threshold);
      }
    });
  }

  private sendPerformanceAlert(metric: string, value: number, threshold: number): void {
    console.warn(`Performance Alert: ${metric} (${value}) exceeded threshold (${threshold})`);
    
    // Send to monitoring service (could be integrated with external services)
    if (window.gtag) {
      window.gtag('event', 'performance_alert', {
        metric_name: metric,
        metric_value: Math.round(value),
        threshold: threshold,
        session_id: this.sessionId
      });
    }
  }

  private reportError(error: ErrorReport): void {
    if (!this.isEnabled) return;

    this.errorQueue.push(error);
    
    // Send critical errors immediately
    if (this.isCriticalError(error)) {
      this.flushErrors();
    }

    // Send to analytics
    if (window.gtag) {
      window.gtag('event', 'exception', {
        description: error.message,
        fatal: this.isCriticalError(error),
        session_id: this.sessionId
      });
    }
  }

  private isCriticalError(error: ErrorReport): boolean {
    const criticalPatterns = [
      /network error/i,
      /failed to fetch/i,
      /script error/i,
      /uncaught/i
    ];
    
    return criticalPatterns.some(pattern => pattern.test(error.message));
  }

  private reportInteraction(interaction: UserInteraction): void {
    if (!this.isEnabled) return;

    this.interactionQueue.push(interaction);
    
    if (this.interactionQueue.length >= this.batchSize) {
      this.flushInteractions();
    }
  }

  private flushData(): void {
    this.flushErrors();
    this.flushInteractions();
  }

  private flushErrors(): void {
    if (this.errorQueue.length === 0) return;

    // In a real implementation, send to your monitoring service
    console.log('Flushing errors:', this.errorQueue);
    
    this.errorQueue = [];
  }

  private flushInteractions(): void {
    if (this.interactionQueue.length === 0) return;

    // In a real implementation, send to your analytics service
    console.log('Flushing interactions:', this.interactionQueue);
    
    this.interactionQueue = [];
  }

  // Public methods
  public trackCustomMetric(name: string, value: number): void {
    if (!this.isEnabled) return;

    if (window.gtag) {
      window.gtag('event', 'custom_metric', {
        metric_name: name,
        metric_value: value,
        session_id: this.sessionId
      });
    }
  }

  public trackCustomError(message: string, details?: any): void {
    if (!this.isEnabled) return;

    const errorReport: ErrorReport = {
      message,
      stack: details?.stack,
      url: window.location.href,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      sessionId: this.sessionId
    };

    this.reportError(errorReport);
  }

  public getSessionId(): string {
    return this.sessionId;
  }

  public isMonitoringEnabled(): boolean {
    return this.isEnabled;
  }
}

// Create singleton instance
const performanceMonitoring = new PerformanceMonitoringService();

// Auto-initialize in browser environment
if (typeof window !== 'undefined') {
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      // Performance monitoring is already initialized in constructor
    });
  }
}

export default performanceMonitoring;