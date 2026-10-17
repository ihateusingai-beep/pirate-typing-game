// ============================================================================
// LocalStorage wrapper — pirate version
// ============================================================================

import type { Progress } from '../types';

const STORAGE_KEY = 'pirate-typing-progress-v1';
const MAX_LEVEL = 15;

/** Exposed for tests + future migrations */
export const STORAGE_KEY_PUBLIC = STORAGE_KEY;

const DEFAULT_PROGRESS: Progress = {
  highestLevelUnlocked: 0,
  starsByLevel: {},
  totalLevelsCompleted: 0,
  bestCombo: 0,
};

export function loadProgress(): Progress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PROGRESS;
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_PROGRESS, ...parsed };
  } catch {
    return DEFAULT_PROGRESS;
  }
}

export function saveProgress(p: Progress): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
  } catch {
    // localStorage may be unavailable (private mode, quota); fail silently
  }
}

export function clearProgress(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

export function recordStars(
  progress: Progress,
  levelId: number,
  stars: 0 | 1 | 2 | 3
): Progress {
  const existing = progress.starsByLevel[levelId] ?? 0;
  const next: Progress = {
    ...progress,
    starsByLevel: {
      ...progress.starsByLevel,
      [levelId]: Math.max(existing, stars) as 0 | 1 | 2 | 3,
    },
    // Clamp to MAX_LEVEL to avoid overflow when Lv15 completes
    highestLevelUnlocked: Math.min(MAX_LEVEL, Math.max(progress.highestLevelUnlocked, levelId + 1)),
    totalLevelsCompleted: progress.totalLevelsCompleted + 1,
  };
  saveProgress(next);
  return next;
}

export function recordCombo(progress: Progress, combo: number): Progress {
  if (combo <= progress.bestCombo) return progress;
  const next: Progress = { ...progress, bestCombo: combo };
  saveProgress(next);
  return next;
}