// ============================================================================
// SpellBook — 艦隊登記冊 (collection screen for all 16 levels)
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
  { key: 'apprentice', label: '見習水手' },
  { key: 'journeyman', label: '水手長' },
  { key: 'mage', label: '副官' },
  { key: 'archmage', label: '大副' },
  { key: 'boss', label: 'Boss' },
];

const TIER_COLORS = {
  tutorial: 'var(--color-pirate-cyan)',
  apprentice: 'var(--color-pirate-wood)',
  journeyman: 'var(--color-pirate-ocean)',
  mage: 'var(--color-pirate-fire)',
  archmage: 'var(--color-pirate-gold)',
  boss: 'var(--color-pirate-enemy)',
} as const;

export function SpellBook({ highestLevelUnlocked, starsByLevel, onSelectLevel, onBack }: SpellBookProps) {
  const [filter, setFilter] = useState<Filter>('all');

  const filtered = useMemo(
    () => filter === 'all' ? LEVELS : LEVELS.filter((l) => l.tier === filter),
    [filter]
  );

  const totalStars = Object.values(starsByLevel).reduce<number>((a, b) => a + b, 0);
  const maxStars = 15 * 3;

  return (
    <div className="scene h-full w-full flex flex-col p-6 overflow-y-auto">
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="px-3 py-1.5 rounded text-sm flex items-center gap-1.5"
            style={{ background: 'var(--color-pirate-bg3)', border: '1px solid var(--color-pirate-line)', color: 'var(--color-pirate-ink-mute)' }}
          >
            ← 返回
          </button>
          <h1 className="font-serif text-3xl" style={{ color: 'var(--color-pirate-gold)' }}>艦隊登記冊</h1>
        </div>
        <div
          className="flex items-center gap-4 px-4 py-2 rounded-lg text-sm"
          style={{ background: 'var(--color-pirate-bg3)', border: '1px solid var(--color-pirate-line)' }}
        >
          <div className="text-center">
            <div className="text-[10px] uppercase tracking-wider" style={{ color: 'var(--color-pirate-ink-dim)' }}>艦隊</div>
            <div className="font-bold text-lg" style={{ color: 'var(--color-pirate-cyan)' }}>{highestLevelUnlocked}/15</div>
          </div>
          <div className="text-center">
            <div className="text-[10px] uppercase tracking-wider" style={{ color: 'var(--color-pirate-ink-dim)' }}>戰利品</div>
            <div className="font-bold text-lg" style={{ color: 'var(--color-pirate-gold)' }}>{totalStars}/{maxStars}</div>
          </div>
        </div>
      </div>

      <div className="flex gap-2 mb-4 flex-shrink-0 flex-wrap">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className="px-3 py-1.5 rounded-full text-sm transition-all"
            style={{
              background: filter === f.key ? 'var(--color-pirate-wood)' : 'var(--color-pirate-bg3)',
              border: `1px solid ${filter === f.key ? 'var(--color-pirate-wood)' : 'var(--color-pirate-line)'}`,
              color: filter === f.key ? 'white' : 'var(--color-pirate-ink-mute)',
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

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
                  ? `linear-gradient(135deg, ${tierColor}22, var(--color-pirate-bg3))`
                  : 'var(--color-pirate-bg3)',
                border: `1px solid ${unlocked ? tierColor : 'var(--color-pirate-line)'}`,
                opacity: unlocked ? 1 : 0.5,
                cursor: unlocked ? 'pointer' : 'not-allowed',
                boxShadow: unlocked ? `0 0 12px -4px ${tierColor}` : 'none',
                minHeight: 140,
              }}
            >
              <div
                className="absolute top-2 right-2 font-mono text-[10px] px-1.5 py-0.5 rounded"
                style={{ background: 'var(--color-pirate-bg)', color: 'var(--color-pirate-ink-mute)' }}
              >
                Lv{level.id}
              </div>

              <div
                className="font-serif text-2xl mb-1 mt-2"
                style={{ color: unlocked ? tierColor : 'var(--color-pirate-ink-dim)' }}
              >
                {unlocked ? runes : '🔒'}
              </div>

              <div
                className="text-xs font-medium mb-2 truncate"
                style={{ color: unlocked ? 'var(--color-pirate-ink)' : 'var(--color-pirate-ink-dim)' }}
              >
                {level.name}
              </div>

              <div className="flex justify-center gap-0.5">
                {[0, 1, 2].map((i) => (
                  <svg key={i} width="12" height="12" viewBox="0 0 24 24"
                    fill={i < stars ? 'var(--color-pirate-gold)' : 'transparent'}
                    stroke={i < stars ? 'var(--color-pirate-gold)' : 'var(--color-pirate-line)'}
                    strokeWidth="1.5"
                  >
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                ))}
              </div>

              {unlocked && (
                <div
                  className="absolute bottom-1.5 left-2 right-2 text-[9px] uppercase tracking-wider"
                  style={{ color: tierColor, opacity: 0.7 }}
                >
                  {level.tier === 'boss' ? '👻 幽靈船長' : level.tier}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12" style={{ color: 'var(--color-pirate-ink-dim)' }}>
          呢個分類暫時未有艦隊
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