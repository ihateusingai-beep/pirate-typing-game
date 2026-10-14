// ============================================================================
// useKeyboard — global keyboard listener hook
// ============================================================================

import { useEffect } from 'react';
import type { KeyToken } from '../types';
import { keyEventToChar } from '../types';

export interface UseKeyboardOptions {
  /** Whether to capture keys right now */
  enabled: boolean;
  /** Caps Lock state (for case conversion) */
  capsLockOn: boolean;
  /** Called when a key resolves to a KeyToken */
  onKey: (token: KeyToken) => void;
}

/**
 * Listens for keydown events and emits KeyTokens. Ignores key auto-repeat
 * (browser holds-fire) to avoid double-counting a single press.
 */
export function useKeyboard({ enabled, capsLockOn, onKey }: UseKeyboardOptions): void {
  useEffect(() => {
    if (!enabled) return;

    let lastKey = '';
    let lastTime = 0;

    const handler = (e: KeyboardEvent) => {
      // Suppress key auto-repeat (same key within 60ms)
      const now = performance.now();
      if (e.key === lastKey && now - lastTime < 60) return;
      lastKey = e.key;
      lastTime = now;

      // Allow meta keys to be ignored (Cmd/Ctrl/Alt combinations) but
      // let plain Enter, Backspace, Delete, CapsLock through.
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      const token = keyEventToChar(e.key, capsLockOn);
      if (!token) return;

      // Prevent default for things like Backspace (back-nav), but only when we
      // actually handle it
      if (token.kind === 'backspace') e.preventDefault();
      onKey(token);
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [enabled, capsLockOn, onKey]);
}