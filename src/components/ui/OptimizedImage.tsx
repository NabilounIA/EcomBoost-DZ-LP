import React, { useState, useRef, useEffect } from 'react';
import { useIntersectionObserver } from '../../utils/lazyLoading';
import { ImageFallback } from './LazyFallback';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  sizes?: string;
  priority?: boolean;
  quality?: number;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  onLoad?: () => void;
  onError?: () => void;
  loading?: 'lazy' | 'eager';
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
}

/**
 * Composant d'image optimisé avec support WebP, lazy loading et images responsives
 */
export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  className = '',
  sizes,
  priority = false,
  quality = 75,
  placeholder = 'empty',
  blurDataURL,
  onLoad,
  onError,
  loading = 'lazy',
  objectFit = 'cover',
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(priority);
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Intersection Observer pour le lazy loading
  const observeIntersection = useIntersectionObserver(
    () => setShouldLoad(true),
    { rootMargin: '50px' }
  );

  useEffect(() => {
    if (!priority && containerRef.current) {
      observeIntersection(containerRef.current);
    }
  }, [priority, observeIntersection]);

  // Générer les sources d'images optimisées
  const generateSources = (baseSrc: string) => {
    const sources = [];
    
    // Support WebP
    if (supportsWebP()) {
      sources.push({
        srcSet: generateSrcSet(baseSrc, 'webp'),
        type: 'image/webp',
      });
    }

    // Support AVIF (plus moderne)
    if (supportsAVIF()) {
      sources.unshift({
        srcSet: generateSrcSet(baseSrc, 'avif'),
        type: 'image/avif',
      });
    }

    // Format original en fallback
    sources.push({
      srcSet: generateSrcSet(baseSrc),
      type: getImageType(baseSrc),
    });

    return sources;
  };

  // Générer le srcSet pour différentes tailles
  const generateSrcSet = (baseSrc: string, format?: string) => {
    const breakpoints = [320, 640, 768, 1024, 1280, 1920];
    const extension = format || getFileExtension(baseSrc);
    const baseName = baseSrc.replace(/\.[^/.]+$/, '');

    return breakpoints
      .map(bp => {
        const optimizedSrc = `${baseName}_${bp}w.${extension}`;
        return `${optimizedSrc} ${bp}w`;
      })
      .join(', ');
  };

  // Gestionnaires d'événements
  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setIsError(true);
    onError?.();
  };

  // Classes CSS
  const imageClasses = `
    transition-opacity duration-300 ease-in-out
    ${isLoaded ? 'opacity-100' : 'opacity-0'}
    ${className}
  `;

  const containerClasses = `
    relative overflow-hidden
    ${!isLoaded && placeholder === 'blur' ? 'bg-gray-200 dark:bg-gray-700' : ''}
  `;

  // Styles inline
  const imageStyles: React.CSSProperties = {
    objectFit,
    width: width ? `${width}px` : '100%',
    height: height ? `${height}px` : 'auto',
  };

  const containerStyles: React.CSSProperties = {
    width: width ? `${width}px` : '100%',
    height: height ? `${height}px` : 'auto',
    aspectRatio: width && height ? `${width}/${height}` : undefined,
  };

  // Placeholder blur
  const blurStyle: React.CSSProperties = placeholder === 'blur' && blurDataURL ? {
    backgroundImage: `url(${blurDataURL})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    filter: 'blur(10px)',
    transform: 'scale(1.1)',
  } : {};

  if (isError) {
    return (
      <div 
        ref={containerRef}
        className={`${containerClasses} ${className}`}
        style={containerStyles}
      >
        <ImageFallback height={height ? `${height}px` : '200px'} />
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className={containerClasses}
      style={containerStyles}
    >
      {/* Placeholder blur */}
      {placeholder === 'blur' && !isLoaded && (
        <div
          className="absolute inset-0"
          style={blurStyle}
        />
      )}

      {/* Skeleton loader */}
      {!isLoaded && placeholder === 'empty' && (
        <ImageFallback height={height ? `${height}px` : '100%'} />
      )}

      {/* Image optimisée */}
      {shouldLoad && (
        <picture>
          {generateSources(src).map((source, index) => (
            <source
              key={index}
              srcSet={source.srcSet}
              type={source.type}
              sizes={sizes}
            />
          ))}
          <img
            ref={imgRef}
            src={src}
            alt={alt}
            className={imageClasses}
            style={imageStyles}
            loading={loading}
            onLoad={handleLoad}
            onError={handleError}
            decoding="async"
            fetchPriority={priority ? 'high' : 'auto'}
          />
        </picture>
      )}
    </div>
  );
};

// Fonctions utilitaires

/**
 * Vérifier le support WebP
 */
function supportsWebP(): boolean {
  if (typeof window === 'undefined') return false;
  
  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  
  return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
}

/**
 * Vérifier le support AVIF
 */
function supportsAVIF(): boolean {
  if (typeof window === 'undefined') return false;
  
  const avif = new Image();
  avif.src = 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgABogQEAwgMg8f8D///8WfhwB8+ErK42A=';
  
  return avif.complete && avif.naturalWidth > 0;
}

/**
 * Obtenir l'extension du fichier
 */
function getFileExtension(src: string): string {
  const match = src.match(/\.([^.]+)$/);
  return match ? match[1] : 'jpg';
}

/**
 * Obtenir le type MIME de l'image
 */
function getImageType(src: string): string {
  const extension = getFileExtension(src).toLowerCase();
  const types: Record<string, string> = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    svg: 'image/svg+xml',
    webp: 'image/webp',
    avif: 'image/avif',
  };
  
  return types[extension] || 'image/jpeg';
}

export default OptimizedImage;