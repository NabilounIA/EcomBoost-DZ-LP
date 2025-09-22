import React, { useState, useEffect } from 'react';
import useAnalytics from '../hooks/useAnalytics';

const WhatsAppWidget: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentMessage, setCurrentMessage] = useState(0);
  const { trackWhatsAppClick, trackEvent, ANALYTICS_EVENTS } = useAnalytics();

  // Messages pré-définis selon la section
  const messages = [
    "Salut ! Je veux automatiser ma boutique e-commerce 🚀",
    "Bonjour, j'aimerais en savoir plus sur vos services",
    "Salut ! Puis-je avoir une démo de votre plateforme ?",
    "Bonjour, combien coûte votre solution ?",
    "Salut ! Comment puis-je commencer l'essai gratuit ?"
  ];

  // Afficher le widget après 3 secondes
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  // Rotation des messages
  useEffect(() => {
    if (isExpanded) {
      const interval = setInterval(() => {
        setCurrentMessage((prev) => (prev + 1) % messages.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [isExpanded, messages.length]);

  const handleWhatsAppClick = () => {
    // Tracking Analytics
    trackWhatsAppClick('floating_widget');
    
    const phoneNumber = "213770123456";
    const message = encodeURIComponent(messages[currentMessage]);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleWidgetExpand = () => {
    const newExpandedState = !isExpanded;
    setIsExpanded(newExpandedState);
    
    // Tracking de l'expansion du widget
    if (newExpandedState) {
      trackEvent({
        action: 'expand',
        category: 'engagement',
        label: 'whatsapp_widget'
      });
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Widget principal */}
      <div className="relative">
        {/* Bulle de message */}
        {isExpanded && (
          <div className="absolute bottom-16 right-0 mb-2 animate-fadeIn">
            <div className="bg-white rounded-lg shadow-lg p-4 max-w-xs border border-gray-200">
              <div className="flex items-center mb-2">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-2">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.515"/>
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-sm text-gray-800">EcomBoost DZ</p>
                  <p className="text-xs text-green-500">En ligne</p>
                </div>
                <button 
                  onClick={() => setIsExpanded(false)}
                  className="ml-auto text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <p className="text-sm text-gray-600 mb-3 leading-relaxed">
                {messages[currentMessage]}
              </p>
              <button
                onClick={handleWhatsAppClick}
                className="w-full bg-green-500 hover:bg-green-600 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors duration-200"
              >
                Démarrer la conversation
              </button>
            </div>
            {/* Flèche */}
            <div className="absolute bottom-0 right-6 transform translate-y-1/2">
              <div className="w-3 h-3 bg-white border-r border-b border-gray-200 transform rotate-45"></div>
            </div>
          </div>
        )}

        {/* Bouton principal */}
        <button
          onClick={handleWidgetExpand}
          className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 animate-pulse"
          style={{ animationDuration: '2s' }}
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.515"/>
          </svg>
        </button>

        {/* Badge de notification */}
        <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-bounce">
          1
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default WhatsAppWidget;