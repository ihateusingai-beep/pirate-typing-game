// ============================================================================
// App — root component. Mounts the GameProvider, holds the screen state,
// loads progress from localStorage.
// ============================================================================

import { useCallback, useState } from 'react';
import { GameProvider } from './contexts/GameContext';
import { MainMenu } from './pages/MainMenu';
import { Tutorial } from './pages/Tutorial';
import { Battle } from './pages/Battle';
import { loadProgress, clearProgress, recordStars } from './lib/storage';
import { LEVELS } from './config/levels';
import type { Progress } from './types';

type Screen = 'menu' | 'tutorial' | 'battle' | 'gameover';

interface GameOverInfo {
  won: boolean;
  stars: 0 | 1 | 2 | 3;
  levelId: number;
}

function AppInner() {
  const [screen, setScreen] = useState<Screen>('menu');
  const [progress, setProgress] = useState<Progress>(() => loadProgress());
  const [activeLevelId, setActiveLevelId] = useState<number>(1);
  const [gameOver, setGameOver] = useState<GameOverInfo | null>(null);

  const handleStart = useCallback(() => {
    // Start at the highest unlocked level (or L1 if nothing unlocked)
    const next = progress.highestLevelUnlocked > 0 ? progress.highestLevelUnlocked : 1;
    setActiveLevelId(next);
    // Always go through tutorial if level 1
    if (next === 1) {
      setScreen('tutorial');
    } else {
      setScreen('battle');
    }
  }, [progress.highestLevelUnlocked]);

  const handleTutorialComplete = useCallback(() => {
    setScreen('battle');
  }, []);

  const handleBattleExit = useCallback(
    (won: boolean, stars: 0 | 1 | 2 | 3) => {
      setGameOver({ won, stars, levelId: activeLevelId });
      if (won) {
        const updated = recordStars(progress, activeLevelId, stars);
        setProgress(updated);
      }
      setScreen('gameover');
    },
    [activeLevelId, progress]
  );

  const handleNextLevel = useCallback(() => {
    const nextId = Math.min(activeLevelId + 1, LEVELS.length - 1);
    setActiveLevelId(nextId);
    setGameOver(null);
    setScreen('battle');
  }, [activeLevelId]);

  const handleBackToMenu = useCallback(() => {
    setGameOver(null);
    setScreen('menu');
  }, []);

  const handleResetProgress = useCallback(() => {
    if (confirm('確定要重置所有進度？所有星數會清除。')) {
      clearProgress();
      setProgress(loadProgress());
    }
  }, []);

  return (
    <>
      {screen === 'menu' && (
        <MainMenu
          onStart={handleStart}
          onResetProgress={handleResetProgress}
          highestLevelUnlocked={progress.highestLevelUnlocked}
          starsByLevel={progress.starsByLevel}
        />
      )}
      {screen === 'tutorial' && (
        <Tutorial
          onComplete={handleTutorialComplete}
          onSkip={handleTutorialComplete}
        />
      )}
      {screen === 'battle' && (
        <Battle levelId={activeLevelId} onExit={handleBattleExit} />
      )}
      {screen === 'gameover' && gameOver && (
        <GameOverScreen
          won={gameOver.won}
          stars={gameOver.stars}
          levelId={gameOver.levelId}
          hasNext={gameOver.won && gameOver.levelId < LEVELS.length - 1}
          onNext={handleNextLevel}
          onMenu={handleBackToMenu}
          onRetry={() => {
            setGameOver(null);
            setScreen('battle');
          }}
        />
      )}
    </>
  );
}

export default function App() {
  return (
    <GameProvider>
      <AppInner />
    </GameProvider>
  );
}

// ============================================================================
// GameOverScreen — modal shown after a level ends
// ============================================================================

interface GameOverScreenProps {
  won: boolean;
  stars: 0 | 1 | 2 | 3;
  levelId: number;
  hasNext: boolean;
  onNext: () => void;
  onRetry: () => void;
  onMenu: () => void;
}

function GameOverScreen({ won, stars, levelId, hasNext, onNext, onRetry, onMenu }: GameOverScreenProps) {
  const level = LEVELS.find((l) => l.id === levelId);
  return (
    <div className="h-full w-full flex items-center justify-center scene">
      <div
        className="max-w-md w-full mx-4 p-8 rounded-2xl text-center"
        style={{
          background: 'var(--color-wizard-bg3)',
          border: `2px solid ${won ? 'var(--color-wizard-gold)' : 'var(--color-wizard-red)'}`,
          boxShadow: won
            ? '0 0 40px -4px var(--color-wizard-gold)'
            : '0 0 40px -4px var(--color-wizard-red)',
        }}
      >
        <div className="text-6xl mb-4">{won ? '✨' : '💫'}</div>
        <h2 className="font-serif text-3xl mb-2">
          {won ? '咒語完成！' : '挑戰失敗'}
        </h2>
        <div className="text-sm mb-1" style={{ color: 'var(--color-wizard-ink-mute)' }}>
          {level?.name ?? `Lv${levelId}`}
        </div>
        {won && (
          <div className="flex justify-center gap-1 my-4">
            {[0, 1, 2].map((i) => (
              <svg key={i} width="36" height="36" viewBox="0 0 24 24" fill={i < stars ? 'var(--color-wizard-gold)' : 'var(--color-wizard-bg)'}
                stroke={i < stars ? 'var(--color-wizard-gold)' : 'var(--color-wizard-line)'} strokeWidth="1">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            ))}
          </div>
        )}
        <div className="flex gap-3 justify-center mt-6">
          {!won && (
            <button onClick={onRetry} className="btn-primary">重試</button>
          )}
          {won && hasNext && (
            <button onClick={onNext} className="btn-primary">下一關 →</button>
          )}
          {won && !hasNext && (
            <div className="text-sm" style={{ color: 'var(--color-wizard-gold)' }}>
              🏆 你完成咗所有 15 關！
            </div>
          )}
          <button onClick={onMenu} className="btn-ghost">主畫面</button>
        </div>
      </div>
    </div>
  );
}