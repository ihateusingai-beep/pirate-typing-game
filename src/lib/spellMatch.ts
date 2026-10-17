// ============================================================================
// Pure spell-matching logic — extracted from Battle.tsx for unit testing.
// No React, no DOM, no side effects.
// ============================================================================

import type { KeyToken } from '../types';

/** Case-sensitive token equality. F3 lesson applied. */
export function tokensMatch(a: KeyToken, b: KeyToken): boolean {
  if (a.kind !== b.kind) return false;
  if (a.kind === 'char' && b.kind === 'char') {
    return a.value === b.value;
  }
  if (a.kind === 'arrow' && b.kind === 'arrow') {
    return a.direction === b.direction;
  }
  return true;
}

/** Display string for a token (used in token-progress dots + virtual keyboard hints) */
export function tokenDisplay(token: KeyToken): string {
  switch (token.kind) {
    case 'char': return token.value.toUpperCase();
    case 'enter': return '↵';
    case 'backspace': return '⌫';
    case 'delete': return '⌦';
    case 'capslock': return '⇪';
    case 'arrow':
      return { up: '↑', down: '↓', left: '←', right: '→' }[token.direction];
  }
}
