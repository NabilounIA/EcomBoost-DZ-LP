import React from 'react';
import { useTheme } from '../contexts/ThemeContext';


interface ThemeToggleProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ 
  className = '', 
  size = 'md',
  showLabel = false 
}) => {
  const { theme, toggleTheme } = useTheme();


  const handleToggle = () => {
    toggleTheme();
  };

  const sizeClasses = {
    sm: 'w-10 h-6',
    md: 'w-12 h-7',
    lg: 'w-14 h-8'
  };

  const dotSizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const translateClasses = {
    sm: theme === 'dark' ? 'translate-x-4' : 'translate-x-1',
    md: theme === 'dark' ? 'translate-x-5' : 'translate-x-1',
    lg: theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
  };

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      {showLabel && (
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {theme === 'light' ? '☀️ Clair' : '🌙 Sombre'}
        </span>
      )}
      
      <button
        onClick={handleToggle}
        className={`
          relative inline-flex ${sizeClasses[size]} items-center rounded-full 
          transition-colors duration-300 ease-in-out focus:outline-none 
          focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
          ${theme === 'dark' 
            ? 'bg-blue-600 hover:bg-blue-700' 
            : 'bg-gray-200 hover:bg-gray-300'
          }
        `}
        role="switch"
        aria-checked={theme === 'dark'}
        aria-label={`Basculer vers le mode ${theme === 'light' ? 'sombre' : 'clair'}`}
      >
        {/* Dot/Circle */}
        <span
          className={`
            ${dotSizeClasses[size]} inline-block rounded-full bg-white 
            shadow-lg transform transition-transform duration-300 ease-in-out
            ${translateClasses[size]}
            flex items-center justify-center
          `}
        >
          {/* Icon inside the dot */}
          {theme === 'dark' ? (
            <svg className="w-3 h-3 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z"/>
            </svg>
          ) : (
            <svg className="w-3 h-3 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12,2.25a.75.75,0,0,0-.75.75v1.5a.75.75,0,0,0,1.5,0V3A.75.75,0,0,0,12,2.25ZM7.5,12A4.5,4.5,0,1,1,12,16.5,4.51,4.51,0,0,1,7.5,12Zm12.75,0a.75.75,0,0,0-.75-.75H18a.75.75,0,0,0,0,1.5h1.5A.75.75,0,0,0,20.25,12ZM12,19.5a.75.75,0,0,0-.75.75v1.5a.75.75,0,0,0,1.5,0V20.25A.75.75,0,0,0,12,19.5Zm-7.28-2.22a.75.75,0,0,0,0,1.06l1.06,1.06a.75.75,0,1,0,1.06-1.06L5.78,17.28a.75.75,0,0,0-1.06,0Zm12.02-12.02a.75.75,0,0,0,1.06,0l1.06-1.06a.75.75,0,1,0-1.06-1.06L16.74,4.22a.75.75,0,0,0,0,1.06ZM6,12a.75.75,0,0,0-.75-.75H3.75a.75.75,0,0,0,0,1.5H5.25A.75.75,0,0,0,6,12ZM4.22,17.28a.75.75,0,0,0,1.06,1.06L6.34,17.28a.75.75,0,1,0-1.06-1.06Z"/>
            </svg>
          )}
        </span>
      </button>
    </div>
  );
};

export default ThemeToggle;