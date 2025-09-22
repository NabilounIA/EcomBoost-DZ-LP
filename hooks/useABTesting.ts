import { useState, useEffect, useCallback } from 'react';
import abTesting, { ABTestVariant } from '../services/abTesting';

export interface UseABTestingReturn {
  variant: string | null;
  config: Record<string, any>;
  trackConversion: (value?: number) => void;
  isLoading: boolean;
}

export function useABTesting(testId: string): UseABTestingReturn {
  const [variant, setVariant] = useState<string | null>(null);
  const [config, setConfig] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [userId] = useState(() => abTesting.generateUserId());

  useEffect(() => {
    const assignedVariant = abTesting.getVariant(testId, userId);
    setVariant(assignedVariant);
    
    // Get variant configuration
    if (assignedVariant) {
      const testResults = abTesting.getTestResults(testId);
      if (testResults?.test) {
        const variantConfig = testResults.test.variants.find(
          (v: ABTestVariant) => v.id === assignedVariant
        );
        setConfig(variantConfig?.config || {});
      }
    }
    
    setIsLoading(false);
  }, [testId, userId]);

  const trackConversion = useCallback((value?: number) => {
    if (variant) {
      abTesting.trackConversion(testId, userId, value);
    }
  }, [testId, userId, variant]);

  return {
    variant,
    config,
    trackConversion,
    isLoading
  };
}

// Specific hooks for common tests
export function useHeroCTATest() {
  return useABTesting('hero-cta-test');
}

export function usePricingDisplayTest() {
  return useABTesting('pricing-display-test');
}

export default useABTesting;