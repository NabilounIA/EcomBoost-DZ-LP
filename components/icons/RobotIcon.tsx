
import React from 'react';

export const RobotIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M12 6V3m0 18v-3m4-6h3m-3 0V9m-4 6V9m-4 6V9"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 15a3 3 0 100-6 3 3 0 000 6z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 12h.01"
    />
  </svg>
);
