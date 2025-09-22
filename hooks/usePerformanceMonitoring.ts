import { useEffect, useCallback, useRef } from 'react';
import performanceMonitoring from '../services/performance';

export interface UsePerformanceMonitoringOptions {
  trackComponentMount?: boolean;
  trackComponentUnmount?: boolean;
  trackRenderTime?: boolean;
  componentName?: string;
}

export const usePerformanceMonitoring = (options: UsePerformanceMonitoringOptions = {}) => {
  const {
    trackComponentMount = false,
    trackComponentUnmount = false,
    trackRenderTime = false,
    componentName = 'UnknownComponent'
  } = options;

  const mountTimeRef = useRef<number>();
  const renderStartRef = useRef<number>();

  useEffect(() => {
    if (trackComponentMount) {
      mountTimeRef.current = performance.now();
      performanceMonitoring.trackCustomMetric(`${componentName}_mount_time`, mountTimeRef.current);
    }

    return () => {
      if (trackComponentUnmount && mountTimeRef.current) {
        const unmountTime = performance.now();
        const componentLifetime = unmountTime - mountTimeRef.current;
        performanceMonitoring.trackCustomMetric(`${componentName}_lifetime`, componentLifetime);
      }
    };
  }, [trackComponentMount, trackComponentUnmount, componentName]);

  useEffect(() => {
    if (trackRenderTime) {
      renderStartRef.current = performance.now();
    }
  });

  useEffect(() => {
    if (trackRenderTime && renderStartRef.current) {
      const renderTime = performance.now() - renderStartRef.current;
      performanceMonitoring.trackCustomMetric(`${componentName}_render_time`, renderTime);
    }
  });

  const trackCustomMetric = useCallback((name: string, value: number) => {
    performanceMonitoring.trackCustomMetric(name, value);
  }, []);

  const trackError = useCallback((message: string, details?: any) => {
    performanceMonitoring.trackCustomError(message, details);
  }, []);

  const trackUserAction = useCallback((action: string, details?: any) => {
    performanceMonitoring.trackCustomMetric(`user_action_${action}`, performance.now());
    
    if (window.gtag) {
      window.gtag('event', 'user_action', {
        action_name: action,
        component: componentName,
        details: JSON.stringify(details),
        session_id: performanceMonitoring.getSessionId()
      });
    }
  }, [componentName]);

  const measureAsyncOperation = useCallback(async <T>(
    operationName: string,
    operation: () => Promise<T>
  ): Promise<T> => {
    const startTime = performance.now();
    
    try {
      const result = await operation();
      const duration = performance.now() - startTime;
      
      trackCustomMetric(`${operationName}_duration`, duration);
      trackCustomMetric(`${operationName}_success`, 1);
      
      return result;
    } catch (error) {
      const duration = performance.now() - startTime;
      
      trackCustomMetric(`${operationName}_duration`, duration);
      trackCustomMetric(`${operationName}_error`, 1);
      trackError(`${operationName} failed`, error);
      
      throw error;
    }
  }, [trackCustomMetric, trackError]);

  return {
    trackCustomMetric,
    trackError,
    trackUserAction,
    measureAsyncOperation,
    sessionId: performanceMonitoring.getSessionId(),
    isEnabled: performanceMonitoring.isMonitoringEnabled()
  };
};

// Specialized hooks for common use cases
export const usePagePerformance = (pageName: string) => {
  const { trackCustomMetric, trackError } = usePerformanceMonitoring();

  useEffect(() => {
    // Track page view
    trackCustomMetric(`${pageName}_page_view`, 1);

    // Track page load time
    if (document.readyState === 'complete') {
      const loadTime = performance.now();
      trackCustomMetric(`${pageName}_page_load_time`, loadTime);
    } else {
      window.addEventListener('load', () => {
        const loadTime = performance.now();
        trackCustomMetric(`${pageName}_page_load_time`, loadTime);
      });
    }

    // Track time spent on page
    const startTime = performance.now();
    
    return () => {
      const timeSpent = performance.now() - startTime;
      trackCustomMetric(`${pageName}_time_spent`, timeSpent);
    };
  }, [pageName, trackCustomMetric]);

  return { trackCustomMetric, trackError };
};

export const useFormPerformance = (formName: string) => {
  const { trackCustomMetric, trackUserAction, measureAsyncOperation } = usePerformanceMonitoring();

  const trackFormStart = useCallback(() => {
    trackUserAction(`${formName}_start`);
  }, [formName, trackUserAction]);

  const trackFormSubmit = useCallback(async (submitFunction: () => Promise<any>) => {
    return measureAsyncOperation(`${formName}_submit`, submitFunction);
  }, [formName, measureAsyncOperation]);

  const trackFormError = useCallback((error: string) => {
    trackUserAction(`${formName}_error`, { error });
  }, [formName, trackUserAction]);

  const trackFieldInteraction = useCallback((fieldName: string) => {
    trackUserAction(`${formName}_field_${fieldName}_interaction`);
  }, [formName, trackUserAction]);

  return {
    trackFormStart,
    trackFormSubmit,
    trackFormError,
    trackFieldInteraction,
    trackCustomMetric
  };
};

export const useAPIPerformance = () => {
  const { measureAsyncOperation, trackError } = usePerformanceMonitoring();

  const trackAPICall = useCallback(async <T>(
    endpoint: string,
    apiCall: () => Promise<T>
  ): Promise<T> => {
    return measureAsyncOperation(`api_${endpoint.replace(/[^a-zA-Z0-9]/g, '_')}`, apiCall);
  }, [measureAsyncOperation]);

  return { trackAPICall, trackError };
};

export default usePerformanceMonitoring;