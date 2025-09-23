import React, { useState } from 'react';
import { WHATSAPP_LINK } from '../constants';
import { WhatsAppIcon } from './icons/WhatsAppIcon';

import { useHeroCTATest } from '../hooks/useABTesting';
import QuickLeadForm from './QuickLeadForm';

const Hero: React.FC = () => {
  const { variant, config, trackConversion, isLoading } = useHeroCTATest();
  const [showLeadForm, setShowLeadForm] = useState(false);

  const handleWhatsAppClick = () => {
    trackConversion(); // Track A/B test conversion
  };

  // Get button styling based on A/B test variant
  const getButtonClasses = () => {
    const baseClasses = "inline-flex items-center font-bold text-lg py-4 px-8 rounded-full transition-transform transform hover:scale-105 mb-12";
    
    if (config.color === 'blue') {
      return `${baseClasses} bg-blue-500 hover:bg-blue-600 text-white`;
    }
    
    // Default green styling
    return `${baseClasses} bg-green-500 hover:bg-green-600 text-white`;
  };

  const buttonText = config.text || 'Démarrer sur WhatsApp';

  return (
    <section className="py-20 md:py-32 bg-gray-900">
      <div className="container mx-auto px-6 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-4">
          Boostez votre E-commerce en Algérie. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
            Vendez plus, travaillez moins.
          </span>
        </h1>
        <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-8">
          Automatisez vos ventes sur WhatsApp et créez des publicités qui convertissent. Concentrez-vous sur votre business, on s'occupe du reste.
        </p>
        <div className="flex flex-col items-center space-y-4 mb-12">
          <a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleWhatsAppClick}
            className={getButtonClasses()}
          >
            <WhatsAppIcon className="w-6 h-6 mr-3" />
            {buttonText}
          </a>
          
          <div className="text-gray-400 text-sm">ou</div>
          
          <button
            onClick={() => setShowLeadForm(!showLeadForm)}
            className="text-blue-400 hover:text-blue-300 font-medium transition-colors duration-200"
          >
            {showLeadForm ? 'Masquer le formulaire' : 'Demander un devis personnalisé'}
          </button>
        </div>

        {/* Quick Lead Form */}
        {showLeadForm && (
          <div className="max-w-md mx-auto mb-12">
            <QuickLeadForm
              compact={true}
              title="Devis gratuit"
              description="Obtenez votre devis personnalisé en 2 minutes"
              buttonText="Recevoir mon devis"
              showBusinessName={true}
              onSuccess={() => {
                setShowLeadForm(false);
                trackCTAClick('Quick Lead Form', 'Hero Section');
              }}
              onError={(error) => {
                console.error('Lead form error:', error);
              }}
            />
          </div>
        )}

        {/* Social Proof Section */}
        <div className="max-w-4xl mx-auto">
          {/* Statistics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-green-400 mb-1">500+</div>
              <div className="text-gray-400 text-sm">Boutiques automatisées</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-blue-400 mb-1">2.5M</div>
              <div className="text-gray-400 text-sm">DA de ventes/mois</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-purple-400 mb-1">95%</div>
              <div className="text-gray-400 text-sm">Clients satisfaits</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-yellow-400 mb-1">24/7</div>
              <div className="text-gray-400 text-sm">Support disponible</div>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
            <p className="text-gray-400 text-sm mb-4 text-center">Ils nous font confiance :</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 items-center">
              <div className="text-center">
                <div className="bg-white/10 rounded-lg p-4 mb-2">
                  <span className="text-2xl">👗</span>
                </div>
                <div className="text-xs text-gray-400">Mode & Style</div>
              </div>
              <div className="text-center">
                <div className="bg-white/10 rounded-lg p-4 mb-2">
                  <span className="text-2xl">📱</span>
                </div>
                <div className="text-xs text-gray-400">Électronique</div>
              </div>
              <div className="text-center">
                <div className="bg-white/10 rounded-lg p-4 mb-2">
                  <span className="text-2xl">💄</span>
                </div>
                <div className="text-xs text-gray-400">Cosmétiques</div>
              </div>
              <div className="text-center">
                <div className="bg-white/10 rounded-lg p-4 mb-2">
                  <span className="text-2xl">🏠</span>
                </div>
                <div className="text-xs text-gray-400">Maison & Déco</div>
              </div>
            </div>
          </div>

          {/* Quick Benefits */}
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <div className="flex items-center bg-green-500/20 border border-green-500/30 rounded-full px-4 py-2">
              <span className="text-green-400 mr-2">✓</span>
              <span className="text-gray-300">Configuration en 24h</span>
            </div>
            <div className="flex items-center bg-blue-500/20 border border-blue-500/30 rounded-full px-4 py-2">
              <span className="text-blue-400 mr-2">✓</span>
              <span className="text-gray-300">Essai gratuit 7 jours</span>
            </div>
            <div className="flex items-center bg-purple-500/20 border border-purple-500/30 rounded-full px-4 py-2">
              <span className="text-purple-400 mr-2">✓</span>
              <span className="text-gray-300">Support en français</span>
            </div>
            <div className="flex items-center bg-yellow-500/20 border border-yellow-500/30 rounded-full px-4 py-2">
              <span className="text-yellow-400 mr-2">✓</span>
              <span className="text-gray-300">Équipe algérienne</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;