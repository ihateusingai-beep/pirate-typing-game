// ============================================================================
// Level configuration — L0 tutorial + L1-L15 cannon commands
// ============================================================================

import type { Level } from '../types';

/** L0 — Tutorial: keyboard zones (no enemies) */
const L0: Level = {
  id: 0,
  name: '航海圖',
  tier: 'tutorial',
  description: '歡迎來到海盜船長訓練！首先認識你的鍵盤 3 大區域。',
  spells: [],
  enemiesPerWave: 0,
  timeLimit: 0,
  comboEnabled: false,
  spellPowerEnabled: false,
  backspaceEnabled: false,
  deleteEnabled: false,
  capsLockEnabled: false,
};

/** Helper to build a single-char spell level */
const singleChar = (id: number, name: string, tier: Level['tier'], ch: string, opts?: Partial<Level>): Level => ({
  id,
  name,
  tier,
  description: `單字符射擊：${ch.toUpperCase()}`,
  spells: [{ id: `${id}-${ch}`, name, tokens: [{ kind: 'char', value: ch }] }],
  enemiesPerWave: 1,
  timeLimit: 0,
  comboEnabled: false,
  spellPowerEnabled: false,
  backspaceEnabled: false,
  deleteEnabled: false,
  capsLockEnabled: false,
  ...opts,
});

export const LEVELS: Level[] = [
  L0,

  // L1 — Left hand (A, S, D, F)
  {
    ...singleChar(1, '小巡邏艇', 'apprentice', 'a'),
    spells: [
      { id: 'l1-a', name: '左舷巡邏艇', tokens: [{ kind: 'char', value: 'a' }] },
      { id: 'l1-s', name: '中巡邏艇', tokens: [{ kind: 'char', value: 's' }] },
      { id: 'l1-d', name: '右巡邏艇', tokens: [{ kind: 'char', value: 'd' }] },
      { id: 'l1-f', name: '護衛艇', tokens: [{ kind: 'char', value: 'f' }] },
    ],
  },

  // L2 — Right hand (J, K, L, ;)
  {
    ...singleChar(2, '商船隊', 'apprentice', 'j'),
    spells: [
      { id: 'l2-j', name: '小型商船', tokens: [{ kind: 'char', value: 'j' }] },
      { id: 'l2-k', name: '中型商船', tokens: [{ kind: 'char', value: 'k' }] },
      { id: 'l2-l', name: '大型商船', tokens: [{ kind: 'char', value: 'l' }] },
    ],
  },

  // L3 — Numbers 1-3
  {
    ...singleChar(3, '漁船隊', 'apprentice', '1'),
    spells: [
      { id: 'l3-1', name: '漁船 1 號', tokens: [{ kind: 'char', value: '1' }] },
      { id: 'l3-2', name: '漁船 2 號', tokens: [{ kind: 'char', value: '2' }] },
      { id: 'l3-3', name: '漁船 3 號', tokens: [{ kind: 'char', value: '3' }] },
    ],
  },

  // L4 — Numbers 4-6 + 20s timer
  {
    ...singleChar(4, '海盜斥侯', 'apprentice', '4'),
    timeLimit: 20,
    spells: [
      { id: 'l4-4', name: '斥侯 4 號', tokens: [{ kind: 'char', value: '4' }] },
      { id: 'l4-5', name: '斥侯 5 號', tokens: [{ kind: 'char', value: '5' }] },
      { id: 'l4-6', name: '斥侯 6 號', tokens: [{ kind: 'char', value: '6' }] },
    ],
  },

  // L5 — Enter confirm
  {
    id: 5,
    name: '入港申請',
    tier: 'apprentice',
    description: '打出艦名後按 Enter 確認射擊。',
    spells: [
      { id: 'l5-ab', name: '兩艦隊', tokens: [
        { kind: 'char', value: 'a' },
        { kind: 'char', value: 'b' },
        { kind: 'enter' },
      ]},
    ],
    enemiesPerWave: 1,
    timeLimit: 20,
    comboEnabled: false,
    spellPowerEnabled: false,
    backspaceEnabled: false,
    deleteEnabled: false,
    capsLockEnabled: false,
  },

  // L6 — Continuous letters, combo enabled
  {
    id: 6,
    name: '護衛艦隊',
    tier: 'journeyman',
    description: '連續打 abc 等同排序列，combo 啟用。',
    spells: [
      { id: 'l6-abc', name: '三連艦隊', tokens: [
        { kind: 'char', value: 'a' }, { kind: 'char', value: 'b' }, { kind: 'char', value: 'c' },
      ]},
      { id: 'l6-def', name: '另一艦隊', tokens: [
        { kind: 'char', value: 'd' }, { kind: 'char', value: 'e' }, { kind: 'char', value: 'f' },
      ]},
    ],
    enemiesPerWave: 2,
    timeLimit: 15,
    comboEnabled: true,
    spellPowerEnabled: false,
    backspaceEnabled: false,
    deleteEnabled: false,
    capsLockEnabled: false,
  },

  // L7 — Skip letters
  {
    id: 7,
    name: '海盜同盟',
    tier: 'journeyman',
    description: '跨手指跳躍 ajk。',
    spells: [
      { id: 'l7-ajk', name: '跳躍艦隊', tokens: [
        { kind: 'char', value: 'a' }, { kind: 'char', value: 'j' }, { kind: 'char', value: 'k' },
      ]},
    ],
    enemiesPerWave: 2,
    timeLimit: 15,
    comboEnabled: true,
    spellPowerEnabled: false,
    backspaceEnabled: false,
    deleteEnabled: false,
    capsLockEnabled: false,
  },

  // L8 — Backspace
  {
    id: 8,
    name: '修正射擊',
    tier: 'journeyman',
    description: '打錯可用 Backspace 修正。',
    spells: [
      { id: 'l8-correct', name: '修正射擊', tokens: [
        { kind: 'char', value: 'a' },
        { kind: 'char', value: 's' },
        { kind: 'char', value: 'd' },
      ]},
    ],
    enemiesPerWave: 2,
    timeLimit: 15,
    comboEnabled: true,
    spellPowerEnabled: false,
    backspaceEnabled: true,
    deleteEnabled: false,
    capsLockEnabled: false,
  },

  // L9 — All numbers
  {
    id: 9,
    name: '全數字艦隊',
    tier: 'journeyman',
    description: '完整頂排 0-9。',
    spells: [
      { id: 'l9-789', name: '頂排一段', tokens: [
        { kind: 'char', value: '7' }, { kind: 'char', value: '8' }, { kind: 'char', value: '9' },
      ]},
      { id: 'l9-456', name: '頂排二段', tokens: [
        { kind: 'char', value: '4' }, { kind: 'char', value: '5' }, { kind: 'char', value: '6' },
      ]},
      { id: 'l9-1230', name: '頂排三段', tokens: [
        { kind: 'char', value: '1' }, { kind: 'char', value: '2' }, { kind: 'char', value: '3' }, { kind: 'char', value: '0' },
      ]},
    ],
    enemiesPerWave: 3,
    timeLimit: 15,
    comboEnabled: true,
    spellPowerEnabled: false,
    backspaceEnabled: true,
    deleteEnabled: false,
    capsLockEnabled: false,
  },

  // L10 — Enter sequence, spell power enabled
  {
    id: 10,
    name: '二段砲擊',
    tier: 'journeyman',
    description: '打一個艦名按 Enter，再打下一個。1/5/0 鍵可換炮彈。',
    spells: [
      { id: 'l10-ab', name: '二段砲擊', tokens: [
        { kind: 'char', value: 'a' }, { kind: 'enter' },
        { kind: 'char', value: 'b' }, { kind: 'enter' },
        { kind: 'char', value: 'c' }, { kind: 'enter' },
      ]},
    ],
    enemiesPerWave: 3,
    timeLimit: 15,
    comboEnabled: true,
    spellPowerEnabled: true,
    backspaceEnabled: true,
    deleteEnabled: false,
    capsLockEnabled: false,
  },

  // L11 — Caps Lock first time
  {
    id: 11,
    name: '敵軍旗艦',
    tier: 'mage',
    description: '敵人是大階艦名 ASD，需開 Caps Lock。',
    spells: [
      { id: 'l11-asd', name: '敵軍旗艦', tokens: [
        { kind: 'capslock' },
        { kind: 'char', value: 'A' },
        { kind: 'char', value: 'S' },
        { kind: 'char', value: 'D' },
      ], requiresCapsLock: true},
    ],
    enemiesPerWave: 3,
    timeLimit: 12,
    comboEnabled: true,
    spellPowerEnabled: true,
    backspaceEnabled: true,
    deleteEnabled: false,
    capsLockEnabled: true,
  },

  // L12 — Mixed case
  {
    id: 12,
    name: '海軍上將',
    tier: 'mage',
    description: '混合大階與小階 FiRe，切換 Caps Lock。',
    spells: [
      { id: 'l12-mix', name: '上將旗', tokens: [
        { kind: 'capslock' },
        { kind: 'char', value: 'F' },
        { kind: 'capslock' },
        { kind: 'char', value: 'i' },
        { kind: 'char', value: 'r' },
        { kind: 'char', value: 'e' },
      ]},
    ],
    enemiesPerWave: 4,
    timeLimit: 12,
    comboEnabled: true,
    spellPowerEnabled: true,
    backspaceEnabled: true,
    deleteEnabled: false,
    capsLockEnabled: true,
  },

  // L13 — Delete
  {
    id: 13,
    name: '冰山清除',
    tier: 'mage',
    description: '海上會出現冰山障礙，按 Delete 清除。',
    spells: [
      { id: 'l13-clear', name: '清除冰山', tokens: [
        { kind: 'delete' },
        { kind: 'char', value: 'a' },
        { kind: 'char', value: 'b' },
      ]},
    ],
    enemiesPerWave: 4,
    timeLimit: 10,
    comboEnabled: true,
    spellPowerEnabled: true,
    backspaceEnabled: true,
    deleteEnabled: true,
    capsLockEnabled: true,
  },

  // L14 — Full English word
  {
    id: 14,
    name: '求救訊號',
    tier: 'archmage',
    description: '完整英文單詞：大階 HELP + Enter。',
    spells: [
      { id: 'l14-help', name: 'HELP', tokens: [
        { kind: 'capslock' },
        { kind: 'char', value: 'H' },
        { kind: 'char', value: 'E' },
        { kind: 'char', value: 'L' },
        { kind: 'char', value: 'P' },
        { kind: 'enter' },
      ], requiresCapsLock: true},
    ],
    enemiesPerWave: 4,
    timeLimit: 8,
    comboEnabled: true,
    spellPowerEnabled: true,
    backspaceEnabled: true,
    deleteEnabled: true,
    capsLockEnabled: true,
  },

  // L15 — BOSS
  {
    id: 15,
    name: '黑珍珠號',
    tier: 'boss',
    description: '最終試煉！施咒 BLACK PEARL! 擊沉幽靈船長。',
    spells: [
      { id: 'l15-boss', name: 'BLACK PEARL!', tokens: [
        { kind: 'capslock' },
        { kind: 'char', value: 'B' }, { kind: 'char', value: 'L' }, { kind: 'char', value: 'A' },
        { kind: 'char', value: 'C' }, { kind: 'char', value: 'K' },
        { kind: 'char', value: 'P' }, { kind: 'char', value: 'E' }, { kind: 'char', value: 'A' },
        { kind: 'char', value: 'R' }, { kind: 'char', value: 'L' },
        { kind: 'enter' },
      ], requiresCapsLock: true},
    ],
    enemiesPerWave: 1,
    // 12 tokens (Caps + BLACKPEARL + Enter) — 5s was unwinnable for primary
    timeLimit: 30,
    comboEnabled: true,
    spellPowerEnabled: true,
    backspaceEnabled: true,
    deleteEnabled: true,
    capsLockEnabled: true,
  },
];

export function getLevel(id: number): Level {
  const level = LEVELS.find((l) => l.id === id);
  if (!level) throw new Error(`Level ${id} not found`);
  return level;
}