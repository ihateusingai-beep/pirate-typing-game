import { describe, it, expect } from 'vitest';
import { LEVELS, getLevel } from './levels';

describe('LEVELS config', () => {
  it('contains exactly 16 levels (L0–L15)', () => {
    expect(LEVELS).toHaveLength(16);
  });

  it('has unique IDs 0..15 in order', () => {
    const ids = LEVELS.map((l) => l.id);
    expect(ids).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]);
  });

  it('every level has at least one spell (except L0 tutorial)', () => {
    for (const level of LEVELS) {
      if (level.id === 0) {
        expect(level.spells).toEqual([]);
      } else {
        expect(level.spells.length).toBeGreaterThan(0);
      }
    }
  });

  it('every spell has a unique id (prevents duplicate-key bugs)', () => {
    const allIds = LEVELS.flatMap((l) => l.spells.map((s) => s.id));
    expect(new Set(allIds).size).toBe(allIds.length);
  });

  it('every spell has at least one token', () => {
    for (const level of LEVELS) {
      for (const spell of level.spells) {
        expect(spell.tokens.length).toBeGreaterThan(0);
      }
    }
  });

  it('L4 is the first level with timeLimit (matches curriculum)', () => {
    const before4 = LEVELS.filter((l) => l.id < 4);
    const at4 = LEVELS.find((l) => l.id === 4)!;
    expect(before4.every((l) => l.timeLimit === 0)).toBe(true);
    expect(at4.timeLimit).toBeGreaterThan(0);
  });

  it('L6 is the first level with comboEnabled (matches curriculum)', () => {
    const before6 = LEVELS.filter((l) => l.id < 6);
    const at6 = LEVELS.find((l) => l.id === 6)!;
    expect(before6.every((l) => !l.comboEnabled)).toBe(true);
    expect(at6.comboEnabled).toBe(true);
  });

  it('L11 is the first level with capsLockEnabled (matches curriculum)', () => {
    const before11 = LEVELS.filter((l) => l.id < 11);
    const at11 = LEVELS.find((l) => l.id === 11)!;
    expect(before11.every((l) => !l.capsLockEnabled)).toBe(true);
    expect(at11.capsLockEnabled).toBe(true);
  });

  it('L15 is the BOSS tier', () => {
    expect(LEVELS[15].tier).toBe('boss');
  });

  it('enemiesPerWave scales up (Lv1=1, Lv6=2, Lv9=3, Lv12=4, Lv15=1 boss)', () => {
    expect(LEVELS.find((l) => l.id === 1)!.enemiesPerWave).toBe(1);
    expect(LEVELS.find((l) => l.id === 6)!.enemiesPerWave).toBe(2);
    expect(LEVELS.find((l) => l.id === 9)!.enemiesPerWave).toBe(3);
    expect(LEVELS.find((l) => l.id === 12)!.enemiesPerWave).toBe(4);
    expect(LEVELS.find((l) => l.id === 15)!.enemiesPerWave).toBe(1); // boss — single target
  });
});

describe('getLevel', () => {
  it('returns the level by id', () => {
    expect(getLevel(0).name).toBe('航海圖');
    expect(getLevel(15).tier).toBe('boss');
  });

  it('throws on out-of-range id (defensive)', () => {
    expect(() => getLevel(-1)).toThrow();
    expect(() => getLevel(16)).toThrow();
    expect(() => getLevel(99)).toThrow();
  });
});
