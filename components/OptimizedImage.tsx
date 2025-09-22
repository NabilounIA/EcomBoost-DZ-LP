import React, { useEffect, useRef } from 'react';
import useImageOptimization from '../hooks/useImageOptimization';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp' | 'jpeg' | 'png';
  lazy?: boolean;
  placeholder?: string;
  onLoad?: () => void;
  onError?: (error: string) => void;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className = '',
  width,
  height,
  quality = 80,
  format = 'webp',
  lazy = true,
  placeholder,
  onLoad,
  onError
}) => {
  const imgRef = useRef<HTMLImageElement>(null);
  const { 
    src: optimizedSrc, 
    isLoaded, 
    isLoading, 
    error,
    loadImage 
  } = useImageOptimization(src, {
    quality,
    format,
    width,
    height,
    lazy
  }) as any;

  useEffect(() => {
    if (lazy && imgRef.current) {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            loadImage();
            observer.unobserve(imgRef.current!);
          }
        },
        { rootMargin: '50px' }
      );

      observer.observe(imgRef.current);

      return () => {
        if (imgRef.current) {
          observer.unobserve(imgRef.current);
        }
      };
    }
  }, [lazy, loadImage]);

  useEffect(() => {
    if (isLoaded && onLoad) {
      onLoad();
    }
  }, [isLoaded, onLoad]);

  useEffect(() => {
    if (error && onError) {
      onError(error);
    }
  }, [error, onError]);

  const showPlaceholder = lazy && !isLoaded && !isLoading;
  const showLoader = isLoading;

  return (
    <div className={`relative ${className}`}>
      {showPlaceholder && (
        <div 
          className="w-full h-full bg-gray-200 animate-pulse flex items-center justify-center"
          style={{ width, height }}
        >
          {placeholder ? (
            <img src={placeholder} alt={alt} className="opacity-50" />
          ) : (
            <svg 
              className="w-12 h-12 text-gray-400" 
              fill="currentColor" 
              viewBox="0 0 24 24"
            >
              <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
            </svg>
          )}
        </div>
      )}

      {showLoader && (
        <div 
          className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center"
          style={{ width, height }}
        >
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      <img
        ref={imgRef}
        src={optimizedSrc}
        alt={alt}
        className={`${className} ${showPlaceholder || showLoader ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        width={width}
        height={height}
        loading={lazy ? 'lazy' : 'eager'}
        style={{
          display: showPlaceholder ? 'none' : 'block'
        }}
      />

      {error && (
        <div className="absolute inset-0 bg-red-100 flex items-center justify-center text-red-600 text-sm">
          Erreur de chargement
        </div>
      )}
    </div>
  );
};

export default OptimizedImage;