// ============================================================================
// CapLock — small indicator pill showing ON/OFF
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
          : 'linear-gradient(135deg, rgba(168, 85, 247, 0.15), rgba(168, 85, 247, 0.05))',
        border: `1px solid ${on ? 'rgba(251, 191, 36, 0.5)' : 'rgba(168, 85, 247, 0.4)'}`,
        backdropFilter: 'blur(8px)',
        boxShadow: on ? '0 0 12px -2px var(--color-wizard-gold)' : 'none',
      }}
    >
      <div
        className="font-mono font-bold text-base flex items-center justify-center rounded"
        style={{
          width: 22,
          height: 22,
          background: on ? 'var(--color-wizard-gold)' : 'var(--color-wizard-purple)',
          color: on ? '#0a0820' : 'white',
          boxShadow: on ? '0 0 8px var(--color-wizard-gold)' : '0 0 6px rgba(168, 85, 247, 0.6)',
          fontSize: 13,
        }}
      >
        {on ? 'A' : 'a'}
      </div>
      <div>
        <div className="text-[9px] uppercase tracking-wider" style={{ color: 'var(--color-wizard-ink-dim)' }}>
          Caps
        </div>
        <div
          className="font-mono font-semibold text-sm leading-tight"
          style={{ color: on ? 'var(--color-wizard-gold)' : 'var(--color-wizard-purple)' }}
        >
          {on ? '大階' : '小階'}
        </div>
      </div>
    </div>
  );
}