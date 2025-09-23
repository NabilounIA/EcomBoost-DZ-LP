// Advanced Analytics Service with Google Analytics 4 and Custom Events
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

export interface AnalyticsEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
  custom_parameters?: Record<string, any>;
}

export interface ConversionEvent {
  event_name: string;
  currency?: string;
  value?: number;
  transaction_id?: string;
  items?: Array<{
    item_id: string;
    item_name: string;
    category: string;
    price: number;
    quantity: number;
  }>;
}

class AnalyticsService {
  private isInitialized = false;
  private measurementId: string;
  private debugMode = false;
  private isEnabled = true;

  constructor(measurementId?: string, debug?: boolean, enabled?: boolean) {
    this.measurementId = measurementId || import.meta.env.VITE_GA_MEASUREMENT_ID || 'G-DEMO123456';
    this.debugMode = debug ?? (import.meta.env.VITE_NODE_ENV === 'development');
    this.isEnabled = enabled ?? (import.meta.env.VITE_ENABLE_ANALYTICS === 'true');
  }

  // Initialize Google Analytics 4
  async initialize(): Promise<void> {
    if (this.isInitialized || !this.isEnabled) return;

    try {
      // Load Google Analytics script
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${this.measurementId}`;
      document.head.appendChild(script);

      // Initialize dataLayer and gtag
      window.dataLayer = window.dataLayer || [];
      window.gtag = function() {
        window.dataLayer.push(arguments);
      };

      // Configure Google Analytics
      window.gtag('js', new Date());
      window.gtag('config', this.measurementId, {
        page_title: document.title,
        page_location: window.location.href,
        debug_mode: this.debugMode,
        send_page_view: true
      });

      this.isInitialized = true;
      this.log('Analytics initialized successfully');
    } catch (error) {
      console.error('Failed to initialize analytics:', error);
    }
  }

  // Track page views
  trackPageView(page_title?: string, page_location?: string): void {
    if (!this.isInitialized || !this.isEnabled) return;

    window.gtag('config', this.measurementId, {
      page_title: page_title || document.title,
      page_location: page_location || window.location.href,
    });

    this.log('Page view tracked', { page_title, page_location });
  }

  // Track custom events
  async trackEvent(event: AnalyticsEvent): Promise<void> {
    if (!this.isInitialized || !this.isEnabled) return;
    
    // Utiliser uniquement l'API serverless pour le tracking
    // Cela sécurise toutes les clés API et identifiants
    try {
      const response = await fetch('/api/analytics/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          event: event.action,
          category: event.category,
          label: event.label,
          value: event.value,
          page: window.location.pathname,
          userId: this.measurementId,
          sessionId: Date.now().toString(),
          ...event.custom_parameters
        })
      });
      
      if (!response.ok) {
        console.warn('Server analytics tracking failed:', await response.text());
      }
    } catch (error) {
      console.error('Error sending analytics to server:', error);
    }

    this.log('Event tracked', event);
  }

  // Track conversions
  trackConversion(conversion: ConversionEvent): void {
    if (!this.isInitialized) return;

    window.gtag('event', conversion.event_name, {
      currency: conversion.currency || 'EUR',
      value: conversion.value,
      transaction_id: conversion.transaction_id,
      items: conversion.items
    });

    this.log('Conversion tracked', conversion);
  }

  // Track user engagement
  trackEngagement(engagement_time_msec: number): void {
    if (!this.isInitialized) return;

    window.gtag('event', 'user_engagement', {
      engagement_time_msec
    });
  }

  // Track scroll depth
  trackScrollDepth(percent: number): void {
    if (!this.isInitialized) return;

    window.gtag('event', 'scroll', {
      event_category: 'engagement',
      event_label: `${percent}%`,
      value: percent
    });

    this.log('Scroll depth tracked', { percent });
  }

  // Track CTA clicks
  trackCTAClick(cta_name: string, cta_location: string): void {
    this.trackEvent({
      action: 'cta_click',
      category: 'engagement',
      label: cta_name,
      custom_parameters: {
        cta_location,
        timestamp: Date.now()
      }
    });
  }

  // Track form submissions
  trackFormSubmission(form_name: string, form_location: string): void {
    this.trackEvent({
      action: 'form_submit',
      category: 'lead_generation',
      label: form_name,
      custom_parameters: {
        form_location,
        timestamp: Date.now()
      }
    });
  }

  // Track demo requests
  trackDemoRequest(demo_type: string): void {
    this.trackConversion({
      event_name: 'demo_request',
      currency: 'EUR',
      value: 100, // Estimated lead value
      custom_parameters: {
        demo_type,
        timestamp: Date.now()
      }
    });
  }

  // Track pricing plan views
  trackPricingView(plan_name: string): void {
    this.trackEvent({
      action: 'pricing_view',
      category: 'product_interest',
      label: plan_name,
      custom_parameters: {
        timestamp: Date.now()
      }
    });
  }

  // Track blog article reads
  trackBlogRead(article_title: string, reading_time: number): void {
    this.trackEvent({
      action: 'blog_read',
      category: 'content_engagement',
      label: article_title,
      value: reading_time,
      custom_parameters: {
        reading_time_seconds: reading_time,
        timestamp: Date.now()
      }
    });
  }

  // Track video plays
  trackVideoPlay(video_title: string, video_duration?: number): void {
    this.trackEvent({
      action: 'video_play',
      category: 'content_engagement',
      label: video_title,
      custom_parameters: {
        video_duration,
        timestamp: Date.now()
      }
    });
  }

  // Track calculator usage
  trackCalculatorUse(calculator_type: string, result_value?: number): void {
    this.trackEvent({
      action: 'calculator_use',
      category: 'tool_engagement',
      label: calculator_type,
      value: result_value,
      custom_parameters: {
        timestamp: Date.now()
      }
    });
  }

  // Track theme changes
  trackThemeChange(theme: string): void {
    this.trackEvent({
      action: 'theme_change',
      category: 'user_preference',
      label: theme,
      custom_parameters: {
        timestamp: Date.now()
      }
    });
  }

  // Track errors
  trackError(error_message: string, error_location: string): void {
    this.trackEvent({
      action: 'error',
      category: 'technical',
      label: error_message,
      custom_parameters: {
        error_location,
        user_agent: navigator.userAgent,
        timestamp: Date.now()
      }
    });
  }

  // Set user properties
  setUserProperty(property_name: string, property_value: string): void {
    if (!this.isInitialized) return;

    window.gtag('config', this.measurementId, {
      custom_map: {
        [property_name]: property_value
      }
    });
  }

  // Set user ID for cross-device tracking
  setUserId(user_id: string): void {
    if (!this.isInitialized) return;

    window.gtag('config', this.measurementId, {
      user_id: user_id
    });
  }

  private log(message: string, data?: any): void {
    if (this.debugMode) {
      console.log(`[Analytics] ${message}`, data);
    }
  }
}

// Create singleton instance
export const analytics = new AnalyticsService();

// Auto-initialize analytics
if (typeof window !== 'undefined') {
  analytics.initialize();
}

export default analytics;