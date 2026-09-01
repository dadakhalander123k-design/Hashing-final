import { ModuleRecord, ModuleStatus, UserProgressState } from '../types/game';

const STORAGE_KEY = 'hash_quest_field_notes_progress_v2';

export const FIELD_NOTES_MODULES: Omit<ModuleRecord, 'status' | 'progressPercent'>[] = [
  {
    id: 'fn-01-basics',
    number: '01',
    code: 'FN-01',
    title: 'HASHING BASICS & O(1) TIME',
    category: 'FOUNDATION',
    description: 'Understand direct addressing, hash tables, and why hash lookups operate in average O(1) constant time.',
    criteriaDescription: 'Read the foundation theory and complete the interactive O(1) vs O(n) lookup speed race.',
    targetTab: 'THEORY',
    targetChapterId: 'theory-01',
  },
  {
    id: 'fn-02-modulo',
    number: '02',
    code: 'FN-02',
    title: 'HASH FUNCTION & MODULO ARITHMETIC',
    category: 'FOUNDATION',
    description: 'Master the core modulus formula: h(key) = key mod table size to map numbers into array bounds.',
    criteriaDescription: 'Use the interactive modulo arithmetic calculator with at least 2 distinct keys and table sizes.',
    targetTab: 'THEORY',
    targetChapterId: 'theory-02',
  },
  {
    id: 'fn-03-level1-basic',
    number: '03',
    code: 'FN-03',
    title: 'DIRECT HASH TABLE (LEVEL 1)',
    category: 'TECHNIQUE',
    description: 'Compute remainders, place keys into array slots, and encounter the natural collision phenomenon.',
    criteriaDescription: 'Calculate and place all 4 keys in Level 1 and trigger the collision event with Key 33.',
    targetTab: 'GAME',
    targetLevelId: 1,
  },
  {
    id: 'fn-04-level2-chaining',
    number: '04',
    code: 'FN-04',
    title: 'SEPARATE CHAINING (LEVEL 2)',
    category: 'TECHNIQUE',
    description: 'Closed addressing strategy where each slot holds a linked list to gracefully store colliding elements.',
    criteriaDescription: 'Complete Level 2 by calculating hashes and inserting all 5 keys into linked buckets.',
    targetTab: 'GAME',
    targetLevelId: 2,
  },
  {
    id: 'fn-05-level3-linear',
    number: '05',
    code: 'FN-05',
    title: 'LINEAR PROBING (LEVEL 3)',
    category: 'TECHNIQUE',
    description: 'Open addressing algorithm searching sequentially (+1, +2...) for the nearest open slot upon collision.',
    criteriaDescription: 'Complete Level 3 by calculating probe steps and inserting all 5 keys into open table slots.',
    targetTab: 'GAME',
    targetLevelId: 3,
  },
  {
    id: 'fn-06-level4-quadratic',
    number: '06',
    code: 'FN-06',
    title: 'QUADRATIC PROBING (LEVEL 4)',
    category: 'TECHNIQUE',
    description: 'Leaping open addressing using square increments (+1², +2², +3²) to avoid primary clustering.',
    criteriaDescription: 'Complete Level 4 by computing square probe steps and inserting all 4 keys.',
    targetTab: 'GAME',
    targetLevelId: 4,
  },
  {
    id: 'fn-07-level5-double',
    number: '07',
    code: 'FN-07',
    title: 'DOUBLE HASHING (LEVEL 5)',
    category: 'TECHNIQUE',
    description: 'Advanced dual-hash resolution where a second function h2(key) computes a unique non-zero jump interval.',
    criteriaDescription: 'Complete Level 5 by calculating h1 base index and h2 step size for all 4 keys.',
    targetTab: 'GAME',
    targetLevelId: 5,
  },
  {
    id: 'fn-08-load-factor',
    number: '08',
    code: 'FN-08',
    title: 'LOAD FACTOR & REHASHING',
    category: 'ANALYSIS',
    description: 'Analyze table saturation alpha = n/m, threshold limits (0.75), and array doubling with rehashing.',
    criteriaDescription: 'Interact with the dynamic Load Factor gauge or master advanced theory chapters.',
    targetTab: 'THEORY',
    targetChapterId: 'theory-08',
  },
  {
    id: 'fn-09-quiz',
    number: '09',
    code: 'FN-09',
    title: 'SIMPLE HASHING QUIZ',
    category: 'EXAMINATION',
    description: '10-question comprehensive assessment covering modulo hashing, collisions, separate chaining, linear/quadratic probing, and double hashing.',
    criteriaDescription: 'Complete all 10 questions. Score 8-10 for Excellent (Mastered) or 6-7 for Good (Completed).',
    targetTab: 'QUIZ',
    targetChapterId: 'knowledge-quiz',
  },
  {
    id: 'fn-10-completion',
    number: '10',
    code: 'FN-10',
    title: 'ALGORITHM MASTERY COMPLETION',
    category: 'EXAMINATION',
    description: 'Complete all 5 collision resolution levels and review the full algorithm certification suite.',
    criteriaDescription: 'Complete all 5 levels in Game mode to achieve full DSA Hashing Mastery Completion.',
    targetTab: 'GAME',
    targetLevelId: 6,
  },
];

const INITIAL_PROGRESS: UserProgressState = {
  version: 2,
  modules: {
    'fn-01-basics': 'NOT_STARTED',
    'fn-02-modulo': 'NOT_STARTED',
    'fn-03-level1-basic': 'NOT_STARTED',
    'fn-04-level2-chaining': 'NOT_STARTED',
    'fn-05-level3-linear': 'NOT_STARTED',
    'fn-06-level4-quadratic': 'NOT_STARTED',
    'fn-07-level5-double': 'NOT_STARTED',
    'fn-08-load-factor': 'NOT_STARTED',
    'fn-09-quiz': 'NOT_STARTED',
    'fn-10-completion': 'NOT_STARTED',
  },
  moduleProgress: {},
  completedTheoryChapters: [],
  currentTheoryChapterId: 'theory-01',
  levelCompletedKeys: {},
  levelsCompleted: [],
  levelsMastered: [],
  quizScores: {},
  quizSubmitted: false,
  quizFinalScore: 0,
  masterChallengesCompleted: [],
  sandboxOperationsCount: 0,
  totalScore: 0,
  streak: 0,
  currentActiveModuleId: 'fn-01-basics',
  lastActiveTimestamp: Date.now(),
  completedVideos: [],
};

// Normalized map of chapter aliases to standard IDs
export const THEORY_ID_MAP: Record<string, string> = {
  'what-is-hashing': 'theory-01',
  'hash-function': 'theory-02',
  'hash-table': 'theory-03',
  'hashing-lifecycle': 'theory-04',
  'what-is-a-collision': 'theory-05',
  'separate-chaining': 'theory-06',
  'linear-probing': 'theory-07',
  'quadratic-probing': 'theory-08',
  'double-hashing': 'theory-09',
  'real-world-applications': 'theory-10',
  'core-advantages': 'theory-11',
  'limitations-tradeoffs': 'theory-12',
  'load-factor': 'theory-08',
  '01': 'theory-01',
  '02': 'theory-02',
  '03': 'theory-03',
  '04': 'theory-04',
  '05': 'theory-05',
  '06': 'theory-06',
  '07': 'theory-07',
  '08': 'theory-08',
  '09': 'theory-09',
  '10': 'theory-10',
  '11': 'theory-11',
  '12': 'theory-12',
};

export const normalizeTheoryChapterId = (idOrSlug: string): string => {
  if (!idOrSlug) return 'theory-01';
  if (idOrSlug.startsWith('theory-')) return idOrSlug;
  return THEORY_ID_MAP[idOrSlug] || idOrSlug;
};

type ProgressListener = (state: UserProgressState) => void;

class ProgressManager {
  private state: UserProgressState;
  private listeners: Set<ProgressListener> = new Set();

  constructor() {
    this.state = this.loadState();
  }

  private loadState(): UserProgressState {
    if (typeof window === 'undefined') return INITIAL_PROGRESS;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return INITIAL_PROGRESS;
      const parsed = JSON.parse(stored);
      if (parsed && parsed.version === 2) {
        return {
          ...INITIAL_PROGRESS,
          ...parsed,
          completedTheoryChapters: Array.isArray(parsed.completedTheoryChapters)
            ? Array.from(new Set(parsed.completedTheoryChapters.map(normalizeTheoryChapterId)))
            : [],
          currentTheoryChapterId: parsed.currentTheoryChapterId
            ? normalizeTheoryChapterId(parsed.currentTheoryChapterId)
            : 'theory-01',
          completedVideos: Array.isArray(parsed.completedVideos)
            ? parsed.completedVideos
            : [],
        };
      }
      return INITIAL_PROGRESS;
    } catch {
      return INITIAL_PROGRESS;
    }
  }

  private saveState() {
    if (typeof window === 'undefined') return;
    try {
      this.state.lastActiveTimestamp = Date.now();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
      this.notifyListeners();
    } catch {
      // Ignore write errors
    }
  }

  public subscribe(listener: ProgressListener): () => void {
    this.listeners.add(listener);
    listener(this.getState());
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners() {
    const copy = this.getState();
    this.listeners.forEach((fn) => fn(copy));
  }

  public getState(): UserProgressState {
    return JSON.parse(JSON.stringify(this.state));
  }

  public getTheoryStats() {
    const list = this.state.completedTheoryChapters || [];
    const completed = list.length;
    const total = 12;
    const percentage = Math.round((completed / total) * 100);
    return {
      total,
      completed,
      percentage,
      isComplete: completed >= total,
      completedIds: [...list],
      currentChapterId: this.state.currentTheoryChapterId,
    };
  }

  public getVideoStats() {
    const list = this.state.completedVideos || [];
    const isIntroCompleted = list.includes('lesson-01') || list.includes('introduction');
    const isCollisionCompleted = list.includes('lesson-02') || list.includes('collision');
    const completed = (isIntroCompleted ? 1 : 0) + (isCollisionCompleted ? 1 : 0);
    const total = 2;
    const percentage = Math.round((completed / total) * 100);

    return {
      total,
      completed,
      percentage,
      isIntroCompleted,
      isCollisionCompleted,
      isComplete: completed >= total,
      completedVideos: [...list],
    };
  }

  public getGameStats() {
    const completedList = (this.state.levelsCompleted || []).filter(
      (lvl) => lvl >= 1 && lvl <= 5
    );
    const completed = completedList.length;
    const total = 5;
    const percentage = Math.round((completed / total) * 100);

    return {
      total,
      completed,
      percentage,
      isComplete: completed >= total,
      completedLevels: [...completedList],
    };
  }

  public getQuizStats() {
    const isSubmitted = Boolean(this.state.quizSubmitted);
    const completed = isSubmitted ? 1 : 0;
    const total = 1;
    const percentage = isSubmitted ? 100 : 0;

    return {
      total,
      completed,
      percentage,
      isSubmitted,
      finalScore: this.state.quizFinalScore || 0,
      isComplete: isSubmitted,
    };
  }

  public getModules(): ModuleRecord[] {
    const theoryDone = this.state.completedTheoryChapters || [];
    const levelsDone = this.state.levelsCompleted || [];
    const quizDone = Boolean(this.state.quizSubmitted);

    return FIELD_NOTES_MODULES.map((m) => {
      let status = this.state.modules[m.id] || 'NOT_STARTED';
      let progressPercent = this.state.moduleProgress[m.id] || 0;

      // Deterministic sync with underlying activity states
      if (m.id === 'fn-01-basics' && theoryDone.includes('theory-01')) {
        status = 'COMPLETED';
        progressPercent = 100;
      } else if (m.id === 'fn-02-modulo' && theoryDone.includes('theory-02')) {
        status = 'COMPLETED';
        progressPercent = 100;
      } else if (m.id === 'fn-03-level1-basic' && levelsDone.includes(1)) {
        status = this.state.levelsMastered.includes(1) ? 'MASTERED' : 'COMPLETED';
        progressPercent = 100;
      } else if (m.id === 'fn-04-level2-chaining' && levelsDone.includes(2)) {
        status = this.state.levelsMastered.includes(2) ? 'MASTERED' : 'COMPLETED';
        progressPercent = 100;
      } else if (m.id === 'fn-05-level3-linear' && levelsDone.includes(3)) {
        status = this.state.levelsMastered.includes(3) ? 'MASTERED' : 'COMPLETED';
        progressPercent = 100;
      } else if (m.id === 'fn-06-level4-quadratic' && levelsDone.includes(4)) {
        status = this.state.levelsMastered.includes(4) ? 'MASTERED' : 'COMPLETED';
        progressPercent = 100;
      } else if (m.id === 'fn-07-level5-double' && levelsDone.includes(5)) {
        status = this.state.levelsMastered.includes(5) ? 'MASTERED' : 'COMPLETED';
        progressPercent = 100;
      } else if (
        m.id === 'fn-08-load-factor' &&
        (theoryDone.includes('theory-08') || theoryDone.includes('theory-10') || this.state.sandboxOperationsCount >= 3)
      ) {
        status = 'COMPLETED';
        progressPercent = 100;
      } else if (m.id === 'fn-09-quiz' && quizDone) {
        status = (this.state.quizFinalScore >= 80) ? 'MASTERED' : 'COMPLETED';
        progressPercent = 100;
      } else if (m.id === 'fn-10-completion' && [1, 2, 3, 4, 5].every((lvl) => levelsDone.includes(lvl))) {
        const allMastered = [1, 2, 3, 4, 5].every((lvl) => this.state.levelsMastered.includes(lvl));
        status = allMastered ? 'MASTERED' : 'COMPLETED';
        progressPercent = 100;
      }

      if (status === 'COMPLETED' || status === 'MASTERED') {
        progressPercent = 100;
      } else if (status === 'IN_PROGRESS' && progressPercent === 0) {
        progressPercent = 50;
      }

      return {
        ...m,
        status,
        progressPercent,
      };
    });
  }

  public getStats() {
    const theory = this.getTheoryStats();
    const video = this.getVideoStats();
    const game = this.getGameStats();
    const quiz = this.getQuizStats();

    // 20 distinct measurable learning activities:
    // 12 Theory Chapters + 2 Videos + 5 Game Levels + 1 Whole Quiz
    const total = 20;
    const completed = theory.completed + video.completed + game.completed + quiz.completed;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    const modules = this.getModules();
    const mastered = modules.filter((m) => m.status === 'MASTERED').length;

    // Find next unfinished module
    const currentUnfinished =
      modules.find(
        (m) => m.status === 'IN_PROGRESS' || m.status === 'NOT_STARTED'
      ) || modules[modules.length - 1];

    return {
      total,
      completed,
      mastered,
      percentage,
      nextModule: currentUnfinished,
      theory,
      video,
      game,
      quiz,
    };
  }

  // =========================================================================
  // THEORY SPECIFIC PROGRESS (Idempotent & Exact)
  // =========================================================================
  public isTheoryChapterCompleted(chapterId: string): boolean {
    const normalized = normalizeTheoryChapterId(chapterId);
    return (this.state.completedTheoryChapters || []).includes(normalized);
  }

  public completeTheoryChapter(chapterId: string): boolean {
    const normalized = normalizeTheoryChapterId(chapterId);

    if (!this.state.completedTheoryChapters) {
      this.state.completedTheoryChapters = [];
    }

    // Idempotent check: if already completed, do not re-add
    if (this.state.completedTheoryChapters.includes(normalized)) {
      return false; // Already completed
    }

    this.state.completedTheoryChapters.push(normalized);
    this.state.currentTheoryChapterId = normalized;

    // Synchronize underlying curriculum modules
    if (normalized === 'theory-01') {
      this.completeModule('fn-01-basics');
    }
    if (normalized === 'theory-02' || normalized === 'theory-03') {
      this.completeModule('fn-02-modulo');
    }
    if (
      normalized === 'theory-08' ||
      normalized === 'theory-10' ||
      normalized === 'theory-11' ||
      normalized === 'theory-12'
    ) {
      this.completeModule('fn-08-load-factor');
    }

    this.saveState();
    return true; // Newly completed!
  }

  public setCurrentTheoryChapter(chapterId: string) {
    const normalized = normalizeTheoryChapterId(chapterId);
    this.state.currentTheoryChapterId = normalized;
    this.saveState();
  }

  // =========================================================================
  // VIDEO SPECIFIC PROGRESS (Idempotent & Independent)
  // =========================================================================
  public isVideoCompleted(videoId: string): boolean {
    const list = this.state.completedVideos || [];
    return list.includes(videoId);
  }

  public completeVideo(videoId: string): boolean {
    if (!this.state.completedVideos) {
      this.state.completedVideos = [];
    }
    if (this.state.completedVideos.includes(videoId)) {
      return false; // Already completed
    }
    this.state.completedVideos.push(videoId);
    this.saveState();
    return true; // Newly completed!
  }

  // =========================================================================
  // MODULE LEVEL METHODS
  // =========================================================================
  public startModule(moduleId: string) {
    if (!this.state.modules[moduleId] || this.state.modules[moduleId] === 'NOT_STARTED') {
      this.state.modules[moduleId] = 'IN_PROGRESS';
      this.state.moduleProgress[moduleId] = Math.max(this.state.moduleProgress[moduleId] || 0, 25);
      this.state.currentActiveModuleId = moduleId;
      this.saveState();
    }
  }

  public updateModuleProgress(moduleId: string, percent: number) {
    if (this.state.modules[moduleId] !== 'COMPLETED' && this.state.modules[moduleId] !== 'MASTERED') {
      this.state.modules[moduleId] = 'IN_PROGRESS';
      this.state.moduleProgress[moduleId] = Math.min(
        100,
        Math.max(this.state.moduleProgress[moduleId] || 0, percent)
      );
      this.state.currentActiveModuleId = moduleId;
      this.saveState();
    }
  }

  public completeModule(moduleId: string, isMastered: boolean = false) {
    const currentStatus = this.state.modules[moduleId];
    const newStatus: ModuleStatus =
      isMastered || currentStatus === 'MASTERED' ? 'MASTERED' : 'COMPLETED';

    this.state.modules[moduleId] = newStatus;
    this.state.moduleProgress[moduleId] = 100;
    this.state.currentActiveModuleId = moduleId;
    this.saveState();
  }

  public markLevelCompleted(levelId: number, scoreAwarded: number = 100, isPerfect: boolean = false) {
    if (!this.state.levelsCompleted) {
      this.state.levelsCompleted = [];
    }
    if (!this.state.levelsMastered) {
      this.state.levelsMastered = [];
    }

    const wasAlreadyCompleted = this.state.levelsCompleted.includes(levelId);

    if (!wasAlreadyCompleted) {
      this.state.levelsCompleted.push(levelId);
    }
    if (isPerfect && !this.state.levelsMastered.includes(levelId)) {
      this.state.levelsMastered.push(levelId);
    }

    // Map level to module ID
    const levelToModuleMap: Record<number, string> = {
      1: 'fn-03-level1-basic',
      2: 'fn-04-level2-chaining',
      3: 'fn-05-level3-linear',
      4: 'fn-06-level4-quadratic',
      5: 'fn-07-level5-double',
    };

    const moduleId = levelToModuleMap[levelId];
    if (moduleId) {
      this.completeModule(moduleId, isPerfect);
    }

    // If all 5 levels are completed, mark Algorithm Mastery Completion (FN-10)
    const allFiveDone = [1, 2, 3, 4, 5].every((lvl) => this.state.levelsCompleted.includes(lvl));
    if (allFiveDone) {
      const allFiveMastered = [1, 2, 3, 4, 5].every((lvl) => this.state.levelsMastered.includes(lvl));
      this.completeModule('fn-10-completion', allFiveMastered);
    }

    // Advance current active module to next level if available
    if (levelId < 5) {
      const nextModuleId = levelToModuleMap[levelId + 1];
      if (nextModuleId && this.state.modules[nextModuleId] === 'NOT_STARTED') {
        this.state.modules[nextModuleId] = 'IN_PROGRESS';
      }
    }

    this.saveState();
  }

  public checkAndCompleteCertification() {
    const modules = this.getModules();
    const otherNineDone = modules
      .filter((m) => m.id !== 'fn-10-completion')
      .every((m) => m.status === 'COMPLETED' || m.status === 'MASTERED');

    if (
      otherNineDone &&
      this.state.modules['fn-10-completion'] !== 'COMPLETED' &&
      this.state.modules['fn-10-completion'] !== 'MASTERED'
    ) {
      this.completeModule('fn-10-completion', true);
    }
  }

  public setCelebrationAcknowledged() {
    this.state.hasCelebrated100Percent = true;
    this.saveState();
  }

  public recordQuizCompletion(scores: Record<number, number>, correctCount: number, totalQuestions: number) {
    this.state.quizScores = scores;
    this.state.quizSubmitted = true;
    const percentage = Math.round((correctCount / totalQuestions) * 100);
    this.state.quizFinalScore = percentage;

    if (correctCount >= 8) {
      this.completeModule('fn-09-quiz', true); // 8-10: Excellent — Hashing Master!
    } else if (correctCount >= 6) {
      this.completeModule('fn-09-quiz', false); // 6-7: Good — Completed
    } else {
      this.updateModuleProgress('fn-09-quiz', percentage);
    }
    this.saveState();
  }

  public resetQuizAttempt() {
    this.state.quizScores = {};
    this.state.quizSubmitted = false;
    this.state.quizFinalScore = 0;
    this.saveState();
  }

  public recordMasterChallenge(challengeId: string) {
    if (!this.state.masterChallengesCompleted) {
      this.state.masterChallengesCompleted = [];
    }
    if (!this.state.masterChallengesCompleted.includes(challengeId)) {
      this.state.masterChallengesCompleted.push(challengeId);
    }
    const totalDone = this.state.masterChallengesCompleted.length;
    if (totalDone >= 4) {
      this.completeModule('fn-10-completion', true); // Mastered
    } else if (totalDone >= 2) {
      this.completeModule('fn-10-completion', false); // Completed
    } else {
      this.updateModuleProgress('fn-10-completion', totalDone * 25);
    }
    this.saveState();
  }

  public recordSandboxOp() {
    this.state.sandboxOperationsCount += 1;
    if (this.state.sandboxOperationsCount >= 3) {
      this.updateModuleProgress('fn-08-load-factor', 100);
    }
    this.saveState();
  }

  public resetProgress() {
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem('hash_quest_quiz_answers_v3');
        localStorage.removeItem('hash_quest_quiz_submitted_v3');
      } catch {
        // Ignore storage errors
      }
    }

    this.state = {
      version: 2,
      modules: {
        'fn-01-basics': 'NOT_STARTED',
        'fn-02-modulo': 'NOT_STARTED',
        'fn-03-level1-basic': 'NOT_STARTED',
        'fn-04-level2-chaining': 'NOT_STARTED',
        'fn-05-level3-linear': 'NOT_STARTED',
        'fn-06-level4-quadratic': 'NOT_STARTED',
        'fn-07-level5-double': 'NOT_STARTED',
        'fn-08-load-factor': 'NOT_STARTED',
        'fn-09-quiz': 'NOT_STARTED',
        'fn-10-completion': 'NOT_STARTED',
      },
      moduleProgress: {},
      completedTheoryChapters: [],
      currentTheoryChapterId: 'theory-01',
      levelCompletedKeys: {},
      levelsCompleted: [],
      levelsMastered: [],
      quizScores: {},
      quizSubmitted: false,
      quizFinalScore: 0,
      masterChallengesCompleted: [],
      sandboxOperationsCount: 0,
      totalScore: 0,
      streak: 0,
      currentActiveModuleId: 'fn-01-basics',
      lastActiveTimestamp: Date.now(),
      completedVideos: [],
      hasCelebrated100Percent: false,
    };
    this.saveState();
  }
}

export const progressManager = new ProgressManager();
