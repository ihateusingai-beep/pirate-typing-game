// ============================================================================
// App — pirate version root component
// Mounts GameProvider, holds screen state, loads progress from localStorage
// ============================================================================

import { useCallback, useState } from 'react';
import { GameProvider } from './contexts/GameContext';
import { MainMenu } from './pages/MainMenu';
import { Tutorial } from './pages/Tutorial';
import { Battle } from './pages/Battle';
import { SpellBook } from './pages/SpellBook';
import { loadProgress, clearProgress, recordStars } from './lib/storage';
import { LEVELS } from './config/levels';
import type { Progress } from './types';

type Screen = 'menu' | 'tutorial' | 'battle' | 'gameover' | 'spellbook';

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
    const next = progress.highestLevelUnlocked > 0 ? progress.highestLevelUnlocked : 1;
    setActiveLevelId(next);
    if (next === 1) {
      setScreen('tutorial');
    } else {
      setScreen('battle');
    }
  }, [progress.highestLevelUnlocked]);

  const handleTutorialComplete = useCallback(() => setScreen('battle'), []);

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

  const handleOpenSpellBook = useCallback(() => setScreen('spellbook'), []);

  const handleSelectLevel = useCallback((levelId: number) => {
    setGameOver(null);
    // L0 has no battle spells — route to tutorial instead of empty arena
    if (levelId === 0) {
      setActiveLevelId(1);
      setScreen('tutorial');
      return;
    }
    setActiveLevelId(levelId);
    setScreen('battle');
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
          onOpenSpellBook={handleOpenSpellBook}
          highestLevelUnlocked={progress.highestLevelUnlocked}
          starsByLevel={progress.starsByLevel}
        />
      )}
      {screen === 'spellbook' && (
        <SpellBook
          highestLevelUnlocked={progress.highestLevelUnlocked}
          starsByLevel={progress.starsByLevel}
          onSelectLevel={handleSelectLevel}
          onBack={handleBackToMenu}
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
          background: 'var(--color-pirate-bg3)',
          border: `2px solid ${won ? 'var(--color-pirate-gold)' : 'var(--color-pirate-enemy)'}`,
          boxShadow: won
            ? '0 0 40px -4px var(--color-pirate-gold)'
            : '0 0 40px -4px var(--color-pirate-enemy)',
        }}
      >
        <div className="text-6xl mb-4">{won ? '🏆' : '💀'}</div>
        <h2 className="font-serif text-3xl mb-2" style={{ color: 'var(--color-pirate-gold)' }}>
          {won ? '海戰勝利！' : '戰敗沉船'}
        </h2>
        <div className="text-sm mb-1" style={{ color: 'var(--color-pirate-ink-mute)' }}>
          {level?.name ?? `Lv${levelId}`}
        </div>
        {won && (
          <div className="flex justify-center gap-1 my-4">
            {[0, 1, 2].map((i) => (
              <svg key={i} width="36" height="36" viewBox="0 0 24 24" fill={i < stars ? 'var(--color-pirate-gold)' : 'var(--color-pirate-bg)'}
                stroke={i < stars ? 'var(--color-pirate-gold)' : 'var(--color-pirate-line)'} strokeWidth="1">
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
            <button onClick={onNext} className="btn-primary">下一個海域 →</button>
          )}
          {won && !hasNext && (
            <div className="text-sm" style={{ color: 'var(--color-pirate-gold)' }}>
              🏆 你擊沉咗所有 15 個敵艦！
            </div>
          )}
          <button onClick={onMenu} className="btn-ghost">主畫面</button>
        </div>
      </div>
    </div>
  );
}