import { describe, it, expect } from 'vitest';
import { keyEventToChar, tokenToKey } from './types';

describe('keyEventToChar', () => {
  it('returns enter token for "Enter"', () => {
    expect(keyEventToChar('Enter', false)).toEqual({ kind: 'enter' });
  });

  it('returns backspace token for "Backspace"', () => {
    expect(keyEventToChar('Backspace', false)).toEqual({ kind: 'backspace' });
  });

  it('returns delete token for "Delete"', () => {
    expect(keyEventToChar('Delete', false)).toEqual({ kind: 'delete' });
  });

  it('returns capslock token for "CapsLock"', () => {
    expect(keyEventToChar('CapsLock', false)).toEqual({ kind: 'capslock' });
  });

  it('returns arrow token with correct direction', () => {
    expect(keyEventToChar('ArrowUp', false)).toEqual({ kind: 'arrow', direction: 'up' });
    expect(keyEventToChar('ArrowDown', false)).toEqual({ kind: 'arrow', direction: 'down' });
    expect(keyEventToChar('ArrowLeft', false)).toEqual({ kind: 'arrow', direction: 'left' });
    expect(keyEventToChar('ArrowRight', false)).toEqual({ kind: 'arrow', direction: 'right' });
  });

  it('lowercases single-char keys when capsLock is off', () => {
    expect(keyEventToChar('a', false)).toEqual({ kind: 'char', value: 'a' });
    expect(keyEventToChar('A', false)).toEqual({ kind: 'char', value: 'a' }); // browser e.key may be A even without capsLock (e.g., Shift held)
  });

  it('uppercases single-char keys when capsLock is on (case-sensitive downstream match)', () => {
    expect(keyEventToChar('a', true)).toEqual({ kind: 'char', value: 'A' });
    expect(keyEventToChar('5', true)).toEqual({ kind: 'char', value: '5' }); // digits not affected
  });

  it('returns null for keys that are not actionable (e.g. F-keys, Tab)', () => {
    expect(keyEventToChar('F1', false)).toBeNull();
    expect(keyEventToChar('Tab', false)).toBeNull();
    expect(keyEventToChar('Shift', false)).toBeNull();
    expect(keyEventToChar('Meta', false)).toBeNull();
  });
});

describe('tokenToKey', () => {
  it('passes through char tokens', () => {
    expect(tokenToKey({ kind: 'char', value: 'a' })).toBe('a');
    expect(tokenToKey({ kind: 'char', value: 'A' })).toBe('A');
  });

  it('maps special kinds to their KeyboardEvent.key names', () => {
    expect(tokenToKey({ kind: 'enter' })).toBe('Enter');
    expect(tokenToKey({ kind: 'backspace' })).toBe('Backspace');
    expect(tokenToKey({ kind: 'delete' })).toBe('Delete');
    expect(tokenToKey({ kind: 'capslock' })).toBe('CapsLock');
  });

  it('maps arrow tokens to Arrow<Direction> PascalCase', () => {
    expect(tokenToKey({ kind: 'arrow', direction: 'up' })).toBe('ArrowUp');
    expect(tokenToKey({ kind: 'arrow', direction: 'down' })).toBe('ArrowDown');
    expect(tokenToKey({ kind: 'arrow', direction: 'left' })).toBe('ArrowLeft');
    expect(tokenToKey({ kind: 'arrow', direction: 'right' })).toBe('ArrowRight');
  });
});

describe('keyEventToChar ↔ tokenToKey roundtrip', () => {
  it('special keys roundtrip', () => {
    for (const key of ['Enter', 'Backspace', 'Delete', 'CapsLock', 'ArrowUp', 'ArrowDown']) {
      expect(tokenToKey(keyEventToChar(key, false)!)).toBe(key);
    }
  });
});
