// ============================================================================
// Keyboard layout definitions — for both VirtualKeyboard component and L0 tutorial
// ============================================================================

import type { KeyToken } from '../types';

/** Visual row in the keyboard (used for L0 zone display & virtual keyboard) */
export interface KeyRow {
  zone: 'main' | 'number' | 'edit';
  keys: Array<{ token: KeyToken; label: string; width?: number }>;
}

/** Standard QWERTY layout, structured by region */
export const KEYBOARD_LAYOUT: KeyRow[] = [
  // Number row (top)
  {
    zone: 'number',
    keys: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'].map((k) => ({
      token: { kind: 'char', value: k },
      label: k,
    })),
  },
  // Main top row
  {
    zone: 'main',
    keys: ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'].map((k) => ({
      token: { kind: 'char', value: k },
      label: k,
      width: 1.5,
    })),
  },
  // Main middle (home) row
  {
    zone: 'main',
    keys: ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ';'].map((k) => ({
      token: { kind: 'char', value: k },
      label: k,
      width: 1.5,
    })),
  },
  // Main bottom row
  {
    zone: 'main',
    keys: [
      { token: { kind: 'char', value: 'Z' }, label: 'Z', width: 1.5 },
      { token: { kind: 'char', value: 'X' }, label: 'X', width: 1.5 },
      { token: { kind: 'char', value: 'C' }, label: 'C', width: 1.5 },
      { token: { kind: 'char', value: 'V' }, label: 'V', width: 1.5 },
      { token: { kind: 'char', value: 'B' }, label: 'B', width: 1.5 },
      { token: { kind: 'char', value: 'N' }, label: 'N', width: 1.5 },
      { token: { kind: 'char', value: 'M' }, label: 'M', width: 1.5 },
      { token: { kind: 'enter' }, label: '↵ Enter', width: 3 },
      { token: { kind: 'backspace' }, label: '⌫', width: 2 },
    ],
  },
  // Edit row (arrows + navigation)
  {
    zone: 'edit',
    keys: [
      { token: { kind: 'arrow', direction: 'left' }, label: '←', width: 1.5 },
      { token: { kind: 'arrow', direction: 'up' }, label: '↑', width: 1.5 },
      { token: { kind: 'arrow', direction: 'down' }, label: '↓', width: 1.5 },
      { token: { kind: 'arrow', direction: 'right' }, label: '→', width: 1.5 },
      { token: { kind: 'delete' }, label: '⌦ Del', width: 2 },
      { token: { kind: 'capslock' }, label: '⇪ Caps', width: 2.5 },
    ],
  },
];

/** Get display string for a key token */
export function displayKey(token: KeyToken, capsLockOn = false): string {
  switch (token.kind) {
    case 'char':
      return capsLockOn ? token.value.toUpperCase() : token.value.toLowerCase();
    case 'enter': return '↵';
    case 'backspace': return '⌫';
    case 'delete': return '⌦';
    case 'capslock': return '⇪';
    case 'arrow':
      return { up: '↑', down: '↓', left: '←', right: '→' }[token.direction];
  }
}

/** Find a row by zone */
export function rowsByZone(zone: 'main' | 'number' | 'edit'): KeyRow[] {
  return KEYBOARD_LAYOUT.filter((r) => r.zone === zone);
}