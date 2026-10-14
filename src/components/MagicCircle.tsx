// ============================================================================
// MagicCircle — rotating floor circle SVG
// ============================================================================

interface MagicCircleProps {
  size?: number;
}

/** A pentagram-style magic circle that slowly rotates. Pure SVG. */
export function MagicCircle({ size = 320 }: MagicCircleProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 320 320"
      className="magic-circle-spin"
      style={{ animation: 'rotate 60s linear infinite' }}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="mcRing" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#a855f7" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.5" />
        </linearGradient>
      </defs>

      {/* Outer rings */}
      <circle cx="160" cy="160" r="150" fill="none" stroke="url(#mcRing)" strokeWidth="1.5" />
      <circle cx="160" cy="160" r="120" fill="none" stroke="rgba(168, 85, 247, 0.3)" strokeWidth="1" />
      <circle cx="160" cy="160" r="90" fill="none" stroke="rgba(34, 211, 238, 0.4)" strokeWidth="1" strokeDasharray="3 5" />
      <circle cx="160" cy="160" r="55" fill="none" stroke="rgba(168, 85, 247, 0.4)" strokeWidth="1" />

      {/* Pentagram */}
      <polygon
        points="160,40 290,260 30,260"
        fill="none"
        stroke="rgba(168, 85, 247, 0.4)"
        strokeWidth="1.5"
      />

      {/* Rune marks at cardinal points */}
      <text x="160" y="35" textAnchor="middle" fill="rgba(168, 85, 247, 0.6)" fontFamily="JetBrains Mono" fontSize="10">A</text>
      <text x="160" y="295" textAnchor="middle" fill="rgba(34, 211, 238, 0.6)" fontFamily="JetBrains Mono" fontSize="10">Z</text>
      <text x="20" y="165" textAnchor="middle" fill="rgba(251, 191, 36, 0.6)" fontFamily="JetBrains Mono" fontSize="10">Q</text>
      <text x="300" y="165" textAnchor="middle" fill="rgba(244, 63, 94, 0.6)" fontFamily="JetBrains Mono" fontSize="10">P</text>

      {/* Inner glow */}
      <circle cx="160" cy="160" r="40" fill="url(#mcRing)" opacity="0.3" />
    </svg>
  );
}