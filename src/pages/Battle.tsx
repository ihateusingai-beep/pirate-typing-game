// ============================================================================
// Battle — pirate combat screen (L1+)
// APPLIES WIZARD LESSONS:
//   F1 (unmount safety): timeoutsRef + scheduleTimeout
//   F2 (reset-on-render): timer useEffect deps EXCLUDE `game` full value
//   F3 (enable-condition): CapsLock only toggles when spell expects it
// ============================================================================

import { useCallback, useEffect, useRef, useState } from 'react';
import { useGame } from '../contexts/GameContext';
import { useKeyboard } from '../hooks/useKeyboard';
import { HUD } from '../components/HUD';
import { VirtualKeyboard } from '../components/VirtualKeyboard';
import { Ship } from '../components/Ship';
import { EnemyShip } from '../components/EnemyShip';
import { SeaBackground } from '../components/SeaBackground';
import { ComboMeter } from '../components/ComboMeter';
import { getLevel } from '../config/levels';
import { tokensMatch, tokenDisplay } from '../lib/spellMatch';
import { calculateStars } from '../lib/stars';
import type { KeyToken, Spell } from '../types';

interface BattleProps {
  levelId: number;
  onExit: (won: boolean, stars: 0 | 1 | 2 | 3) => void;
}

interface ActiveEnemy {
  id: string;
  rune: string;
  hp: number;
  maxHp: number;
  x: number;
  y: number;
}

const VARIANTS: Array<'scout' | 'patrol' | 'frigate' | 'warship' | 'ghost'> = [
  'scout', 'scout', 'patrol', 'frigate', 'warship', 'ghost',
];

export function Battle({ levelId, onExit }: BattleProps) {
  const level = getLevel(levelId);
  const game = useGame();
  const [spellIdx, setSpellIdx] = useState(0);
  const [tokenIdx, setTokenIdx] = useState(0);
  const [enemies, setEnemies] = useState<ActiveEnemy[]>([]);
  const [mistakes, setMistakes] = useState(0);
  const [waveComplete, setWaveComplete] = useState(false);
  const [cannonFlash, setCannonFlash] = useState(false);
  const timeoutsRef = useRef<Set<ReturnType<typeof setTimeout>>>(new Set());

  const currentSpell: Spell | undefined = level.spells[spellIdx];
  const currentTarget: KeyToken | null = currentSpell?.tokens[tokenIdx] ?? null;

  // Initialize / reset on level change
  useEffect(() => {
    game.setLevel(level.id, level.spells.length);
    setSpellIdx(0);
    setTokenIdx(0);
    setMistakes(0);
    setWaveComplete(false);
    spawnWave(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [levelId]);

  // Cancel pending timeouts on unmount (F1 lesson)
  useEffect(() => {
    const timeouts = timeoutsRef.current;
    return () => {
      timeouts.forEach((t) => clearTimeout(t));
      timeouts.clear();
    };
  }, []);

  /** Helper to schedule a timeout that's auto-cancelled on unmount */
  const scheduleTimeout = useCallback((fn: () => void, ms: number): void => {
    const id = setTimeout(() => {
      timeoutsRef.current.delete(id);
      fn();
    }, ms);
    timeoutsRef.current.add(id);
  }, []);

  // Multi-enemy wave spawner
  const spawnWave = useCallback((idx: number) => {
    const spell = level.spells[idx];
    if (!spell) return;
    const firstChar = spell.tokens.find((t) => t.kind === 'char');
    if (!firstChar || firstChar.kind !== 'char') return;

    const count = Math.max(1, level.enemiesPerWave);
    const newEnemies: ActiveEnemy[] = [];

    for (let i = 0; i < count; i++) {
      const t = count === 1 ? 0.5 : i / (count - 1);
      const xPct = 18 + t * 64;
      const yPct = count === 1 ? 32 : 22 + Math.abs(0.5 - t) * 22;
      newEnemies.push({
        id: `e-${idx}-${i}`,
        rune: firstChar.value,
        hp: 1,
        maxHp: 1,
        x: xPct,
        y: yPct,
      });
    }
    setEnemies(newEnemies);
  }, [level.spells, level.enemiesPerWave]);

  // Timer countdown — F2 lesson: do NOT include `game` full value in deps,
  // but DO include `game.gameStatus` so the effect re-runs when setLevel flips
  // status from 'idle' to 'playing' on initial mount.
  useEffect(() => {
    if (level.timeLimit <= 0) return;
    if (game.gameStatus !== 'playing' || waveComplete) return;

    const startMs = performance.now();
    const duration = level.timeLimit;
    game.setTimer(duration);

    const interval = setInterval(() => {
      const elapsed = (performance.now() - startMs) / 1000;
      const remaining = Math.max(0, duration - elapsed);
      game.setTimer(remaining);
      if (remaining <= 0) {
        clearInterval(interval);
        game.setStatus('lost');
        onExit(false, 0);
      }
    }, 100);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spellIdx, levelId, level.timeLimit, waveComplete, game.gameStatus]);

  // Spell complete handler
  const handleSpellComplete = useCallback(() => {
    setEnemies([]);
    setWaveComplete(true);
    scheduleTimeout(() => {
      const next = spellIdx + 1;
      if (next >= level.spells.length) {
        const stars = calculateStars(mistakes + 1, level.spells.length);
        game.setStatus('won');
        onExit(true, stars);
      } else {
        setSpellIdx(next);
        setTokenIdx(0);
        setWaveComplete(false);
        spawnWave(next);
      }
    }, 600);
  }, [spellIdx, level.spells.length, mistakes, game, onExit, spawnWave, scheduleTimeout]);

  // Key handler
  const handleKey = useCallback((token: KeyToken) => {
    if (game.gameStatus !== 'playing' || waveComplete) return;

    // F3 lesson: CapsLock only when spell expects it
    if (token.kind === 'capslock') {
      const spellExpectsCaps = currentTarget.kind === 'capslock' || currentSpell?.requiresCapsLock === true;
      if (spellExpectsCaps) {
        game.setCapLock(!game.capLockOn);
      }
      if (currentTarget.kind === 'capslock') {
        if (tokenIdx + 1 >= currentSpell!.tokens.length) {
          handleSpellComplete();
        } else {
          setTokenIdx((i) => i + 1);
        }
      }
      return;
    }

    if (!currentTarget) return;

    // Cannon type switch (1/5/0) when spell power enabled
    if (token.kind === 'char' && level.spellPowerEnabled) {
      const ch = token.value.toLowerCase();
      if (ch === '5' && game.combo >= 3) {
        game.setCannonType('fire');
        return;
      }
      if (ch === '0' && game.combo >= 7) {
        game.setCannonType('ultimate');
        return;
      }
      if (ch === '1') {
        game.setCannonType('normal');
        return;
      }
    }

    // Backspace: undo last typed char
    if (token.kind === 'backspace') {
      if (level.backspaceEnabled && tokenIdx > 0) {
        setTokenIdx((i) => i - 1);
      }
      return;
    }
    // Delete: clear obstacle
    if (token.kind === 'delete') {
      if (level.deleteEnabled) {
        // MVP: just consume
      }
      return;
    }

    // Check if pressed key matches the current target
    const matches = tokensMatch(token, currentTarget);
    if (!matches) {
      setMistakes((m) => m + 1);
      game.resetCombo();
      return;
    }

    // Correct press — visual flash
    setCannonFlash(true);
    scheduleTimeout(() => setCannonFlash(false), 200);

    game.addScore(10);
    game.incCombo();

    if (tokenIdx + 1 >= currentSpell!.tokens.length) {
      handleSpellComplete();
    } else {
      setTokenIdx((i) => i + 1);
    }
  }, [game, currentTarget, currentSpell, tokenIdx, level, waveComplete, handleSpellComplete, scheduleTimeout]);

  useKeyboard({
    enabled: game.gameStatus === 'playing' && !waveComplete,
    capsLockOn: game.capLockOn,
    onKey: handleKey,
  });

  const needsCaps = currentSpell?.requiresCapsLock && !game.capLockOn;
  const variant = VARIANTS[Math.min(level.id, VARIANTS.length - 1)];

  return (
    <div className="scene h-full w-full overflow-hidden relative">
      <SeaBackground />
      <HUD />

      {/* Spell banner */}
      <div className="absolute top-14 left-4 z-10 flex items-center gap-2">
        <div
          className="px-3 py-1.5 rounded-lg text-xs flex items-center gap-2"
          style={{
            background: 'rgba(220, 38, 38, 0.15)',
            border: '1px solid rgba(220, 38, 38, 0.4)',
            color: 'var(--color-pirate-enemy)',
            backdropFilter: 'blur(8px)',
          }}
        >
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span>第 {game.currentWave} / {game.totalWaves} 艦</span>
          <span style={{ color: 'var(--color-pirate-gold)', paddingLeft: 8, borderLeft: '1px solid rgba(220, 38, 38, 0.3)' }}>
            💣 {currentSpell?.name ?? level.name}
          </span>
        </div>
        {needsCaps && (
          <div
            className="px-3 py-1.5 rounded-lg text-xs flex items-center gap-2"
            style={{
              background: 'rgba(251, 191, 36, 0.15)',
              border: '1px solid rgba(251, 191, 36, 0.5)',
              color: 'var(--color-pirate-gold)',
              backdropFilter: 'blur(8px)',
              animation: 'pulse-glow 1.5s ease-in-out infinite',
            }}
          >
            ⇪ 請按 Caps Lock
          </div>
        )}
      </div>

      {/* Arena */}
      <div className="absolute top-0 left-0 right-0 bottom-32">
        {/* Combo meter (Lv6+) */}
        {level.comboEnabled && (
          <div className="absolute top-32 right-4 z-10">
            <ComboMeter combo={game.combo} />
          </div>
        )}

        {/* Player ship */}
        <div
          className="absolute bottom-2 left-1/2 -translate-x-1/2 z-5"
          style={{
            filter: cannonFlash ? 'drop-shadow(0 0 16px var(--color-pirate-fire))' : 'none',
            transition: 'filter 0.2s',
          }}
        >
          <Ship size={120} firing={cannonFlash || waveComplete} />
        </div>

        {/* Enemies */}
        {enemies.map((e) => (
          <div
            key={e.id}
            className="absolute"
            style={{
              left: `${e.x}%`,
              top: `${e.y}%`,
              transform: 'translate(-50%, -50%)',
              zIndex: 4,
            }}
          >
            <EnemyShip rune={e.rune} hp={e.hp} maxHp={e.maxHp} variant={variant} />
          </div>
        ))}

        {/* Token progress dots */}
        {currentSpell && (
          <div className="absolute top-4 right-4 z-10 flex flex-col gap-1.5 px-3 py-2 rounded-lg"
            style={{
              background: 'rgba(10, 20, 40, 0.85)',
              border: '1px solid var(--color-pirate-line)',
              backdropFilter: 'blur(8px)',
            }}>
            <div className="text-[9px] uppercase tracking-wider mb-1" style={{ color: 'var(--color-pirate-ink-dim)' }}>
              指令進度
            </div>
            <div className="flex gap-1.5">
              {currentSpell.tokens.map((t, i) => {
                const isDone = i < tokenIdx;
                const isCurrent = i === tokenIdx;
                return (
                  <div
                    key={i}
                    className="w-7 h-7 rounded font-mono text-xs flex items-center justify-center"
                    style={{
                      background: isDone
                        ? 'rgba(74, 222, 128, 0.2)'
                        : isCurrent
                        ? 'rgba(34, 211, 238, 0.2)'
                        : 'var(--color-pirate-bg3)',
                      border: `1px solid ${
                        isDone ? 'var(--color-pirate-green)' :
                        isCurrent ? 'var(--color-pirate-cyan)' :
                        'var(--color-pirate-line)'
                      }`,
                      color: isDone
                        ? 'var(--color-pirate-green)'
                        : isCurrent
                        ? 'var(--color-pirate-cyan)'
                        : 'var(--color-pirate-ink-mute)',
                    }}
                  >
                    {tokenDisplay(t)}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Virtual keyboard */}
      <VirtualKeyboard target={currentTarget} capsLockOn={game.capLockOn} />

      {/* Exit button */}
      <button
        onClick={() => onExit(false, 0)}
        className="absolute top-14 right-3 z-20 px-2.5 py-1.5 rounded text-xs flex items-center gap-1.5"
        style={{
          background: 'rgba(10, 20, 40, 0.85)',
          border: '1px solid var(--color-pirate-line)',
          color: 'var(--color-pirate-ink-mute)',
        }}
      >
        ← 撤退
      </button>
    </div>
  );
}

// (tokensMatch, tokenDisplay, calculateStars are imported from src/lib/* for unit testing)