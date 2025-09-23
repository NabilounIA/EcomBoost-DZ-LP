import React, { useState, useEffect } from 'react';


const ExitIntentPopup: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasShown, setHasShown] = useState(false);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  


  useEffect(() => {
    // Vérifier si la popup a déjà été montrée dans cette session
    const popupShown = sessionStorage.getItem('exitPopupShown');
    if (popupShown) {
      setHasShown(true);
      return;
    }

    let exitIntentTriggered = false;

    const handleMouseLeave = (e: MouseEvent) => {
      // Détecter si la souris sort par le haut de la page (intention de fermer)
      if (e.clientY <= 0 && !exitIntentTriggered && !hasShown) {
        exitIntentTriggered = true;
        setIsVisible(true);
        setHasShown(true);
        sessionStorage.setItem('exitPopupShown', 'true');
        

      }
    };

    // Délai de sécurité - montrer après 30 secondes si pas encore montré
    const timeoutId = setTimeout(() => {
      if (!hasShown && !exitIntentTriggered) {
        setIsVisible(true);
        setHasShown(true);
        sessionStorage.setItem('exitPopupShown', 'true');
        

      }
    }, 30000);

    // Ajouter l'écouteur d'événement
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
      clearTimeout(timeoutId);
    };
  }, [hasShown]);

  const handleClose = () => {
    setIsVisible(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulation d'envoi (remplacer par votre API)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsSuccess(true);

      // Rediriger vers WhatsApp avec les infos
      setTimeout(() => {
        const message = `Salut ! Je viens de m'inscrire pour l'audit gratuit. Voici mes coordonnées :\n📧 Email: ${email}\n📱 Téléphone: ${phone}\n\nJ'aimerais discuter de mon projet e-commerce ! 🚀`;
        const whatsappUrl = `https://wa.me/213770123456?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
        
        setIsVisible(false);
      }, 2000);
      
    } catch (error) {
      console.error('Erreur lors de l\'envoi:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOfferClick = (offer: string) => {
    trackEvent({
      action: 'click',
      category: 'popup',
      label: `exit_intent_offer_${offer}`
    });
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full mx-auto shadow-2xl transform animate-bounce-in">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-red-500 to-pink-500 text-white p-6 rounded-t-2xl">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-white hover:text-gray-200 text-2xl font-bold"
          >
            ×
          </button>
          <div className="text-center">
            <div className="text-4xl mb-2">⏰</div>
            <h2 className="text-2xl font-bold mb-2">Attendez !</h2>
            <p className="text-lg opacity-90">
              Ne partez pas sans votre audit gratuit !
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {!isSuccess ? (
            <>
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  🎁 Offre Spéciale - Dernière Chance !
                </h3>
                <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 mb-4">
                  <div className="flex items-center">
                    <div className="text-yellow-700">
                      <strong>AUDIT GRATUIT</strong> de votre boutique e-commerce
                      <br />
                      <span className="text-sm">Valeur: 15,000 DA - Gratuit aujourd'hui !</span>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
                  <div 
                    className="bg-green-50 p-3 rounded-lg border border-green-200 cursor-pointer hover:bg-green-100 transition-colors"
                    onClick={() => handleOfferClick('audit')}
                  >
                    <div className="text-green-600 font-semibold">✅ Audit Complet</div>
                    <div className="text-gray-600">Analyse détaillée</div>
                  </div>
                  <div 
                    className="bg-blue-50 p-3 rounded-lg border border-blue-200 cursor-pointer hover:bg-blue-100 transition-colors"
                    onClick={() => handleOfferClick('strategy')}
                  >
                    <div className="text-blue-600 font-semibold">🎯 Stratégie</div>
                    <div className="text-gray-600">Plan d'action</div>
                  </div>
                  <div 
                    className="bg-purple-50 p-3 rounded-lg border border-purple-200 cursor-pointer hover:bg-purple-100 transition-colors"
                    onClick={() => handleOfferClick('consultation')}
                  >
                    <div className="text-purple-600 font-semibold">💬 Consultation</div>
                    <div className="text-gray-600">30 min gratuit</div>
                  </div>
                  <div 
                    className="bg-orange-50 p-3 rounded-lg border border-orange-200 cursor-pointer hover:bg-orange-100 transition-colors"
                    onClick={() => handleOfferClick('bonus')}
                  >
                    <div className="text-orange-600 font-semibold">🎁 Bonus</div>
                    <div className="text-gray-600">Templates gratuits</div>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <input
                    type="email"
                    placeholder="Votre email professionnel"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <input
                    type="tel"
                    placeholder="Votre numéro WhatsApp"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white font-bold py-4 px-6 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Envoi en cours...
                    </div>
                  ) : (
                    '🚀 Réclamer Mon Audit Gratuit'
                  )}
                </button>
              </form>

              <div className="mt-4 text-center">
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                  <span>🔒</span>
                  <span>Vos données sont sécurisées</span>
                </div>
                <div className="mt-2 text-xs text-gray-400">
                  Offre limitée - Valable uniquement aujourd'hui
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="text-2xl font-bold text-green-600 mb-3">
                Parfait ! C'est noté !
              </h3>
              <p className="text-gray-600 mb-4">
                Nous vous contactons dans les 2 heures pour programmer votre audit gratuit.
              </p>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <p className="text-green-700 font-semibold">
                  🎁 Bonus : Vous recevrez aussi nos templates exclusifs !
                </p>
              </div>
              <p className="text-sm text-gray-500">
                Redirection vers WhatsApp dans quelques secondes...
              </p>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes bounce-in {
          0% {
            opacity: 0;
            transform: scale(0.3) translateY(-50px);
          }
          50% {
            opacity: 1;
            transform: scale(1.05);
          }
          70% {
            transform: scale(0.9);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        .animate-bounce-in {
          animation: bounce-in 0.6s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ExitIntentPopup;