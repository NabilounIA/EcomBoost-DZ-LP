import { useCallback } from 'react';

// Types pour les événements
export interface AnalyticsEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
}

// Types d'événements prédéfinis
export const ANALYTICS_EVENTS = {
  // Conversions principales
  WHATSAPP_CLICK: {
    action: 'click',
    category: 'conversion',
    label: 'whatsapp_contact'
  },
  FORM_SUBMIT: {
    action: 'submit',
    category: 'conversion',
    label: 'contact_form'
  },
  PRICING_VIEW: {
    action: 'view',
    category: 'engagement',
    label: 'pricing_section'
  },
  DEMO_REQUEST: {
    action: 'click',
    category: 'conversion',
    label: 'demo_request'
  },
  
  // Engagement
  SCROLL_DEPTH: {
    action: 'scroll',
    category: 'engagement',
    label: 'page_scroll'
  },
  VIDEO_PLAY: {
    action: 'play',
    category: 'engagement',
    label: 'demo_video'
  },
  FAQ_EXPAND: {
    action: 'expand',
    category: 'engagement',
    label: 'faq_item'
  },
  
  // Navigation
  SECTION_VIEW: {
    action: 'view',
    category: 'navigation',
    label: 'section_visible'
  },
  CTA_CLICK: {
    action: 'click',
    category: 'navigation',
    label: 'cta_button'
  },
  
  // ROI Calculator
  ROI_CALCULATE: {
    action: 'calculate',
    category: 'tool',
    label: 'roi_calculator'
  },
  
  // Exit Intent
  EXIT_INTENT: {
    action: 'trigger',
    category: 'retention',
    label: 'exit_intent_popup'
  }
} as const;

declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

export const useAnalytics = () => {
  // Fonction pour tracker un événement
  const trackEvent = useCallback((event: AnalyticsEvent) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', event.action, {
        event_category: event.category,
        event_label: event.label,
        value: event.value,
        custom_parameter_1: event.label // Pour mapping personnalisé
      });
      
      // Log en développement
      if (process.env.NODE_ENV === 'development') {
        console.log('📊 Analytics Event:', event);
      }
    }
  }, []);

  // Fonction pour tracker une conversion
  const trackConversion = useCallback((conversionType: string, value?: number) => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'conversion', {
        send_to: 'GA_MEASUREMENT_ID',
        event_category: 'conversion',
        event_label: conversionType,
        value: value || 1,
        currency: 'DZD'
      });
      
      // Log en développement
      if (process.env.NODE_ENV === 'development') {
        console.log('🎯 Conversion Tracked:', conversionType, value);
      }
    }
  }, []);

  // Fonction pour tracker la profondeur de scroll
  const trackScrollDepth = useCallback((percentage: number) => {
    trackEvent({
      ...ANALYTICS_EVENTS.SCROLL_DEPTH,
      value: percentage
    });
  }, [trackEvent]);

  // Fonction pour tracker le temps passé sur une section
  const trackTimeOnSection = useCallback((sectionName: string, timeInSeconds: number) => {
    trackEvent({
      action: 'time_spent',
      category: 'engagement',
      label: `section_${sectionName}`,
      value: timeInSeconds
    });
  }, [trackEvent]);

  // Fonction pour tracker les clics WhatsApp
  const trackWhatsAppClick = useCallback((source: string) => {
    trackEvent({
      ...ANALYTICS_EVENTS.WHATSAPP_CLICK,
      label: `whatsapp_${source}`
    });
    trackConversion('whatsapp_contact');
  }, [trackEvent, trackConversion]);

  // Fonction pour tracker les soumissions de formulaire
  const trackFormSubmit = useCallback((formType: string) => {
    trackEvent({
      ...ANALYTICS_EVENTS.FORM_SUBMIT,
      label: `form_${formType}`
    });
    trackConversion('form_submission');
  }, [trackEvent, trackConversion]);

  return {
    trackEvent,
    trackConversion,
    trackScrollDepth,
    trackTimeOnSection,
    trackWhatsAppClick,
    trackFormSubmit,
    ANALYTICS_EVENTS
  };
};

export default useAnalytics;