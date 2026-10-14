// ============================================================================
// Enemy — SVG shadow creature with rune on forehead
// ============================================================================

interface EnemyProps {
  rune: string;
  isTarget?: boolean;
  hp?: number;
  maxHp?: number;
  variant?: 'imp' | 'ghost' | 'specter' | 'dragon';
}

/**
 * One of four enemy types, all rendered as inline SVG. The `rune` is the
 * character the player needs to type to defeat this enemy.
 */
export function Enemy({
  rune,
  isTarget = false,
  hp = 1,
  maxHp = 1,
  variant = 'imp',
}: EnemyProps) {
  const hpPct = Math.max(0, Math.min(100, (hp / maxHp) * 100));

  return (
    <div
      className={`relative float ${isTarget ? 'pulse-glow' : ''}`}
      style={{
        background: 'rgba(20, 17, 46, 0.95)',
        border: `2px solid ${isTarget ? 'var(--color-wizard-cyan)' : 'var(--color-wizard-red)'}`,
        borderRadius: 14,
        padding: '8px 14px',
        boxShadow: isTarget
          ? '0 0 24px -2px var(--color-wizard-cyan)'
          : '0 0 20px -2px rgba(244, 63, 94, 0.5)',
        minWidth: 60,
      }}
    >
      {/* Enemy face art — varies by variant */}
      <EnemyFace variant={variant} target={isTarget} />

      {/* Rune label — the character the player needs to type */}
      <div
        className="font-serif text-center mt-1"
        style={{
          fontSize: 32,
          lineHeight: 1,
          color: isTarget ? 'var(--color-wizard-cyan)' : 'var(--color-wizard-red)',
          textShadow: isTarget
            ? '0 0 12px var(--color-wizard-cyan)'
            : '0 0 8px rgba(244, 63, 94, 0.5)',
        }}
      >
        {rune}
      </div>

      {/* HP bar */}
      {maxHp > 1 && (
        <div
          className="mt-1.5 rounded-full overflow-hidden"
          style={{
            width: '100%',
            height: 3,
            background: 'rgba(255,255,255,0.1)',
          }}
        >
          <div
            className="h-full transition-all duration-300"
            style={{
              width: `${hpPct}%`,
              background: isTarget
                ? 'var(--color-wizard-cyan)'
                : 'var(--color-wizard-red)',
            }}
          />
        </div>
      )}
    </div>
  );
}

function EnemyFace({
  variant,
  target,
}: {
  variant: 'imp' | 'ghost' | 'specter' | 'dragon';
  target: boolean;
}) {
  const eyeColor = target ? 'var(--color-wizard-cyan)' : 'var(--color-wizard-red)';
  const eyeGlow = target ? 'var(--color-wizard-cyan)' : 'rgba(244, 63, 94, 0.8)';

  if (variant === 'imp') {
    return (
      <svg width="40" height="32" viewBox="0 0 60 48" aria-hidden="true">
        <ellipse cx="30" cy="28" rx="22" ry="18" fill="#1a0a1e" stroke={eyeColor} strokeWidth="2" />
        <circle cx="30" cy="24" r="6" fill={eyeColor} />
        <circle cx="30" cy="24" r="3" fill="#fbbf24" style={{ filter: `drop-shadow(0 0 4px ${eyeGlow})` }} />
        <path d="M20 38 L15 42 M40 38 L45 42" stroke={eyeColor} strokeWidth="2" strokeLinecap="round" />
        <path d="M22 14 Q25 12 28 14 M32 14 Q35 12 38 14" stroke={eyeColor} strokeWidth="1.5" fill="none" />
      </svg>
    );
  }
  if (variant === 'ghost') {
    return (
      <svg width="40" height="32" viewBox="0 0 60 48" aria-hidden="true">
        <path
          d="M15 28 Q10 14 20 9 Q30 4 40 9 Q50 14 45 28 Q50 42 40 42 Q30 42 30 38 Q30 42 20 42 Q10 42 15 28 Z"
          fill="#1e1b4b"
          stroke={eyeColor}
          strokeWidth="2"
        />
        <ellipse cx="22" cy="26" rx="4" ry="5" fill={eyeColor} />
        <ellipse cx="38" cy="26" rx="4" ry="5" fill={eyeColor} />
        <path d="M22 38 Q30 42 38 38" stroke={eyeColor} strokeWidth="2" fill="none" strokeLinecap="round" />
      </svg>
    );
  }
  if (variant === 'specter') {
    return (
      <svg width="40" height="32" viewBox="0 0 60 48" aria-hidden="true">
        <path
          d="M10 28 L20 13 L30 23 L40 8 L50 23 L55 28 L50 43 L40 48 L30 38 L20 48 L10 43 Z"
          fill="#451a03"
          stroke={eyeColor}
          strokeWidth="2"
        />
        <circle cx="25" cy="26" r="3" fill="#fbbf24" />
        <circle cx="35" cy="26" r="3" fill="#fbbf24" />
        <circle cx="30" cy="36" r="2" fill="#fbbf24" />
      </svg>
    );
  }
  // dragon (boss)
  return (
    <svg width="48" height="36" viewBox="0 0 60 48" aria-hidden="true">
      <path
        d="M5 36 Q10 22 20 18 Q40 13 50 22 Q55 28 50 38 Q40 46 30 42 Q20 46 10 42 Q5 40 5 36 Z"
        fill="#7f1d1d"
        stroke={eyeColor}
        strokeWidth="2.5"
      />
      <circle cx="38" cy="28" r="5" fill="#fbbf24" />
      <circle cx="38" cy="28" r="2.5" fill="#0a0820" />
      <path d="M45 22 L52 19 M50 28 L57 28 M45 34 L52 36" stroke={eyeColor} strokeWidth="1.5" />
    </svg>
  );
}