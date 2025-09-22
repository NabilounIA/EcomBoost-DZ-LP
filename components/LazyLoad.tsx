import React, { useState, useEffect, useRef, ReactNode } from 'react';

interface LazyLoadProps {
  children: ReactNode;
  fallback?: ReactNode;
  rootMargin?: string;
  threshold?: number;
  className?: string;
}

const LazyLoad: React.FC<LazyLoadProps> = ({
  children,
  fallback = <div className="animate-pulse bg-gray-200 rounded h-64"></div>,
  rootMargin = '50px',
  threshold = 0.1,
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasLoaded) {
          setIsVisible(true);
          setHasLoaded(true);
          // Disconnect observer after loading
          if (elementRef.current) {
            observer.unobserve(elementRef.current);
          }
        }
      },
      {
        rootMargin,
        threshold
      }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, [rootMargin, threshold, hasLoaded]);

  return (
    <div ref={elementRef} className={className}>
      {isVisible || hasLoaded ? children : fallback}
    </div>
  );
};

export default LazyLoad;