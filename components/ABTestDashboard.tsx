import React, { useState, useEffect } from 'react';
import abTesting from '../services/abTesting';

interface TestStats {
  name: string;
  participants: number;
  conversions: number;
  conversionRate: number;
  totalValue: number;
}

interface TestResult {
  test: any;
  stats: Record<string, TestStats>;
  totalParticipants: number;
  startDate?: Date;
  endDate?: Date;
}

const ABTestDashboard: React.FC = () => {
  const [testResults, setTestResults] = useState<Record<string, TestResult>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTestResults();
  }, []);

  const loadTestResults = () => {
    setIsLoading(true);
    
    // Get results for known tests
    const testIds = ['hero-cta-test', 'pricing-display-test'];
    const results: Record<string, TestResult> = {};

    testIds.forEach(testId => {
      const result = abTesting.getTestResults(testId);
      if (result) {
        results[testId] = result;
      }
    });

    setTestResults(results);
    setIsLoading(false);
  };

  const formatDate = (date?: Date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('fr-FR');
  };

  const getWinningVariant = (stats: Record<string, TestStats>) => {
    let winner = null;
    let highestRate = 0;

    Object.entries(stats).forEach(([variantId, stat]) => {
      if (stat.conversionRate > highestRate) {
        highestRate = stat.conversionRate;
        winner = { id: variantId, ...stat };
      }
    });

    return winner;
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Tableau de Bord A/B Testing
        </h2>
        <button
          onClick={loadTestResults}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Actualiser
        </button>
      </div>

      {Object.keys(testResults).length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">
            Aucun test A/B en cours ou terminé.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(testResults).map(([testId, result]) => {
            const winner = getWinningVariant(result.stats);
            
            return (
              <div key={testId} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                <div className="mb-4">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {result.test.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-2">
                    {result.test.description}
                  </p>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
                    <span>Participants: {result.totalParticipants}</span>
                    <span>Début: {formatDate(result.startDate)}</span>
                    <span>Fin: {formatDate(result.endDate)}</span>
                    <span className={`px-2 py-1 rounded ${
                      result.test.status === 'running' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                    }`}>
                      {result.test.status === 'running' ? 'En cours' : 'Terminé'}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(result.stats).map(([variantId, stats]) => {
                    const isWinner = winner && winner.id === variantId;
                    
                    return (
                      <div
                        key={variantId}
                        className={`p-4 rounded-lg border-2 ${
                          isWinner
                            ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                            : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium text-gray-900 dark:text-white">
                            {stats.name}
                          </h4>
                          {isWinner && (
                            <span className="bg-green-500 text-white text-xs px-2 py-1 rounded">
                              Gagnant
                            </span>
                          )}
                        </div>
                        
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Participants:</span>
                            <span className="font-medium text-gray-900 dark:text-white">
                              {stats.participants}
                            </span>
                          </div>
                          
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Conversions:</span>
                            <span className="font-medium text-gray-900 dark:text-white">
                              {stats.conversions}
                            </span>
                          </div>
                          
                          <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Taux de conversion:</span>
                            <span className={`font-bold ${
                              isWinner ? 'text-green-600 dark:text-green-400' : 'text-gray-900 dark:text-white'
                            }`}>
                              {stats.conversionRate.toFixed(2)}%
                            </span>
                          </div>
                          
                          {stats.totalValue > 0 && (
                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-gray-400">Valeur totale:</span>
                              <span className="font-medium text-gray-900 dark:text-white">
                                {stats.totalValue.toFixed(2)} DA
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Conversion rate bar */}
                        <div className="mt-3">
                          <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                isWinner ? 'bg-green-500' : 'bg-blue-500'
                              }`}
                              style={{ width: `${Math.min(stats.conversionRate, 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {winner && result.totalParticipants > 30 && (
                  <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <h5 className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                      Recommandation
                    </h5>
                    <p className="text-blue-800 dark:text-blue-200 text-sm">
                      La variante "{winner.name}" performe le mieux avec un taux de conversion de {winner.conversionRate.toFixed(2)}%. 
                      Considérez l'implémenter comme version par défaut.
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ABTestDashboard;