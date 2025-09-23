import React from 'react';

const DemoVideo: React.FC = () => {


  const handlePlayClick = () => {
    window.open('https://wa.me/213770123456?text=Salut ! J\'aimerais voir une demo complete d\'EcomBoost DZ', '_blank');
  };

  return (
    <section className="py-20 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">
            Voyez EcomBoost DZ en Action
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Découvrez comment nos solutions transforment une boutique ordinaire 
            en machine à vendre automatisée en moins de 24h.
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <div className="mb-8">
            <div className="relative group cursor-pointer" onClick={handlePlayClick}>
              <div className="aspect-video bg-gradient-to-br from-green-600 to-blue-600 rounded-xl overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-white bg-opacity-90 rounded-full flex items-center justify-center mb-6 mx-auto group-hover:bg-opacity-100 transition-all duration-300 group-hover:scale-110">
                      <svg className="w-8 h-8 text-green-600 ml-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </div>
                    
                    <h3 className="text-2xl font-bold text-white mb-2">
                      Démo Complète EcomBoost DZ
                    </h3>
                    <p className="text-gray-200 mb-4">
                      Automatisation • Gestion • Croissance
                    </p>
                    <div className="flex items-center justify-center space-x-4 text-sm text-gray-300">
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                        </svg>
                        3 min
                      </span>
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                        HD Quality
                      </span>
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
                        </svg>
                        Sous-titres FR
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="w-full h-full bg-gradient-to-br from-green-500 via-blue-500 to-purple-600 opacity-80">
                  <div className="absolute inset-0 bg-pattern opacity-20"></div>
                </div>
              </div>
              
              <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                🔥 Nouveau
              </div>
              
              <div className="absolute bottom-4 right-4 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm">
                3:24
              </div>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-gray-700 rounded-lg">
              <div className="text-3xl font-bold text-green-400 mb-2">+300%</div>
              <div className="text-gray-300">Augmentation des ventes</div>
            </div>
            <div className="text-center p-6 bg-gray-700 rounded-lg">
              <div className="text-3xl font-bold text-blue-400 mb-2">24h</div>
              <div className="text-gray-300">Configuration complète</div>
            </div>
            <div className="text-center p-6 bg-gray-700 rounded-lg">
              <div className="text-3xl font-bold text-purple-400 mb-2">0€</div>
              <div className="text-gray-300">Frais de setup</div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <a
              href="https://wa.me/213770123456?text=Salut ! J'ai vu votre demo et je veux automatiser ma boutique"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors duration-200 text-lg"
              onClick={() => trackEvent({
                action: 'click',
                category: 'conversion',
                label: 'demo_video_cta'
              })}
            >
              <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.515"/>
              </svg>
              Commencer Mon Automatisation
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DemoVideo;