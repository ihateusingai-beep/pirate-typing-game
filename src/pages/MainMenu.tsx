// ============================================================================
// MainMenu — landing screen, has Start/SpellBook/Quit buttons
// ============================================================================

interface MainMenuProps {
  onStart: () => void;
  onResetProgress?: () => void;
  highestLevelUnlocked: number;
  starsByLevel: Record<number, 0 | 1 | 2 | 3>;
}

export function MainMenu({ onStart, onResetProgress, highestLevelUnlocked, starsByLevel }: MainMenuProps) {
  const totalStars = Object.values(starsByLevel).reduce<number>((a, b) => a + b, 0);

  return (
    <div className="scene h-full w-full flex flex-col p-8">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <div className="font-serif text-2xl flex items-center gap-2">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-wizard-gold)" strokeWidth="2">
            <path d="M15 4V2" /><path d="M15 16v-2" /><path d="M8 9h2" /><path d="M20 9h2" />
            <path d="M17.8 11.8L19 13" /><path d="M15 9h0" /><path d="M17.8 6.2L19 5" />
            <path d="m3 21 9-9" /><path d="M12.2 6.2L11 5" />
          </svg>
          <span>巫師學徒</span>
        </div>
        <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--color-wizard-ink-mute)' }}>
          <div
            className="w-8 h-8 rounded-full"
            style={{
              background: 'linear-gradient(135deg, var(--color-wizard-purple), var(--color-wizard-pink))',
              border: '2px solid var(--color-wizard-gold)',
            }}
          />
          <span>冒險者 Ken</span>
        </div>
      </div>

      {/* Center hero */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div>
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-4"
            style={{
              background: 'rgba(251, 191, 36, 0.12)',
              border: '1px solid rgba(251, 191, 36, 0.4)',
              color: 'var(--color-wizard-gold)',
            }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3 7h7l-5.5 4.5 2 7L12 16l-6.5 4.5 2-7L2 9h7z" />
            </svg>
            巫師等級 · 學徒 Lv{highestLevelUnlocked}
          </div>
          <h1 className="font-serif text-5xl leading-tight mb-4">
            準備好施<br />下一個咒語了嗎？
          </h1>
          <p className="text-base mb-6 max-w-md" style={{ color: 'var(--color-wizard-ink-mute)' }}>
            透過施咒練習，由單字符開始，逐步解鎖 16 級咒語書。學打字，學英文。
          </p>
          <div className="flex gap-3">
            <button onClick={onStart} className="btn-primary">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3" /></svg>
              開始歷險
            </button>
            {onResetProgress && (
              <button onClick={onResetProgress} className="btn-ghost text-xs">
                重置進度
              </button>
            )}
          </div>
        </div>
        <div className="flex items-center justify-center">
          {/* Big wizard illustration */}
          <div className="relative">
            <svg width="180" height="248" viewBox="0 0 80 110">
              <defs>
                <linearGradient id="heroRobe" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#a855f7" />
                  <stop offset="100%" stopColor="#6366f1" />
                </linearGradient>
              </defs>
              <path d="M20 50 Q15 75 18 105 L62 105 Q65 75 60 50 Z" fill="url(#heroRobe)" stroke="#fbbf24" strokeWidth="1.5" />
              <ellipse cx="40" cy="55" rx="18" ry="22" fill="#221d40" />
              <circle cx="40" cy="35" r="14" fill="#f5d5b3" />
              <ellipse cx="36" cy="35" rx="2" ry="2.5" fill="#22d3ee" />
              <ellipse cx="44" cy="35" rx="2" ry="2.5" fill="#22d3ee" />
              <ellipse cx="40" cy="25" rx="20" ry="3" fill="#4f46e5" />
              <path d="M22 22 Q40 -5 58 22 L55 25 L25 25 Z" fill="#6366f1" stroke="#fbbf24" strokeWidth="1.5" />
              <circle cx="40" cy="8" r="3" fill="#fbbf24" />
              <line x1="68" y1="105" x2="72" y2="35" stroke="#92400e" strokeWidth="3" />
              <circle cx="72" cy="32" r="6" fill="#fbbf24" style={{ filter: 'drop-shadow(0 0 8px #fbbf24)' }} />
              <circle cx="72" cy="32" r="10" fill="none" stroke="#fbbf24" strokeWidth="1" opacity="0.5" />
            </svg>
          </div>
        </div>
      </div>

      {/* Bottom progress */}
      <div className="flex items-center gap-4">
        <div
          className="flex items-center gap-3 px-4 py-2 rounded-lg text-sm"
          style={{ background: 'var(--color-wizard-bg3)', border: '1px solid var(--color-wizard-line)' }}
        >
          <span style={{ color: 'var(--color-wizard-ink-mute)' }}>已學咒語</span>
          <div
            className="w-32 h-1.5 rounded-full overflow-hidden"
            style={{ background: 'var(--color-wizard-line)' }}
          >
            <div
              className="h-full rounded-full"
              style={{
                width: `${(highestLevelUnlocked / 15) * 100}%`,
                background: 'linear-gradient(90deg, var(--color-wizard-primary), var(--color-wizard-cyan))',
              }}
            />
          </div>
          <span className="font-semibold">{highestLevelUnlocked} / 15</span>
        </div>
        <div
          className="flex items-center gap-3 px-4 py-2 rounded-lg text-sm"
          style={{ background: 'var(--color-wizard-bg3)', border: '1px solid var(--color-wizard-line)' }}
        >
          <span style={{ color: 'var(--color-wizard-gold)' }}>⭐</span>
          <span style={{ color: 'var(--color-wizard-ink-mute)' }}>總星數</span>
          <span className="font-semibold">{totalStars} / 45</span>
        </div>
      </div>
    </div>
  );
}