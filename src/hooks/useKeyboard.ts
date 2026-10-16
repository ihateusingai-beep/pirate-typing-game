// ============================================================================
// useKeyboard — pirate version with F3 lesson applied
// (case-sensitive tokensMatch, anti-repeat, no stale closures)
// ============================================================================

import { useEffect } from 'react';
import type { KeyToken } from '../types';
import { keyEventToChar } from '../types';

export interface UseKeyboardOptions {
  enabled: boolean;
  capsLockOn: boolean;
  onKey: (token: KeyToken) => void;
}

export function useKeyboard({ enabled, capsLockOn, onKey }: UseKeyboardOptions): void {
  useEffect(() => {
    if (!enabled) return;

    let lastKey = '';
    let lastTime = 0;

    const handler = (e: KeyboardEvent) => {
      const now = performance.now();
      // Suppress key auto-repeat (same key within 60ms)
      if (e.key === lastKey && now - lastTime < 60) return;
      lastKey = e.key;
      lastTime = now;

      // Skip modifier-combo keys; allow plain Enter/Backspace/Delete/CapsLock through
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      const token = keyEventToChar(e.key, capsLockOn);
      if (!token) return;

      if (token.kind === 'backspace') e.preventDefault();
      onKey(token);
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [enabled, capsLockOn, onKey]);
}