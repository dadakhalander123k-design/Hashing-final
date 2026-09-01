import React from 'react';
import {
  Menu,
  Volume2,
  VolumeX,
  RotateCcw,
  Flame,
  Moon,
  Sun,
} from 'lucide-react';
import { MainViewTab, TechniqueType } from '../types/game';
import { soundManager } from '../utils/audio';
import { useTheme } from '../utils/themeContext';

export interface TopHeaderProps {
  activeTab: MainViewTab;
  currentLevelId: number;
  score: number;
  streak: number;
  technique: TechniqueType;
  isMuted: boolean;
  onToggleMute: () => void;
  speed?: number;
  onChangeSpeed?: (newSpeed: number) => void;
  onResetLevel: () => void;
  onResetAllProgress: () => void;
  onToggleMobileSidebar: () => void;
  onOpenHelpModal?: () => void;
  onOpenSettingsModal?: () => void;
  isDesktopSidebarOpen?: boolean;
}

export const TopHeader: React.FC<TopHeaderProps> = ({
  activeTab,
  currentLevelId,
  score,
  streak,
  technique,
  isMuted,
  onToggleMute,
  speed,
  onChangeSpeed,
  onResetLevel,
  onResetAllProgress,
  onToggleMobileSidebar,
  isDesktopSidebarOpen = true,
}) => {
  const { theme, toggleTheme } = useTheme();

  const getPageName = () => {
    switch (activeTab) {
      case 'HOME':
        return 'Overview';
      case 'THEORY':
        return 'Learn';
      case 'VIDEO':
        return 'Visualize';
      case 'GAME':
      case 'QUEST':
        return 'Game';
      case 'LAB':
        return 'Lab';
      case 'QUIZ':
        return 'Quiz';
      case 'PROGRESS':
        return 'Progress';
      default:
        return 'Learn';
    }
  };

  const pageName = getPageName();
  const isGameMode = activeTab === 'GAME' || activeTab === 'QUEST';

  return (
    <header
      id="app-top-header"
      className={`fixed top-0 right-0 left-0 ${
        isDesktopSidebarOpen ? 'lg:left-64' : 'lg:left-0'
      } z-20 bg-white dark:bg-[#070B18]/95 border-b border-slate-200 dark:border-purple-500/20 shadow-xs backdrop-blur-md transition-all duration-300`}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between gap-2 sm:gap-4">
        {/* Left Side: 1. Three-Bar Menu Button -> 2. Logo -> 3. AlgoLearn -> 4. Current Page */}
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          {/* 1. THREE-BAR MENU BUTTON */}
          <button
            id="btn-sidebar-toggle"
            onClick={onToggleMobileSidebar}
            className="p-1.5 sm:p-2 text-slate-600 dark:text-purple-300 hover:text-slate-900 dark:hover:text-white bg-slate-100/80 dark:bg-purple-950/40 hover:bg-slate-200/80 dark:hover:bg-purple-900/50 border border-slate-200 dark:border-purple-500/30 rounded-xl transition-all duration-150 cursor-pointer shrink-0 shadow-xs flex items-center justify-center"
            title="Toggle Navigation Menu (☰)"
            aria-label="Toggle navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* 2. LOGO / BRAND ICON */}
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#EEF2FF] dark:bg-purple-600 text-[#4F46E5] dark:text-white border border-[#E0E7FF] dark:border-purple-500/30 flex items-center justify-center font-bold text-base sm:text-lg shadow-xs shrink-0 select-none">
            #
          </div>

          {/* 3. ALGOLEARN (PRIMARY) + 4. CURRENT PAGE (SECONDARY / SUBORDINATE) */}
          <div className="flex flex-col min-w-0 select-none justify-center">
            <span className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-slate-100 font-sans tracking-tight leading-none">
              AlgoLearn
            </span>
            <span className="text-[11px] sm:text-xs font-semibold text-indigo-600 dark:text-purple-300 font-sans tracking-wide leading-tight mt-0.5">
              {pageName}
            </span>
          </div>
        </div>

        {/* Right Side: Essential Utilities (Theme, Mute, Reset) - NO XP/PTS */}
        <div className="flex items-center gap-1 sm:gap-2.5 shrink-0">
          {/* Streak Pill (in game mode) */}
          {streak > 0 && isGameMode && (
            <div
              id="header-stat-streak"
              className="flex items-center gap-1 px-1.5 sm:px-2 py-1.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-500/30 rounded-xl text-xs font-semibold text-amber-800 dark:text-amber-300 shadow-xs animate-fadeIn"
              title="Current Correct Streak"
            >
              <Flame className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span className="font-mono font-bold">{streak}</span>
            </div>
          )}

          {/* Theme Mode Toggle */}
          <button
            id="btn-theme-toggle"
            onClick={() => {
              soundManager.playToggle(theme !== 'dark');
              toggleTheme();
            }}
            className="p-1.5 sm:p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-purple-950/40 border border-slate-200 dark:border-purple-500/30 rounded-xl transition-all cursor-pointer shadow-xs dark:shadow-[0_0_12px_rgba(124,58,237,0.2)]"
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700" />
            )}
          </button>

          {/* Sound Mute Toggle */}
          <button
            id="btn-header-mute"
            onClick={onToggleMute}
            className="p-1.5 sm:p-2 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-purple-950/40 border border-slate-200 dark:border-purple-500/30 rounded-xl transition-colors cursor-pointer shadow-xs"
            title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
            aria-label={isMuted ? 'Unmute Audio' : 'Mute Audio'}
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 text-slate-400" />
            ) : (
              <Volume2 className="w-4 h-4 text-indigo-600 dark:text-purple-400" />
            )}
          </button>

          {/* Reset Progress Button */}
          <button
            id="btn-header-reset-progress"
            onClick={() => {
              soundManager.playModalOpen();
              onResetAllProgress();
            }}
            className="p-1.5 sm:p-2 text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-slate-200 dark:border-purple-500/30 rounded-xl transition-colors cursor-pointer shadow-xs"
            title="Reset Progress"
            aria-label="Reset Progress"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
