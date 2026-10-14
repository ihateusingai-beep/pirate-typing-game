// ============================================================================
// KeyboardZones — L0 tutorial diagram showing the 3 main zones
// ============================================================================

interface KeyboardZonesProps {
  /** Which zone is currently highlighted (animated) */
  highlighted?: 'main' | 'number' | 'edit' | 'all';
}

/** A clean visual showing the 3 keyboard regions, for the L0 tutorial. */
export function KeyboardZones({ highlighted = 'all' }: KeyboardZonesProps) {
  return (
    <div className="flex flex-col gap-3 max-w-3xl mx-auto">
      <Zone
        title="主鍵盤區"
        subtitle="Main · 學徒戰場"
        accent="primary"
        active={highlighted === 'main' || highlighted === 'all'}
        keys={['Q W E R T Y U I O P', 'A S D F G H J K L ;', 'Z X C V B N M']}
      />
      <Zone
        title="數字區 · 頂排"
        subtitle="Number · 召喚之門"
        accent="cyan"
        active={highlighted === 'number' || highlighted === 'all'}
        keys={['1 2 3 4 5 6 7 8 9 0']}
      />
      <Zone
        title="編輯區"
        subtitle="Edit · 控制之翼"
        accent="gold"
        active={highlighted === 'edit' || highlighted === 'all'}
        keys={['←  ↑  ↓  →', 'Home  End', 'PgUp  PgDn', '⌫ Backspace   ⌦ Delete   ↵ Enter   ⇪ Caps']}
      />
    </div>
  );
}

interface ZoneProps {
  title: string;
  subtitle: string;
  keys: string[];
  accent: 'primary' | 'cyan' | 'gold';
  active: boolean;
}

function Zone({ title, subtitle, keys, accent, active }: ZoneProps) {
  const accentColor = {
    primary: 'var(--color-wizard-primary)',
    cyan: 'var(--color-wizard-cyan)',
    gold: 'var(--color-wizard-gold)',
  }[accent];

  return (
    <div
      className="rounded-xl p-4 transition-all"
      style={{
        background: active ? `${accentColor}15` : 'rgba(20, 17, 46, 0.4)',
        border: `1px solid ${active ? accentColor : 'var(--color-wizard-line)'}`,
        boxShadow: active ? `0 0 24px -4px ${accentColor}` : 'none',
      }}
    >
      <div className="flex items-center gap-3 mb-3">
        <div
          className="w-3 h-3 rounded-full"
          style={{ background: accentColor, boxShadow: active ? `0 0 8px ${accentColor}` : 'none' }}
        />
        <div>
          <div className="font-serif text-lg" style={{ color: accentColor }}>{title}</div>
          <div className="text-[10px] uppercase tracking-wider" style={{ color: 'var(--color-wizard-ink-dim)' }}>
            {subtitle}
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        {keys.map((row, i) => (
          <div
            key={i}
            className="font-mono text-center text-sm py-2 rounded"
            style={{
              background: 'var(--color-wizard-bg)',
              border: '1px solid var(--color-wizard-line)',
              color: 'var(--color-wizard-ink-mute)',
              letterSpacing: '0.15em',
            }}
          >
            {row}
          </div>
        ))}
      </div>
    </div>
  );
}