import { useEffect, useCallback, useRef } from 'react';
import analytics, { AnalyticsEvent, ConversionEvent } from '../services/analytics';

export interface UseAdvancedAnalyticsReturn {
  trackEvent: (event: AnalyticsEvent) => void;
  trackConversion: (conversion: ConversionEvent) => void;
  trackPageView: (title?: string, location?: string) => void;
  trackCTAClick: (ctaName: string, ctaLocation: string) => void;
  trackFormSubmission: (formName: string, formLocation: string) => void;
  trackDemoRequest: (demoType: string) => void;
  trackPricingView: (planName: string) => void;
  trackBlogRead: (articleTitle: string, readingTime: number) => void;
  trackVideoPlay: (videoTitle: string, videoDuration?: number) => void;
  trackCalculatorUse: (calculatorType: string, resultValue?: number) => void;
  trackThemeChange: (theme: string) => void;
  trackError: (errorMessage: string, errorLocation: string) => void;
  trackScrollDepth: (percent: number) => void;
  trackTimeOnPage: () => void;
}

export const useAdvancedAnalytics = (): UseAdvancedAnalyticsReturn => {
  const startTimeRef = useRef<number>(Date.now());
  const scrollDepthRef = useRef<Set<number>>(new Set());
  const engagementTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Track page view on mount
  useEffect(() => {
    analytics.trackPageView();
    startTimeRef.current = Date.now();

    // Track engagement every 15 seconds
    engagementTimerRef.current = setInterval(() => {
      const engagementTime = Date.now() - startTimeRef.current;
      analytics.trackEngagement(engagementTime);
    }, 15000);

    return () => {
      if (engagementTimerRef.current) {
        clearInterval(engagementTimerRef.current);
      }
    };
  }, []);

  // Set up scroll tracking
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = Math.round((scrollTop / documentHeight) * 100);

      // Track scroll milestones (25%, 50%, 75%, 100%)
      const milestones = [25, 50, 75, 100];
      milestones.forEach(milestone => {
        if (scrollPercent >= milestone && !scrollDepthRef.current.has(milestone)) {
          scrollDepthRef.current.add(milestone);
          analytics.trackScrollDepth(milestone);
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Set up visibility change tracking
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        const timeOnPage = Date.now() - startTimeRef.current;
        analytics.trackEngagement(timeOnPage);
      } else {
        startTimeRef.current = Date.now();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  const trackEvent = useCallback((event: AnalyticsEvent) => {
    analytics.trackEvent(event);
  }, []);

  const trackConversion = useCallback((conversion: ConversionEvent) => {
    analytics.trackConversion(conversion);
  }, []);

  const trackPageView = useCallback((title?: string, location?: string) => {
    analytics.trackPageView(title, location);
  }, []);

  const trackCTAClick = useCallback((ctaName: string, ctaLocation: string) => {
    analytics.trackCTAClick(ctaName, ctaLocation);
  }, []);

  const trackFormSubmission = useCallback((formName: string, formLocation: string) => {
    analytics.trackFormSubmission(formName, formLocation);
  }, []);

  const trackDemoRequest = useCallback((demoType: string) => {
    analytics.trackDemoRequest(demoType);
  }, []);

  const trackPricingView = useCallback((planName: string) => {
    analytics.trackPricingView(planName);
  }, []);

  const trackBlogRead = useCallback((articleTitle: string, readingTime: number) => {
    analytics.trackBlogRead(articleTitle, readingTime);
  }, []);

  const trackVideoPlay = useCallback((videoTitle: string, videoDuration?: number) => {
    analytics.trackVideoPlay(videoTitle, videoDuration);
  }, []);

  const trackCalculatorUse = useCallback((calculatorType: string, resultValue?: number) => {
    analytics.trackCalculatorUse(calculatorType, resultValue);
  }, []);

  const trackThemeChange = useCallback((theme: string) => {
    analytics.trackThemeChange(theme);
  }, []);

  const trackError = useCallback((errorMessage: string, errorLocation: string) => {
    analytics.trackError(errorMessage, errorLocation);
  }, []);

  const trackScrollDepth = useCallback((percent: number) => {
    analytics.trackScrollDepth(percent);
  }, []);

  const trackTimeOnPage = useCallback(() => {
    const timeOnPage = Date.now() - startTimeRef.current;
    analytics.trackEngagement(timeOnPage);
  }, []);

  return {
    trackEvent,
    trackConversion,
    trackPageView,
    trackCTAClick,
    trackFormSubmission,
    trackDemoRequest,
    trackPricingView,
    trackBlogRead,
    trackVideoPlay,
    trackCalculatorUse,
    trackThemeChange,
    trackError,
    trackScrollDepth,
    trackTimeOnPage,
  };
};

export default useAdvancedAnalytics;