import React from 'react';

interface LazyFallbackProps {
  type?: 'section' | 'card' | 'button' | 'text' | 'image';
  height?: string;
  className?: string;
  showPulse?: boolean;
}

/**
 * Composant de fallback optimisé pour le lazy loading
 * Utilise des skeleton screens pour une meilleure UX
 */
export const LazyFallback: React.FC<LazyFallbackProps> = ({
  type = 'section',
  height = 'auto',
  className = '',
  showPulse = true,
}) => {
  const baseClasses = `
    bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 
    dark:from-gray-700 dark:via-gray-600 dark:to-gray-700
    ${showPulse ? 'animate-pulse' : ''}
    ${className}
  `;

  const renderSkeleton = () => {
    switch (type) {
      case 'section':
        return (
          <div className={`${baseClasses} rounded-lg p-8`} style={{ height }}>
            <div className="space-y-4">
              <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-5/6"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-4/6"></div>
              </div>
            </div>
          </div>
        );

      case 'card':
        return (
          <div className={`${baseClasses} rounded-lg p-6`} style={{ height }}>
            <div className="space-y-4">
              <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
              </div>
              <div className="h-10 bg-gray-300 dark:bg-gray-600 rounded w-1/3"></div>
            </div>
          </div>
        );

      case 'button':
        return (
          <div 
            className={`${baseClasses} rounded-lg h-12 w-32`}
            style={{ height }}
          ></div>
        );

      case 'text':
        return (
          <div className="space-y-2">
            <div className={`${baseClasses} h-4 rounded w-full`}></div>
            <div className={`${baseClasses} h-4 rounded w-5/6`}></div>
            <div className={`${baseClasses} h-4 rounded w-4/6`}></div>
          </div>
        );

      case 'image':
        return (
          <div 
            className={`${baseClasses} rounded-lg flex items-center justify-center`}
            style={{ height: height || '200px' }}
          >
            <svg 
              className="w-12 h-12 text-gray-400 dark:text-gray-500" 
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path 
                fillRule="evenodd" 
                d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" 
                clipRule="evenodd" 
              />
            </svg>
          </div>
        );

      default:
        return (
          <div className={`${baseClasses} rounded-lg h-32`} style={{ height }}></div>
        );
    }
  };

  return (
    <div className="lazy-fallback" role="status" aria-label="Chargement en cours...">
      {renderSkeleton()}
      <span className="sr-only">Chargement en cours...</span>
    </div>
  );
};

/**
 * Fallbacks spécialisés pour différents types de contenu
 */
export const SectionFallback: React.FC<{ height?: string }> = ({ height = '400px' }) => (
  <LazyFallback type="section" height={height} />
);

export const CardFallback: React.FC<{ height?: string }> = ({ height = '300px' }) => (
  <LazyFallback type="card" height={height} />
);

export const ButtonFallback: React.FC = () => (
  <LazyFallback type="button" />
);

export const TextFallback: React.FC = () => (
  <LazyFallback type="text" showPulse={false} />
);

export const ImageFallback: React.FC<{ height?: string }> = ({ height }) => (
  <LazyFallback type="image" height={height} />
);

export default LazyFallback;