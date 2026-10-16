// ============================================================================
// EnemyShip — SVG enemy ship with name on flag
// 5 variants: scout / patrol / frigate / warship / ghost (boss)
// ============================================================================

interface EnemyShipProps {
  rune: string;
  isTarget?: boolean;
  hp?: number;
  maxHp?: number;
  variant?: 'scout' | 'patrol' | 'frigate' | 'warship' | 'ghost';
}

/** One of 5 enemy ship types. The `rune` is the character the player types
 *  to sink this ship. */
export function EnemyShip({
  rune,
  isTarget = false,
  hp = 1,
  maxHp = 1,
  variant = 'scout',
}: EnemyShipProps) {
  const hpPct = Math.max(0, Math.min(100, (hp / maxHp) * 100));

  return (
    <div
      className={`relative float ${isTarget ? 'pulse-glow' : ''}`}
      style={{
        background: 'rgba(20, 42, 64, 0.95)',
        border: `2px solid ${isTarget ? 'var(--color-pirate-cyan)' : 'var(--color-pirate-enemy)'}`,
        borderRadius: 14,
        padding: '6px 14px',
        boxShadow: isTarget
          ? '0 0 24px -2px var(--color-pirate-cyan)'
          : '0 0 20px -2px var(--color-pirate-enemy)',
        minWidth: 60,
      }}
    >
      <ShipArt variant={variant} target={isTarget} />

      {/* Ship name (rune character) */}
      <div
        className="font-serif text-center mt-1"
        style={{
          fontSize: 28,
          lineHeight: 1,
          color: isTarget ? 'var(--color-pirate-cyan)' : 'var(--color-pirate-enemy)',
          textShadow: isTarget
            ? '0 0 12px var(--color-pirate-cyan)'
            : '0 0 8px var(--color-pirate-enemy)',
        }}
      >
        {rune}
      </div>

      {/* HP bar (only for multi-HP enemies) */}
      {maxHp > 1 && (
        <div
          className="mt-1.5 rounded-full overflow-hidden"
          style={{ width: '100%', height: 3, background: 'rgba(255,255,255,0.1)' }}
        >
          <div
            className="h-full transition-all duration-300"
            style={{
              width: `${hpPct}%`,
              background: isTarget ? 'var(--color-pirate-cyan)' : 'var(--color-pirate-enemy)',
            }}
          />
        </div>
      )}
    </div>
  );
}

function ShipArt({
  variant,
  target,
}: {
  variant: 'scout' | 'patrol' | 'frigate' | 'warship' | 'ghost';
  target: boolean;
}) {
  const eyeColor = target ? 'var(--color-pirate-cyan)' : 'var(--color-pirate-enemy)';

  if (variant === 'scout') {
    return (
      <svg width="44" height="28" viewBox="0 0 60 40" aria-hidden="true">
        <path d="M5 25 Q5 35 15 35 L45 35 Q55 35 55 25 L50 22 L10 22 Z" fill="#7c2d12" stroke="#451a03" />
        <line x1="30" y1="22" x2="30" y2="6" stroke="#451a03" strokeWidth="1.5" />
        <path d="M22 8 L38 8 L38 20 L22 20 Z" fill="#fef3c7" />
        <text x="30" y="16" textAnchor="middle" fontSize="6" fill="#0a0820" fontFamily="serif">!</text>
      </svg>
    );
  }
  if (variant === 'patrol') {
    return (
      <svg width="44" height="28" viewBox="0 0 60 40" aria-hidden="true">
        <path d="M4 25 Q4 36 14 36 L46 36 Q56 36 56 25 L52 22 L8 22 Z" fill="#991b1b" stroke="#451a03" />
        <rect x="20" y="22" width="20" height="3" fill="#451a03" />
        <line x1="30" y1="22" x2="30" y2="4" stroke="#451a03" strokeWidth="1.5" />
        <path d="M20 6 L40 6 L40 18 L20 18 Z" fill="#fef3c7" />
        <circle cx="30" cy="12" r="2.5" fill={eyeColor} />
      </svg>
    );
  }
  if (variant === 'frigate') {
    return (
      <svg width="44" height="28" viewBox="0 0 60 40" aria-hidden="true">
        <path d="M3 25 Q3 36 14 36 L46 36 Q57 36 57 25 L52 22 L8 22 Z" fill="#7f1d1d" stroke="#450a0a" strokeWidth="1" />
        <rect x="18" y="22" width="24" height="3" fill="#450a0a" />
        <circle cx="22" cy="29" r="1.5" fill="#fbbf24" />
        <circle cx="30" cy="29" r="1.5" fill="#fbbf24" />
        <circle cx="38" cy="29" r="1.5" fill="#fbbf24" />
        <line x1="14" y1="22" x2="14" y2="10" stroke="#450a0a" strokeWidth="1.5" />
        <line x1="46" y1="22" x2="46" y2="10" stroke="#450a0a" strokeWidth="1.5" />
        <path d="M14 12 L14 18 M46 12 L46 18" stroke="#450a0a" strokeWidth="1" />
      </svg>
    );
  }
  if (variant === 'warship') {
    return (
      <svg width="48" height="30" viewBox="0 0 60 40" aria-hidden="true">
        <path d="M2 24 Q2 36 13 36 L47 36 Q58 36 58 24 L52 20 L8 20 Z" fill="#450a0a" stroke="#1c0707" strokeWidth="1" />
        <rect x="16" y="20" width="28" height="4" fill="#1c0707" />
        <rect x="20" y="16" width="6" height="4" fill="#1c0707" />
        <rect x="34" y="16" width="6" height="4" fill="#1c0707" />
        <circle cx="23" cy="30" r="2" fill="#fbbf24" />
        <circle cx="30" cy="30" r="2" fill="#fbbf24" />
        <circle cx="37" cy="30" r="2" fill="#fbbf24" />
        <path d="M5 28 L8 32 L5 36" stroke="#1c0707" strokeWidth="1" fill="none" />
        <path d="M55 28 L52 32 L55 36" stroke="#1c0707" strokeWidth="1" fill="none" />
      </svg>
    );
  }
  // ghost (boss)
  return (
    <svg width="60" height="40" viewBox="0 0 80 50" aria-hidden="true">
      <defs>
        <linearGradient id="ghostHull" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1c0707" />
          <stop offset="100%" stopColor="#0a0820" />
        </linearGradient>
      </defs>
      {/* Ghostly main hull */}
      <path d="M2 30 Q2 44 16 44 L64 44 Q78 44 78 30 L72 26 L8 26 Z" fill="url(#ghostHull)" stroke="#7c2d12" strokeWidth="1.5" />
      {/* Torn sails (waving) */}
      <path d="M22 26 L22 8 L30 12 L22 16 Z M30 26 L30 6 L38 10 L30 14 Z M40 26 L40 10 L48 14 L40 18 Z"
        fill="#1c0707" stroke="#7c2d12" strokeWidth="0.5" opacity="0.7" />
      {/* Glowing eyes */}
      <ellipse cx="25" cy="32" rx="2" ry="3" fill="#fbbf24" style={{ filter: 'drop-shadow(0 0 4px #fbbf24)' }} />
      <ellipse cx="35" cy="32" rx="2" ry="3" fill="#fbbf24" style={{ filter: 'drop-shadow(0 0 4px #fbbf24)' }} />
      <ellipse cx="45" cy="32" rx="2" ry="3" fill="#fbbf24" style={{ filter: 'drop-shadow(0 0 4px #fbbf24)' }} />
      <ellipse cx="55" cy="32" rx="2" ry="3" fill="#fbbf24" style={{ filter: 'drop-shadow(0 0 4px #fbbf24)' }} />
      {/* Skull Jolly Roger */}
      <circle cx="40" cy="14" r="2.5" fill="#0a0820" stroke="#fef3c7" strokeWidth="0.5" />
      <circle cx="39" cy="13.5" r="0.6" fill="#fef3c7" />
      <circle cx="41" cy="13.5" r="0.6" fill="#fef3c7" />
    </svg>
  );
}