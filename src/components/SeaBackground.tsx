// ============================================================================
// SeaBackground — animated ocean horizon with rolling waves
// ============================================================================

interface SeaBackgroundProps {
  size?: number;
}

/** Decorative animated ocean: depth gradient + rolling wave line.
 *  Replaces the wizard's MagicCircle. */
export function SeaBackground({ size = 320 }: SeaBackgroundProps) {
  return (
    <svg
      width={size}
      height={size * 0.5}
      viewBox="0 0 800 400"
      preserveAspectRatio="none"
      style={{ position: 'absolute', bottom: 80, left: 0, right: 0, pointerEvents: 'none' }}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="seaHorizon" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#0c1e3a" />
          <stop offset="100%" stopColor="#0a1428" />
        </linearGradient>
        <linearGradient id="sunGlow" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#fbbf24" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Sun glow at horizon */}
      <ellipse cx="400" cy="280" rx="200" ry="60" fill="url(#sunGlow)" />

      {/* Distant island silhouette */}
      <path d="M120 290 Q150 270 180 280 Q220 285 250 270 Q280 260 300 280 L300 320 L120 320 Z" fill="#0a1428" />

      {/* Wave lines (animated) */}
      <g className="wave-roll" style={{ animation: 'wave-roll 12s linear infinite' }}>
        <path d="M0 320 Q200 310 400 320 T800 320" stroke="#67e8f9" strokeWidth="1.5" fill="none" opacity="0.5" />
        <path d="M0 340 Q200 330 400 340 T800 340" stroke="#67e8f9" strokeWidth="1" fill="none" opacity="0.4" />
        <path d="M0 360 Q200 350 400 360 T800 360" stroke="#67e8f9" strokeWidth="1" fill="none" opacity="0.3" />
        <path d="M0 380 Q200 370 400 380 T800 380" stroke="#67e8f9" strokeWidth="1" fill="none" opacity="0.2" />
        {/* Duplicate for seamless loop */}
        <path d="M800 320 Q1000 310 1200 320 T2000 320" stroke="#67e8f9" strokeWidth="1.5" fill="none" opacity="0.5" />
        <path d="M800 340 Q1000 330 1200 340 T2000 340" stroke="#67e8f9" strokeWidth="1" fill="none" opacity="0.4" />
        <path d="M800 360 Q1000 350 1200 360 T2000 360" stroke="#67e8f9" strokeWidth="1" fill="none" opacity="0.3" />
        <path d="M800 380 Q1000 370 1200 380 T2000 380" stroke="#67e8f9" strokeWidth="1" fill="none" opacity="0.2" />
      </g>
    </svg>
  );
}