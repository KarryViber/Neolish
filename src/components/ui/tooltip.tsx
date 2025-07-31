'use client';

import { useState, ReactNode } from 'react';

interface TooltipProps {
  content: string;
  children: ReactNode;
  className?: string;
  side?: 'top' | 'bottom' | 'left' | 'right';
}

export function Tooltip({ content, children, className = '', side = 'top' }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  if (!content) return <>{children}</>;

  const getTooltipPosition = () => {
    switch (side) {
      case 'bottom':
        return 'top-full left-1/2 transform -translate-x-1/2 mt-2';
      case 'left':
        return 'right-full top-1/2 transform -translate-y-1/2 mr-2';
      case 'right':
        return 'left-full top-1/2 transform -translate-y-1/2 ml-2';
      default: // top
        return 'bottom-full left-1/2 transform -translate-x-1/2 mb-2';
    }
  };

  const getArrowPosition = () => {
    switch (side) {
      case 'bottom':
        return 'bottom-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-b-gray-900';
      case 'left':
        return 'left-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-l-gray-900';
      case 'right':
        return 'right-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-r-gray-900';
      default: // top
        return 'top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900';
    }
  };

  return (
    <div 
      className={`relative inline-block ${className}`}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div className={`absolute ${getTooltipPosition()} z-50`}>
          <div className="bg-gray-900 text-white text-xs rounded-md py-2 px-3 max-w-xs shadow-lg whitespace-pre-wrap break-words">
            {content}
            <div className={`absolute ${getArrowPosition()}`}></div>
          </div>
        </div>
      )}
    </div>
  );
} 