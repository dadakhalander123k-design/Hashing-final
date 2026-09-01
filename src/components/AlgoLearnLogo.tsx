import React from 'react';

export interface AlgoLearnLogoProps {
  theme?: 'light' | 'dark';
  className?: string;
  onClick?: () => void;
}

export const AlgoLearnLogo: React.FC<AlgoLearnLogoProps> = ({
  theme = 'light',
  className = 'h-9 w-auto',
  onClick,
}) => {
  const isDark = theme === 'dark';

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center select-none cursor-pointer transition-opacity duration-200 hover:opacity-95 ${className}`}
      title="AlgoLearn - YOUR DSA JOURNEY"
      aria-label="AlgoLearn Logo"
    >
      <svg
        viewBox="0 0 340 88"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-full w-auto max-h-9 overflow-visible"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {/* Gradients for Graduation Cap */}
          {/* 1. Mortarboard Top (Diamond) */}
          <linearGradient id="capTopGradLight" x1="12" y1="12" x2="88" y2="60" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#0B1E5C" />
            <stop offset="45%" stopColor="#1D4ED8" />
            <stop offset="100%" stopColor="#2563EB" />
          </linearGradient>

          <linearGradient id="capTopGradDark" x1="12" y1="12" x2="88" y2="60" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#0D256B" />
            <stop offset="50%" stopColor="#1E40AF" />
            <stop offset="100%" stopColor="#2563EB" />
          </linearGradient>

          {/* Mortarboard Edge Highlight */}
          <linearGradient id="capEdgeGlow" x1="10" y1="36" x2="52" y2="12" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor={isDark ? "#38BDF8" : "#93C5FD"} stopOpacity={isDark ? "0.9" : "0.7"} />
            <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.2" />
          </linearGradient>

          {/* 2. Cap Base / Lower Section (Vibrant Violet -> Royal Blue -> Electric Cyan) */}
          <linearGradient id="capBaseGradLight" x1="26" y1="52" x2="78" y2="82" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#7C3AED" />
            <stop offset="45%" stopColor="#2563EB" />
            <stop offset="100%" stopColor="#06B6D4" />
          </linearGradient>

          <linearGradient id="capBaseGradDark" x1="26" y1="52" x2="78" y2="82" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#9333EA" />
            <stop offset="40%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#00E5FF" />
          </linearGradient>

          {/* 3. Tassel Gradient */}
          <linearGradient id="tasselGrad" x1="82" y1="38" x2="82" y2="76" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#1D4ED8" />
          </linearGradient>

          {/* 4. Wordmark 'Learn' Gradient */}
          <linearGradient id="learnGradLight" x1="190" y1="24" x2="310" y2="48" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#1D4ED8" />
            <stop offset="45%" stopColor="#2563EB" />
            <stop offset="100%" stopColor="#7C3AED" />
          </linearGradient>

          <linearGradient id="learnGradDark" x1="190" y1="24" x2="310" y2="48" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="45%" stopColor="#60A5FA" />
            <stop offset="100%" stopColor="#A855F7" />
          </linearGradient>

          {/* Dark Mode Glow Filters */}
          {isDark && (
            <filter id="capGlowDark" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#3B82F6" floodOpacity="0.35" />
            </filter>
          )}
        </defs>

        {/* =================== GRADUATION CAP ICON =================== */}
        <g id="graduation-cap-symbol" filter={isDark ? "url(#capGlowDark)" : undefined}>
          {/* Lower Cap Base (Underneath Mortarboard) */}
          {/* 3D Curved Neck Base */}
          <path
            d="M 28,52 L 28,66 C 28,76 38,82 52,82 C 66,82 76,76 76,66 L 76,52 C 69,57 60,60 52,60 C 44,60 35,57 28,52 Z"
            fill={isDark ? "url(#capBaseGradDark)" : "url(#capBaseGradLight)"}
          />
          
          {/* Base Inner Depth shadow */}
          <path
            d="M 28,52 C 35,57 44,60 52,60 C 60,60 69,57 76,52 L 76,55 C 69,60 60,63 52,63 C 44,63 35,60 28,55 Z"
            fill="#000000"
            fillOpacity={isDark ? "0.3" : "0.2"}
          />

          {/* 3D Mortarboard Underside / Thickness Rim */}
          <path
            d="M 12,38.5 L 50,59 Q 52,60 54,59 L 92,38.5 L 92,42.5 L 54,63 Q 52,64 50,63 L 12,42.5 Z"
            fill={isDark ? "#061338" : "#0A1B4E"}
          />

          {/* Mortarboard Top (Diamond Shape) */}
          <path
            d="M 49,15.5 Q 52,14 55,15.5 L 91.5,35.5 Q 93.5,36.7 91.5,38 L 55,57.5 Q 52,59 49,57.5 L 12.5,38 Q 10.5,36.7 12.5,35.5 Z"
            fill={isDark ? "url(#capTopGradDark)" : "url(#capTopGradLight)"}
          />

          {/* Top Edge Highlight / Reflection Stroke */}
          <path
            d="M 12.5,35.5 L 49,15.5 Q 52,14 55,15.5 L 91.5,35.5"
            stroke="url(#capEdgeGlow)"
            strokeWidth="1.75"
            strokeLinecap="round"
          />

          {/* Central Mortarboard Button */}
          <ellipse
            cx="52"
            cy="36.5"
            rx="3"
            ry="2"
            fill={isDark ? "#60A5FA" : "#93C5FD"}
          />

          {/* Tassel Cord */}
          <path
            d="M 52,37 Q 72,36 82,44 L 82,56"
            stroke={isDark ? "#60A5FA" : "#2563EB"}
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />

          {/* Tassel Bob Ring/Bead */}
          <circle
            cx="82"
            cy="56"
            r="2"
            fill={isDark ? "#38BDF8" : "#1D4ED8"}
          />

          {/* Tassel Bob / Teardrop */}
          <path
            d="M 80.5,57.5 C 79,62 78.5,67 80,72 C 81,74.5 83,74.5 84,72 C 85.5,67 85,62 83.5,57.5 Z"
            fill="url(#tasselGrad)"
          />
        </g>

        {/* =================== WORDMARK & TAGLINE =================== */}
        <g id="algolearn-branding">
          {/* 'Algo' */}
          <text
            x="112"
            y="48"
            fontFamily="Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
            fontSize="41"
            fontWeight="800"
            letterSpacing="-0.025em"
            fill={isDark ? "#FFFFFF" : "#0B132B"}
          >
            Algo
          </text>

          {/* 'Learn' */}
          <text
            x="208"
            y="48"
            fontFamily="Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
            fontSize="41"
            fontWeight="800"
            letterSpacing="-0.025em"
            fill={isDark ? "url(#learnGradDark)" : "url(#learnGradLight)"}
          >
            Learn
          </text>

          {/* Tagline: 'YOUR DSA JOURNEY' */}
          <text
            x="114"
            y="72"
            fontFamily="Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
            fontSize="12.5"
            fontWeight="700"
            letterSpacing="0.28em"
            fill={isDark ? "#8193B0" : "#506280"}
          >
            YOUR DSA JOURNEY
          </text>
        </g>
      </svg>
    </div>
  );
};
