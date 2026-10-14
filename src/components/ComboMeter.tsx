// ============================================================================
// ComboMeter — visual chain of dots showing the player's current combo
// ============================================================================

interface ComboMeterProps {
  combo: number;
  /** How many dots to show (default 5 for Q×3 / W×5 / E×7 tiers) */
  maxDots?: number;
}

export function ComboMeter({ combo, maxDots = 7 }: ComboMeterProps) {
  // Tiers: 3=ice, 5=fire, 7=lightning
  const tier3 = combo >= 3;
  const tier5 = combo >= 5;
  const tier7 = combo >= 7;

  return (
    <div
      className="flex flex-col items-center gap-1 px-3 py-2 rounded-lg"
      style={{
        background: 'rgba(20, 17, 46, 0.85)',
        border: '1px solid var(--color-wizard-line)',
        backdropFilter: 'blur(8px)',
        minWidth: 160,
      }}
    >
      <div className="text-[9px] uppercase tracking-wider" style={{ color: 'var(--color-wizard-ink-dim)' }}>
        連擊 Combo
      </div>
      <div className="flex gap-1.5">
        {Array.from({ length: maxDots }).map((_, i) => {
          const filled = i < combo;
          const isTier3 = i === 2;
          const isTier5 = i === 4;
          const isTier7 = i === 6;
          let color = 'var(--color-wizard-bg)';
          if (filled) {
            if (isTier7) color = 'var(--color-wizard-gold)';
            else if (isTier5) color = 'var(--color-wizard-red)';
            else if (isTier3) color = 'var(--color-wizard-cyan)';
            else color = 'var(--color-wizard-cyan)';
          }
          return (
            <div
              key={i}
              className="w-3 h-3 rounded-full transition-all"
              style={{
                background: color,
                boxShadow: filled
                  ? `0 0 6px ${color}`
                  : 'none',
                border: filled ? 'none' : '1px solid var(--color-wizard-line)',
              }}
            />
          );
        })}
      </div>
      <div className="flex items-center gap-2 mt-1 text-[9px] font-mono">
        <Tier active={tier3} label="Q 冰封" color="var(--color-wizard-cyan)" />
        <Tier active={tier5} label="W 火焰" color="var(--color-wizard-red)" />
        <Tier active={tier7} label="E 雷電" color="var(--color-wizard-gold)" />
      </div>
    </div>
  );
}

function Tier({ active, label, color }: { active: boolean; label: string; color: string }) {
  return (
    <div
      className="flex items-center gap-1 px-1.5 py-0.5 rounded transition-all"
      style={{
        background: active ? `${color}22` : 'transparent',
        border: `1px solid ${active ? color : 'var(--color-wizard-line)'}`,
        color: active ? color : 'var(--color-wizard-ink-dim)',
        opacity: active ? 1 : 0.5,
      }}
    >
      {label}
    </div>
  );
}