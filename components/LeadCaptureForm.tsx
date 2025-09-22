import React, { useState, useEffect } from 'react';
import { useLeadCapture } from '../hooks/useLeadCapture';
import { FormField } from '../services/leadCapture';

interface LeadCaptureFormProps {
  onSuccess?: (leadId: string) => void;
  onError?: (error: string) => void;
  className?: string;
  showProgress?: boolean;
  showLeadScore?: boolean;
}

const LeadCaptureForm: React.FC<LeadCaptureFormProps> = ({
  onSuccess,
  onError,
  className = '',
  showProgress = true,
  showLeadScore = false
}) => {
  const {
    currentStep,
    totalSteps,
    currentStepData,
    isFirstStep,
    isLastStep,
    formData,
    updateFormData,
    nextStep,
    previousStep,
    validateCurrentStep,
    canProceedToNext,
    submitLead,
    isSubmitting,
    isCompleted,
    leadScore,
    resetForm,
    getProgress
  } = useLeadCapture();

  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [showErrors, setShowErrors] = useState(false);

  // Reset errors when step changes
  useEffect(() => {
    setValidationErrors([]);
    setShowErrors(false);
  }, [currentStep]);

  // Handle form completion
  useEffect(() => {
    if (isCompleted && onSuccess) {
      onSuccess('lead-captured');
    }
  }, [isCompleted, onSuccess]);

  const handleNext = () => {
    const errors = validateCurrentStep();
    setValidationErrors(errors);
    
    if (errors.length > 0) {
      setShowErrors(true);
      return;
    }
    
    setShowErrors(false);
    
    if (isLastStep) {
      handleSubmit();
    } else {
      nextStep();
    }
  };

  const handlePrevious = () => {
    setShowErrors(false);
    previousStep();
  };

  const handleSubmit = async () => {
    const result = await submitLead();
    
    if (!result.success) {
      if (onError) {
        onError(result.error || 'Erreur lors de la soumission');
      }
    }
  };

  const handleFieldChange = (fieldName: string, value: any) => {
    updateFormData({ [fieldName]: value });
  };

  const renderField = (field: FormField) => {
    const value = formData[field.name as keyof typeof formData] || '';
    const hasError = showErrors && validationErrors.some(error => error.includes(field.label));

    const baseInputClasses = `w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
      hasError ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
    }`;

    switch (field.type) {
      case 'text':
      case 'email':
      case 'tel':
        return (
          <div key={field.name} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <input
              type={field.type}
              value={value}
              onChange={(e) => handleFieldChange(field.name, e.target.value)}
              placeholder={field.placeholder}
              className={baseInputClasses}
              required={field.required}
            />
            {field.helpText && (
              <p className="text-sm text-gray-500">{field.helpText}</p>
            )}
          </div>
        );

      case 'select':
        return (
          <div key={field.name} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <select
              value={value}
              onChange={(e) => handleFieldChange(field.name, e.target.value)}
              className={baseInputClasses}
              required={field.required}
            >
              <option value="">Sélectionnez une option</option>
              {field.options?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {field.helpText && (
              <p className="text-sm text-gray-500">{field.helpText}</p>
            )}
          </div>
        );

      case 'textarea':
        return (
          <div key={field.name} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            <textarea
              value={value}
              onChange={(e) => handleFieldChange(field.name, e.target.value)}
              placeholder={field.placeholder}
              rows={4}
              className={baseInputClasses}
              required={field.required}
            />
            {field.helpText && (
              <p className="text-sm text-gray-500">{field.helpText}</p>
            )}
          </div>
        );

      case 'checkbox':
        return (
          <div key={field.name} className="space-y-2">
            <label className="flex items-start space-x-3">
              <input
                type="checkbox"
                checked={!!value}
                onChange={(e) => handleFieldChange(field.name, e.target.checked)}
                className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                required={field.required}
              />
              <span className="text-sm text-gray-700">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </span>
            </label>
            {field.helpText && (
              <p className="text-sm text-gray-500 ml-7">{field.helpText}</p>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  if (isCompleted) {
    return (
      <div className={`bg-white rounded-lg shadow-lg p-8 text-center ${className}`}>
        <div className="mb-6">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Merci pour votre demande !
          </h3>
          <p className="text-gray-600">
            Nous avons bien reçu vos informations et notre équipe vous contactera dans les plus brefs délais.
          </p>
        </div>
        
        {showLeadScore && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              Score de qualification : <span className="font-semibold">{leadScore}/100</span>
            </p>
          </div>
        )}
        
        <button
          onClick={resetForm}
          className="px-6 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors duration-200"
        >
          Nouvelle demande
        </button>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-lg p-8 ${className}`}>
      {/* Progress Bar */}
      {showProgress && (
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">
              Étape {currentStep + 1} sur {totalSteps}
            </span>
            <span className="text-sm text-gray-500">
              {getProgress()}% complété
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${getProgress()}%` }}
            />
          </div>
        </div>
      )}

      {/* Lead Score Indicator */}
      {showLeadScore && leadScore > 0 && (
        <div className="mb-6 p-3 bg-blue-50 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm text-blue-800">Score de qualification</span>
            <span className="text-sm font-semibold text-blue-900">{leadScore}/100</span>
          </div>
          <div className="mt-2 w-full bg-blue-200 rounded-full h-1">
            <div
              className="bg-blue-600 h-1 rounded-full transition-all duration-300"
              style={{ width: `${leadScore}%` }}
            />
          </div>
        </div>
      )}

      {/* Step Content */}
      {currentStepData && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {currentStepData.title}
          </h3>
          {currentStepData.description && (
            <p className="text-gray-600 mb-6">
              {currentStepData.description}
            </p>
          )}

          {/* Error Messages */}
          {showErrors && validationErrors.length > 0 && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <h4 className="text-sm font-medium text-red-800 mb-2">
                Veuillez corriger les erreurs suivantes :
              </h4>
              <ul className="text-sm text-red-700 space-y-1">
                {validationErrors.map((error, index) => (
                  <li key={index}>• {error}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Form Fields */}
          <div className="space-y-6">
            {currentStepData.fields.map(renderField)}
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <button
          onClick={handlePrevious}
          disabled={isFirstStep}
          className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
            isFirstStep
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Précédent
        </button>

        <button
          onClick={handleNext}
          disabled={isSubmitting}
          className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
            canProceedToNext() && !isSubmitting
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {isSubmitting ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Envoi...
            </span>
          ) : isLastStep ? (
            'Envoyer'
          ) : (
            'Suivant'
          )}
        </button>
      </div>
    </div>
  );
};

export default LeadCaptureForm;