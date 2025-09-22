import React, { useState, useEffect } from 'react';
import { ChartBarIcon } from './icons/ChartBarIcon';
import performanceMonitoring from '../services/performance';

interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  status: 'good' | 'warning' | 'critical';
  threshold: number;
}

interface ErrorSummary {
  total: number;
  critical: number;
  recent: Array<{
    message: string;
    timestamp: number;
    url: string;
  }>;
}

const PerformanceDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([]);
  const [errors, setErrors] = useState<ErrorSummary>({ total: 0, critical: 0, recent: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  useEffect(() => {
    loadPerformanceData();
    
    // Refresh data every 30 seconds
    const interval = setInterval(loadPerformanceData, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const loadPerformanceData = async () => {
    setIsLoading(true);
    
    try {
      // Simulate loading performance data
      // In a real implementation, this would fetch from your monitoring service
      const mockMetrics: PerformanceMetric[] = [
        {
          name: 'Page Load Time',
          value: Math.random() * 3000 + 1000,
          unit: 'ms',
          status: 'good',
          threshold: 3000
        },
        {
          name: 'First Contentful Paint',
          value: Math.random() * 2000 + 800,
          unit: 'ms',
          status: 'good',
          threshold: 1800
        },
        {
          name: 'Largest Contentful Paint',
          value: Math.random() * 3000 + 1500,
          unit: 'ms',
          status: 'warning',
          threshold: 2500
        },
        {
          name: 'Cumulative Layout Shift',
          value: Math.random() * 0.2,
          unit: '',
          status: 'good',
          threshold: 0.1
        },
        {
          name: 'First Input Delay',
          value: Math.random() * 200 + 50,
          unit: 'ms',
          status: 'good',
          threshold: 100
        }
      ];

      // Determine status based on thresholds
      mockMetrics.forEach(metric => {
        if (metric.value > metric.threshold * 1.5) {
          metric.status = 'critical';
        } else if (metric.value > metric.threshold) {
          metric.status = 'warning';
        } else {
          metric.status = 'good';
        }
      });

      const mockErrors: ErrorSummary = {
        total: Math.floor(Math.random() * 10),
        critical: Math.floor(Math.random() * 3),
        recent: [
          {
            message: 'Network request failed',
            timestamp: Date.now() - 300000,
            url: '/api/data'
          },
          {
            message: 'Component render error',
            timestamp: Date.now() - 600000,
            url: '/dashboard'
          }
        ]
      };

      setMetrics(mockMetrics);
      setErrors(mockErrors);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Failed to load performance data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good':
        return 'text-green-400';
      case 'warning':
        return 'text-yellow-400';
      case 'critical':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'good':
        return 'bg-green-500/20';
      case 'warning':
        return 'bg-yellow-500/20';
      case 'critical':
        return 'bg-red-500/20';
      default:
        return 'bg-gray-500/20';
    }
  };

  const formatValue = (value: number, unit: string) => {
    if (unit === 'ms') {
      return `${Math.round(value)}${unit}`;
    } else if (unit === '') {
      return value.toFixed(3);
    }
    return `${value.toFixed(1)}${unit}`;
  };

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('fr-FR');
  };

  if (!performanceMonitoring.isMonitoringEnabled()) {
    return (
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
        <div className="text-center">
          <ChartBarIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">
            Surveillance des Performances Désactivée
          </h3>
          <p className="text-gray-400">
            Activez la surveillance des performances dans les variables d'environnement pour voir les métriques.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <ChartBarIcon className="w-8 h-8 text-emerald-400" />
          <div>
            <h2 className="text-2xl font-bold text-white">Tableau de Bord Performance</h2>
            <p className="text-gray-400">
              Dernière mise à jour: {lastUpdate.toLocaleTimeString('fr-FR')}
            </p>
          </div>
        </div>
        <button
          onClick={loadPerformanceData}
          disabled={isLoading}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-600 text-white rounded-lg transition-colors"
        >
          {isLoading ? 'Actualisation...' : 'Actualiser'}
        </button>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {metrics.map((metric, index) => (
          <div
            key={index}
            className={`bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 ${getStatusBg(metric.status)}`}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">{metric.name}</h3>
              <span className={`text-sm font-medium ${getStatusColor(metric.status)}`}>
                {metric.status.toUpperCase()}
              </span>
            </div>
            
            <div className="space-y-2">
              <div className="text-3xl font-bold text-white">
                {formatValue(metric.value, metric.unit)}
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">
                  Seuil: {formatValue(metric.threshold, metric.unit)}
                </span>
                <span className={getStatusColor(metric.status)}>
                  {metric.value > metric.threshold ? 
                    `+${Math.round(((metric.value - metric.threshold) / metric.threshold) * 100)}%` :
                    `${Math.round(((metric.threshold - metric.value) / metric.threshold) * 100)}% sous le seuil`
                  }
                </span>
              </div>
              
              {/* Progress bar */}
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    metric.status === 'good' ? 'bg-green-500' :
                    metric.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{
                    width: `${Math.min((metric.value / (metric.threshold * 1.5)) * 100, 100)}%`
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Error Summary */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
        <h3 className="text-xl font-semibold text-white mb-4">Résumé des Erreurs</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-white">{errors.total}</div>
            <div className="text-gray-400">Total des erreurs</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-red-400">{errors.critical}</div>
            <div className="text-gray-400">Erreurs critiques</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-emerald-400">
              {((1 - errors.total / 100) * 100).toFixed(1)}%
            </div>
            <div className="text-gray-400">Taux de réussite</div>
          </div>
        </div>

        {/* Recent Errors */}
        {errors.recent.length > 0 && (
          <div>
            <h4 className="text-lg font-semibold text-white mb-3">Erreurs Récentes</h4>
            <div className="space-y-2">
              {errors.recent.map((error, index) => (
                <div
                  key={index}
                  className="bg-gray-700/50 rounded-lg p-3 border border-gray-600"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-white font-medium">{error.message}</span>
                    <span className="text-gray-400 text-sm">
                      {formatTimestamp(error.timestamp)}
                    </span>
                  </div>
                  <div className="text-gray-400 text-sm mt-1">{error.url}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Session Info */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
        <h3 className="text-xl font-semibold text-white mb-4">Informations de Session</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-400">ID de Session:</span>
            <span className="text-white ml-2 font-mono">
              {performanceMonitoring.getSessionId()}
            </span>
          </div>
          <div>
            <span className="text-gray-400">Surveillance Active:</span>
            <span className="text-emerald-400 ml-2">
              {performanceMonitoring.isMonitoringEnabled() ? 'Oui' : 'Non'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceDashboard;