// ============================================================================
// KeyboardZones — L0 tutorial diagram (pirate "航海圖" theme)
// ============================================================================

interface KeyboardZonesProps {
  highlighted?: 'main' | 'number' | 'edit' | 'all';
}

const ZONE_META: Record<'main' | 'number' | 'edit', { title: string; subtitle: string; accent: string; hint: string }> = {
  main: {
    title: '主鍵盤區',
    subtitle: 'Main · 艦隊控制',
    accent: 'var(--color-pirate-wood)',
    hint: '呢度係你嘅艦隊總部。26 個英文字母 (A–Z) 喺度。',
  },
  number: {
    title: '數字區 · 頂排',
    subtitle: 'Number · 彈藥庫',
    accent: 'var(--color-pirate-ocean)',
    hint: '頂排 10 個數字 (0–9) 控制炮彈類型：1=普通 / 5=火 / 0=導彈。',
  },
  edit: {
    title: '編輯區',
    subtitle: 'Edit · 航海羅盤',
    accent: 'var(--color-pirate-gold)',
    hint: 'Backspace 修正射擊、Delete 清冰山、Enter 開炮、Caps Lock 切大階。',
  },
};

export function KeyboardZones({ highlighted = 'all' }: KeyboardZonesProps) {
  return (
    <div className="flex flex-col gap-3 max-w-3xl mx-auto">
      {(Object.keys(ZONE_META) as Array<keyof typeof ZONE_META>).map((zone) => {
        const meta = ZONE_META[zone];
        const active = highlighted === zone || highlighted === 'all';
        return (
          <div
            key={zone}
            className="rounded-xl p-4 transition-all"
            style={{
              background: active ? `${meta.accent}22` : 'rgba(10, 20, 40, 0.4)',
              border: `1px solid ${active ? meta.accent : 'var(--color-pirate-line)'}`,
              boxShadow: active ? `0 0 24px -4px ${meta.accent}` : 'none',
            }}
          >
            <div className="flex items-center gap-3 mb-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{
                  background: meta.accent,
                  boxShadow: active ? `0 0 8px ${meta.accent}` : 'none',
                }}
              />
              <div className="flex-1">
                <div className="font-serif text-lg" style={{ color: meta.accent }}>{meta.title}</div>
                <div className="text-[10px] uppercase tracking-wider" style={{ color: 'var(--color-pirate-ink-dim)' }}>
                  {meta.subtitle}
                </div>
              </div>
            </div>
            {active && highlighted !== 'all' && (
              <p className="text-xs mb-2" style={{ color: 'var(--color-pirate-ink-mute)' }}>
                {meta.hint}
              </p>
            )}
            <ZoneKeys zone={zone} accent={meta.accent} active={active} />
          </div>
        );
      })}
    </div>
  );
}

function ZoneKeys({
  zone, accent, active,
}: { zone: 'main' | 'number' | 'edit'; accent: string; active: boolean }) {
  const keysByZone: Record<'main' | 'number' | 'edit', string[]> = {
    main: ['Q W E R T Y U I O P', 'A S D F G H J K L ;', 'Z X C V B N M'],
    number: ['1 2 3 4 5 6 7 8 9 0'],
    edit: ['←  ↑  ↓  →', '⌫ Backspace   ⌦ Delete', '↵ Enter   ⇪ Caps'],
  };
  return (
    <div className="flex flex-col gap-1.5">
      {keysByZone[zone].map((row, i) => (
        <div
          key={i}
          className="font-mono text-center text-sm py-2 rounded"
          style={{
            background: 'var(--color-pirate-bg)',
            border: `1px solid ${active ? accent : 'var(--color-pirate-line)'}`,
            color: 'var(--color-pirate-ink-mute)',
            letterSpacing: '0.15em',
          }}
        >
          {row}
        </div>
      ))}
    </div>
  );
}