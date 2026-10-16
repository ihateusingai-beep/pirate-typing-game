// ============================================================================
// CapLock — pirate version indicator pill
// ============================================================================

interface CapLockProps {
  on: boolean;
}

export function CapLock({ on }: CapLockProps) {
  return (
    <div
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs"
      style={{
        background: on
          ? 'linear-gradient(135deg, rgba(251, 191, 36, 0.2), rgba(251, 191, 36, 0.05))'
          : 'linear-gradient(135deg, rgba(14, 165, 233, 0.15), rgba(14, 165, 233, 0.05))',
        border: `1px solid ${on ? 'rgba(251, 191, 36, 0.5)' : 'rgba(14, 165, 233, 0.4)'}`,
        backdropFilter: 'blur(8px)',
        boxShadow: on ? '0 0 12px -2px var(--color-pirate-gold)' : 'none',
      }}
    >
      <div
        className="font-mono font-bold text-base flex items-center justify-center rounded"
        style={{
          width: 22,
          height: 22,
          background: on ? 'var(--color-pirate-gold)' : 'var(--color-pirate-ocean)',
          color: on ? '#0a0820' : 'white',
          boxShadow: on ? '0 0 8px var(--color-pirate-gold)' : '0 0 6px rgba(14, 165, 233, 0.6)',
          fontSize: 13,
        }}
      >
        {on ? 'A' : 'a'}
      </div>
      <div>
        <div className="text-[9px] uppercase tracking-wider" style={{ color: 'var(--color-pirate-ink-dim)' }}>
          Caps
        </div>
        <div
          className="font-mono font-semibold text-sm leading-tight"
          style={{ color: on ? 'var(--color-pirate-gold)' : 'var(--color-pirate-ocean)' }}
        >
          {on ? '大階' : '小階'}
        </div>
      </div>
    </div>
  );
}