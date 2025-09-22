import React, { useState, useEffect } from 'react';
import { alertingService } from '../services/alerting';

interface Alert {
  id: string;
  type: 'performance' | 'error' | 'business' | 'security';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  timestamp: Date;
  data?: any;
  resolved?: boolean;
}

const AlertNotifications: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [summary, setSummary] = useState<any>(null);

  useEffect(() => {
    // Vérifier si les alertes sont activées
    const isDev = import.meta.env.DEV;
    const isAdmin = localStorage.getItem('admin_mode') === 'true';
    const alertsEnabled = import.meta.env.VITE_ENABLE_ERROR_TRACKING === 'true';
    
    if ((isDev || isAdmin) && alertsEnabled) {
      setIsVisible(true);

      // Charger les alertes existantes
      const existingAlerts = alertingService.getAlerts({ resolved: false });
      setAlerts(existingAlerts.slice(0, 5)); // Limiter à 5 alertes

      // S'abonner aux nouvelles alertes
      const handleNewAlert = (alert: Alert) => {
        setAlerts(prev => [alert, ...prev.slice(0, 4)]); // Garder max 5 alertes
        
        // Auto-hide pour les alertes de faible priorité
        if (alert.severity === 'low' || alert.severity === 'medium') {
          setTimeout(() => {
            setAlerts(prev => prev.filter(a => a.id !== alert.id));
          }, 5000);
        }
      };

      alertingService.onAlert(handleNewAlert);

      // Mettre à jour le résumé périodiquement
      const updateSummary = () => {
        setSummary(alertingService.getAlertSummary());
      };

      updateSummary();
      const summaryInterval = setInterval(updateSummary, 30000);

      return () => {
        clearInterval(summaryInterval);
      };
    }
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500 text-white border-red-600';
      case 'high': return 'bg-orange-500 text-white border-orange-600';
      case 'medium': return 'bg-yellow-500 text-black border-yellow-600';
      case 'low': return 'bg-blue-500 text-white border-blue-600';
      default: return 'bg-gray-500 text-white border-gray-600';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'performance': return '⚡';
      case 'error': return '❌';
      case 'business': return '📊';
      case 'security': return '🔒';
      default: return '⚠️';
    }
  };

  const dismissAlert = (alertId: string) => {
    setAlerts(prev => prev.filter(a => a.id !== alertId));
    alertingService.resolveAlert(alertId);
  };

  const dismissAll = () => {
    alerts.forEach(alert => alertingService.resolveAlert(alert.id));
    setAlerts([]);
  };

  if (!isVisible || alerts.length === 0) {
    return summary && summary.total > 0 ? (
      <div className="fixed top-4 right-4 z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-3">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              🚨 {summary.total} alerte{summary.total > 1 ? 's' : ''}
            </span>
            <button
              onClick={() => setAlerts(alertingService.getAlerts({ resolved: false }).slice(0, 5))}
              className="text-xs text-blue-500 hover:text-blue-700 dark:text-blue-400"
            >
              Voir
            </button>
          </div>
        </div>
      </div>
    ) : null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {/* Header avec résumé */}
      {summary && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-3">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
              🚨 Alertes Système
            </h3>
            <button
              onClick={dismissAll}
              className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              Tout masquer
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Critiques:</span>
              <span className="font-mono text-red-600 dark:text-red-400">{summary.critical}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Élevées:</span>
              <span className="font-mono text-orange-600 dark:text-orange-400">{summary.high}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Moyennes:</span>
              <span className="font-mono text-yellow-600 dark:text-yellow-400">{summary.medium}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Faibles:</span>
              <span className="font-mono text-blue-600 dark:text-blue-400">{summary.low}</span>
            </div>
          </div>
        </div>
      )}

      {/* Liste des alertes */}
      {alerts.map((alert) => (
        <div
          key={alert.id}
          className={`rounded-lg shadow-lg border p-3 ${getSeverityColor(alert.severity)} animate-slide-in`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-2">
              <span className="text-lg">{getTypeIcon(alert.type)}</span>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-semibold uppercase tracking-wide">
                    {alert.type}
                  </span>
                  <span className="text-xs opacity-75">
                    {alert.severity}
                  </span>
                </div>
                <p className="text-sm mt-1 leading-tight">
                  {alert.message}
                </p>
                <p className="text-xs opacity-75 mt-1">
                  {alert.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>
            
            <button
              onClick={() => dismissAlert(alert.id)}
              className="ml-2 text-lg opacity-75 hover:opacity-100 transition-opacity"
            >
              ×
            </button>
          </div>

          {/* Détails supplémentaires pour les alertes critiques */}
          {alert.severity === 'critical' && alert.data && (
            <div className="mt-2 pt-2 border-t border-current border-opacity-30">
              <details className="text-xs">
                <summary className="cursor-pointer opacity-75 hover:opacity-100">
                  Détails techniques
                </summary>
                <pre className="mt-1 text-xs opacity-75 overflow-x-auto">
                  {JSON.stringify(alert.data, null, 2)}
                </pre>
              </details>
            </div>
          )}
        </div>
      ))}

      {/* Boutons d'action pour le développement */}
      {import.meta.env.DEV && (
        <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-2">
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Mode Développement:</p>
          <div className="flex space-x-1">
            <button
              onClick={() => alertingService.simulateAlert('performance', 'high')}
              className="text-xs bg-orange-500 text-white px-2 py-1 rounded hover:bg-orange-600"
            >
              Test Perf
            </button>
            <button
              onClick={() => alertingService.simulateAlert('error', 'critical')}
              className="text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
            >
              Test Erreur
            </button>
            <button
              onClick={() => alertingService.simulateAlert('business', 'medium')}
              className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
            >
              Test Business
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AlertNotifications;