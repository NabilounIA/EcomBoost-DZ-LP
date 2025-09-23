import React, { useState } from 'react';

interface CaseStudy {
  id: string;
  clientName: string;
  industry: string;
  location: string;
  duration: string;
  challenge: string;
  solution: string[];
  beforeStats: {
    revenue: number;
    orders: number;
    conversionRate: number;
    timeSpent: number;
  };
  afterStats: {
    revenue: number;
    orders: number;
    conversionRate: number;
    timeSpent: number;
  };
  testimonial: {
    text: string;
    author: string;
    position: string;
  };
  image: string;
}

const CaseStudies: React.FC = () => {
  const [activeCase, setActiveCase] = useState(0);


  const caseStudies: CaseStudy[] = [
    {
      id: 'boutique-mode-alger',
      clientName: 'Boutique Amina Fashion',
      industry: 'Mode Féminine',
      location: 'Alger',
      duration: '3 mois',
      challenge: 'Faible taux de conversion et gestion manuelle chronophage des commandes Instagram',
      solution: [
        'Automatisation complète du processus de commande',
        'Chatbot intelligent pour le service client',
        'Système de suivi automatique des stocks',
        'Intégration WhatsApp Business API'
      ],
      beforeStats: {
        revenue: 180000,
        orders: 45,
        conversionRate: 1.2,
        timeSpent: 8
      },
      afterStats: {
        revenue: 420000,
        orders: 140,
        conversionRate: 4.8,
        timeSpent: 2
      },
      testimonial: {
        text: "EcomBoost DZ a transformé ma boutique ! Je gagne 3x plus tout en travaillant 6h de moins par jour. Le chatbot gère 80% de mes clients automatiquement.",
        author: "Amina Benali",
        position: "Propriétaire, Boutique Amina Fashion"
      },
      image: "👗"
    },
    {
      id: 'electronics-oran',
      clientName: 'TechStore Oran',
      industry: 'Électronique',
      location: 'Oran',
      duration: '4 mois',
      challenge: 'Concurrence féroce et difficultés à fidéliser la clientèle',
      solution: [
        'Système de recommandations personnalisées',
        'Programme de fidélité automatisé',
        'Remarketing intelligent via WhatsApp',
        'Gestion automatique des garanties'
      ],
      beforeStats: {
        revenue: 320000,
        orders: 80,
        conversionRate: 2.1,
        timeSpent: 10
      },
      afterStats: {
        revenue: 680000,
        orders: 170,
        conversionRate: 5.2,
        timeSpent: 3
      },
      testimonial: {
        text: "Incroyable ! Mes ventes ont doublé et mes clients reviennent grâce au système de fidélité automatique. Je recommande vivement EcomBoost DZ.",
        author: "Karim Meziane",
        position: "Gérant, TechStore Oran"
      },
      image: "📱"
    },
    {
      id: 'cosmetics-constantine',
      clientName: 'Beauty Corner',
      industry: 'Cosmétiques',
      location: 'Constantine',
      duration: '2 mois',
      challenge: 'Gestion complexe des variantes produits et service client débordé',
      solution: [
        'Catalogue intelligent avec filtres automatiques',
        'Chatbot spécialisé beauté avec conseils',
        'Système de réservation de consultations',
        'Automatisation des relances clients'
      ],
      beforeStats: {
        revenue: 95000,
        orders: 38,
        conversionRate: 1.8,
        timeSpent: 6
      },
      afterStats: {
        revenue: 285000,
        orders: 114,
        conversionRate: 6.1,
        timeSpent: 1.5
      },
      testimonial: {
        text: "En 2 mois seulement, j'ai triplé mon chiffre d'affaires ! Le chatbot conseille mes clientes mieux que moi parfois. C'est magique !",
        author: "Yasmine Hadj",
        position: "Fondatrice, Beauty Corner"
      },
      image: "💄"
    }
  ];

  const currentCase = caseStudies[activeCase];

  const calculateGrowth = (before: number, after: number) => {
    return Math.round(((after - before) / before) * 100);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-DZ', {
      style: 'currency',
      currency: 'DZD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleCaseChange = (index: number) => {
    setActiveCase(index);
    trackEvent({
      action: 'view',
      category: 'case_study',
      label: caseStudies[index].id
    });
  };

  const handleContactClick = () => {
    trackEvent({
      action: 'click',
      category: 'conversion',
      label: 'case_study_contact',
      value: 1
    });
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Nos Clients Témoignent
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Découvrez comment nos solutions ont transformé des boutiques algériennes ordinaires 
            en machines à vendre automatisées. Résultats réels, clients réels.
          </p>
        </div>

        {/* Case Study Tabs */}
        <div className="flex flex-wrap justify-center mb-12 space-x-2 space-y-2">
          {caseStudies.map((study, index) => (
            <button
              key={study.id}
              onClick={() => handleCaseChange(index)}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-200 ${
                activeCase === index
                  ? 'bg-green-600 text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              <span className="mr-2">{study.image}</span>
              {study.clientName}
            </button>
          ))}
        </div>

        {/* Active Case Study */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Left Side - Story */}
            <div className="p-8 lg:p-12">
              <div className="mb-6">
                <div className="flex items-center mb-4">
                  <span className="text-4xl mr-4">{currentCase.image}</span>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      {currentCase.clientName}
                    </h3>
                    <p className="text-gray-600">
                      {currentCase.industry} • {currentCase.location}
                    </p>
                  </div>
                </div>
                <div className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                  Transformation en {currentCase.duration}
                </div>
              </div>

              {/* Challenge */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">
                  🎯 Le Défi
                </h4>
                <p className="text-gray-600 leading-relaxed">
                  {currentCase.challenge}
                </p>
              </div>

              {/* Solution */}
              <div className="mb-8">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">
                  ⚡ Notre Solution
                </h4>
                <ul className="space-y-2">
                  {currentCase.solution.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-green-500 mr-2 mt-1">✓</span>
                      <span className="text-gray-600">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Testimonial */}
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="text-2xl text-green-600 mb-3">"</div>
                <p className="text-gray-700 italic mb-4 leading-relaxed">
                  {currentCase.testimonial.text}
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
                    {currentCase.testimonial.author.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">
                      {currentCase.testimonial.author}
                    </div>
                    <div className="text-sm text-gray-600">
                      {currentCase.testimonial.position}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Results */}
            <div className="bg-gradient-to-br from-green-600 to-blue-600 p-8 lg:p-12 text-white">
              <h4 className="text-2xl font-bold mb-8 text-center">
                Résultats Mesurés
              </h4>

              <div className="space-y-8">
                {/* Revenue */}
                <div className="bg-white bg-opacity-10 rounded-lg p-6">
                  <div className="text-center mb-4">
                    <div className="text-3xl mb-2">💰</div>
                    <h5 className="text-lg font-semibold">Chiffre d'Affaires Mensuel</h5>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm opacity-90">Avant</span>
                    <span className="font-semibold">{formatCurrency(currentCase.beforeStats.revenue)}</span>
                  </div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm opacity-90">Après</span>
                    <span className="font-bold text-yellow-300">{formatCurrency(currentCase.afterStats.revenue)}</span>
                  </div>
                  <div className="text-center">
                    <span className="bg-yellow-300 text-green-800 px-3 py-1 rounded-full font-bold">
                      +{calculateGrowth(currentCase.beforeStats.revenue, currentCase.afterStats.revenue)}%
                    </span>
                  </div>
                </div>

                {/* Orders */}
                <div className="bg-white bg-opacity-10 rounded-lg p-6">
                  <div className="text-center mb-4">
                    <div className="text-3xl mb-2">📦</div>
                    <h5 className="text-lg font-semibold">Commandes Mensuelles</h5>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm opacity-90">Avant</span>
                    <span className="font-semibold">{currentCase.beforeStats.orders}</span>
                  </div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm opacity-90">Après</span>
                    <span className="font-bold text-yellow-300">{currentCase.afterStats.orders}</span>
                  </div>
                  <div className="text-center">
                    <span className="bg-yellow-300 text-green-800 px-3 py-1 rounded-full font-bold">
                      +{calculateGrowth(currentCase.beforeStats.orders, currentCase.afterStats.orders)}%
                    </span>
                  </div>
                </div>

                {/* Conversion Rate */}
                <div className="bg-white bg-opacity-10 rounded-lg p-6">
                  <div className="text-center mb-4">
                    <div className="text-3xl mb-2">🎯</div>
                    <h5 className="text-lg font-semibold">Taux de Conversion</h5>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm opacity-90">Avant</span>
                    <span className="font-semibold">{currentCase.beforeStats.conversionRate}%</span>
                  </div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm opacity-90">Après</span>
                    <span className="font-bold text-yellow-300">{currentCase.afterStats.conversionRate}%</span>
                  </div>
                  <div className="text-center">
                    <span className="bg-yellow-300 text-green-800 px-3 py-1 rounded-full font-bold">
                      +{calculateGrowth(currentCase.beforeStats.conversionRate, currentCase.afterStats.conversionRate)}%
                    </span>
                  </div>
                </div>

                {/* Time Saved */}
                <div className="bg-white bg-opacity-10 rounded-lg p-6">
                  <div className="text-center mb-4">
                    <div className="text-3xl mb-2">⏰</div>
                    <h5 className="text-lg font-semibold">Temps Quotidien</h5>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm opacity-90">Avant</span>
                    <span className="font-semibold">{currentCase.beforeStats.timeSpent}h</span>
                  </div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm opacity-90">Après</span>
                    <span className="font-bold text-yellow-300">{currentCase.afterStats.timeSpent}h</span>
                  </div>
                  <div className="text-center">
                    <span className="bg-yellow-300 text-green-800 px-3 py-1 rounded-full font-bold">
                      -{Math.round(((currentCase.beforeStats.timeSpent - currentCase.afterStats.timeSpent) / currentCase.beforeStats.timeSpent) * 100)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <p className="text-lg text-gray-600 mb-6">
            Prêt à obtenir des résultats similaires pour votre boutique ?
          </p>
          <a
            href="https://wa.me/213770123456?text=Salut%20!%20J'ai%20vu%20les%20cas%20d'études%20et%20je%20veux%20les%20mêmes%20résultats%20pour%20ma%20boutique%20!%20Pouvez-vous%20m'aider%20%3F%20🚀"
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleContactClick}
            className="inline-flex items-center bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            <span className="mr-2">🚀</span>
            Obtenir les Mêmes Résultats
          </a>
        </div>
      </div>
    </section>
  );
};

export default CaseStudies;