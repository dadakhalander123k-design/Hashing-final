import React, { useState, useEffect } from 'react';
import {
  Target,
  BookOpen,
  Sparkles,
  Gamepad2,
  HelpCircle,
  AlertCircle,
  ArrowRight,
  ShieldAlert,
  Award,
  CheckCircle2,
} from 'lucide-react';
import { pointsManager, PointsState } from '../utils/pointsManager';
import { progressManager } from '../utils/progressManager';
import { MainViewTab } from '../types/game';
import { soundManager } from '../utils/audio';

export interface PointsViewProps {
  onNavigateToTab?: (tab: MainViewTab) => void;
}

export const PointsView: React.FC<PointsViewProps> = ({ onNavigateToTab }) => {
  const [points, setPoints] = useState<PointsState>(() => pointsManager.getPoints());
  const [stats, setStats] = useState(() => progressManager.getStats());

  useEffect(() => {
    const unsubPoints = pointsManager.subscribe((newPoints) => {
      setPoints(newPoints);
    });
    const unsubProgress = progressManager.subscribe(() => {
      setStats(progressManager.getStats());
      setPoints(pointsManager.getPoints());
    });
    return () => {
      unsubPoints();
      unsubProgress();
    };
  }, []);

  const handleNavigate = (tab: MainViewTab) => {
    soundManager.playNav();
    if (onNavigateToTab) {
      onNavigateToTab(tab);
    }
  };

  const percentage = Math.min(100, Math.max(0, points.totalPoints));

  return (
    <div className="w-full max-w-4xl mx-auto py-6 px-4 font-sans text-slate-900 dark:text-white animate-page-enter">
      {/* Header Banner */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-6 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-500/30 text-[#2563EB] dark:text-[#3B82F6] rounded-lg text-xs font-semibold uppercase tracking-wider font-mono">
            <Target className="w-3.5 h-3.5 text-[#2563EB] dark:text-[#3B82F6]" />
            <span>Scorecard</span>
          </div>
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400 font-mono">
            Max Reward Score: 100 Points
          </span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight animate-heading-enter">
          Points
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-300 max-w-2xl mt-1 leading-relaxed">
          Your current points balance out of 100, earned across Theory, Quiz, Visualization, and Game levels, with deductions applied for hints and guided solves.
        </p>
      </div>

      {/* Hero Card: Total Points Balance */}
      <div
        id="points-total-card"
        className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-xs mb-8"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="text-xs font-bold font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
              CURRENT BALANCE
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl sm:text-6xl font-black font-mono text-[#2563EB] dark:text-[#3B82F6] tracking-tight">
                {points.totalPoints}
              </span>
              <span className="text-xl sm:text-2xl font-bold font-mono text-slate-400 dark:text-slate-500">
                / 100
              </span>
              <span className="text-xs font-semibold font-mono text-slate-500 dark:text-slate-400 ml-1">
                Points
              </span>
            </div>
          </div>

          <div className="text-left sm:text-right">
            <div className="text-xs font-mono font-semibold text-slate-500 dark:text-slate-400">
              Total Score Formula
            </div>
            <div className="text-xs font-mono text-[#2563EB] dark:text-[#3B82F6] font-medium mt-0.5">
              Theory + Quiz + Visualize + Game − Penalties
            </div>
          </div>
        </div>

        {/* Progress Bar Indicator */}
        <div className="mt-6">
          <div className="flex items-center justify-between text-xs font-mono mb-2">
            <span className="text-slate-600 dark:text-slate-300 font-medium">Overall Progress</span>
            <span className="font-bold text-[#2563EB] dark:text-[#3B82F6]">{percentage}%</span>
          </div>
          <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div
              className="h-full rounded-full bg-[#2563EB] dark:bg-[#3B82F6] transition-all duration-500 ease-out"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Category Breakdown Cards */}
      <div className="mb-8">
        <h2 className="text-sm font-bold font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4">
          Reward Categories (100 Points Total)
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* 1. Theory */}
          <div
            id="points-category-theory"
            className="p-5 rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 flex flex-col justify-between shadow-2xs"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-[#2563EB] dark:text-[#3B82F6] flex items-center justify-center">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">Theory</h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">12 Modules</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold font-mono text-[#2563EB] dark:text-[#3B82F6]">
                    {points.theoryPoints}
                  </span>
                  <span className="text-xs font-mono text-slate-400"> / 24</span>
                </div>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
                Awarded +2 points for completing each module for the first time. Reopening completed modules does not duplicate points.
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
              <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                {stats.theory.completed} / 12 completed
              </span>
              {onNavigateToTab && (
                <button
                  onClick={() => handleNavigate('THEORY')}
                  className="text-xs font-semibold text-[#2563EB] dark:text-[#3B82F6] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>Open Theory</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          {/* 2. Quiz */}
          <div
            id="points-category-quiz"
            className="p-5 rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 flex flex-col justify-between shadow-2xs"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-[#2563EB] dark:text-[#3B82F6] flex items-center justify-center">
                    <HelpCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">Quiz</h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">10 Questions</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold font-mono text-[#2563EB] dark:text-[#3B82F6]">
                    {points.quizPoints}
                  </span>
                  <span className="text-xs font-mono text-slate-400"> / 20</span>
                </div>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
                Awarded +2 points for correct answers and −1 point for wrong answers. Clamped between 0 and 20 points.
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
              <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                {stats.quiz.isSubmitted ? 'Quiz Completed' : 'In Progress'}
              </span>
              {onNavigateToTab && (
                <button
                  onClick={() => handleNavigate('QUIZ')}
                  className="text-xs font-semibold text-[#2563EB] dark:text-[#3B82F6] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>Open Quiz</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          {/* 3. Visualize */}
          <div
            id="points-category-visualize"
            className="p-5 rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 flex flex-col justify-between shadow-2xs"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-[#2563EB] dark:text-[#3B82F6] flex items-center justify-center">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">Visualize</h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">2 Modules</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold font-mono text-[#2563EB] dark:text-[#3B82F6]">
                    {points.visualizePoints}
                  </span>
                  <span className="text-xs font-mono text-slate-400"> / 6</span>
                </div>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
                Awarded +3 points for completing each module for the first time. Revisiting completed visualizations does not duplicate points.
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
              <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                {stats.video.completed} / 2 completed
              </span>
              {onNavigateToTab && (
                <button
                  onClick={() => handleNavigate('VIDEO')}
                  className="text-xs font-semibold text-[#2563EB] dark:text-[#3B82F6] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>Open Visualize</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          {/* 4. Game */}
          <div
            id="points-category-game"
            className="p-5 rounded-xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 flex flex-col justify-between shadow-2xs"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-[#2563EB] dark:text-[#3B82F6] flex items-center justify-center">
                    <Gamepad2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">Game</h3>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">5 Levels</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold font-mono text-[#2563EB] dark:text-[#3B82F6]">
                    {points.gamePoints}
                  </span>
                  <span className="text-xs font-mono text-slate-400"> / 50</span>
                </div>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
                Awarded +10 points for completing each level for the first time. Replaying completed levels does not duplicate points.
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
              <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                {stats.game.completed} / 5 completed
              </span>
              {onNavigateToTab && (
                <button
                  onClick={() => handleNavigate('GAME')}
                  className="text-xs font-semibold text-[#2563EB] dark:text-[#3B82F6] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <span>Play Game</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Penalties & Deductions Section */}
      <div className="mb-8">
        <h2 className="text-sm font-bold font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4">
          Penalties & Deductions
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Hint Penalties */}
          <div
            id="points-penalty-hints"
            className="p-5 rounded-xl bg-white dark:bg-[#111827] border border-rose-200 dark:border-rose-900/40 shadow-2xs"
          >
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                  <AlertCircle className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Hint Penalties</h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                    {points.hintUsesCount} {points.hintUsesCount === 1 ? 'use' : 'uses'} recorded
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-lg font-bold font-mono text-rose-600 dark:text-rose-400">
                  −{points.hintPenalties}
                </span>
                <span className="text-xs font-mono text-slate-400"> pts</span>
              </div>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Deducts 2 points for every genuine hint activation. Repeated uses in the same level apply additional −2 point penalties.
            </p>
          </div>

          {/* Guided-Solve Penalties */}
          <div
            id="points-penalty-guided-solve"
            className="p-5 rounded-xl bg-white dark:bg-[#111827] border border-rose-200 dark:border-rose-900/40 shadow-2xs"
          >
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                  <ShieldAlert className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Guided-Solve Penalties</h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                    {points.guidedSolveUsesCount} {points.guidedSolveUsesCount === 1 ? 'use' : 'uses'} recorded
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-lg font-bold font-mono text-rose-600 dark:text-rose-400">
                  −{points.guidedSolvePenalties}
                </span>
                <span className="text-xs font-mono text-slate-400"> pts</span>
              </div>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Deducts 3 points for every genuine guided-solve activation. Repeated uses in the same level apply additional −3 point penalties.
            </p>
          </div>
        </div>
      </div>

      {/* Structured Points Breakdown Table */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-xs">
        <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4">
          Audit Breakdown
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400">
                <th className="py-2 pr-4 font-semibold">Category</th>
                <th className="py-2 px-4 font-semibold text-center">Max Capacity</th>
                <th className="py-2 px-4 font-semibold text-center">Rules</th>
                <th className="py-2 pl-4 font-semibold text-right">Points Earned / Deducted</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              <tr>
                <td className="py-2.5 pr-4 font-bold text-slate-900 dark:text-white">Theory Modules</td>
                <td className="py-2.5 px-4 text-center">24 pts</td>
                <td className="py-2.5 px-4 text-center text-slate-500 dark:text-slate-400">12 × 2 pts</td>
                <td className="py-2.5 pl-4 text-right font-bold text-emerald-600 dark:text-emerald-400">
                  +{points.theoryPoints}
                </td>
              </tr>
              <tr>
                <td className="py-2.5 pr-4 font-bold text-slate-900 dark:text-white">Quiz Assessment</td>
                <td className="py-2.5 px-4 text-center">20 pts</td>
                <td className="py-2.5 px-4 text-center text-slate-500 dark:text-slate-400">+2 correct, −1 wrong</td>
                <td className="py-2.5 pl-4 text-right font-bold text-emerald-600 dark:text-emerald-400">
                  +{points.quizPoints}
                </td>
              </tr>
              <tr>
                <td className="py-2.5 pr-4 font-bold text-slate-900 dark:text-white">Visualization Modules</td>
                <td className="py-2.5 px-4 text-center">6 pts</td>
                <td className="py-2.5 px-4 text-center text-slate-500 dark:text-slate-400">2 × 3 pts</td>
                <td className="py-2.5 pl-4 text-right font-bold text-emerald-600 dark:text-emerald-400">
                  +{points.visualizePoints}
                </td>
              </tr>
              <tr>
                <td className="py-2.5 pr-4 font-bold text-slate-900 dark:text-white">Game Levels</td>
                <td className="py-2.5 px-4 text-center">50 pts</td>
                <td className="py-2.5 px-4 text-center text-slate-500 dark:text-slate-400">5 × 10 pts</td>
                <td className="py-2.5 pl-4 text-right font-bold text-emerald-600 dark:text-emerald-400">
                  +{points.gamePoints}
                </td>
              </tr>
              <tr>
                <td className="py-2.5 pr-4 font-bold text-slate-900 dark:text-white">Hint Penalties</td>
                <td className="py-2.5 px-4 text-center text-slate-400">—</td>
                <td className="py-2.5 px-4 text-center text-slate-500 dark:text-slate-400">−2 pts per use</td>
                <td className="py-2.5 pl-4 text-right font-bold text-rose-600 dark:text-rose-400">
                  −{points.hintPenalties}
                </td>
              </tr>
              <tr>
                <td className="py-2.5 pr-4 font-bold text-slate-900 dark:text-white">Guided-Solve Penalties</td>
                <td className="py-2.5 px-4 text-center text-slate-400">—</td>
                <td className="py-2.5 px-4 text-center text-slate-500 dark:text-slate-400">−3 pts per use</td>
                <td className="py-2.5 pl-4 text-right font-bold text-rose-600 dark:text-rose-400">
                  −{points.guidedSolvePenalties}
                </td>
              </tr>
              <tr className="border-t-2 border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/40">
                <td className="py-3 pr-4 font-bold text-sm text-slate-900 dark:text-white">Total Points</td>
                <td className="py-3 px-4 text-center font-bold">100 pts</td>
                <td className="py-3 px-4 text-center text-slate-500 dark:text-slate-400">Range: [0, 100]</td>
                <td className="py-3 pl-4 text-right font-black text-base text-[#2563EB] dark:text-[#3B82F6]">
                  {points.totalPoints} / 100
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
