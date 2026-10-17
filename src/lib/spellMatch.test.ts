import { describe, it, expect } from 'vitest';
import { tokensMatch, tokenDisplay } from './spellMatch';
import type { KeyToken } from '../types';

describe('tokensMatch', () => {
  it('matches char with same value (case-sensitive)', () => {
    expect(tokensMatch({ kind: 'char', value: 'a' }, { kind: 'char', value: 'a' })).toBe(true);
    expect(tokensMatch({ kind: 'char', value: 'A' }, { kind: 'char', value: 'A' })).toBe(true);
  });

  it('rejects char with different case (F3 lesson)', () => {
    expect(tokensMatch({ kind: 'char', value: 'a' }, { kind: 'char', value: 'A' })).toBe(false);
    expect(tokensMatch({ kind: 'char', value: 'A' }, { kind: 'char', value: 'a' })).toBe(false);
  });

  it('rejects char with different value', () => {
    expect(tokensMatch({ kind: 'char', value: 'a' }, { kind: 'char', value: 'b' })).toBe(false);
  });

  it('matches enter, backspace, delete, capslock regardless of value (only kind matters)', () => {
    for (const kind of ['enter', 'backspace', 'delete', 'capslock'] as const) {
      const a: KeyToken = { kind };
      const b: KeyToken = { kind };
      expect(tokensMatch(a, b)).toBe(true);
    }
  });

  it('rejects cross-kind tokens', () => {
    expect(tokensMatch({ kind: 'char', value: 'a' }, { kind: 'enter' })).toBe(false);
    expect(tokensMatch({ kind: 'enter' }, { kind: 'backspace' })).toBe(false);
    expect(tokensMatch({ kind: 'capslock' }, { kind: 'delete' })).toBe(false);
  });

  it('matches arrow with same direction', () => {
    expect(tokensMatch({ kind: 'arrow', direction: 'up' }, { kind: 'arrow', direction: 'up' })).toBe(true);
    expect(tokensMatch({ kind: 'arrow', direction: 'left' }, { kind: 'arrow', direction: 'right' })).toBe(false);
  });
});

describe('tokenDisplay', () => {
  it('uppercases char tokens', () => {
    expect(tokenDisplay({ kind: 'char', value: 'a' })).toBe('A');
    expect(tokenDisplay({ kind: 'char', value: '5' })).toBe('5');
  });

  it('uses arrow glyphs for arrow tokens', () => {
    expect(tokenDisplay({ kind: 'arrow', direction: 'up' })).toBe('↑');
    expect(tokenDisplay({ kind: 'arrow', direction: 'down' })).toBe('↓');
    expect(tokenDisplay({ kind: 'arrow', direction: 'left' })).toBe('←');
    expect(tokenDisplay({ kind: 'arrow', direction: 'right' })).toBe('→');
  });

  it('uses known glyphs for special keys', () => {
    expect(tokenDisplay({ kind: 'enter' })).toBe('↵');
    expect(tokenDisplay({ kind: 'backspace' })).toBe('⌫');
    expect(tokenDisplay({ kind: 'delete' })).toBe('⌦');
    expect(tokenDisplay({ kind: 'capslock' })).toBe('⇪');
  });
});
