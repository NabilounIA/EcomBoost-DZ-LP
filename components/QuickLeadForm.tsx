import React, { useState } from 'react';

interface QuickLeadFormProps {
  onSuccess?: () => void;
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
  className = '',
  title = 'Demandez votre devis gratuit',
  description = 'Remplissez ce formulaire et notre équipe vous contactera dans les 24h.',
  buttonText = 'Obtenir mon devis',
  showBusinessName = true,
  showMessage = false,
  compact = false
}) => {
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
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowErrors(true);
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);

    // Créer le message WhatsApp
    const whatsappMessage = `Bonjour ! Je souhaite obtenir un devis pour vos services EcomBoost DZ.

📋 Mes informations :
• Nom : ${formData.firstName} ${formData.lastName}
• Email : ${formData.email}
• Téléphone : ${formData.phone}${showBusinessName && formData.businessName ? `\n• Entreprise : ${formData.businessName}` : ''}${showMessage && formData.message ? `\n\n💬 Message : ${formData.message}` : ''}

Merci de me contacter pour discuter de mes besoins !`;

    // Encoder le message pour WhatsApp
    const encodedMessage = encodeURIComponent(whatsappMessage);
    const whatsappUrl = `https://wa.me/213XXXXXXXXX?text=${encodedMessage}`;

    // Ouvrir WhatsApp
    window.open(whatsappUrl, '_blank');

    // Simuler un délai puis appeler onSuccess
    setTimeout(() => {
      setIsSubmitting(false);
      if (onSuccess) {
        onSuccess();
      }
    }, 1000);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const inputClasses = `w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${compact ? 'py-2 text-sm' : ''}`;
  const errorClasses = 'text-red-500 text-sm mt-1';

  return (
    <div className={`bg-white rounded-xl shadow-lg p-6 ${compact ? 'p-4' : ''} ${className}`}>
      {!compact && (
        <div className="text-center mb-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-600">{description}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <input
              type="text"
              placeholder="Prénom *"
              value={formData.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              className={`${inputClasses} ${showErrors && errors.firstName ? 'border-red-500' : ''}`}
              disabled={isSubmitting}
            />
            {showErrors && errors.firstName && (
              <p className={errorClasses}>{errors.firstName}</p>
            )}
          </div>

          <div>
            <input
              type="text"
              placeholder="Nom *"
              value={formData.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              className={`${inputClasses} ${showErrors && errors.lastName ? 'border-red-500' : ''}`}
              disabled={isSubmitting}
            />
            {showErrors && errors.lastName && (
              <p className={errorClasses}>{errors.lastName}</p>
            )}
          </div>
        </div>

        <div>
          <input
            type="email"
            placeholder="Email *"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className={`${inputClasses} ${showErrors && errors.email ? 'border-red-500' : ''}`}
            disabled={isSubmitting}
          />
          {showErrors && errors.email && (
            <p className={errorClasses}>{errors.email}</p>
          )}
        </div>

        <div>
          <input
            type="tel"
            placeholder="Téléphone *"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            className={`${inputClasses} ${showErrors && errors.phone ? 'border-red-500' : ''}`}
            disabled={isSubmitting}
          />
          {showErrors && errors.phone && (
            <p className={errorClasses}>{errors.phone}</p>
          )}
        </div>

        {showBusinessName && (
          <div>
            <input
              type="text"
              placeholder="Nom de l'entreprise"
              value={formData.businessName}
              onChange={(e) => handleInputChange('businessName', e.target.value)}
              className={inputClasses}
              disabled={isSubmitting}
            />
          </div>
        )}

        {showMessage && (
          <div>
            <textarea
              placeholder="Votre message"
              value={formData.message}
              onChange={(e) => handleInputChange('message', e.target.value)}
              rows={4}
              className={inputClasses}
              disabled={isSubmitting}
            />
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${compact ? 'py-2 text-sm' : ''}`}
        >
          {isSubmitting ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Redirection...
            </div>
          ) : (
            buttonText
          )}
        </button>
      </form>

      <div className="text-center mt-4">
        <p className="text-xs text-gray-500">
          En soumettant ce formulaire, vous serez redirigé vers WhatsApp
        </p>
      </div>
    </div>
  );
};

export default QuickLeadForm;