import React from 'react';

export interface AlgoLearnLogoProps {
  theme?: 'light' | 'dark';
  className?: string;
  onClick?: () => void;
}

export const AlgoLearnLogo: React.FC<AlgoLearnLogoProps> = ({
  theme = 'light',
  className = 'h-7.5 sm:h-8.5 w-auto',
  onClick,
}) => {
  const isDark = theme === 'dark';

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center select-none cursor-pointer transition-all duration-200 hover:opacity-95 shrink-0 ${className}`}
      title="AlgoLearn - YOUR DSA JOURNEY"
      aria-label="AlgoLearn Logo"
    >
      <img
        src={isDark ? '/algolearn-logo-dark.png' : '/algolearn-logo-cropped.png'}
        alt="AlgoLearn - YOUR DSA JOURNEY"
        className="h-full w-auto max-h-8 sm:max-h-8.5 object-contain select-none pointer-events-none"
        draggable={false}
      />
    </div>
  );
};
