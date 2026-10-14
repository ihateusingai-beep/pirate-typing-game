// ============================================================================
// LocalStorage wrapper — typed progress persistence
// ============================================================================

import type { Progress } from '../types';

const STORAGE_KEY = 'wizard-typing-progress-v1';

const DEFAULT_PROGRESS: Progress = {
  highestLevelUnlocked: 0,
  starsByLevel: {},
  totalSpellsCast: 0,
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
    highestLevelUnlocked: Math.max(progress.highestLevelUnlocked, levelId + 1),
    totalSpellsCast: progress.totalSpellsCast + 1,
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