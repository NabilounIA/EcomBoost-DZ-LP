import React, { useState } from 'react';
import { useQuickLeadCapture } from '../hooks/useLeadCapture';

interface QuickLeadFormProps {
  onSuccess?: (leadId: string) => void;
  onError?: (error: string) => void;
  className?: string;
  title?: string;
  description?: string;
  buttonText?: string;
  showBusinessName?: boolean;
  showMessage?: boolean;
  compact?: boolean;
}

const QuickLeadForm: React.FC<QuickLeadFormProps> = ({
  onSuccess,
  onError,
  className = '',
  title = 'Demandez votre devis gratuit',
  description = 'Remplissez ce formulaire et notre équipe vous contactera dans les 24h.',
  buttonText = 'Obtenir mon devis',
  showBusinessName = true,
  showMessage = false,
  compact = false
}) => {
  const { submitQuickLead, isSubmitting, isCompleted, resetQuickForm } = useQuickLeadCapture();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    businessName: '',
    message: ''
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showErrors, setShowErrors] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Le prénom est requis';
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Le nom est requis';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Format d\'email invalide';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Le téléphone est requis';
    } else if (!/^[\d\s\-\+\(\)]{8,}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Format de téléphone invalide';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowErrors(true);
    
    if (!validateForm()) {
      return;
    }
    
    try {
      const result = await submitQuickLead(formData);
      
      if (result.success) {
        if (onSuccess) {
          onSuccess(result.leadId || 'quick-lead');
        }
      } else {
        if (onError) {
          onError(result.error || 'Erreur lors de l\'envoi');
        }
      }
    } catch (error) {
      if (onError) {
        onError('Une erreur inattendue s\'est produite');
      }
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleReset = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      businessName: '',
      message: ''
    });
    setErrors({});
    setShowErrors(false);
    resetQuickForm();
  };

  if (isCompleted) {
    return (
      <div className={`bg-white rounded-lg shadow-lg p-6 text-center ${className}`}>
        <div className="mb-4">
          <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Demande envoyée !
          </h3>
          <p className="text-gray-600 text-sm">
            Nous vous contacterons très bientôt.
          </p>
        </div>
        
        <button
          onClick={handleReset}
          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
        >
          Nouvelle demande
        </button>
      </div>
    );
  }

  const inputClasses = (fieldName: string) => `
    w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200
    ${compact ? 'text-sm' : ''}
    ${showErrors && errors[fieldName] ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'}
  `;

  return (
    <div className={`bg-white rounded-lg shadow-lg ${compact ? 'p-4' : 'p-6'} ${className}`}>
      {!compact && (
        <div className="mb-6 text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {title}
          </h3>
          <p className="text-gray-600 text-sm">
            {description}
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name Fields */}
        <div className={compact ? 'space-y-3' : 'grid grid-cols-2 gap-4'}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Prénom *
            </label>
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              placeholder="Votre prénom"
              className={inputClasses('firstName')}
            />
            {showErrors && errors.firstName && (
              <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nom *
            </label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              placeholder="Votre nom"
              className={inputClasses('lastName')}
            />
            {showErrors && errors.lastName && (
              <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
            )}
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email *
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            placeholder="votre@email.com"
            className={inputClasses('email')}
          />
          {showErrors && errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Téléphone *
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            placeholder="+213 XX XX XX XX"
            className={inputClasses('phone')}
          />
          {showErrors && errors.phone && (
            <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
          )}
        </div>

        {/* Business Name */}
        {showBusinessName && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nom de l'entreprise
            </label>
            <input
              type="text"
              value={formData.businessName}
              onChange={(e) => handleInputChange('businessName', e.target.value)}
              placeholder="Votre entreprise"
              className={inputClasses('businessName')}
            />
          </div>
        )}

        {/* Message */}
        {showMessage && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Message
            </label>
            <textarea
              value={formData.message}
              onChange={(e) => handleInputChange('message', e.target.value)}
              placeholder="Décrivez brièvement votre projet..."
              rows={3}
              className={inputClasses('message')}
            />
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
            compact ? 'py-2 text-sm' : 'py-3'
          }`}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Envoi...
            </span>
          ) : (
            buttonText
          )}
        </button>

        {/* Privacy Notice */}
        <p className="text-xs text-gray-500 text-center">
          En soumettant ce formulaire, vous acceptez notre{' '}
          <a href="/privacy" className="text-blue-600 hover:underline">
            politique de confidentialité
          </a>
        </p>
      </form>
    </div>
  );
};

export default QuickLeadForm;