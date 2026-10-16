// ============================================================================
// MainMenu — pirate-themed landing page
// ============================================================================

interface MainMenuProps {
  onStart: () => void;
  onResetProgress?: () => void;
  onOpenSpellBook?: () => void;
  highestLevelUnlocked: number;
  starsByLevel: Record<number, 0 | 1 | 2 | 3>;
}

export function MainMenu({ onStart, onResetProgress, onOpenSpellBook, highestLevelUnlocked, starsByLevel }: MainMenuProps) {
  const totalStars = Object.values(starsByLevel).reduce<number>((a, b) => a + b, 0);
  const maxStars = 15 * 3;

  const rank = highestLevelUnlocked >= 15 ? '船長'
    : highestLevelUnlocked >= 11 ? '副官'
    : highestLevelUnlocked >= 6 ? '水手長'
    : '見習水手';

  return (
    <div className="scene h-full w-full flex flex-col p-8">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <div className="font-serif text-2xl flex items-center gap-2" style={{ color: 'var(--color-pirate-gold)' }}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 2v20M2 12h20" />
            <path d="M12 2a10 10 0 0 1 0 20" />
          </svg>
          海盜船長炮台
        </div>
        <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--color-pirate-ink-mute)' }}>
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
            style={{
              background: 'linear-gradient(135deg, var(--color-pirate-wood), var(--color-pirate-gold))',
              color: 'var(--color-pirate-bg)',
            }}
          >
            船
          </div>
          <span>船長 Ken</span>
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
              color: 'var(--color-pirate-gold)',
            }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3 7h7l-5.5 4.5 2 7L12 16l-6.5 4.5 2-7L2 9h7z" />
            </svg>
            船員等級 · {rank} LV{highestLevelUnlocked}
          </div>
          <h1 className="font-serif text-5xl leading-tight mb-4" style={{ color: 'var(--color-pirate-ink)' }}>
            準備好出航了嗎？<br />敵人就在海平線！
          </h1>
          <p className="text-base mb-6 max-w-md" style={{ color: 'var(--color-pirate-ink-mute)' }}>
            駛出你的戰船，每艘敵艦都有一個字符旗號。按下對應的鍵開炮擊沉！由單字符開始，逐步解鎖 16 級海上戰役。
          </p>
          <div className="flex gap-3 flex-wrap">
            <button onClick={onStart} className="btn-primary">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3" /></svg>
              啟錨出航
            </button>
            {onOpenSpellBook && (
              <button onClick={onOpenSpellBook} className="btn-ghost">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 4h14a3 3 0 0 1 3 3v13a1 1 0 0 1-1 1H6a3 3 0 0 1-3-3z" />
                  <path d="M3 4v14a1 1 0 0 0 1 1h13" />
                </svg>
                艦隊登記冊
              </button>
            )}
            {onResetProgress && (
              <button onClick={onResetProgress} className="btn-ghost text-xs">
                重置進度
              </button>
            )}
          </div>
        </div>
        <div className="flex items-center justify-center">
          <svg width="220" height="180" viewBox="0 0 100 80">
            <defs>
              <linearGradient id="heroHull" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#b45309" />
                <stop offset="100%" stopColor="#78350f" />
              </linearGradient>
            </defs>
            {/* Water */}
            <ellipse cx="50" cy="74" rx="40" ry="4" fill="var(--color-pirate-ocean)" opacity="0.4" />
            {/* Hull */}
            <path d="M10 50 Q10 70 25 70 L75 70 Q90 70 90 50 L80 45 L20 45 Z" fill="url(#heroHull)" stroke="#451a03" strokeWidth="1.5" />
            <rect x="20" y="55" width="60" height="3" fill="#451a03" />
            {/* Mast */}
            <line x1="50" y1="45" x2="50" y2="8" stroke="#451a03" strokeWidth="2.5" />
            <ellipse cx="50" cy="15" rx="6" ry="2" fill="#451a03" />
            {/* Big sail */}
            <path d="M28 18 Q28 12 30 10 L70 10 Q72 12 72 18 L72 32 Q72 38 70 40 L30 40 Q28 38 28 32 Z"
              fill="#fef3c7" stroke="#78350f" strokeWidth="1" />
            <circle cx="50" cy="22" r="5" fill="#0a0820" />
            <circle cx="48" cy="20.5" r="1.2" fill="#fef3c7" />
            <circle cx="52" cy="20.5" r="1.2" fill="#fef3c7" />
            <line x1="42" y1="30" x2="58" y2="34" stroke="#0a0820" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="42" y1="34" x2="58" y2="30" stroke="#0a0820" strokeWidth="1.5" strokeLinecap="round" />
            {/* Flag */}
            <path d="M50 8 L65 8 L65 18 L57 18 L62 22 L50 18 Z" fill="#0a0820" />
          </svg>
        </div>
      </div>

      {/* Bottom progress */}
      <div className="flex items-center gap-4">
        <div
          className="flex items-center gap-3 px-4 py-2 rounded-lg text-sm"
          style={{ background: 'rgba(20, 42, 64, 0.7)', border: '1px solid var(--color-pirate-line)' }}
        >
          <span style={{ color: 'var(--color-pirate-ink-mute)' }}>已解鎖艦隊</span>
          <div className="w-32 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--color-pirate-line)' }}>
            <div
              className="h-full rounded-full"
              style={{
                width: `${(highestLevelUnlocked / 15) * 100}%`,
                background: 'linear-gradient(90deg, var(--color-pirate-wood), var(--color-pirate-gold))',
              }}
            />
          </div>
          <span className="font-semibold">{highestLevelUnlocked} / 15</span>
        </div>
        <div
          className="flex items-center gap-3 px-4 py-2 rounded-lg text-sm"
          style={{ background: 'rgba(20, 42, 64, 0.7)', border: '1px solid var(--color-pirate-line)' }}
        >
          <span style={{ color: 'var(--color-pirate-gold)' }}>💰</span>
          <span style={{ color: 'var(--color-pirate-ink-mute)' }}>總戰利品</span>
          <span className="font-semibold">{totalStars} / {maxStars}</span>
        </div>
      </div>
    </div>
  );
}