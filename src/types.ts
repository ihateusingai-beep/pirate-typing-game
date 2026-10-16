// ============================================================================
// Core game types — Pirate Captain's Cannon
// ============================================================================

/** A single key that can appear on a spell / cannon command */
export type KeyToken =
  | { kind: 'char'; value: string }      // 'a', 'A', '1', etc.
  | { kind: 'enter' }                     // Enter / Return
  | { kind: 'backspace' }                 // ⌫ Backspace
  | { kind: 'delete' }                    // ⌦ Delete
  | { kind: 'capslock' }                  // ⇪ Caps Lock toggle
  | { kind: 'arrow'; direction: 'up' | 'down' | 'left' | 'right' };

/** A complete cannon command (sequence of KeyTokens) */
export interface Spell {
  id: string;
  name: string;
  tokens: KeyToken[];
  /** Whether the command needs Caps Lock ON before typing */
  requiresCapsLock?: boolean;
}

/** Enemy ship on the battle arena */
export interface Enemy {
  id: string;
  /** Ship's "name" character on the flag */
  rune: string;
  hp: number;
  maxHp: number;
  /** CSS position as % of arena */
  x: number;
  y: number;
  isTarget?: boolean;
}

/** A single level (L0..L15) */
export interface Level {
  id: number;            // 0..15
  name: string;          // e.g. "小巡邏艇"
  tier: 'tutorial' | 'apprentice' | 'journeyman' | 'mage' | 'archmage' | 'boss';
  description: string;
  /** The cannon command(s) to complete in this level */
  spells: Spell[];
  /** Number of enemies on screen at once */
  enemiesPerWave: number;
  /** Time limit per spell in seconds; 0 = no timer */
  timeLimit: number;
  /** Combo system available? */
  comboEnabled: boolean;
  /** Cannon-type switch via 1/5/0 keys available? */
  spellPowerEnabled: boolean;
  /** Backspace allowed for typo correction */
  backspaceEnabled: boolean;
  /** Delete allowed for clearing obstacles */
  deleteEnabled: boolean;
  /** Caps Lock required for this level */
  capsLockEnabled: boolean;
}

/** Progress saved to localStorage */
export interface Progress {
  highestLevelUnlocked: number;
  starsByLevel: Record<number, 0 | 1 | 2 | 3>;
  totalLevelsCompleted: number;
  bestCombo: number;
}

/** Live game state held in context */
export interface GameState {
  hp: number;
  maxHp: number;
  score: number;
  combo: number;
  currentLevelId: number;
  currentWave: number;
  totalWaves: number;
  remainingSeconds: number;
  capLockOn: boolean;
  gameStatus: 'idle' | 'playing' | 'won' | 'lost';
  /** Currently selected cannon type (1/5/0) */
  cannonType: 'normal' | 'fire' | 'ultimate';
}

/** Helper to extract plain character string from a KeyToken */
export function tokenToKey(token: KeyToken): string {
  switch (token.kind) {
    case 'char': return token.value;
    case 'enter': return 'Enter';
    case 'backspace': return 'Backspace';
    case 'delete': return 'Delete';
    case 'capslock': return 'CapsLock';
    case 'arrow': return `Arrow${token.direction[0].toUpperCase()}${token.direction.slice(1)}`;
  }
}

/** Reverse: keyboard event key string → display char */
export function keyEventToChar(key: string, capsLockOn: boolean): KeyToken | null {
  if (key === 'Enter') return { kind: 'enter' };
  if (key === 'Backspace') return { kind: 'backspace' };
  if (key === 'Delete') return { kind: 'delete' };
  if (key === 'CapsLock') return { kind: 'capslock' };
  if (key.startsWith('Arrow')) {
    const dir = key.slice(5).toLowerCase() as 'up' | 'down' | 'left' | 'right';
    return { kind: 'arrow', direction: dir };
  }
  if (key.length === 1) {
    return { kind: 'char', value: capsLockOn ? key.toUpperCase() : key.toLowerCase() };
  }
  return null;
}