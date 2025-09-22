import React, { useState } from 'react';
import { WHATSAPP_LINK } from '../constants';
import LeadCaptureForm from './LeadCaptureForm';
import QuickLeadForm from './QuickLeadForm';

const Contact: React.FC = () => {
  const [formType, setFormType] = useState<'quick' | 'detailed'>('quick');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleLeadSuccess = (leadId: string) => {
    setIsSubmitted(true);
    
    // Reset after 5 seconds
    setTimeout(() => {
      setIsSubmitted(false);
    }, 5000);
  };

  const handleLeadError = (error: string) => {
    console.error('Lead capture error:', error);
    // You could show an error message to the user here
  };

  if (isSubmitted) {
    return (
      <section id="contact" className="py-20 bg-gray-900">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-green-500/20 border border-green-500/30 rounded-2xl p-8">
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="text-2xl font-bold text-white mb-4">Demande reçue avec succès !</h3>
              <p className="text-gray-300 mb-6">
                Merci pour votre intérêt ! Notre équipe d'experts va analyser vos besoins et vous contacter dans les 24h avec une proposition personnalisée.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href={WHATSAPP_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                  </svg>
                  Discuter maintenant
                </a>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="px-6 py-3 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors duration-200"
                >
                  Nouvelle demande
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="contact" className="py-20 bg-gray-900">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Contactez-nous</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Prêt à booster vos ventes ? Parlez-nous de votre projet et recevez une proposition personnalisée.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div>
              <h3 className="text-2xl font-bold mb-6">Parlons de votre projet</h3>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-green-500/20 w-12 h-12 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <span className="text-xl">💬</span>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">WhatsApp (Recommandé)</h4>
                    <p className="text-gray-400 text-sm mb-3">
                      Réponse immédiate et démonstration en direct de nos outils.
                    </p>
                    <a
                      href={WHATSAPP_LINK}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm"
                    >
                      Ouvrir WhatsApp
                    </a>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-blue-500/20 w-12 h-12 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <span className="text-xl">📧</span>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Email</h4>
                    <p className="text-gray-400 text-sm mb-3">
                      Pour les demandes détaillées et les devis personnalisés.
                    </p>
                    <a
                      href="mailto:contact@ecomboost-dz.com"
                      className="text-blue-400 hover:text-blue-300 transition-colors text-sm"
                    >
                      contact@ecomboost-dz.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="bg-purple-500/20 w-12 h-12 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <span className="text-xl">🕒</span>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Horaires</h4>
                    <p className="text-gray-400 text-sm">
                      Dimanche - Jeudi : 9h - 18h<br />
                      Samedi : 9h - 14h<br />
                      Vendredi : Fermé
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-6 bg-white/5 rounded-xl">
                <h4 className="font-semibold mb-3">🎁 Offre Spéciale</h4>
                <p className="text-gray-300 text-sm">
                  Contactez-nous cette semaine et bénéficiez de <strong>7 jours d'essai gratuit</strong> + 
                  une consultation personnalisée offerte !
                </p>
              </div>
            </div>

            {/* Lead Capture Forms */}
            <div>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                {/* Form Type Selector */}
                <div className="mb-6">
                  <h3 className="text-xl font-bold mb-4">Choisissez votre formulaire</h3>
                  <div className="flex space-x-4">
                    <button
                      onClick={() => setFormType('quick')}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                        formType === 'quick'
                          ? 'bg-blue-600 text-white'
                          : 'bg-white/10 text-gray-300 hover:bg-white/20'
                      }`}
                    >
                      Contact rapide
                    </button>
                    <button
                      onClick={() => setFormType('detailed')}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                        formType === 'detailed'
                          ? 'bg-blue-600 text-white'
                          : 'bg-white/10 text-gray-300 hover:bg-white/20'
                      }`}
                    >
                      Analyse détaillée
                    </button>
                  </div>
                  <p className="text-gray-400 text-sm mt-2">
                    {formType === 'quick' 
                      ? 'Formulaire simple pour un contact rapide'
                      : 'Questionnaire détaillé pour une proposition personnalisée'
                    }
                  </p>
                </div>

                {/* Form Content */}
                {formType === 'quick' ? (
                  <QuickLeadForm
                    title=""
                    description=""
                    buttonText="Envoyer ma demande"
                    showBusinessName={true}
                    showMessage={true}
                    onSuccess={handleLeadSuccess}
                    onError={handleLeadError}
                    className="bg-transparent shadow-none p-0"
                  />
                ) : (
                  <LeadCaptureForm
                    showProgress={true}
                    showLeadScore={true}
                    onSuccess={handleLeadSuccess}
                    onError={handleLeadError}
                    className="bg-transparent shadow-none p-0"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;