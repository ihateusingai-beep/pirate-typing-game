// ============================================================================
// VirtualKeyboard — bottom keyboard with target key highlight (pirate version)
// ============================================================================

import { KEYBOARD_LAYOUT, displayKey } from '../config/keyboard';
import type { KeyToken } from '../types';

interface VirtualKeyboardProps {
  target?: KeyToken | null;
  capsLockOn?: boolean;
}

export function VirtualKeyboard({ target = null, capsLockOn = false }: VirtualKeyboardProps) {
  return (
    <div
      className="absolute bottom-0 left-0 right-0 px-3 py-2.5 z-10"
      style={{
        background: 'linear-gradient(180deg, rgba(10, 20, 40, 0.6), rgba(10, 20, 40, 0.95))',
        borderTop: '1px solid var(--color-pirate-line)',
        backdropFilter: 'blur(8px)',
      }}
    >
      {KEYBOARD_LAYOUT.map((row, ri) => (
        <div key={ri} className="flex gap-1 justify-center mb-1 last:mb-0">
          {row.keys.map((k, ki) => {
            const isTarget = target && tokensMatch(target, k.token);
            const width = (k.width ?? 1) * 32;
            return (
              <div
                key={ki}
                className={`rounded flex items-center justify-center font-mono text-xs ${
                  isTarget ? 'pulse-glow' : ''
                }`}
                style={{
                  width,
                  height: 32,
                  background: isTarget
                    ? 'rgba(34, 211, 238, 0.15)'
                    : 'rgba(20, 42, 64, 0.9)',
                  border: `1px solid ${
                    isTarget ? 'var(--color-pirate-cyan)' : 'var(--color-pirate-line)'
                  }`,
                  color: isTarget ? 'var(--color-pirate-cyan)' : 'var(--color-pirate-ink-mute)',
                  boxShadow: isTarget ? '0 0 12px var(--color-pirate-cyan)' : 'none',
                  fontSize: k.label.length > 1 ? 10 : 11,
                }}
              >
                {displayKey(k.token, capsLockOn)}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

function tokensMatch(a: KeyToken, b: KeyToken): boolean {
  if (a.kind !== b.kind) return false;
  if (a.kind === 'char' && b.kind === 'char') {
    return a.value.toLowerCase() === b.value.toLowerCase();
  }
  if (a.kind === 'arrow' && b.kind === 'arrow') {
    return a.direction === b.direction;
  }
  return true;
}