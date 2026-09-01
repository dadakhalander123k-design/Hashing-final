import React, { useState, useEffect, useMemo } from 'react';
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  Award,
  RotateCcw,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  BookOpen,
  Gamepad2,
  Check,
  Star,
  Layers,
  ChevronRight,
  ListOrdered,
  Trophy,
} from 'lucide-react';
import { progressManager } from '../utils/progressManager';
import { soundManager } from '../utils/audio';
import { useScrollReveal } from '../hooks/useScrollReveal';

export interface QuizViewProps {
  onNavigateToTheory: (chapterId?: string) => void;
  onNavigateToQuest: (levelId?: number) => void;
  onNavigateToProgress: () => void;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  correctAnswerText: string;
  explanation: string;
  exampleSnippet?: string;
  techniqueCode: string;
  targetChapterId?: string;
  targetLevelId?: number;
}

export interface StudentAnswerRecord {
  questionId: number;
  selectedOptionIndex: number;
  selectedAnswerText: string;
  correctOptionIndex: number;
  correctAnswerText: string;
  isCorrect: boolean;
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: '1. What is hashing in data structures?',
    options: [
      'A sorting algorithm for array elements',
      'A technique to map keys to array indexes for fast O(1) storage and retrieval',
      'A binary tree rebalancing mechanism',
      'A linear sequential search scan',
    ],
    correctIndex: 1,
    correctAnswerText: 'A technique to map keys to array indexes for fast O(1) storage and retrieval',
    explanation:
      'Hashing is a technique used to store and retrieve data quickly in average O(1) constant time by using a mathematical hash function to compute direct memory slot positions.',
    techniqueCode: 'CORE-01',
    targetChapterId: 'what-is-hashing',
  },
  {
    id: 2,
    question: '2. What is the primary role of a hash function?',
    options: [
      'To sort elements in ascending numerical order',
      'To compress data files for network transfer',
      'To calculate the array index where a given key should be stored',
      'To delete duplicate elements from memory',
    ],
    correctIndex: 2,
    correctAnswerText: 'To calculate the array index where a given key should be stored',
    explanation:
      'A hash function calculates the exact numerical index in the hash table where a key should be stored or retrieved using deterministic arithmetic.',
    techniqueCode: 'CORE-02',
    targetChapterId: 'hash-function',
    targetLevelId: 1,
  },
  {
    id: 3,
    question: '3. What is a hash table?',
    options: [
      'An array-based data structure that stores key-value pairs using calculated hash indexes',
      'A database table sorted alphabetically',
      'A singly linked list with pointer traversal',
      'A heap queue used exclusively for scheduling',
    ],
    correctIndex: 0,
    correctAnswerText: 'An array-based data structure that stores key-value pairs using calculated hash indexes',
    explanation:
      'A hash table is a data structure that implements an associative array abstract data type, using a hash function to compute an index into an array of buckets or slots.',
    techniqueCode: 'CORE-03',
    targetChapterId: 'hash-table',
  },
  {
    id: 4,
    question: '4. Using the modulo formula h(key) = key % 10, where will key 25 be stored?',
    options: ['Index 2', 'Index 5', 'Index 10', 'Index 25'],
    correctIndex: 1,
    correctAnswerText: 'Index 5',
    explanation:
      '25 % 10 = 5. Dividing 25 by 10 leaves a remainder of 5, so key 25 maps to table slot index 5.',
    techniqueCode: 'MATH-04',
    targetChapterId: 'hash-function',
    targetLevelId: 1,
  },
  {
    id: 5,
    question: '5. What is a collision in a hash table?',
    options: [
      'When an element is deleted from memory',
      'When the hash table is completely empty',
      'When two different keys produce the exact same hash index',
      'When a search query fails to find a key',
    ],
    correctIndex: 2,
    correctAnswerText: 'When two different keys produce the exact same hash index',
    explanation:
      'A collision occurs when two or more distinct keys evaluate to the exact same table slot when passed through the hash function (e.g. h(k1) == h(k2)).',
    techniqueCode: 'COLLISION-05',
    targetChapterId: 'what-is-a-collision',
  },
  {
    id: 6,
    question: '6. If 23 % 10 = 3 and 33 % 10 = 3, what occurs during insertion of 33?',
    options: [
      'Both keys are automatically deleted',
      'A collision occurs at index 3 and requires a resolution strategy',
      'The table becomes corrupted and throws a fatal error',
      'Key 33 silently overwrites key 23 without warning',
    ],
    correctIndex: 1,
    correctAnswerText: 'A collision occurs at index 3 and requires a resolution strategy',
    explanation:
      'Both 23 % 10 and 33 % 10 evaluate to index 3. Because slot 3 is already occupied when 33 arrives, a collision occurs and must be resolved.',
    techniqueCode: 'COLLISION-06',
    targetChapterId: 'what-is-a-collision',
    targetLevelId: 2,
  },
  {
    id: 7,
    question: '7. Which technique attaches a linked chain to each bucket upon collision?',
    options: [
      'Linear Probing',
      'Quadratic Probing',
      'Separate Chaining',
      'Binary Search',
    ],
    correctIndex: 2,
    correctAnswerText: 'Separate Chaining',
    explanation:
      'Separate Chaining (closed addressing) stores colliding keys in a linked list attached directly to that bucket, e.g., Slot 3: [23] → [33] → [43].',
    exampleSnippet: 'Slot 3: [23] → [33] → [43]',
    techniqueCode: 'CHAIN-07',
    targetChapterId: 'separate-chaining',
    targetLevelId: 2,
  },
  {
    id: 8,
    question: '8. How does Linear Probing resolve a collision at index h?',
    options: [
      'Sequentially checks the next consecutive positions (h+1, h+2, h+3...) mod m',
      'Deletes the existing element in that slot',
      'Creates a binary search tree in memory',
      'Stops the insertion and reports table failure',
    ],
    correctIndex: 0,
    correctAnswerText: 'Sequentially checks the next consecutive positions (h+1, h+2, h+3...) mod m',
    explanation:
      'Linear Probing is an open addressing strategy that sequentially checks consecutive slots: (hash + i) % m for i = 1, 2, 3... until an empty slot is located.',
    techniqueCode: 'PROBE-08',
    targetChapterId: 'linear-probing',
    targetLevelId: 3,
  },
  {
    id: 9,
    question: '9. What jump pattern does Quadratic Probing use to avoid primary clustering?',
    options: [
      'Random pseudo-generated offsets',
      'Squared increments such as 1², 2², 3²...: (hash + i²) mod m',
      'Sequential steps of +1 only',
      'Halving the table index on each step',
    ],
    correctIndex: 1,
    correctAnswerText: 'Squared increments such as 1², 2², 3²...: (hash + i²) mod m',
    explanation:
      'Quadratic Probing uses squared jump offsets (hash + 1², hash + 2², hash + 3²...) % m to spread keys across the table and avoid contiguous clusters.',
    techniqueCode: 'PROBE-09',
    targetChapterId: 'quadratic-probing',
    targetLevelId: 4,
  },
  {
    id: 10,
    question: '10. What is used in Double Hashing to calculate probe steps?',
    options: [
      'Two sorting algorithms',
      'Two linked lists per bucket',
      'A second hash function h2(key) that computes a non-zero jump interval',
      'Two separate hash tables',
    ],
    correctIndex: 2,
    correctAnswerText: 'A second hash function h2(key) that computes a non-zero jump interval',
    explanation:
      'Double Hashing uses two hash functions: h1(key) computes the initial slot index, while h2(key) computes a key-dependent jump interval: index = (h1 + i * h2) % m.',
    techniqueCode: 'PROBE-10',
    targetChapterId: 'double-hashing',
    targetLevelId: 5,
  },
];

const QUIZ_STORAGE_ANSWERS_KEY = 'hash_quest_quiz_answers_v3';
const QUIZ_STORAGE_SUBMITTED_KEY = 'hash_quest_quiz_submitted_v3';

export const QuizView: React.FC<QuizViewProps> = ({
  onNavigateToTheory,
  onNavigateToQuest,
  onNavigateToProgress,
}) => {
  useScrollReveal();

  // Load persisted student answers
  const [studentAnswers, setStudentAnswers] = useState<Record<number, StudentAnswerRecord>>(() => {
    try {
      const stored = localStorage.getItem(QUIZ_STORAGE_ANSWERS_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // fallback
    }
    return {};
  });

  const [isSubmitted, setIsSubmitted] = useState<boolean>(() => {
    try {
      const storedSub = localStorage.getItem(QUIZ_STORAGE_SUBMITTED_KEY);
      if (storedSub !== null) {
        return storedSub === 'true';
      }
      return progressManager.getState().quizSubmitted || false;
    } catch {
      return false;
    }
  });

  // Subscribe to progressManager for reset synchronization
  useEffect(() => {
    const unsub = progressManager.subscribe((pState) => {
      if (!pState.quizSubmitted) {
        setIsSubmitted(false);
        try {
          const stored = localStorage.getItem(QUIZ_STORAGE_ANSWERS_KEY);
          if (!stored) {
            setStudentAnswers({});
            setViewMode('STEP_BY_STEP');
          }
        } catch {
          // Ignore
        }
      }
    });
    return unsub;
  }, []);

  // Navigation within Quiz (0-indexed current question)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  // Temporary selection before confirming/submitting the question
  const [pendingSelection, setPendingSelection] = useState<number | null>(null);
  // View mode: 'STEP_BY_STEP' or 'FULL_REVIEW'
  const [viewMode, setViewMode] = useState<'STEP_BY_STEP' | 'FULL_REVIEW'>(() => {
    return isSubmitted ? 'FULL_REVIEW' : 'STEP_BY_STEP';
  });

  // Current question helper
  const currentQuestion = QUIZ_QUESTIONS[currentQuestionIndex] || QUIZ_QUESTIONS[0];
  const currentAnswerRecord = studentAnswers[currentQuestion.id];
  const isCurrentQuestionAnswered = currentAnswerRecord !== undefined;

  // Synchronize selection with current question record
  useEffect(() => {
    if (currentAnswerRecord !== undefined) {
      setPendingSelection(currentAnswerRecord.selectedOptionIndex);
    } else {
      setPendingSelection(null);
    }
  }, [currentQuestionIndex, currentAnswerRecord]);

  // Persist answers to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(QUIZ_STORAGE_ANSWERS_KEY, JSON.stringify(studentAnswers));
    } catch {
      // Ignore storage errors
    }
  }, [studentAnswers]);

  // Calculate score deterministically from stored answers
  const { score, totalQuestions, percentage, correctAnswersCount } = useMemo(() => {
    let correct = 0;
    QUIZ_QUESTIONS.forEach((q) => {
      const rec = studentAnswers[q.id];
      if (rec && rec.isCorrect) {
        correct++;
      }
    });
    const total = QUIZ_QUESTIONS.length;
    const pct = total > 0 ? Math.round((correct / total) * 100) : 0;
    return {
      score: correct,
      totalQuestions: total,
      percentage: pct,
      correctAnswersCount: correct,
    };
  }, [studentAnswers]);

  // Get result tier based on final score
  const getResultTier = (correctCount: number) => {
    if (correctCount >= 8) {
      return {
        level: 'EXCELLENT',
        emoji: '🟢',
        title: '8–10: 🟢 Excellent — Hashing Master!',
        badgeText: '🟢 EXCELLENT — HASHING MASTER!',
        badgeClass: 'bg-emerald-700 text-white border-emerald-900',
        cardClass: 'border-emerald-700 bg-emerald-50/80',
        summary:
          'Outstanding achievement! You scored in the top tier and have mastered all primary hashing concepts, collision mechanics, and resolution strategies.',
        isMastered: true,
      };
    } else if (correctCount >= 6) {
      return {
        level: 'GOOD',
        emoji: '🟡',
        title: '6–7: 🟡 Good — Review a little and try again.',
        badgeText: '🟡 GOOD — REVIEW & PRACTICE',
        badgeClass: 'bg-amber-500 text-[#181818] border-amber-600',
        cardClass: 'border-amber-600 bg-amber-50/80',
        summary:
          'Solid foundation! You understand the key concepts. Review the detailed technical rationales below and try again to achieve Hashing Master status.',
        isMastered: false,
      };
    } else {
      return {
        level: 'KEEP_LEARNING',
        emoji: '🔴',
        title: '0–5: 🔴 Keep Learning — Review the theory and visualization.',
        badgeText: '🔴 KEEP LEARNING — REVIEW THEORY',
        badgeClass: 'bg-red-600 text-white border-red-800',
        cardClass: 'border-red-600 bg-red-50/80',
        summary:
          'Keep practicing! Review the step-by-step Theory Field Guide chapters and try interactive probe experiments in the Lab Workbench.',
        isMastered: false,
      };
    }
  };

  const tier = getResultTier(score);

  // Handle student selecting an option (before or during answering)
  const handleSelectOption = (optionIndex: number) => {
    if (isCurrentQuestionAnswered && isSubmitted) return;
    soundManager.playQuizSelect();
    setPendingSelection(optionIndex);
  };

  // Handle confirming answer for current question
  const handleConfirmAnswer = () => {
    if (pendingSelection === null || isCurrentQuestionAnswered) return;

    const q = currentQuestion;
    const isCorrect = pendingSelection === q.correctIndex;
    const selectedText = q.options[pendingSelection] || '';

    const newRecord: StudentAnswerRecord = {
      questionId: q.id,
      selectedOptionIndex: pendingSelection,
      selectedAnswerText: selectedText,
      correctOptionIndex: q.correctIndex,
      correctAnswerText: q.correctAnswerText,
      isCorrect,
    };

    const updatedAnswers = {
      ...studentAnswers,
      [q.id]: newRecord,
    };

    setStudentAnswers(updatedAnswers);

    // Play appropriate interaction sound
    if (isCorrect) {
      soundManager.playQuizCorrect();
    } else {
      soundManager.playQuizWrong();
    }

    // Check if all questions are now answered
    const totalAnswered = Object.keys(updatedAnswers).length;
    if (totalAnswered === QUIZ_QUESTIONS.length) {
      // Calculate final score
      let finalCorrect = 0;
      QUIZ_QUESTIONS.forEach((quest) => {
        if (updatedAnswers[quest.id]?.isCorrect) {
          finalCorrect++;
        }
      });

      setIsSubmitted(true);
      try {
        localStorage.setItem(QUIZ_STORAGE_SUBMITTED_KEY, 'true');
      } catch {
        // Ignore
      }

      // Synchronize with ProgressManager
      const rawScoresMap: Record<number, number> = {};
      (Object.values(updatedAnswers) as StudentAnswerRecord[]).forEach((rec) => {
        rawScoresMap[rec.questionId] = rec.selectedOptionIndex;
      });

      progressManager.recordQuizCompletion(rawScoresMap, finalCorrect, QUIZ_QUESTIONS.length);
    }
  };

  // Handle submitting the entire examination
  const handleSubmitExamination = () => {
    const totalAnswered = Object.keys(studentAnswers).length;
    if (totalAnswered < QUIZ_QUESTIONS.length) {
      soundManager.playError();
      return;
    }

    setIsSubmitted(true);
    setViewMode('FULL_REVIEW');
    try {
      localStorage.setItem(QUIZ_STORAGE_SUBMITTED_KEY, 'true');
    } catch {
      // Ignore storage errors
    }

    // Synchronize with progressManager
    const rawScoresMap: Record<number, number> = {};
    (Object.values(studentAnswers) as StudentAnswerRecord[]).forEach((rec) => {
      rawScoresMap[rec.questionId] = rec.selectedOptionIndex;
    });

    progressManager.recordQuizCompletion(rawScoresMap, score, QUIZ_QUESTIONS.length);

    if (score >= 6) {
      soundManager.playQuizComplete();
    } else {
      soundManager.playQuizWrong();
    }
  };

  // Handle resetting the quiz completely
  const handleResetQuiz = () => {
    soundManager.playReset();
    setStudentAnswers({});
    setIsSubmitted(false);
    setCurrentQuestionIndex(0);
    setPendingSelection(null);
    setViewMode('STEP_BY_STEP');

    try {
      localStorage.removeItem(QUIZ_STORAGE_ANSWERS_KEY);
      localStorage.setItem(QUIZ_STORAGE_SUBMITTED_KEY, 'false');
    } catch {
      // Ignore
    }

    progressManager.resetQuizAttempt();
  };

  const answeredCount = Object.keys(studentAnswers).length;
  const allAnswered = answeredCount === QUIZ_QUESTIONS.length;

  return (
    <div className="w-full max-w-4xl mx-auto py-4 px-4 font-sans text-slate-900 dark:text-white animate-page-enter">
      {/* Header Banner */}
      <div className="border border-slate-200 dark:border-purple-500/20 rounded-2xl pb-6 mb-6 bg-white dark:bg-[#0B1228] p-6 sm:p-8 shadow-xs dark:shadow-[0_8px_30px_rgba(0,0,0,0.35)] reveal-on-scroll">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 dark:bg-purple-950/60 border border-indigo-100 dark:border-purple-500/30 text-indigo-700 dark:text-purple-300 rounded-lg text-xs font-semibold uppercase tracking-wider font-mono">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-600 dark:text-purple-400" />
            <span>Knowledge Assessment</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              Simple Hashing Quiz (10 Questions)
            </span>
            {isSubmitted && (
              <span className="px-2.5 py-0.5 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-300 rounded-md text-xs font-semibold">
                Completed
              </span>
            )}
          </div>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight animate-heading-enter">
          Hashing Knowledge Check
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-300 max-w-2xl mt-1 leading-relaxed">
          Test your understanding of modulo formulas, hash collisions, separate chaining, linear/quadratic probing, and double hashing.
        </p>

        {/* Question Index Tabs / Progress Tracker */}
        <div className="mt-5 pt-4 border-t border-slate-100 dark:border-purple-500/15">
          <div className="flex items-center justify-between gap-2 mb-3 text-xs font-semibold text-slate-700 dark:text-slate-300">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-purple-400" />
              <span>
                Progress: <strong className="text-indigo-600 dark:text-purple-300 font-mono">{answeredCount}</strong> / {totalQuestions} Answered
              </span>
            </div>
            {isSubmitted && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    soundManager.playNav();
                    setViewMode(viewMode === 'STEP_BY_STEP' ? 'FULL_REVIEW' : 'STEP_BY_STEP');
                  }}
                  className="text-xs font-semibold text-indigo-600 dark:text-cyan-400 hover:text-indigo-700 dark:hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
                >
                  <ListOrdered className="w-3.5 h-3.5" />
                  <span>{viewMode === 'STEP_BY_STEP' ? 'Switch to Full Review' : 'Switch to Step Mode'}</span>
                </button>
              </div>
            )}
          </div>

          {/* Question Index Pills */}
          <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5">
            {QUIZ_QUESTIONS.map((q, idx) => {
              const rec = studentAnswers[q.id];
              const isAnswered = rec !== undefined;
              const isCurrent = currentQuestionIndex === idx && viewMode === 'STEP_BY_STEP';

              let pillStyle = 'bg-slate-50 dark:bg-[#080D1F] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-purple-500/20 hover:bg-slate-100 dark:hover:bg-[#0F1733]';
              if (isCurrent) {
                pillStyle = 'bg-indigo-600 dark:bg-purple-600 text-white border-indigo-600 dark:border-purple-500 font-bold shadow-xs dark:shadow-[0_0_12px_rgba(124,58,237,0.4)]';
              } else if (isAnswered) {
                if (rec.isCorrect) {
                  pillStyle = 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/30 font-semibold';
                } else {
                  pillStyle = 'bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-500/30 font-semibold';
                }
              }

              return (
                <button
                  key={q.id}
                  id={`btn-quiz-jump-${q.id}`}
                  onClick={() => {
                    soundManager.playNav();
                    setCurrentQuestionIndex(idx);
                    setViewMode('STEP_BY_STEP');
                  }}
                  className={`py-2 text-center text-xs font-mono rounded-lg border transition-all cursor-pointer ${pillStyle}`}
                  title={`Question ${idx + 1}`}
                >
                  <span>Q{idx + 1}</span>
                  {isAnswered && (
                    <span className="block text-[10px] leading-tight mt-0.5">
                      {rec.isCorrect ? '✓' : '✕'}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Quiz Assessment Completed Section (Shown when submitted or in review mode) */}
      {isSubmitted && (
        <div
          id="quiz-result-card"
          className="mb-8 p-6 sm:p-10 lg:p-12 bg-white dark:bg-[#0B1228] border border-slate-200 dark:border-purple-500/25 rounded-3xl shadow-xs dark:shadow-[0_8px_30px_rgba(0,0,0,0.35)] flex flex-col items-center justify-center text-center animate-editorial-scale transition-all"
        >
          {/* 1. Top Achievement Trophy Icon */}
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl bg-[#00A86B] dark:bg-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 dark:shadow-emerald-950/50 mx-auto mb-4 sm:mb-5">
            <Trophy className="w-8 h-8 sm:w-10 sm:h-10 text-white stroke-[2.2]" />
          </div>

          {/* 2. Achievement Badge */}
          <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full border border-[#00A86B]/40 dark:border-emerald-500/40 bg-[#E6F8F0] dark:bg-emerald-950/60 text-[#008A54] dark:text-emerald-300 font-mono text-[11px] sm:text-xs font-bold tracking-wider uppercase mb-3 sm:mb-4">
            ★ OUTSTANDING MASTERY (GRADE A+) ★
          </div>

          {/* 3. Main Completion Heading */}
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B192C] dark:text-white tracking-tight uppercase mb-3">
            QUIZ ASSESSMENT COMPLETED
          </h2>

          {/* 4. Supporting Description */}
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-xl mx-auto leading-relaxed font-normal mb-6 sm:mb-8">
            Incredible performance! You demonstrated thorough command of Stack operations and algorithmic constraints.
          </p>

          {/* 5. Large Highlighted Score Card */}
          <div className="w-full max-w-md mx-auto p-6 sm:p-8 bg-white dark:bg-[#070B18] border-2 border-indigo-200/70 dark:border-purple-500/40 rounded-3xl shadow-[0_8px_30px_rgba(99,102,241,0.08)] dark:shadow-[0_8px_30px_rgba(124,58,237,0.18)] flex flex-col items-center justify-center text-center mb-6 sm:mb-8">
            <span className="text-[11px] sm:text-xs font-mono font-bold tracking-[0.2em] text-[#6366F1] dark:text-purple-300 uppercase mb-2">
              FINAL HIGHLIGHTED SCORE
            </span>
            <div className="text-5xl sm:text-6xl font-black text-[#00A86B] dark:text-emerald-400 font-sans tracking-tight leading-none my-2">
              {percentage}%
            </div>
            <div className="mt-3 px-4 py-1.5 rounded-xl bg-slate-50 dark:bg-purple-950/40 border border-slate-200 dark:border-purple-500/30 text-slate-700 dark:text-slate-300 font-mono text-xs sm:text-sm font-semibold">
              {score} / {totalQuestions} Questions Correct
            </div>
          </div>

          {/* 6. Summary Statistics Cards (CORRECT, INCORRECT, ACCURACY - STRICTLY NO XP) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 w-full max-w-2xl mx-auto">
            {/* CORRECT CARD */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#070B18] border border-slate-200/90 dark:border-purple-500/30 shadow-xs flex flex-col items-center justify-center text-center">
              <span className="text-[10px] sm:text-[11px] font-mono font-bold tracking-widest text-slate-400 dark:text-slate-500 uppercase mb-1.5">
                CORRECT
              </span>
              <span className="text-xl sm:text-2xl font-extrabold text-[#00A86B] dark:text-emerald-400 font-mono flex items-center justify-center gap-1.5">
                <Check className="w-5 h-5 stroke-[2.5]" />
                {score}
              </span>
            </div>

            {/* INCORRECT CARD */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#070B18] border border-slate-200/90 dark:border-purple-500/30 shadow-xs flex flex-col items-center justify-center text-center">
              <span className="text-[10px] sm:text-[11px] font-mono font-bold tracking-widest text-slate-400 dark:text-slate-500 uppercase mb-1.5">
                INCORRECT
              </span>
              <span className="text-xl sm:text-2xl font-extrabold text-rose-500 dark:text-rose-400 font-mono">
                {totalQuestions - score}
              </span>
            </div>

            {/* ACCURACY CARD */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#070B18] border border-slate-200/90 dark:border-purple-500/30 shadow-xs flex flex-col items-center justify-center text-center">
              <span className="text-[10px] sm:text-[11px] font-mono font-bold tracking-widest text-slate-400 dark:text-slate-500 uppercase mb-1.5">
                ACCURACY
              </span>
              <span className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white font-mono">
                {percentage}%
              </span>
            </div>
          </div>
        </div>
      )}

      {/* VIEW MODE 1: STEP BY STEP QUESTION FLOW */}
      {viewMode === 'STEP_BY_STEP' && (
        <div className="space-y-6">
          <div
            key={currentQuestion.id}
            id={`quiz-step-card-${currentQuestion.id}`}
            className={`p-6 sm:p-8 border rounded-2xl transition-all bg-white dark:bg-[#0B1228] shadow-xs dark:shadow-[0_8px_30px_rgba(0,0,0,0.35)] animate-chapter-switch ${isCurrentQuestionAnswered
                ? currentAnswerRecord?.isCorrect
                  ? 'border-emerald-300 dark:border-emerald-500/40 ring-1 ring-emerald-200 dark:ring-emerald-500/30'
                  : 'border-rose-300 dark:border-rose-500/40 ring-1 ring-rose-200 dark:ring-rose-500/30'
                : 'border-slate-200 dark:border-purple-500/20'
              }`}
          >
            {/* Question Header */}
            <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100 dark:border-purple-500/15">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 bg-indigo-600 dark:bg-purple-600 text-white rounded-md text-xs font-bold font-mono shadow-xs">
                  Question {currentQuestionIndex + 1 < 10 ? `0${currentQuestionIndex + 1}` : currentQuestionIndex + 1} of {totalQuestions}
                </span>
                <span className="text-xs font-semibold text-indigo-600 dark:text-cyan-300 font-mono">{currentQuestion.techniqueCode}</span>
              </div>

              {isCurrentQuestionAnswered && (
                <div>
                  {currentAnswerRecord?.isCorrect ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 dark:bg-emerald-950/60 text-xs font-bold text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30 rounded-lg">
                      <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                      <span>Correct</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-50 dark:bg-rose-950/60 text-xs font-bold text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-500/30 rounded-lg">
                      <XCircle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />
                      <span>Incorrect</span>
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Question Statement */}
            <p className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-6 leading-snug break-words">
              {currentQuestion.question}
            </p>

            {/* Answer Options */}
            <div className="space-y-3">
              {currentQuestion.options.map((opt, optIdx) => {
                const isSelected = pendingSelection === optIdx;
                let optStyle =
                  'bg-white dark:bg-[#080D1F] border-slate-200 dark:border-purple-500/25 hover:border-indigo-300 dark:hover:border-purple-500/50 hover:bg-slate-50 dark:hover:bg-[#0F1733] text-slate-800 dark:text-slate-200';

                if (isCurrentQuestionAnswered) {
                  if (optIdx === currentQuestion.correctIndex) {
                    optStyle =
                      'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-950 dark:text-emerald-200 font-bold ring-2 ring-emerald-400 dark:ring-emerald-500/40';
                  } else if (isSelected && !currentAnswerRecord?.isCorrect) {
                    optStyle = 'bg-rose-50 dark:bg-rose-950/60 border-rose-400 text-rose-950 dark:text-rose-200 font-bold';
                  } else {
                    optStyle = 'bg-white dark:bg-[#080D1F] opacity-40 border-slate-200 dark:border-purple-500/20 text-slate-400 dark:text-slate-500';
                  }
                } else if (isSelected) {
                  optStyle =
                    'bg-indigo-50/80 dark:bg-purple-950/60 border-indigo-600 dark:border-cyan-400 text-indigo-900 dark:text-cyan-200 font-semibold ring-2 ring-indigo-500 dark:ring-cyan-500/30';
                }

                return (
                  <button
                    key={optIdx}
                    id={`quiz-q${currentQuestion.id}-opt${optIdx}`}
                    onClick={() => handleSelectOption(optIdx)}
                    disabled={isCurrentQuestionAnswered && isSubmitted}
                    style={{ animationDelay: `${(optIdx + 1) * 60}ms` }}
                    className={`w-full p-4 text-left text-sm font-sans rounded-xl border transition-all flex items-start gap-3.5 cursor-pointer animate-chapter-switch ${optStyle}`}
                  >
                    <span
                      className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 border text-xs font-bold font-mono ${isSelected
                          ? isCurrentQuestionAnswered
                            ? optIdx === currentQuestion.correctIndex
                              ? 'bg-emerald-600 text-white border-emerald-600'
                              : 'bg-rose-600 text-white border-rose-600'
                            : 'bg-indigo-600 dark:bg-purple-600 text-white border-indigo-600 dark:border-purple-500'
                          : 'bg-slate-100 dark:bg-[#0B1228] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-purple-500/30'
                        }`}
                    >
                      {String.fromCharCode(65 + optIdx)}
                    </span>
                    <span className="flex-1 pt-0.5 leading-relaxed break-words">{opt}</span>
                  </button>
                );
              })}
            </div>

            {/* Answer Confirmation / Next Button Bar */}
            <div className="mt-6 pt-4 border-t border-slate-100 dark:border-purple-500/15 flex flex-wrap items-center justify-between gap-3">
              <button
                disabled={currentQuestionIndex === 0}
                onClick={() => {
                  soundManager.playNav();
                  setCurrentQuestionIndex((prev) => Math.max(0, prev - 1));
                }}
                className={`btn-modern-secondary px-4 py-2 text-xs font-semibold flex items-center gap-1.5 transition-all ${currentQuestionIndex === 0 ? 'opacity-40 cursor-not-allowed pointer-events-none' : 'cursor-pointer'
                  }`}
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Previous</span>
              </button>

              {!isCurrentQuestionAnswered ? (
                <button
                  id="btn-confirm-answer"
                  disabled={pendingSelection === null}
                  onClick={handleConfirmAnswer}
                  className={`btn-modern-primary px-6 py-2.5 text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all ${pendingSelection !== null ? 'cursor-pointer' : 'opacity-40 cursor-not-allowed pointer-events-none'
                    }`}
                >
                  <Check className="w-4 h-4" />
                  <span>Confirm Answer</span>
                </button>
              ) : currentQuestionIndex < totalQuestions - 1 ? (
                <button
                  id="btn-next-question"
                  onClick={() => {
                    soundManager.playClick();
                    setCurrentQuestionIndex((prev) => prev + 1);
                  }}
                  className="btn-modern-primary px-6 py-2.5 text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer"
                >
                  <span>Next Question</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  id="btn-finish-quiz"
                  onClick={handleSubmitExamination}
                  className="btn-modern-primary px-6 py-2.5 text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer"
                >
                  <Award className="w-4 h-4" />
                  <span>Complete & Review</span>
                </button>
              )}
            </div>

            {/* Technical Explanation Panel (visible once answered) */}
            {isCurrentQuestionAnswered && (
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-purple-500/15 bg-slate-50 dark:bg-[#080D1F] rounded-xl p-4 sm:p-5 text-xs">
                <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white mb-2">
                  <HelpCircle className="w-4 h-4 text-indigo-600 dark:text-purple-400" />
                  <span>Technical Explanation:</span>
                </div>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-3 font-normal text-sm">
                  {currentQuestion.explanation}
                </p>

                {currentQuestion.exampleSnippet && (
                  <div className="mb-3 p-3 bg-white dark:bg-[#0B1228] border border-slate-200 dark:border-purple-500/30 rounded-lg font-mono text-xs text-indigo-700 dark:text-cyan-300 font-semibold">
                    Example: {currentQuestion.exampleSnippet}
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-3 text-xs pt-1">
                  {currentQuestion.targetChapterId && (
                    <button
                      onClick={() => {
                        soundManager.playNav();
                        onNavigateToTheory(currentQuestion.targetChapterId);
                      }}
                      className="text-indigo-600 dark:text-cyan-400 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Review in Theory Guide →</span>
                    </button>
                  )}
                  {currentQuestion.targetLevelId && (
                    <button
                      onClick={() => {
                        soundManager.playNav();
                        onNavigateToQuest(currentQuestion.targetLevelId);
                      }}
                      className="text-slate-700 dark:text-slate-300 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Gamepad2 className="w-3.5 h-3.5 text-indigo-600 dark:text-purple-400" />
                      <span>Practice in Quest Level {currentQuestion.targetLevelId} →</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIEW MODE 2: COMPREHENSIVE AUDIT REVIEW */}
      {viewMode === 'FULL_REVIEW' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-purple-500/20">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ListOrdered className="w-4 h-4 text-indigo-600 dark:text-purple-400" />
              <span>Full Question-by-Question Review</span>
            </h3>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold font-mono">
              {score} of {totalQuestions} Correct
            </span>
          </div>

          <div className="space-y-4">
            {QUIZ_QUESTIONS.map((q, idx) => {
              const rec = studentAnswers[q.id];
              const isAnswered = rec !== undefined;
              const isCorrect = rec?.isCorrect || false;

              return (
                <div
                  key={q.id}
                  id={`quiz-review-card-${q.id}`}
                  className={`p-5 sm:p-6 border rounded-2xl transition-all bg-white dark:bg-[#0B1228] shadow-xs dark:shadow-[0_8px_30px_rgba(0,0,0,0.35)] ${isAnswered
                      ? isCorrect
                        ? 'border-emerald-300 dark:border-emerald-500/40 ring-1 ring-emerald-200 dark:ring-emerald-500/30'
                        : 'border-rose-300 dark:border-rose-500/40 ring-1 ring-rose-200 dark:ring-rose-500/30'
                      : 'border-slate-200 dark:border-purple-500/20 opacity-75'
                    }`}
                >
                  {/* Header */}
                  <div className="flex items-center justify-between gap-3 mb-3 pb-2 border-b border-slate-100 dark:border-purple-500/15">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 bg-indigo-600 dark:bg-purple-600 text-white rounded-md text-xs font-bold font-mono">
                        Question {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                      </span>
                      <span className="text-xs font-semibold text-indigo-600 dark:text-cyan-300 font-mono">{q.techniqueCode}</span>
                    </div>

                    <div>
                      {isAnswered ? (
                        isCorrect ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-emerald-50 dark:bg-emerald-950/60 text-xs font-bold text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30 rounded-md">
                            <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> Correct
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-rose-50 dark:bg-rose-950/60 text-xs font-bold text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-500/30 rounded-md">
                            <XCircle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" /> Incorrect
                          </span>
                        )
                      ) : (
                        <span className="px-2 py-0.5 bg-slate-100 dark:bg-[#080D1F] rounded-md text-xs font-semibold text-slate-500 dark:text-slate-400">
                          Unanswered
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Question Prompt */}
                  <p className="text-base font-bold text-slate-900 dark:text-white mb-4 leading-snug">
                    {q.question}
                  </p>

                  {/* Stored Comparison */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4 text-xs font-mono">
                    <div className={`p-3 rounded-xl border ${isCorrect ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-500/30 text-emerald-950 dark:text-emerald-200' : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-500/30 text-rose-950 dark:text-rose-200'}`}>
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1 font-sans">
                        Your Submission:
                      </div>
                      <div className="font-bold text-sm">
                        {rec ? `${String.fromCharCode(65 + rec.selectedOptionIndex)}: ${rec.selectedAnswerText}` : 'No Answer Submitted'}
                      </div>
                    </div>

                    <div className="p-3 rounded-xl border bg-slate-50 dark:bg-[#080D1F] border-slate-200 dark:border-purple-500/20 text-slate-900 dark:text-white">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1 font-sans">
                        Correct Answer:
                      </div>
                      <div className="font-bold text-sm text-emerald-800 dark:text-emerald-300">
                        {String.fromCharCode(65 + q.correctIndex)}: {q.correctAnswerText}
                      </div>
                    </div>
                  </div>

                  {/* Explanation */}
                  <div className="bg-slate-50 dark:bg-[#080D1F] p-4 rounded-xl border border-slate-200 dark:border-purple-500/20 text-xs">
                    <div className="flex items-center gap-1.5 font-bold text-slate-900 dark:text-white mb-1.5">
                      <HelpCircle className="w-4 h-4 text-indigo-600 dark:text-purple-400" />
                      <span>Technical Explanation:</span>
                    </div>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed mb-2 font-normal text-sm">
                      {q.explanation}
                    </p>

                    {q.exampleSnippet && (
                      <div className="mb-2 p-2.5 bg-white dark:bg-[#0B1228] border border-slate-200 dark:border-purple-500/30 rounded-lg font-mono text-xs text-indigo-700 dark:text-cyan-300 font-semibold">
                        Example: {q.exampleSnippet}
                      </div>
                    )}

                    <div className="flex flex-wrap items-center gap-3 text-xs pt-1">
                      {q.targetChapterId && (
                        <button
                          onClick={() => {
                            soundManager.playNav();
                            onNavigateToTheory(q.targetChapterId);
                          }}
                          className="text-indigo-600 dark:text-cyan-400 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>Review in Theory Guide →</span>
                        </button>
                      )}
                      {q.targetLevelId && (
                        <button
                          onClick={() => {
                            soundManager.playNav();
                            onNavigateToQuest(q.targetLevelId);
                          }}
                          className="text-slate-700 dark:text-slate-300 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <Gamepad2 className="w-3.5 h-3.5 text-indigo-600 dark:text-purple-400" />
                          <span>Practice in Quest Level {q.targetLevelId} →</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizView;
