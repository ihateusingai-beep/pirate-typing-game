import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  loadProgress,
  saveProgress,
  clearProgress,
  recordStars,
  recordCombo,
  STORAGE_KEY_PUBLIC,
} from './storage';
import type { Progress } from '../types';

const DEFAULT: Progress = {
  highestLevelUnlocked: 0,
  starsByLevel: {},
  totalLevelsCompleted: 0,
  bestCombo: 0,
};

beforeEach(() => {
  localStorage.clear();
});

afterEach(() => {
  localStorage.clear();
});

describe('loadProgress', () => {
  it('returns default when no localStorage entry exists', () => {
    expect(loadProgress()).toEqual(DEFAULT);
  });

  it('returns default when localStorage value is malformed JSON', () => {
    localStorage.setItem(STORAGE_KEY_PUBLIC, '{not valid json');
    expect(loadProgress()).toEqual(DEFAULT);
  });

  it('merges partial saved progress with defaults (forward-compat)', () => {
    localStorage.setItem(STORAGE_KEY_PUBLIC, JSON.stringify({ highestLevelUnlocked: 5 }));
    const loaded = loadProgress();
    expect(loaded.highestLevelUnlocked).toBe(5);
    expect(loaded.starsByLevel).toEqual({});
    expect(loaded.bestCombo).toBe(0);
  });

  it('preserves all saved fields', () => {
    const saved: Progress = {
      highestLevelUnlocked: 7,
      starsByLevel: { 1: 3, 2: 2, 5: 1 },
      totalLevelsCompleted: 3,
      bestCombo: 12,
    };
    localStorage.setItem(STORAGE_KEY_PUBLIC, JSON.stringify(saved));
    expect(loadProgress()).toEqual(saved);
  });
});

describe('saveProgress / clearProgress', () => {
  it('round-trips through localStorage', () => {
    saveProgress({ highestLevelUnlocked: 3, starsByLevel: { 1: 3 }, totalLevelsCompleted: 1, bestCombo: 5 });
    expect(loadProgress().highestLevelUnlocked).toBe(3);
  });

  it('clearProgress removes the entry', () => {
    saveProgress({ highestLevelUnlocked: 3, starsByLevel: {}, totalLevelsCompleted: 0, bestCombo: 0 });
    clearProgress();
    expect(loadProgress()).toEqual(DEFAULT);
  });
});

describe('recordStars', () => {
  it('updates highestLevelUnlocked to level+1', () => {
    const next = recordStars(DEFAULT, 2, 3);
    expect(next.highestLevelUnlocked).toBe(3);
  });

  it('clamps highestLevelUnlocked to MAX_LEVEL (15)', () => {
    const next = recordStars(DEFAULT, 15, 3);
    expect(next.highestLevelUnlocked).toBe(15);
  });

  it('records best-of stars for each level', () => {
    let p: Progress = { ...DEFAULT };
    p = recordStars(p, 3, 1);
    p = recordStars(p, 3, 3); // upgrade
    expect(p.starsByLevel[3]).toBe(3);
  });

  it('does NOT downgrade stars (best-of)', () => {
    let p: Progress = { ...DEFAULT };
    p = recordStars(p, 3, 3);
    p = recordStars(p, 3, 1); // lower — should stay 3
    expect(p.starsByLevel[3]).toBe(3);
  });

  it('increments totalLevelsCompleted by 1 per record', () => {
    let p: Progress = { ...DEFAULT };
    p = recordStars(p, 1, 2);
    expect(p.totalLevelsCompleted).toBe(1);
    p = recordStars(p, 2, 3);
    expect(p.totalLevelsCompleted).toBe(2);
  });

  it('preserves previous highestLevelUnlocked if already higher (replay safety)', () => {
    // User has already unlocked L10. Replaying L5 should NOT regress to L6.
    const start: Progress = { ...DEFAULT, highestLevelUnlocked: 10 };
    const next = recordStars(start, 5, 3);
    expect(next.highestLevelUnlocked).toBe(10); // max(10, 5+1) = max(10, 6) = 10
  });

  it('does unlock level+1 when previous unlock was lower', () => {
    const start: Progress = { ...DEFAULT, highestLevelUnlocked: 2 };
    const next = recordStars(start, 5, 3);
    expect(next.highestLevelUnlocked).toBe(6); // max(2, 5+1) = 6
  });
});

describe('recordCombo', () => {
  it('updates bestCombo when new combo is higher', () => {
    const next = recordCombo(DEFAULT, 7);
    expect(next.bestCombo).toBe(7);
  });

  it('does NOT update when new combo is lower', () => {
    let p: Progress = { ...DEFAULT, bestCombo: 10 };
    p = recordCombo(p, 5);
    expect(p.bestCombo).toBe(10);
  });

  it('does NOT update when new combo equals best', () => {
    let p: Progress = { ...DEFAULT, bestCombo: 10 };
    p = recordCombo(p, 10);
    expect(p.bestCombo).toBe(10);
  });
});
