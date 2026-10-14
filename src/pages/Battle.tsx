// ============================================================================
// Battle — main gameplay screen for L1+
// Phase 2: multi-enemy (level.enemiesPerWave) + timer countdown (level.timeLimit)
// ============================================================================

import { useCallback, useEffect, useRef, useState } from 'react';
import { useGame } from '../contexts/GameContext';
import { useKeyboard } from '../hooks/useKeyboard';
import { HUD } from '../components/HUD';
import { VirtualKeyboard } from '../components/VirtualKeyboard';
import { Wizard } from '../components/Wizard';
import { Enemy } from '../components/Enemy';
import { MagicCircle } from '../components/MagicCircle';
import { ComboMeter } from '../components/ComboMeter';
import { getLevel } from '../config/levels';
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

const VARIANTS: Array<'imp' | 'ghost' | 'specter' | 'dragon'> = ['imp', 'ghost', 'specter', 'dragon'];

export function Battle({ levelId, onExit }: BattleProps) {
  const level = getLevel(levelId);
  const game = useGame();
  const [spellIdx, setSpellIdx] = useState(0);
  const [tokenIdx, setTokenIdx] = useState(0);
  const [enemies, setEnemies] = useState<ActiveEnemy[]>([]);
  const [mistakes, setMistakes] = useState(0);
  const [waveComplete, setWaveComplete] = useState(false);
  const [castFlash, setCastFlash] = useState(false);
  const lastHandledRef = useRef<string>('');

  const currentSpell: Spell | undefined = level.spells[spellIdx];
  const currentTarget: KeyToken | null = currentSpell?.tokens[tokenIdx] ?? null;

  // ------------------------------------------------------------------
  // Initialize / reset on level change
  // ------------------------------------------------------------------
  useEffect(() => {
    game.setLevel(level.id, level.spells.length);
    setSpellIdx(0);
    setTokenIdx(0);
    setMistakes(0);
    setWaveComplete(false);
    lastHandledRef.current = '';
    spawnWave(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [levelId]);

  // ------------------------------------------------------------------
  // Multi-enemy wave spawner
  // ------------------------------------------------------------------
  const spawnWave = useCallback((idx: number) => {
    const spell = level.spells[idx];
    if (!spell) return;
    // Find the first character token to display as the enemy rune
    const firstChar = spell.tokens.find((t) => t.kind === 'char');
    if (!firstChar || firstChar.kind !== 'char') return;

    const count = Math.max(1, level.enemiesPerWave);
    const newEnemies: ActiveEnemy[] = [];

    // Distribute enemies in an arc above the wizard
    for (let i = 0; i < count; i++) {
      const t = count === 1 ? 0.5 : i / (count - 1);
      // Arc from left to right, above center
      const xPct = 18 + t * 64; // 18% to 82%
      const yPct = count === 1 ? 32 : 22 + Math.abs(0.5 - t) * 22; // arc shape
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

  // ------------------------------------------------------------------
  // Timer countdown (for L4+ with timeLimit > 0)
  // ------------------------------------------------------------------
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
  }, [spellIdx, levelId, level.timeLimit, waveComplete, game, onExit]);

  // ------------------------------------------------------------------
  // Spell complete handler — shared by capslock, char, and token-completion
  // ------------------------------------------------------------------
  const handleSpellComplete = useCallback(() => {
    setEnemies([]);
    setWaveComplete(true);
    setTimeout(() => {
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
  }, [spellIdx, level.spells.length, mistakes, game, onExit, spawnWave]);

  // ------------------------------------------------------------------
  // Key handler
  // ------------------------------------------------------------------
  const handleKey = useCallback((token: KeyToken) => {
    if (game.gameStatus !== 'playing' || waveComplete) return;

    // Handle CapsLock toggle
    if (token.kind === 'capslock') {
      game.setCapLock(!game.capLockOn);
      // If the current spell has capslock as a token, advance past it
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

    // ------------------------------------------------------------------
    // Spell power keys (Q = ice, W = fire, E = lightning)
    // Only available when level.spellPowerEnabled AND combo threshold met.
    // Note: only triggers if the spell's NEXT token isn't a 'q'/'w'/'e' char
    // (so we don't accidentally consume spell power when 'q' is part of a
    // multi-char spell like Lv6+). For MVP we just check threshold.
    // ------------------------------------------------------------------
    if (token.kind === 'char' && level.spellPowerEnabled) {
      const ch = token.value.toLowerCase();
      if (ch === 'q' && game.combo >= 3) {
        // Ice: clear 1 enemy (FIFO)
        setEnemies((arr) => arr.slice(1));
        game.resetCombo();
        return;
      }
      if (ch === 'w' && game.combo >= 5) {
        // Fire: clear all enemies
        setEnemies([]);
        game.resetCombo();
        return;
      }
      if (ch === 'e' && game.combo >= 7) {
        // Lightning: clear all enemies + bonus score
        setEnemies([]);
        game.addScore(50);
        game.resetCombo();
        return;
      }
    }

    // Backspace: undo last typed character (L8+)
    if (token.kind === 'backspace') {
      if (level.backspaceEnabled && tokenIdx > 0) {
        setTokenIdx((i) => i - 1);
      }
      return;
    }
    // Delete: clear obstacle (L13+)
    if (token.kind === 'delete') {
      if (level.deleteEnabled) {
        // For MVP, just consume; future = remove an obstacle enemy
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
    setCastFlash(true);
    setTimeout(() => setCastFlash(false), 200);

    // Correct press — advance
    game.addScore(10);
    game.incCombo();

    // If we just finished a spell
    if (tokenIdx + 1 >= currentSpell!.tokens.length) {
      handleSpellComplete();
    } else {
      setTokenIdx((i) => i + 1);
    }
  }, [game, currentTarget, currentSpell, tokenIdx, level, waveComplete, handleSpellComplete]);

  useKeyboard({
    enabled: game.gameStatus === 'playing' && !waveComplete,
    capsLockOn: game.capLockOn,
    onKey: handleKey,
  });

  // Cap-lock visual indicator: gold if the spell needs caps but we don't have it
  const needsCaps = currentSpell?.requiresCapsLock && !game.capLockOn;
  const variant = VARIANTS[Math.min(level.id, VARIANTS.length - 1)];

  return (
    <div className="scene h-full w-full overflow-hidden relative">
      <HUD />
      <MagicCircle size={320} />

      {/* Spell banner */}
      <div className="absolute top-14 left-4 z-10 flex items-center gap-2">
        <div
          className="px-3 py-1.5 rounded-lg text-xs flex items-center gap-2"
          style={{
            background: 'rgba(244, 63, 94, 0.15)',
            border: '1px solid rgba(244, 63, 94, 0.4)',
            color: 'var(--color-wizard-red)',
            backdropFilter: 'blur(8px)',
          }}
        >
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span>第 {game.currentWave} / {game.totalWaves} 咒</span>
          <span style={{ color: 'var(--color-wizard-gold)', paddingLeft: 8, borderLeft: '1px solid rgba(244, 63, 94, 0.3)' }}>
            ⚡ {currentSpell?.name ?? level.name}
          </span>
        </div>
        {needsCaps && (
          <div
            className="px-3 py-1.5 rounded-lg text-xs flex items-center gap-2"
            style={{
              background: 'rgba(251, 191, 36, 0.15)',
              border: '1px solid rgba(251, 191, 36, 0.5)',
              color: 'var(--color-wizard-gold)',
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
        {/* Combo meter (Lv6+ only) — positioned to the right, below token progress */}
        {level.comboEnabled && (
          <div className="absolute top-32 right-4 z-10">
            <ComboMeter combo={game.combo} />
          </div>
        )}
        {/* Wizard */}
        <div
          className="absolute bottom-2 left-1/2 -translate-x-1/2 z-5"
          style={{
            filter: castFlash ? 'drop-shadow(0 0 12px var(--color-wizard-cyan))' : 'none',
            transition: 'filter 0.2s',
          }}
        >
          <Wizard size={80} casting={castFlash || waveComplete} />
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
            <Enemy rune={e.rune} hp={e.hp} maxHp={e.maxHp} variant={variant} />
          </div>
        ))}

        {/* Token progress dots */}
        {currentSpell && (
          <div className="absolute top-4 right-4 z-10 flex flex-col gap-1.5 px-3 py-2 rounded-lg"
            style={{
              background: 'rgba(20, 17, 46, 0.85)',
              border: '1px solid var(--color-wizard-line)',
              backdropFilter: 'blur(8px)',
            }}>
            <div className="text-[9px] uppercase tracking-wider mb-1" style={{ color: 'var(--color-wizard-ink-dim)' }}>
              咒語進度
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
                        ? 'rgba(16, 185, 129, 0.2)'
                        : isCurrent
                        ? 'rgba(34, 211, 238, 0.2)'
                        : 'var(--color-wizard-bg3)',
                      border: `1px solid ${
                        isDone ? 'var(--color-wizard-green)' :
                        isCurrent ? 'var(--color-wizard-cyan)' :
                        'var(--color-wizard-line)'
                      }`,
                      color: isDone
                        ? 'var(--color-wizard-green)'
                        : isCurrent
                        ? 'var(--color-wizard-cyan)'
                        : 'var(--color-wizard-ink-mute)',
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
        className="absolute top-3 right-3 z-20 px-2.5 py-1.5 rounded text-xs flex items-center gap-1.5"
        style={{
          background: 'rgba(20, 17, 46, 0.85)',
          border: '1px solid var(--color-wizard-line)',
          color: 'var(--color-wizard-ink-mute)',
        }}
      >
        ← 退出
      </button>
    </div>
  );
}

function tokensMatch(a: KeyToken, b: KeyToken): boolean {
  if (a.kind !== b.kind) return false;
  if (a.kind === 'char' && b.kind === 'char') {
    // Case-SENSITIVE: this is what makes Caps Lock matter.
    // If spell expects 'A' and CapsLock is OFF, keyEventToChar produces 'a',
    // which will fail to match → user must toggle Caps Lock.
    return a.value === b.value;
  }
  if (a.kind === 'arrow' && b.kind === 'arrow') {
    return a.direction === b.direction;
  }
  return true;
}

function tokenDisplay(token: KeyToken): string {
  switch (token.kind) {
    case 'char': return token.value.toUpperCase();
    case 'enter': return '↵';
    case 'backspace': return '⌫';
    case 'delete': return '⌦';
    case 'capslock': return '⇪';
    case 'arrow':
      return { up: '↑', down: '↓', left: '←', right: '→' }[token.direction];
  }
}

function calculateStars(mistakes: number, total: number): 0 | 1 | 2 | 3 {
  const rate = mistakes / total;
  if (rate <= 0.5) return 3;
  if (rate <= 1) return 2;
  if (rate <= 2) return 1;
  return 0;
}