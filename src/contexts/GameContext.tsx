// ============================================================================
// Game context — pirate version
// LIVE state: HP / score / combo / currentLevel / wave / timer / capLock / cannonType
// PERSISTENT state (in localStorage): highestLevelUnlocked / starsByLevel / bestCombo
// ============================================================================

import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import type { GameState } from '../types';

interface GameContextValue extends GameState {
  setHp: (hp: number) => void;
  addScore: (delta: number) => void;
  incCombo: () => void;
  resetCombo: () => void;
  setCapLock: (on: boolean) => void;
  setLevel: (id: number, totalWaves: number) => void;
  setWave: (current: number, total: number) => void;
  setTimer: (seconds: number) => void;
  setStatus: (s: GameState['gameStatus']) => void;
  setCannonType: (t: GameState['cannonType']) => void;
  reset: () => void;
}

const GameContext = createContext<GameContextValue | null>(null);

const INITIAL: GameState = {
  hp: 100,
  maxHp: 100,
  score: 0,
  combo: 0,
  currentLevelId: 0,
  currentWave: 0,
  totalWaves: 0,
  remainingSeconds: 0,
  capLockOn: false,
  gameStatus: 'idle',
  cannonType: 'normal',
};

export function GameProvider({ children }: { children: ReactNode }) {
  const [hp, setHp] = useState(INITIAL.hp);
  const [score, setScore] = useState(INITIAL.score);
  const [combo, setCombo] = useState(INITIAL.combo);
  const [currentLevelId, setCurrentLevelId] = useState(INITIAL.currentLevelId);
  const [currentWave, setCurrentWave] = useState(INITIAL.currentWave);
  const [totalWaves, setTotalWaves] = useState(INITIAL.totalWaves);
  const [remainingSeconds, setRemainingSeconds] = useState(INITIAL.remainingSeconds);
  const [capLockOn, setCapLockOn] = useState(INITIAL.capLockOn);
  const [gameStatus, setGameStatus] = useState<GameState['gameStatus']>(INITIAL.gameStatus);
  const [cannonType, setCannonTypeState] = useState<GameState['cannonType']>(INITIAL.cannonType);

  const addScore = useCallback((delta: number) => {
    setScore((s) => Math.max(0, s + delta));
  }, []);

  const incCombo = useCallback(() => setCombo((c) => c + 1), []);
  const resetCombo = useCallback(() => setCombo(0), []);
  const setCapLock = useCallback((on: boolean) => setCapLockOn(on), []);
  const setCannonType = useCallback((t: GameState['cannonType']) => setCannonTypeState(t), []);

  const setLevel = useCallback((id: number, waves: number) => {
    setCurrentLevelId(id);
    setTotalWaves(waves);
    setCurrentWave(1);
    setHp(INITIAL.hp);
    setScore(0);
    setCombo(0);
    setCapLockOn(false);
    setCannonTypeState('normal');
    setGameStatus('playing');
  }, []);

  const setWave = useCallback((current: number, total: number) => {
    setCurrentWave(current);
    setTotalWaves(total);
  }, []);

  const setTimer = useCallback((seconds: number) => setRemainingSeconds(seconds), []);
  const setStatus = useCallback((s: GameState['gameStatus']) => setGameStatus(s), []);

  const reset = useCallback(() => {
    setHp(INITIAL.hp);
    setScore(0);
    setCombo(0);
    setCurrentWave(0);
    setTotalWaves(0);
    setRemainingSeconds(0);
    setCapLockOn(false);
    setCannonTypeState('normal');
    setGameStatus('idle');
  }, []);

  const value = useMemo<GameContextValue>(
    () => ({
      hp, maxHp: INITIAL.maxHp, score, combo,
      currentLevelId, currentWave, totalWaves,
      remainingSeconds, capLockOn, gameStatus, cannonType,
      setHp, addScore, incCombo, resetCombo, setCapLock,
      setLevel, setWave, setTimer, setStatus, setCannonType, reset,
    }),
    [hp, score, combo, currentLevelId, currentWave, totalWaves,
     remainingSeconds, capLockOn, gameStatus, cannonType,
     addScore, incCombo, resetCombo, setCapLock,
     setLevel, setWave, setTimer, setStatus, setCannonType, reset]
  );

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame(): GameContextValue {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used inside GameProvider');
  return ctx;
}