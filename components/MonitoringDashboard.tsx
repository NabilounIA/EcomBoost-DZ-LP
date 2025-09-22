import React, { useState, useEffect } from 'react';
import { advancedMonitoring } from '../services/advancedMonitoring';

interface HealthStatus {
  status: 'healthy' | 'warning' | 'critical';
  metrics: any;
  issues: string[];
}

interface MonitoringDashboardProps {
  embedded?: boolean;
}

const MonitoringDashboard: React.FC<MonitoringDashboardProps> = ({ embedded = false }) => {
  const [healthStatus, setHealthStatus] = useState<HealthStatus | null>(null);
  const [report, setReport] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Si embedded, toujours visible. Sinon, vérifier les conditions habituelles
    if (embedded) {
      setIsVisible(true);
    } else {
      // Vérifier si on est en mode développement ou si l'utilisateur a les droits admin
      const isDev = import.meta.env.DEV;
      const isAdmin = localStorage.getItem('admin_mode') === 'true';
      
      if (isDev || isAdmin) {
        setIsVisible(true);
      }
    }
    
    if (isVisible || embedded) {
      // Mise à jour périodique des métriques
      const interval = setInterval(async () => {
        const health = await advancedMonitoring.runHealthCheck();
        const currentReport = advancedMonitoring.generateReport();
        
        setHealthStatus(health);
        setReport(currentReport);
      }, 5000); // Toutes les 5 secondes

      return () => clearInterval(interval);
    }
  }, [embedded, isVisible]);

  if (!isVisible) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-500';
      case 'warning': return 'text-yellow-500';
      case 'critical': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-green-100 border-green-300';
      case 'warning': return 'bg-yellow-100 border-yellow-300';
      case 'critical': return 'bg-red-100 border-red-300';
      default: return 'bg-gray-100 border-gray-300';
    }
  };

  const formatDuration = (ms: number) => {
    if (ms < 1000) return `${Math.round(ms)}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return `${bytes}B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
  };

  const containerClass = embedded 
    ? "w-full" 
    : "fixed bottom-4 right-4 z-50";
    
  const cardClass = embedded 
    ? "bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-6" 
    : "bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4 max-w-md";

  return (
    <div className={containerClass}>
      <div className={cardClass}>
        {!embedded && (
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
              🔍 Monitoring Dashboard
            </h3>
            <button
              onClick={() => setIsVisible(false)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              ✕
            </button>
          </div>
        )}

        {healthStatus && (
          <div className={`rounded-lg p-3 mb-3 border ${getStatusBg(healthStatus.status)}`}>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">État de santé</span>
              <span className={`text-sm font-bold ${getStatusColor(healthStatus.status)}`}>
                {healthStatus.status.toUpperCase()}
              </span>
            </div>
            
            {healthStatus.issues.length > 0 && (
              <div className="mt-2">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Problèmes détectés:</p>
                <ul className="text-xs space-y-1">
                  {healthStatus.issues.map((issue, index) => (
                    <li key={index} className="text-red-600 dark:text-red-400">
                      • {issue}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {report && (
          <div className="space-y-3">
            {/* Métriques de Performance */}
            <div>
              <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                📊 Performance
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {report.performance.firstContentfulPaint && (
                  <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded">
                    <div className="text-gray-600 dark:text-gray-400">FCP</div>
                    <div className="font-mono text-gray-900 dark:text-white">
                      {formatDuration(report.performance.firstContentfulPaint)}
                    </div>
                  </div>
                )}
                
                {report.performance.largestContentfulPaint && (
                  <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded">
                    <div className="text-gray-600 dark:text-gray-400">LCP</div>
                    <div className="font-mono text-gray-900 dark:text-white">
                      {formatDuration(report.performance.largestContentfulPaint)}
                    </div>
                  </div>
                )}
                
                {report.performance.firstInputDelay && (
                  <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded">
                    <div className="text-gray-600 dark:text-gray-400">FID</div>
                    <div className="font-mono text-gray-900 dark:text-white">
                      {formatDuration(report.performance.firstInputDelay)}
                    </div>
                  </div>
                )}
                
                {report.performance.cumulativeLayoutShift && (
                  <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded">
                    <div className="text-gray-600 dark:text-gray-400">CLS</div>
                    <div className="font-mono text-gray-900 dark:text-white">
                      {report.performance.cumulativeLayoutShift.toFixed(3)}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Métriques Business */}
            <div>
              <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                💼 Business
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-2 rounded">
                  <div className="text-blue-600 dark:text-blue-400">Conversions</div>
                  <div className="font-mono text-blue-900 dark:text-blue-100">
                    {report.business.leadConversions || 0}
                  </div>
                </div>
                
                <div className="bg-green-50 dark:bg-green-900/20 p-2 rounded">
                  <div className="text-green-600 dark:text-green-400">Formulaires</div>
                  <div className="font-mono text-green-900 dark:text-green-100">
                    {report.business.formSubmissions || 0}
                  </div>
                </div>
                
                <div className="bg-purple-50 dark:bg-purple-900/20 p-2 rounded">
                  <div className="text-purple-600 dark:text-purple-400">Scroll</div>
                  <div className="font-mono text-purple-900 dark:text-purple-100">
                    {report.business.scrollDepth || 0}%
                  </div>
                </div>
                
                <div className="bg-orange-50 dark:bg-orange-900/20 p-2 rounded">
                  <div className="text-orange-600 dark:text-orange-400">Session</div>
                  <div className="font-mono text-orange-900 dark:text-orange-100">
                    {report.business.sessionDuration ? 
                      formatDuration(report.business.sessionDuration) : '0s'}
                  </div>
                </div>
              </div>
            </div>

            {/* Mémoire */}
            <div>
              <h4 className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                🧠 Mémoire
              </h4>
              <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Utilisée</span>
                  <span className="font-mono text-gray-900 dark:text-white">
                    {(performance as any).memory ? 
                      formatBytes((performance as any).memory.usedJSHeapSize) : 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
          <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
            <span>Dernière MAJ: {new Date().toLocaleTimeString()}</span>
            <button
              onClick={() => {
                const data = { healthStatus, report };
                navigator.clipboard.writeText(JSON.stringify(data, null, 2));
                alert('Données copiées dans le presse-papier');
              }}
              className="text-blue-500 hover:text-blue-700 dark:text-blue-400"
            >
              📋 Copier
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonitoringDashboard;