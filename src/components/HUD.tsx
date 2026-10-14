// ============================================================================
// HUD — top stats bar (HP, score, combo, timer, wave)
// ============================================================================

import { useGame } from '../contexts/GameContext';
import { CapLock } from './CapLock';

export function HUD() {
  const { hp, maxHp, score, combo, currentWave, totalWaves, remainingSeconds, capLockOn } = useGame();

  return (
    <div className="absolute top-3 left-3 right-3 flex items-center gap-2 z-10 pointer-events-none">
      <Stat icon="❤️" label="HP" value={`${hp}/${maxHp}`} color="red" />
      <Stat icon="⚔" label="Wave" value={`${currentWave}/${totalWaves || '-'}`} color="purple" />
      <Stat icon="⭐" label="Score" value={score.toLocaleString()} color="gold" />
      <Stat icon="⚡" label="Combo" value={`×${combo}`} color="cyan" />
      <div className="flex-1" />
      <CapLock on={capLockOn} />
      {remainingSeconds > 0 && (
        <Stat icon="⏱" label="Time" value={`${remainingSeconds.toFixed(1)}s`} color="pink" />
      )}
    </div>
  );
}

function Stat({
  icon, label, value, color,
}: { icon: string; label: string; value: string; color: 'red' | 'purple' | 'gold' | 'cyan' | 'pink' }) {
  const colorMap = {
    red: 'var(--color-wizard-red)',
    purple: 'var(--color-wizard-purple)',
    gold: 'var(--color-wizard-gold)',
    cyan: 'var(--color-wizard-cyan)',
    pink: 'var(--color-wizard-pink)',
  } as const;
  return (
    <div
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs"
      style={{
        background: 'rgba(20, 17, 46, 0.85)',
        border: '1px solid var(--color-wizard-line)',
        backdropFilter: 'blur(8px)',
      }}
    >
      <span className="text-sm">{icon}</span>
      <div>
        <div className="text-[9px] uppercase tracking-wider" style={{ color: 'var(--color-wizard-ink-dim)' }}>
          {label}
        </div>
        <div
          className="font-mono font-semibold text-sm leading-tight"
          style={{ color: colorMap[color] }}
        >
          {value}
        </div>
      </div>
    </div>
  );
}