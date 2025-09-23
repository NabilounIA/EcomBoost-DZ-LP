import React, { useState, useEffect } from 'react';


const ROICalculator: React.FC = () => {
  const [monthlyOrders, setMonthlyOrders] = useState(50);
  const [averageOrderValue, setAverageOrderValue] = useState(3000);
  const [currentConversionRate, setCurrentConversionRate] = useState(2);
  const [timeSpentDaily, setTimeSpentDaily] = useState(4);
  const [results, setResults] = useState({
    currentRevenue: 0,
    projectedRevenue: 0,
    additionalRevenue: 0,
    timeSaved: 0,
    timeSavedValue: 0,
    totalROI: 0,
    paybackPeriod: 0
  });
  


  // Prix des plans (en DA)
  const planPrices = {
    starter: 15000,
    vendeur: 25000,
    topSeller: 45000
  };

  useEffect(() => {
    calculateROI();
  }, [monthlyOrders, averageOrderValue, currentConversionRate, timeSpentDaily]);

  const calculateROI = () => {
    // Revenus actuels
    const currentRevenue = monthlyOrders * averageOrderValue;
    
    // Amélioration estimée avec EcomBoost DZ
    const improvedConversionRate = currentConversionRate * 1.8; // +80% conversion
    const automationBoost = 1.3; // +30% grâce à l'automatisation
    const newMonthlyOrders = monthlyOrders * (improvedConversionRate / currentConversionRate) * automationBoost;
    const projectedRevenue = newMonthlyOrders * averageOrderValue;
    const additionalRevenue = projectedRevenue - currentRevenue;
    
    // Temps économisé
    const timeSavedHours = timeSpentDaily * 0.7; // 70% de temps économisé
    const timeSavedValue = timeSavedHours * 30 * 1500; // 1500 DA/heure
    
    // ROI calculation (plan Vendeur Intelligent)
    const monthlyInvestment = planPrices.vendeur;
    const totalMonthlyGain = additionalRevenue + timeSavedValue;
    const roi = ((totalMonthlyGain - monthlyInvestment) / monthlyInvestment) * 100;
    const paybackPeriod = monthlyInvestment / totalMonthlyGain;

    setResults({
      currentRevenue,
      projectedRevenue,
      additionalRevenue,
      timeSaved: timeSavedHours * 30,
      timeSavedValue,
      totalROI: roi,
      paybackPeriod
    });
  };

  const handleCalculate = () => {
    calculateROI();
    trackEvent({
      action: 'calculate',
      category: 'tool',
      label: 'roi_calculator_used',
      value: Math.round(results.totalROI)
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-DZ', {
      style: 'currency',
      currency: 'DZD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getRecommendedPlan = () => {
    if (monthlyOrders < 30) return 'starter';
    if (monthlyOrders < 100) return 'vendeur';
    return 'topSeller';
  };

  const planNames = {
    starter: 'Starter Social',
    vendeur: 'Vendeur Intelligent',
    topSeller: 'Top Seller DZ'
  };

  return (
    <section className="py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">
            Calculez Votre ROI avec EcomBoost DZ
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Découvrez combien vous pourriez gagner en automatisant votre boutique e-commerce. 
            Calcul basé sur les résultats réels de nos +500 clients.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Formulaire de calcul */}
          <div className="bg-gray-800 rounded-2xl p-8 shadow-xl">
            <h3 className="text-2xl font-bold text-white mb-6">
              Vos Données Actuelles
            </h3>
            
            <div className="space-y-6">
              {/* Commandes mensuelles */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Commandes par mois
                </label>
                <div className="relative">
                  <input
                    type="range"
                    min="10"
                    max="500"
                    value={monthlyOrders}
                    onChange={(e) => setMonthlyOrders(Number(e.target.value))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>10</span>
                    <span className="font-semibold text-green-400">{monthlyOrders}</span>
                    <span>500+</span>
                  </div>
                </div>
              </div>

              {/* Panier moyen */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Panier moyen (DA)
                </label>
                <div className="relative">
                  <input
                    type="range"
                    min="1000"
                    max="20000"
                    step="500"
                    value={averageOrderValue}
                    onChange={(e) => setAverageOrderValue(Number(e.target.value))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>1,000</span>
                    <span className="font-semibold text-green-400">{formatCurrency(averageOrderValue)}</span>
                    <span>20,000+</span>
                  </div>
                </div>
              </div>

              {/* Taux de conversion */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Taux de conversion actuel (%)
                </label>
                <div className="relative">
                  <input
                    type="range"
                    min="0.5"
                    max="10"
                    step="0.5"
                    value={currentConversionRate}
                    onChange={(e) => setCurrentConversionRate(Number(e.target.value))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>0.5%</span>
                    <span className="font-semibold text-green-400">{currentConversionRate}%</span>
                    <span>10%+</span>
                  </div>
                </div>
              </div>

              {/* Temps quotidien */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Temps quotidien sur la boutique (heures)
                </label>
                <div className="relative">
                  <input
                    type="range"
                    min="1"
                    max="12"
                    value={timeSpentDaily}
                    onChange={(e) => setTimeSpentDaily(Number(e.target.value))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>1h</span>
                    <span className="font-semibold text-green-400">{timeSpentDaily}h</span>
                    <span>12h+</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleCalculate}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
              >
                Recalculer Mon ROI
              </button>
            </div>
          </div>

          {/* Résultats */}
          <div className="bg-gradient-to-br from-green-600 to-blue-600 rounded-2xl p-8 shadow-xl text-white">
            <h3 className="text-2xl font-bold mb-6">
              Vos Gains Potentiels
            </h3>

            <div className="space-y-6">
              {/* Revenus */}
              <div className="bg-white bg-opacity-10 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm opacity-90">Revenus actuels/mois</span>
                  <span className="font-semibold">{formatCurrency(results.currentRevenue)}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm opacity-90">Revenus projetés/mois</span>
                  <span className="font-bold text-yellow-300">{formatCurrency(results.projectedRevenue)}</span>
                </div>
                <div className="border-t border-white border-opacity-20 pt-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Gain supplémentaire</span>
                    <span className="font-bold text-2xl text-green-300">
                      +{formatCurrency(results.additionalRevenue)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Temps économisé */}
              <div className="bg-white bg-opacity-10 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm opacity-90">Temps économisé/mois</span>
                  <span className="font-semibold">{Math.round(results.timeSaved)}h</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm opacity-90">Valeur du temps économisé</span>
                  <span className="font-bold text-blue-300">{formatCurrency(results.timeSavedValue)}</span>
                </div>
              </div>

              {/* ROI */}
              <div className="bg-white bg-opacity-20 rounded-lg p-4 border-2 border-yellow-300">
                <div className="text-center">
                  <div className="text-sm opacity-90 mb-1">ROI Total</div>
                  <div className="text-4xl font-bold text-yellow-300 mb-2">
                    {Math.round(results.totalROI)}%
                  </div>
                  <div className="text-sm opacity-90">
                    Retour sur investissement en {Math.ceil(results.paybackPeriod)} mois
                  </div>
                </div>
              </div>

              {/* Plan recommandé */}
              <div className="bg-white bg-opacity-10 rounded-lg p-4">
                <div className="text-center">
                  <div className="text-sm opacity-90 mb-2">Plan recommandé pour vous</div>
                  <div className="font-bold text-lg text-yellow-300 mb-2">
                    {planNames[getRecommendedPlan() as keyof typeof planNames]}
                  </div>
                  <div className="text-sm opacity-90">
                    {formatCurrency(planPrices[getRecommendedPlan() as keyof typeof planPrices])}/mois
                  </div>
                </div>
              </div>

              {/* CTA */}
              <a
                href={`https://wa.me/213770123456?text=Salut%20!%20J'ai%20calculé%20mon%20ROI%20(${Math.round(results.totalROI)}%25)%20et%20je%20veux%20commencer%20avec%20le%20plan%20${planNames[getRecommendedPlan() as keyof typeof planNames]}%20%F0%9F%9A%80`}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-white text-green-600 font-bold py-3 px-6 rounded-lg text-center hover:bg-gray-100 transition-colors duration-200"
                onClick={() => trackEvent({
                  action: 'click',
                  category: 'conversion',
                  label: 'roi_calculator_cta',
                  value: Math.round(results.totalROI)
                })}
              >
                Commencer Mon Automatisation
              </a>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 text-center text-sm text-gray-400">
          <p>
            * Calculs basés sur les performances moyennes de nos clients existants. 
            Les résultats peuvent varier selon votre secteur et votre engagement.
          </p>
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #10B981;
          cursor: pointer;
          box-shadow: 0 0 2px 0 #555;
          transition: background .15s ease-in-out;
        }
        .slider::-webkit-slider-thumb:hover {
          background: #059669;
        }
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #10B981;
          cursor: pointer;
          border: none;
          box-shadow: 0 0 2px 0 #555;
        }
      `}</style>
    </section>
  );
};

export default ROICalculator;