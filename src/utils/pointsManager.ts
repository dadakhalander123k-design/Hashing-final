import { progressManager } from './progressManager';

const POINTS_STORAGE_KEY = 'hash_quest_points_system_v1';
const QUIZ_STORAGE_ANSWERS_KEY = 'hash_quest_quiz_answers_v3';

export interface PointsState {
  theoryPoints: number; // 0 to 24 (12 modules * 2 pts)
  quizPoints: number; // 0 to 20 (+2 correct, -1 wrong, clamped [0, 20])
  visualizePoints: number; // 0 to 6 (2 modules * 3 pts)
  gamePoints: number; // 0 to 50 (5 levels * 10 pts)
  hintPenalties: number; // 2 pts per genuine hint use
  guidedSolvePenalties: number; // 3 pts per genuine guided-solve use
  hintUsesCount: number;
  guidedSolveUsesCount: number;
  totalPoints: number; // 0 to 100
}

interface StoredPointsData {
  version: 1;
  quizPoints: number;
  processedQuizQuestionIds: number[];
  hintUsesCount: number;
  guidedSolveUsesCount: number;
}

const DEFAULT_STORED_DATA: StoredPointsData = {
  version: 1,
  quizPoints: 0,
  processedQuizQuestionIds: [],
  hintUsesCount: 0,
  guidedSolveUsesCount: 0,
};

type PointsListener = (state: PointsState) => void;

class PointsManager {
  private data: StoredPointsData;
  private listeners: Set<PointsListener> = new Set();

  constructor() {
    this.data = this.loadData();

    // Listen to progressManager updates (theory, videos, levels completed, or resets)
    if (typeof window !== 'undefined') {
      progressManager.subscribe(() => {
        this.notifyListeners();
      });
    }
  }

  private loadData(): StoredPointsData {
    if (typeof window === 'undefined') return { ...DEFAULT_STORED_DATA };
    try {
      const stored = localStorage.getItem(POINTS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.version === 1) {
          return {
            version: 1,
            quizPoints: typeof parsed.quizPoints === 'number' ? Math.max(0, Math.min(20, parsed.quizPoints)) : 0,
            processedQuizQuestionIds: Array.isArray(parsed.processedQuizQuestionIds) ? parsed.processedQuizQuestionIds : [],
            hintUsesCount: typeof parsed.hintUsesCount === 'number' && parsed.hintUsesCount >= 0 ? parsed.hintUsesCount : 0,
            guidedSolveUsesCount: typeof parsed.guidedSolveUsesCount === 'number' && parsed.guidedSolveUsesCount >= 0 ? parsed.guidedSolveUsesCount : 0,
          };
        }
      }

      // If no points record exists yet, check if there are pre-existing quiz answers in localStorage
      const existingAnswersRaw = localStorage.getItem(QUIZ_STORAGE_ANSWERS_KEY);
      if (existingAnswersRaw) {
        try {
          const parsedAnswers = JSON.parse(existingAnswersRaw);
          if (parsedAnswers && typeof parsedAnswers === 'object') {
            let initialQuizPts = 0;
            const processedIds: number[] = [];
            Object.values(parsedAnswers).forEach((rec: any) => {
              if (rec && typeof rec.questionId === 'number') {
                processedIds.push(rec.questionId);
                if (rec.isCorrect) {
                  initialQuizPts += 2;
                } else {
                  initialQuizPts -= 1;
                }
              }
            });
            initialQuizPts = Math.max(0, Math.min(20, initialQuizPts));
            const initialData: StoredPointsData = {
              version: 1,
              quizPoints: initialQuizPts,
              processedQuizQuestionIds: processedIds,
              hintUsesCount: 0,
              guidedSolveUsesCount: 0,
            };
            localStorage.setItem(POINTS_STORAGE_KEY, JSON.stringify(initialData));
            return initialData;
          }
        } catch {
          // Ignore
        }
      }

      return { ...DEFAULT_STORED_DATA };
    } catch {
      return { ...DEFAULT_STORED_DATA };
    }
  }

  private saveData() {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(POINTS_STORAGE_KEY, JSON.stringify(this.data));
    } catch {
      // Ignore storage errors
    }
  }

  public subscribe(listener: PointsListener): () => void {
    this.listeners.add(listener);
    listener(this.getPoints());
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners() {
    const state = this.getPoints();
    this.listeners.forEach((fn) => {
      try {
        fn(state);
      } catch {
        // Safe dispatch
      }
    });
  }

  /**
   * Centralized Points Calculation
   * Total Points = Theory Points + Quiz Points + Visualize Points + Game Points - Hint Penalties - Guided-Solve Penalties
   * Clamped between 0 and 100.
   */
  public getPoints(): PointsState {
    // 1. Theory Modules: 12 modules, +2 points each on first completion (max 24)
    const theoryStats = progressManager.getTheoryStats();
    const theoryPoints = Math.min(24, Math.max(0, theoryStats.completed * 2));

    // 2. Quiz Points: +2 correct, -1 wrong (clamped between 0 and 20)
    const quizPoints = Math.max(0, Math.min(20, this.data.quizPoints));

    // 3. Visualize Modules: 2 modules, +3 points each on first completion (max 6)
    const videoStats = progressManager.getVideoStats();
    const visualizePoints = Math.min(6, Math.max(0, videoStats.completed * 3));

    // 4. Game Levels: 5 levels, +10 points each on first completion (max 50)
    const gameStats = progressManager.getGameStats();
    const gamePoints = Math.min(50, Math.max(0, gameStats.completed * 10));

    // 5. Hint Penalties: 2 points per genuine hint use
    const hintPenalties = this.data.hintUsesCount * 2;

    // 6. Guided-Solve Penalties: 3 points per genuine guided-solve use
    const guidedSolvePenalties = this.data.guidedSolveUsesCount * 3;

    // Total points calculation with strict [0, 100] bounds
    const rawTotal = theoryPoints + quizPoints + visualizePoints + gamePoints - hintPenalties - guidedSolvePenalties;
    const totalPoints = Math.max(0, Math.min(100, rawTotal));

    return {
      theoryPoints,
      quizPoints,
      visualizePoints,
      gamePoints,
      hintPenalties,
      guidedSolvePenalties,
      hintUsesCount: this.data.hintUsesCount,
      guidedSolveUsesCount: this.data.guidedSolveUsesCount,
      totalPoints,
    };
  }

  /**
   * Records a genuine quiz answer submission.
   * Prevents duplicate scoring for the same question attempt.
   */
  public recordQuizAnswer(questionId: number, isCorrect: boolean): boolean {
    if (this.data.processedQuizQuestionIds.includes(questionId)) {
      return false; // Prevent duplicate scoring for the same answer submission
    }

    this.data.processedQuizQuestionIds.push(questionId);

    if (isCorrect) {
      this.data.quizPoints = Math.min(20, this.data.quizPoints + 2);
    } else {
      this.data.quizPoints = Math.max(0, this.data.quizPoints - 1);
    }

    this.saveData();
    this.notifyListeners();
    return true;
  }

  /**
   * Resets the quiz score and processed questions when the user resets their quiz attempt.
   */
  public resetQuizPoints() {
    this.data.quizPoints = 0;
    this.data.processedQuizQuestionIds = [];
    this.saveData();
    this.notifyListeners();
  }

  /**
   * Records a genuine hint activation. Deducts 2 points per activation.
   */
  public recordHintUse() {
    this.data.hintUsesCount += 1;
    this.saveData();
    this.notifyListeners();
  }

  /**
   * Records a genuine guided-solve activation. Deducts 3 points per activation.
   */
  public recordGuidedSolveUse() {
    this.data.guidedSolveUsesCount += 1;
    this.saveData();
    this.notifyListeners();
  }

  /**
   * Resets all points data (used on global reset progress).
   */
  public resetAll() {
    this.data = {
      version: 1,
      quizPoints: 0,
      processedQuizQuestionIds: [],
      hintUsesCount: 0,
      guidedSolveUsesCount: 0,
    };
    this.saveData();
    this.notifyListeners();
  }
}

export const pointsManager = new PointsManager();
