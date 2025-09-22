import { useState, useCallback, useEffect } from 'react';
import leadCaptureService, { LeadData, FormStep } from '../services/leadCapture';
import { useFormPerformance } from './usePerformanceMonitoring';

export interface UseLeadCaptureReturn {
  // Form state
  currentStep: number;
  totalSteps: number;
  currentStepData: FormStep | null;
  isFirstStep: boolean;
  isLastStep: boolean;
  
  // Form data
  formData: Partial<LeadData>;
  
  // Form actions
  updateFormData: (data: Partial<LeadData>) => void;
  nextStep: () => boolean;
  previousStep: () => boolean;
  goToStep: (stepIndex: number) => boolean;
  
  // Validation
  validateCurrentStep: () => string[];
  canProceedToNext: () => boolean;
  
  // Submission
  submitLead: () => Promise<{ success: boolean; leadId?: string; error?: string }>;
  
  // State
  isSubmitting: boolean;
  isCompleted: boolean;
  leadScore: number;
  
  // Utilities
  resetForm: () => void;
  getProgress: () => number;
}

export const useLeadCapture = (): UseLeadCaptureReturn => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Partial<LeadData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  
  const { trackFormStart, trackFormSubmit, trackFormError, trackFieldInteraction } = useFormPerformance('lead_capture');

  const steps = leadCaptureService.getSteps();
  const totalSteps = steps.length;
  const currentStepData = steps[currentStep] || null;
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;

  // Track form start on mount
  useEffect(() => {
    trackFormStart();
  }, [trackFormStart]);

  const updateFormData = useCallback((data: Partial<LeadData>) => {
    setFormData(prev => {
      const updated = { ...prev, ...data };
      leadCaptureService.updateStepData(updated);
      
      // Track field interactions
      Object.keys(data).forEach(field => {
        trackFieldInteraction(field);
      });
      
      return updated;
    });
  }, [trackFieldInteraction]);

  const validateCurrentStep = useCallback((): string[] => {
    return leadCaptureService.validateStep(currentStep, formData);
  }, [currentStep, formData]);

  const canProceedToNext = useCallback((): boolean => {
    return leadCaptureService.canProceedToNextStep(currentStep, formData);
  }, [currentStep, formData]);

  const nextStep = useCallback((): boolean => {
    if (!canProceedToNext()) {
      return false;
    }
    
    const success = leadCaptureService.nextStep();
    if (success) {
      setCurrentStep(prev => prev + 1);
    }
    return success;
  }, [canProceedToNext]);

  const previousStep = useCallback((): boolean => {
    const success = leadCaptureService.previousStep();
    if (success) {
      setCurrentStep(prev => prev - 1);
    }
    return success;
  }, []);

  const goToStep = useCallback((stepIndex: number): boolean => {
    if (stepIndex < 0 || stepIndex >= totalSteps) {
      return false;
    }
    
    // Validate all previous steps
    for (let i = 0; i < stepIndex; i++) {
      const errors = leadCaptureService.validateStep(i, formData);
      if (errors.length > 0) {
        return false;
      }
    }
    
    setCurrentStep(stepIndex);
    return true;
  }, [totalSteps, formData]);

  const submitLead = useCallback(async (): Promise<{ success: boolean; leadId?: string; error?: string }> => {
    setIsSubmitting(true);
    
    try {
      const result = await trackFormSubmit(async () => {
        return await leadCaptureService.submitLead(formData);
      });
      
      if (result.success) {
        setIsCompleted(true);
      } else {
        trackFormError(result.error || 'Submission failed');
      }
      
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      trackFormError(errorMessage);
      return {
        success: false,
        error: errorMessage
      };
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, trackFormSubmit, trackFormError]);

  const resetForm = useCallback(() => {
    leadCaptureService.resetForm();
    setFormData({});
    setCurrentStep(0);
    setIsSubmitting(false);
    setIsCompleted(false);
  }, []);

  const getProgress = useCallback((): number => {
    return Math.round(((currentStep + 1) / totalSteps) * 100);
  }, [currentStep, totalSteps]);

  const leadScore = leadCaptureService.calculateLeadScore(formData);

  return {
    // Form state
    currentStep,
    totalSteps,
    currentStepData,
    isFirstStep,
    isLastStep,
    
    // Form data
    formData,
    
    // Form actions
    updateFormData,
    nextStep,
    previousStep,
    goToStep,
    
    // Validation
    validateCurrentStep,
    canProceedToNext,
    
    // Submission
    submitLead,
    
    // State
    isSubmitting,
    isCompleted,
    leadScore,
    
    // Utilities
    resetForm,
    getProgress
  };
};

// Specialized hook for quick lead capture (simplified form)
export const useQuickLeadCapture = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  
  const { trackFormSubmit, trackFormError } = useFormPerformance('quick_lead_capture');

  const submitQuickLead = useCallback(async (data: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    businessName?: string;
    message?: string;
  }): Promise<{ success: boolean; leadId?: string; error?: string }> => {
    setIsSubmitting(true);
    
    try {
      const leadData: Partial<LeadData> = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        businessName: data.businessName || '',
        source: 'quick-form',
        timestamp: Date.now(),
        sessionId: `quick_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        leadScore: 50 // Default score for quick leads
      };

      const result = await trackFormSubmit(async () => {
        return await leadCaptureService.submitLead(leadData);
      });
      
      if (result.success) {
        setIsCompleted(true);
      } else {
        trackFormError(result.error || 'Quick submission failed');
      }
      
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      trackFormError(errorMessage);
      return {
        success: false,
        error: errorMessage
      };
    } finally {
      setIsSubmitting(false);
    }
  }, [trackFormSubmit, trackFormError]);

  const resetQuickForm = useCallback(() => {
    setIsSubmitting(false);
    setIsCompleted(false);
  }, []);

  return {
    submitQuickLead,
    isSubmitting,
    isCompleted,
    resetQuickForm
  };
};

export default useLeadCapture;