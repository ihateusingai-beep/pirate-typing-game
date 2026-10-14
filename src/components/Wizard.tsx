// ============================================================================
// Wizard — SVG character component
// ============================================================================

interface WizardProps {
  size?: number;
  casting?: boolean;
}

/**
 * Apprentice wizard SVG. Uses CSS animations defined in index.css for blinking
 * eyes and glowing orb. Pure inline SVG — no external assets needed.
 */
export function Wizard({ size = 80, casting = false }: WizardProps) {
  return (
    <svg
      width={size}
      height={size * 1.375}
      viewBox="0 0 80 110"
      className="bob"
      role="img"
      aria-label="巫師角色"
    >
      <defs>
        <linearGradient id="wizRobe" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#a855f7" />
          <stop offset="100%" stopColor="#6366f1" />
        </linearGradient>
        <radialGradient id="wizOrb" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fef3c7" />
          <stop offset="100%" stopColor="#fbbf24" />
        </radialGradient>
      </defs>

      {/* Robe */}
      <path
        d="M20 50 Q15 75 18 105 L62 105 Q65 75 60 50 Z"
        fill="url(#wizRobe)"
        stroke="#4f46e5"
        strokeWidth="1"
      />

      {/* Body */}
      <ellipse cx="40" cy="55" rx="18" ry="22" fill="#221d40" />

      {/* Belt */}
      <rect x="22" y="65" width="36" height="3" fill="#92400e" />
      <circle cx="40" cy="66.5" r="1.5" fill="#fbbf24" />

      {/* Head */}
      <circle cx="40" cy="35" r="14" fill="#f5d5b3" />

      {/* Eyes — blinking via parent transform animation */}
      <g style={{ transformOrigin: '40px 35px' }}>
        <ellipse cx="36" cy="35" rx="1.8" ry="2.2" fill="#22d3ee" />
        <ellipse cx="44" cy="35" rx="1.8" ry="2.2" fill="#22d3ee" />
      </g>

      {/* Mouth */}
      <path
        d="M36 42 Q40 44 44 42"
        stroke="#92400e"
        strokeWidth="1.2"
        fill="none"
        strokeLinecap="round"
      />

      {/* Hat brim */}
      <ellipse cx="40" cy="25" rx="20" ry="3" fill="#4f46e5" />

      {/* Hat cone */}
      <path
        d="M22 22 Q40 -5 58 22 L55 25 L25 25 Z"
        fill="#6366f1"
        stroke="#fbbf24"
        strokeWidth="1"
      />

      {/* Hat star */}
      <circle cx="40" cy="8" r="2" fill="#fbbf24" />
      <path
        d="M40 5 L40 11 M37 8 L43 8"
        stroke="#fef3c7"
        strokeWidth="0.5"
        strokeLinecap="round"
      />

      {/* Staff */}
      <line
        x1="68"
        y1="105"
        x2="72"
        y2="35"
        stroke="#92400e"
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      {/* Orb */}
      <circle
        cx="72"
        cy="32"
        r="6"
        fill="url(#wizOrb)"
        style={{
          filter: 'drop-shadow(0 0 4px #fbbf24)',
          animation: 'orb-glow 2s ease-in-out infinite',
        }}
      />
      <circle cx="72" cy="32" r="9" fill="none" stroke="#fbbf24" strokeWidth="0.5" opacity="0.4" />

      {/* Casting flash overlay */}
      {casting && (
        <circle
          cx="72"
          cy="32"
          r="14"
          fill="none"
          stroke="#22d3ee"
          strokeWidth="2"
          opacity="0.8"
          style={{
            animation: 'cast-ring 0.4s ease-out forwards',
            transformOrigin: '72px 32px',
          }}
        />
      )}
    </svg>
  );
}