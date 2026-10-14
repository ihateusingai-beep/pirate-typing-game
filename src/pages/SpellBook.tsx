// ============================================================================
// SpellBook — collection screen showing all 16 levels
// ============================================================================

import { useState, useMemo } from 'react';
import { LEVELS } from '../config/levels';
import type { KeyToken } from '../types';

interface SpellBookProps {
  highestLevelUnlocked: number;
  starsByLevel: Record<number, 0 | 1 | 2 | 3>;
  onSelectLevel: (levelId: number) => void;
  onBack: () => void;
}

type Filter = 'all' | 'tutorial' | 'apprentice' | 'journeyman' | 'mage' | 'archmage' | 'boss';

const FILTERS: Array<{ key: Filter; label: string }> = [
  { key: 'all', label: '全部' },
  { key: 'tutorial', label: '教學' },
  { key: 'apprentice', label: '學徒' },
  { key: 'journeyman', label: '見習' },
  { key: 'mage', label: '法師' },
  { key: 'archmage', label: '大法師' },
  { key: 'boss', label: 'Boss' },
];

const TIER_COLORS = {
  tutorial: 'var(--color-wizard-cyan)',
  apprentice: 'var(--color-wizard-primary)',
  journeyman: 'var(--color-wizard-purple)',
  mage: 'var(--color-wizard-pink)',
  archmage: 'var(--color-wizard-gold)',
  boss: 'var(--color-wizard-red)',
} as const;

export function SpellBook({ highestLevelUnlocked, starsByLevel, onSelectLevel, onBack }: SpellBookProps) {
  const [filter, setFilter] = useState<Filter>('all');

  const filtered = useMemo(
    () => filter === 'all' ? LEVELS : LEVELS.filter((l) => l.tier === filter),
    [filter]
  );

  const totalStars = Object.values(starsByLevel).reduce<number>((a, b) => a + b, 0);
  const maxStars = LEVELS.length * 3;

  return (
    <div className="scene h-full w-full flex flex-col p-6 overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="px-3 py-1.5 rounded text-sm flex items-center gap-1.5"
            style={{ background: 'var(--color-wizard-bg3)', border: '1px solid var(--color-wizard-line)', color: 'var(--color-wizard-ink-mute)' }}
          >
            ← 返回
          </button>
          <h1 className="font-serif text-3xl">我的咒語書</h1>
        </div>
        <div
          className="flex items-center gap-4 px-4 py-2 rounded-lg text-sm"
          style={{ background: 'var(--color-wizard-bg3)', border: '1px solid var(--color-wizard-line)' }}
        >
          <div className="text-center">
            <div className="text-[10px] uppercase tracking-wider" style={{ color: 'var(--color-wizard-ink-dim)' }}>咒語</div>
            <div className="font-bold text-lg" style={{ color: 'var(--color-wizard-cyan)' }}>{highestLevelUnlocked}/15</div>
          </div>
          <div className="text-center">
            <div className="text-[10px] uppercase tracking-wider" style={{ color: 'var(--color-wizard-ink-dim)' }}>星數</div>
            <div className="font-bold text-lg" style={{ color: 'var(--color-wizard-gold)' }}>{totalStars}/{maxStars}</div>
          </div>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-4 flex-shrink-0 flex-wrap">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className="px-3 py-1.5 rounded-full text-sm transition-all"
            style={{
              background: filter === f.key ? 'var(--color-wizard-primary)' : 'var(--color-wizard-bg3)',
              border: `1px solid ${filter === f.key ? 'var(--color-wizard-primary)' : 'var(--color-wizard-line)'}`,
              color: filter === f.key ? 'white' : 'var(--color-wizard-ink-mute)',
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {filtered.map((level) => {
          const unlocked = level.id <= highestLevelUnlocked;
          const stars = starsByLevel[level.id] ?? 0;
          const tierColor = TIER_COLORS[level.tier];
          const firstSpell = level.spells[0];
          const runes = firstSpell ? firstSpell.tokens.map(tokenDisplay).join('') : '—';

          return (
            <button
              key={level.id}
              onClick={() => unlocked && onSelectLevel(level.id)}
              disabled={!unlocked}
              className="rounded-xl p-3 text-center relative transition-all"
              style={{
                background: unlocked
                  ? `linear-gradient(135deg, ${tierColor}15, var(--color-wizard-bg3))`
                  : 'var(--color-wizard-bg3)',
                border: `1px solid ${unlocked ? tierColor : 'var(--color-wizard-line)'}`,
                opacity: unlocked ? 1 : 0.5,
                cursor: unlocked ? 'pointer' : 'not-allowed',
                boxShadow: unlocked ? `0 0 12px -4px ${tierColor}` : 'none',
                minHeight: 140,
              }}
            >
              {/* Level badge */}
              <div
                className="absolute top-2 right-2 font-mono text-[10px] px-1.5 py-0.5 rounded"
                style={{ background: 'var(--color-wizard-bg)', color: 'var(--color-wizard-ink-mute)' }}
              >
                Lv{level.id}
              </div>

              {/* Icon / Rune display */}
              <div
                className="font-serif text-2xl mb-1 mt-2"
                style={{ color: unlocked ? tierColor : 'var(--color-wizard-ink-dim)' }}
              >
                {unlocked ? runes : '🔒'}
              </div>

              {/* Name */}
              <div
                className="text-xs font-medium mb-2 truncate"
                style={{ color: unlocked ? 'var(--color-wizard-ink)' : 'var(--color-wizard-ink-dim)' }}
              >
                {level.name}
              </div>

              {/* Stars */}
              <div className="flex justify-center gap-0.5">
                {[0, 1, 2].map((i) => (
                  <svg key={i} width="12" height="12" viewBox="0 0 24 24"
                    fill={i < stars ? 'var(--color-wizard-gold)' : 'transparent'}
                    stroke={i < stars ? 'var(--color-wizard-gold)' : 'var(--color-wizard-line)'}
                    strokeWidth="1.5"
                  >
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                ))}
              </div>

              {/* Tier tag */}
              {unlocked && (
                <div
                  className="absolute bottom-1.5 left-2 right-2 text-[9px] uppercase tracking-wider"
                  style={{ color: tierColor, opacity: 0.7 }}
                >
                  {level.tier === 'boss' ? '🐉 BOSS' : level.tier}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12" style={{ color: 'var(--color-wizard-ink-dim)' }}>
          呢個分類暫時未有咒語
        </div>
      )}
    </div>
  );
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