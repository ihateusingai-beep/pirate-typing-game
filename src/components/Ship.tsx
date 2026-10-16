// ============================================================================
// Ship — pirate player ship SVG (replaces wizard)
// ============================================================================

interface ShipProps {
  size?: number;
  rocking?: boolean;
  firing?: boolean;
}

/** A wooden pirate ship with mast and Jolly Roger flag. */
export function Ship({ size = 100, rocking = true, firing = false }: ShipProps) {
  return (
    <svg
      width={size}
      height={size * 0.8}
      viewBox="0 0 100 80"
      className={rocking ? 'rock' : ''}
      role="img"
      aria-label="海盜船"
    >
      <defs>
        <linearGradient id="shipHull" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#b45309" />
          <stop offset="100%" stopColor="#78350f" />
        </linearGradient>
        <linearGradient id="shipSail" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fef3c7" />
          <stop offset="100%" stopColor="#fde68a" />
        </linearGradient>
      </defs>

      {/* Water splash at base */}
      <ellipse cx="50" cy="74" rx="40" ry="4" fill="var(--color-pirate-ocean)" opacity="0.4" />

      {/* Hull */}
      <path
        d="M10 50 Q10 70 25 70 L75 70 Q90 70 90 50 L80 45 L20 45 Z"
        fill="url(#shipHull)"
        stroke="#451a03"
        strokeWidth="1.5"
      />
      {/* Hull planks */}
      <line x1="15" y1="55" x2="85" y2="55" stroke="#451a03" strokeWidth="0.5" opacity="0.6" />
      <line x1="15" y1="62" x2="85" y2="62" stroke="#451a03" strokeWidth="0.5" opacity="0.6" />
      {/* Hull portholes */}
      <circle cx="30" cy="58" r="2" fill="#1a0e07" />
      <circle cx="40" cy="58" r="2" fill="#1a0e07" />
      <circle cx="50" cy="58" r="2" fill="#1a0e07" />
      <circle cx="60" cy="58" r="2" fill="#1a0e07" />
      <circle cx="70" cy="58" r="2" fill="#1a0e07" />
      {/* Bow decoration */}
      <path d="M85 50 L92 50 L88 55 Z" fill="#451a03" />
      <path d="M15 50 L8 50 L12 55 Z" fill="#451a03" />

      {/* Main mast */}
      <line x1="50" y1="45" x2="50" y2="8" stroke="#451a03" strokeWidth="2" />
      {/* Crow's nest */}
      <ellipse cx="50" cy="15" rx="6" ry="2" fill="#451a03" />
      {/* Main sail (with skull crossbones) */}
      <path d="M30 18 Q30 12 32 10 L68 10 Q70 12 70 18 L70 32 Q70 38 68 40 L32 40 Q30 38 30 32 Z"
        fill="url(#shipSail)" stroke="#78350f" strokeWidth="1" />
      {/* Skull on sail */}
      <circle cx="50" cy="22" r="4" fill="#0a0820" />
      <circle cx="48.5" cy="21" r="1" fill="#fef3c7" />
      <circle cx="51.5" cy="21" r="1" fill="#fef3c7" />
      {/* Crossbones */}
      <line x1="44" y1="28" x2="56" y2="32" stroke="#0a0820" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="44" y1="32" x2="56" y2="28" stroke="#0a0820" strokeWidth="1.5" strokeLinecap="round" />

      {/* Jolly Roger flag at top */}
      <path d="M50 8 L62 8 L62 16 L56 16 L60 20 L50 16 Z" fill="#0a0820" />
      <circle cx="56" cy="11" r="1.2" fill="#fef3c7" />
      <circle cx="56" cy="13" r="0.4" fill="#0a0820" />

      {/* Cannon (left side) */}
      <g transform={firing ? 'translate(0, -2)' : ''}>
        <rect x="22" y="42" width="14" height="6" rx="2" fill="#1a1a1a" stroke="#0a0820" />
        <circle cx="36" cy="45" r="2" fill="#0a0820" />
        {firing && (
          <circle cx="40" cy="45" r="6" fill="var(--color-pirate-fire)" opacity="0.8" />
        )}
      </g>
      {/* Cannon (right side) */}
      <g transform={firing ? 'translate(0, -2)' : ''}>
        <rect x="64" y="42" width="14" height="6" rx="2" fill="#1a1a1a" stroke="#0a0820" />
        <circle cx="64" cy="45" r="2" fill="#0a0820" />
        {firing && (
          <circle cx="60" cy="45" r="6" fill="var(--color-pirate-fire)" opacity="0.8" />
        )}
      </g>
    </svg>
  );
}