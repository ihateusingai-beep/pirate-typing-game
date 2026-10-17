// ============================================================================
// ComboMeter — pirate version (7 dots)
// 1/5/0 數字鍵 control cannon type:
//   1 = normal (always available)
//   5 = fire (combo ≥ 3)
//   0 = ultimate (combo ≥ 7)
// Tier labels show ONLY cannon-type key + name (combo thresholds are shown
// visually via the 7 dots above — adding "Combo N" labels would mislead kids
// into thinking pressing 5 at combo≥5 unlocks something new).
// ============================================================================

interface ComboMeterProps {
  combo: number;
  maxDots?: number;
}

export function ComboMeter({ combo, maxDots = 7 }: ComboMeterProps) {
  const tier3 = combo >= 3;
  const tier7 = combo >= 7;

  return (
    <div
      className="flex flex-col items-center gap-1 px-3 py-2 rounded-lg"
      style={{
        background: 'rgba(10, 20, 40, 0.85)',
        border: '1px solid var(--color-pirate-line)',
        backdropFilter: 'blur(8px)',
        minWidth: 160,
      }}
    >
      <div className="text-[9px] uppercase tracking-wider" style={{ color: 'var(--color-pirate-ink-dim)' }}>
        連擊 Combo
      </div>
      <div className="flex gap-1.5">
        {Array.from({ length: maxDots }).map((_, i) => {
          const filled = i < combo;
          const isTier3 = i === 2;
          const isTier5 = i === 4;
          const isTier7 = i === 6;
          let color = 'var(--color-pirate-bg3)';
          if (filled) {
            if (isTier7) color = 'var(--color-pirate-gold)';
            else if (isTier5) color = 'var(--color-pirate-fire)';
            else if (isTier3) color = 'var(--color-pirate-cyan)';
            else color = 'var(--color-pirate-cyan)';
          }
          return (
            <div
              key={i}
              className="w-3 h-3 rounded-full transition-all"
              style={{
                background: color,
                boxShadow: filled ? `0 0 6px ${color}` : 'none',
                border: filled ? 'none' : '1px solid var(--color-pirate-line)',
              }}
            />
          );
        })}
      </div>
      <div className="flex items-center gap-2 mt-1 text-[9px] font-mono">
        <Tier active={tier3} label="按 5 火焰" color="var(--color-pirate-cyan)" />
        <Tier active={tier7} label="按 0 導彈" color="var(--color-pirate-gold)" />
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
        border: `1px solid ${active ? color : 'var(--color-pirate-line)'}`,
        color: active ? color : 'var(--color-pirate-ink-dim)',
        opacity: active ? 1 : 0.5,
      }}
    >
      {label}
    </div>
  );
}