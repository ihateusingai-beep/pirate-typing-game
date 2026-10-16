// ============================================================================
// HUD — top stats bar (HP, wave, score, combo, timer, cannon type, capLock)
// ============================================================================

import { useGame } from '../contexts/GameContext';
import { CapLock } from './CapLock';

export function HUD() {
  const { hp, maxHp, score, combo, currentWave, totalWaves, remainingSeconds, capLockOn, cannonType } = useGame();

  return (
    <div className="absolute top-3 left-3 right-3 flex items-center gap-2 z-10 pointer-events-none">
      <Stat icon="❤️" label="HP" value={`${hp}/${maxHp}`} color="enemy" />
      <Stat icon="⚓" label="Wave" value={`${currentWave}/${totalWaves || '-'}`} color="cyan" />
      <Stat icon="💰" label="Score" value={score.toLocaleString()} color="gold" />
      <Stat icon="🔥" label="Combo" value={`×${combo}`} color="fire" />
      <CannonTypeBadge type={cannonType} />
      <div className="flex-1" />
      <CapLock on={capLockOn} />
      {remainingSeconds > 0 && (
        <Stat icon="⏱" label="Time" value={`${remainingSeconds.toFixed(1)}s`} color="cyan" />
      )}
    </div>
  );
}

const COLOR_MAP = {
  enemy: 'var(--color-pirate-enemy)',
  cyan: 'var(--color-pirate-cyan)',
  gold: 'var(--color-pirate-gold)',
  fire: 'var(--color-pirate-fire)',
  pink: 'var(--color-pirate-pink)',
} as const;

function Stat({
  icon, label, value, color,
}: { icon: string; label: string; value: string; color: keyof typeof COLOR_MAP }) {
  return (
    <div
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs"
      style={{
        background: 'rgba(10, 20, 40, 0.85)',
        border: '1px solid var(--color-pirate-line)',
        backdropFilter: 'blur(8px)',
      }}
    >
      <span className="text-sm">{icon}</span>
      <div>
        <div className="text-[9px] uppercase tracking-wider" style={{ color: 'var(--color-pirate-ink-dim)' }}>
          {label}
        </div>
        <div className="font-mono font-semibold text-sm leading-tight" style={{ color: COLOR_MAP[color] }}>
          {value}
        </div>
      </div>
    </div>
  );
}

function CannonTypeBadge({ type }: { type: 'normal' | 'fire' | 'ultimate' }) {
  const meta = {
    normal: { label: '1 普通砲', color: 'var(--color-pirate-cyan)' },
    fire: { label: '5 火焰砲', color: 'var(--color-pirate-fire)' },
    ultimate: { label: '0 終極導彈', color: 'var(--color-pirate-gold)' },
  }[type];
  return (
    <div
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs"
      style={{
        background: 'rgba(10, 20, 40, 0.85)',
        border: `1px solid ${meta.color}`,
        backdropFilter: 'blur(8px)',
      }}
    >
      <span className="text-sm">💣</span>
      <div>
        <div className="text-[9px] uppercase tracking-wider" style={{ color: 'var(--color-pirate-ink-dim)' }}>
          炮彈
        </div>
        <div className="font-mono font-semibold text-sm leading-tight" style={{ color: meta.color }}>
          {meta.label}
        </div>
      </div>
    </div>
  );
}