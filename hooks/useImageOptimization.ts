import { useState, useEffect, useCallback } from 'react';

interface ImageOptimizationOptions {
  quality?: number;
  format?: 'webp' | 'jpeg' | 'png';
  width?: number;
  height?: number;
  lazy?: boolean;
}

interface OptimizedImage {
  src: string;
  isLoaded: boolean;
  isLoading: boolean;
  error: string | null;
}

export const useImageOptimization = (
  originalSrc: string,
  options: ImageOptimizationOptions = {}
): OptimizedImage => {
  const [src, setSrc] = useState<string>('');
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const {
    quality = 80,
    format = 'webp',
    width,
    height,
    lazy = true
  } = options;

  const optimizeImage = useCallback(async (imageSrc: string) => {
    if (!imageSrc) return;

    setIsLoading(true);
    setError(null);

    try {
      // Pour une vraie application, vous utiliseriez un service comme Cloudinary, ImageKit, etc.
      // Ici, nous simulons l'optimisation d'image
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Calculer les nouvelles dimensions
        const aspectRatio = img.width / img.height;
        let newWidth = width || img.width;
        let newHeight = height || img.height;

        if (width && !height) {
          newHeight = width / aspectRatio;
        } else if (height && !width) {
          newWidth = height * aspectRatio;
        }

        canvas.width = newWidth;
        canvas.height = newHeight;

        // Dessiner l'image redimensionnée
        ctx?.drawImage(img, 0, 0, newWidth, newHeight);

        // Convertir au format souhaité avec compression
        const mimeType = format === 'webp' ? 'image/webp' : 
                        format === 'jpeg' ? 'image/jpeg' : 'image/png';
        
        const optimizedDataUrl = canvas.toDataURL(mimeType, quality / 100);
        
        setSrc(optimizedDataUrl);
        setIsLoaded(true);
        setIsLoading(false);
      };

      img.onerror = () => {
        setError('Erreur lors du chargement de l\'image');
        setIsLoading(false);
        // Fallback vers l'image originale
        setSrc(imageSrc);
      };

      img.src = imageSrc;
    } catch (err) {
      setError('Erreur lors de l\'optimisation de l\'image');
      setIsLoading(false);
      setSrc(imageSrc); // Fallback
    }
  }, [quality, format, width, height]);

  useEffect(() => {
    if (originalSrc && !lazy) {
      optimizeImage(originalSrc);
    }
  }, [originalSrc, lazy, optimizeImage]);

  const loadImage = useCallback(() => {
    if (originalSrc && lazy && !isLoaded && !isLoading) {
      optimizeImage(originalSrc);
    }
  }, [originalSrc, lazy, isLoaded, isLoading, optimizeImage]);

  return {
    src: src || originalSrc,
    isLoaded,
    isLoading,
    error,
    loadImage
  } as OptimizedImage & { loadImage: () => void };
};

export default useImageOptimization;