import { progressManager } from './progressManager';

const POINTS_STORAGE_KEY = 'hash_quest_points_system_v1';
const QUIZ_STORAGE_ANSWERS_KEY = 'hash_quest_quiz_answers_v3';

export interface PointActivityEvent {
  id: string;
  title: string;
  typeLabel: string;
  points: number;
  timestamp: number;
}

export interface PointNotification {
  id: string;
  amount: number;
  title: string;
  message: string;
  type: 'reward' | 'penalty';
  timestamp: number;
}

export interface PointsState {
  theoryPoints: number; // 0 to 24 (12 modules * 2 pts)
  quizPoints: number; // 0 to 20 (+2 correct, -1 wrong, clamped [0, 20])
  visualizePoints: number; // 0 to 6 (2 modules * 3 pts)
  gamePoints: number; // 0 to 50 (5 levels * 10 pts)
  hintPenalties: number; // 2 pts per genuine hint use
  guidedSolvePenalties: number; // 3 pts per genuine guided-solve use
  hintUsesCount: number;
  guidedSolveUsesCount: number;
  totalPoints: number; // Real total, supports negative values!
}

interface StoredPointsData {
  version: 1;
  quizPoints: number;
  processedQuizQuestionIds: number[];
  hintUsesCount: number;
  guidedSolveUsesCount: number;
  activities: PointActivityEvent[];
}

const DEFAULT_STORED_DATA: StoredPointsData = {
  version: 1,
  quizPoints: 0,
  processedQuizQuestionIds: [],
  hintUsesCount: 0,
  guidedSolveUsesCount: 0,
  activities: [],
};

type PointsListener = (state: PointsState) => void;
type NotificationListener = (notification: PointNotification) => void;

class PointsManager {
  private data: StoredPointsData;
  private listeners: Set<PointsListener> = new Set();
  private notificationListeners: Set<NotificationListener> = new Set();

  private knownCompletedTheory: Set<string> = new Set();
  private knownCompletedVideos: Set<string> = new Set();
  private knownCompletedLevels: Set<number> = new Set();

  constructor() {
    this.data = this.loadData();
    this.initKnownCompletions();

    // Listen to progressManager updates (theory, videos, levels completed, or resets)
    progressManager.subscribe(() => {
      this.syncProgressActivities(true);
      this.notifyListeners();
    });
  }

  private initKnownCompletions() {
    try {
      const pState = progressManager.getState();
      if (Array.isArray(pState.completedTheoryChapters)) {
        pState.completedTheoryChapters.forEach((c) => this.knownCompletedTheory.add(c));
      }
      if (Array.isArray(pState.completedVideos)) {
        pState.completedVideos.forEach((v) => this.knownCompletedVideos.add(v));
      }
      if (Array.isArray(pState.levelsCompleted)) {
        pState.levelsCompleted.forEach((l) => this.knownCompletedLevels.add(l));
      }
    } catch {
      // Ignore
    }
    this.syncProgressActivities(false);
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
            quizPoints: typeof parsed.quizPoints === 'number' ? Math.min(20, parsed.quizPoints) : 0,
            processedQuizQuestionIds: Array.isArray(parsed.processedQuizQuestionIds) ? parsed.processedQuizQuestionIds : [],
            hintUsesCount: typeof parsed.hintUsesCount === 'number' && parsed.hintUsesCount >= 0 ? parsed.hintUsesCount : 0,
            guidedSolveUsesCount: typeof parsed.guidedSolveUsesCount === 'number' && parsed.guidedSolveUsesCount >= 0 ? parsed.guidedSolveUsesCount : 0,
            activities: Array.isArray(parsed.activities) ? parsed.activities : [],
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
            const initialActivities: PointActivityEvent[] = [];
            Object.values(parsedAnswers).forEach((rec: any) => {
              if (rec && typeof rec.questionId === 'number') {
                processedIds.push(rec.questionId);
                if (rec.isCorrect) {
                  initialQuizPts += 2;
                  initialActivities.push({
                    id: `quiz-init-${rec.questionId}`,
                    title: `Correct Quiz Answer (Q${rec.questionId})`,
                    typeLabel: 'QUIZ CORRECT',
                    points: 2,
                    timestamp: Date.now() - 60000,
                  });
                } else {
                  initialQuizPts -= 1;
                  initialActivities.push({
                    id: `quiz-init-${rec.questionId}`,
                    title: `Incorrect Quiz Answer (Q${rec.questionId})`,
                    typeLabel: 'QUIZ INCORRECT',
                    points: -1,
                    timestamp: Date.now() - 60000,
                  });
                }
              }
            });
            initialQuizPts = Math.min(20, initialQuizPts);
            const initialData: StoredPointsData = {
              version: 1,
              quizPoints: initialQuizPts,
              processedQuizQuestionIds: processedIds,
              hintUsesCount: 0,
              guidedSolveUsesCount: 0,
              activities: initialActivities,
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

  /**
   * Syncs completed theory, video, and game activities from progressManager.
   * If emitNotification is true, fires a toast for genuine new completions.
   */
  private syncProgressActivities(emitNotification: boolean = false) {
    try {
      const pState = progressManager.getState();
      let hasChanges = false;

      // 1. Game Levels Completed (5 levels, 10 pts each)
      if (Array.isArray(pState.levelsCompleted)) {
        pState.levelsCompleted.forEach((lvl) => {
          if (lvl >= 1 && lvl <= 5) {
            const isNewToKnown = !this.knownCompletedLevels.has(lvl);
            this.knownCompletedLevels.add(lvl);

            const eventId = `game-lvl-${lvl}`;
            if (!this.data.activities.some((a) => a.id === eventId)) {
              this.data.activities.unshift({
                id: eventId,
                title: `Completed Game Level ${lvl}`,
                typeLabel: 'GAME COMPLETED',
                points: 10,
                timestamp: Date.now(),
              });
              hasChanges = true;

              if (emitNotification && isNewToKnown) {
                this.emitNotification({
                  id: `notif-${Date.now()}-${Math.random()}`,
                  amount: 10,
                  title: '+10 Points',
                  message: 'Game Level Completed',
                  type: 'reward',
                  timestamp: Date.now(),
                });
              }
            }
          }
        });
      }

      // 2. Theory Modules Completed (12 modules, 2 pts each)
      if (Array.isArray(pState.completedTheoryChapters)) {
        pState.completedTheoryChapters.forEach((chap) => {
          const isNewToKnown = !this.knownCompletedTheory.has(chap);
          this.knownCompletedTheory.add(chap);

          const eventId = `theory-${chap}`;
          if (!this.data.activities.some((a) => a.id === eventId)) {
            const num = chap.replace(/\D/g, '') || chap;
            this.data.activities.unshift({
              id: eventId,
              title: `Completed Theory Module ${parseInt(num, 10) || num}`,
              typeLabel: 'THEORY COMPLETED',
              points: 2,
              timestamp: Date.now(),
            });
            hasChanges = true;

            if (emitNotification && isNewToKnown) {
              this.emitNotification({
                id: `notif-${Date.now()}-${Math.random()}`,
                amount: 2,
                title: '+2 Points',
                message: 'Theory Module Completed',
                type: 'reward',
                timestamp: Date.now(),
              });
            }
          }
        });
      }

      // 3. Visualization Modules Completed (2 modules, 3 pts each)
      if (Array.isArray(pState.completedVideos)) {
        pState.completedVideos.forEach((vid) => {
          const isNewToKnown = !this.knownCompletedVideos.has(vid);
          this.knownCompletedVideos.add(vid);

          const eventId = `video-${vid}`;
          if (!this.data.activities.some((a) => a.id === eventId)) {
            const vidNum = vid.includes('02') || vid.includes('collision') ? '2' : '1';
            this.data.activities.unshift({
              id: eventId,
              title: `Completed Visualization Module ${vidNum}`,
              typeLabel: 'VISUALIZATION COMPLETED',
              points: 3,
              timestamp: Date.now(),
            });
            hasChanges = true;

            if (emitNotification && isNewToKnown) {
              this.emitNotification({
                id: `notif-${Date.now()}-${Math.random()}`,
                amount: 3,
                title: '+3 Points',
                message: 'Visualization Completed',
                type: 'reward',
                timestamp: Date.now(),
              });
            }
          }
        });
      }

      if (hasChanges) {
        this.saveData();
      }
    } catch {
      // Ignore
    }
  }

  public subscribe(listener: PointsListener): () => void {
    this.listeners.add(listener);
    listener(this.getPoints());
    return () => {
      this.listeners.delete(listener);
    };
  }

  public subscribeNotifications(listener: NotificationListener): () => void {
    this.notificationListeners.add(listener);
    return () => {
      this.notificationListeners.delete(listener);
    };
  }

  public emitNotification(notification: PointNotification) {
    this.notificationListeners.forEach((fn) => {
      try {
        fn(notification);
      } catch {
        // Safe dispatch
      }
    });
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
   * Real total supports negative values (e.g. -2, -12).
   */
  public getPoints(): PointsState {
    // 1. Theory Modules: 12 modules, +2 points each on first completion (max 24)
    const theoryStats = progressManager.getTheoryStats();
    const theoryPoints = Math.min(24, Math.max(0, theoryStats.completed * 2));

    // 2. Quiz Points: +2 correct, -1 wrong (capped at 20)
    const quizPoints = Math.min(20, this.data.quizPoints);

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

    // Total points calculation (allows negative values, e.g. -2, -12)
    const totalPoints = theoryPoints + quizPoints + visualizePoints + gamePoints - hintPenalties - guidedSolvePenalties;

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

  public getActivities(): PointActivityEvent[] {
    this.syncProgressActivities(false);
    return [...this.data.activities].sort((a, b) => b.timestamp - a.timestamp);
  }

  /**
   * Records a genuine quiz answer submission.
   * Awards +2 for correct, deducts -1 for wrong.
   * Capped at max 20 points.
   * Immediately updates points balance, records activity, and triggers notification.
   */
  public recordQuizAnswer(questionId: number, isCorrect: boolean): boolean {
    if (this.data.processedQuizQuestionIds.includes(questionId)) {
      return false; // Prevent duplicate scoring for the same question submission
    }

    this.data.processedQuizQuestionIds.push(questionId);

    const prevQuizPoints = this.data.quizPoints;
    const candidateQuizPoints = isCorrect ? Math.min(20, prevQuizPoints + 2) : prevQuizPoints - 1;
    const actualDelta = candidateQuizPoints - prevQuizPoints;
    this.data.quizPoints = candidateQuizPoints;

    if (actualDelta !== 0) {
      this.data.activities.unshift({
        id: `quiz-${questionId}-${Date.now()}`,
        title: isCorrect ? `Correct Quiz Answer (Q${questionId})` : `Incorrect Quiz Answer (Q${questionId})`,
        typeLabel: isCorrect ? 'QUIZ CORRECT' : 'QUIZ INCORRECT',
        points: actualDelta,
        timestamp: Date.now(),
      });
    }

    this.saveData();
    this.notifyListeners();

    // Trigger Popup Notification only for actual applied points change
    if (actualDelta > 0) {
      this.emitNotification({
        id: `notif-${Date.now()}-${Math.random()}`,
        amount: actualDelta,
        title: `+${actualDelta} ${actualDelta === 1 ? 'Point' : 'Points'}`,
        message: 'Correct Answer!',
        type: 'reward',
        timestamp: Date.now(),
      });
    } else if (actualDelta < 0) {
      this.emitNotification({
        id: `notif-${Date.now()}-${Math.random()}`,
        amount: actualDelta,
        title: `${actualDelta} ${Math.abs(actualDelta) === 1 ? 'Point' : 'Points'}`,
        message: 'Incorrect Answer',
        type: 'penalty',
        timestamp: Date.now(),
      });
    }

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
  public recordHintUse(levelId?: number) {
    this.data.hintUsesCount += 1;
    const lvlText = levelId ? `Level ${levelId}` : 'Game';
    this.data.activities.unshift({
      id: `hint-${Date.now()}-${Math.random()}`,
      title: `Used Hint: ${lvlText}`,
      typeLabel: 'HINT USED',
      points: -2,
      timestamp: Date.now(),
    });
    this.saveData();
    this.notifyListeners();

    // Trigger Popup Notification
    this.emitNotification({
      id: `notif-${Date.now()}-${Math.random()}`,
      amount: -2,
      title: '-2 Points',
      message: 'Hint Used',
      type: 'penalty',
      timestamp: Date.now(),
    });
  }

  /**
   * Records a genuine guided-solve activation. Deducts 3 points per activation.
   */
  public recordGuidedSolveUse(levelId?: number) {
    this.data.guidedSolveUsesCount += 1;
    const lvlText = levelId ? `Level ${levelId}` : 'Game';
    this.data.activities.unshift({
      id: `guided-${Date.now()}-${Math.random()}`,
      title: `Used Guided Solve: ${lvlText}`,
      typeLabel: 'GUIDED SOLVE USED',
      points: -3,
      timestamp: Date.now(),
    });
    this.saveData();
    this.notifyListeners();

    // Trigger Popup Notification
    this.emitNotification({
      id: `notif-${Date.now()}-${Math.random()}`,
      amount: -3,
      title: '-3 Points',
      message: 'Guided Solve Used',
      type: 'penalty',
      timestamp: Date.now(),
    });
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
      activities: [],
    };
    this.knownCompletedTheory.clear();
    this.knownCompletedVideos.clear();
    this.knownCompletedLevels.clear();
    this.saveData();
    this.notifyListeners();
  }
}

export const pointsManager = new PointsManager();
