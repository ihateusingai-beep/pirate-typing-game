// ============================================================================
// Level configuration — L0 tutorial + L1-L15 spells
// ============================================================================

import type { Level } from '../types';

/** Build a single-char spell */
const singleChar = (id: string, name: string, ch: string, opts?: Partial<Level>): Level => ({
  id: 1,
  name,
  tier: 'apprentice',
  description: `單字符練習：${ch.toUpperCase()}`,
  spells: [{ id: `${id}-1`, name, tokens: [{ kind: 'char', value: ch }] }],
  enemiesPerWave: 1,
  timeLimit: 0,
  comboEnabled: false,
  spellPowerEnabled: false,
  backspaceEnabled: false,
  deleteEnabled: false,
  capsLockEnabled: false,
  ...opts,
});

/** Helper to override level id */
const setId = (lvl: Partial<Level>, id: number): Level => {
  const base = singleChar('', '', '');
  return { ...base, ...lvl, id };
};

export const LEVELS: Level[] = [
  // L0 — Tutorial: keyboard zones
  setId({
    id: 0,
    name: '認識鍵盤',
    tier: 'tutorial',
    description: '歡迎來到巫師學院！首先認識你的鍵盤 3 大區域。',
    spells: [],
    enemiesPerWave: 0,
    timeLimit: 0,
    comboEnabled: false,
    spellPowerEnabled: false,
    backspaceEnabled: false,
    deleteEnabled: false,
    capsLockEnabled: false,
  }, 0),

  // L1 — Left hand (A, S, D, F)
  setId({
    id: 1,
    name: '光之舞咒',
    tier: 'apprentice',
    description: '認識左手基準鍵 A S D F。點亮魔法燈。',
    spells: [
      { id: 'l1-a', name: '點亮左燈', tokens: [{ kind: 'char', value: 'a' }] },
      { id: 'l1-s', name: '點亮中燈', tokens: [{ kind: 'char', value: 's' }] },
      { id: 'l1-d', name: '點亮右燈', tokens: [{ kind: 'char', value: 'd' }] },
      { id: 'l1-f', name: '點亮尾燈', tokens: [{ kind: 'char', value: 'f' }] },
    ],
    enemiesPerWave: 1,
    timeLimit: 0,
    comboEnabled: false,
    spellPowerEnabled: false,
    backspaceEnabled: false,
    deleteEnabled: false,
    capsLockEnabled: false,
  }, 1),

  // L2 — Right hand (J, K, L, ;)
  setId({
    id: 2,
    name: '鏡像術',
    tier: 'apprentice',
    description: '認識右手基準鍵 J K L。召喚鏡中分身。',
    spells: [
      { id: 'l2-j', name: '召喚鏡像', tokens: [{ kind: 'char', value: 'j' }] },
      { id: 'l2-k', name: '鏡中跳', tokens: [{ kind: 'char', value: 'k' }] },
      { id: 'l2-l', name: '鏡中步', tokens: [{ kind: 'char', value: 'l' }] },
    ],
    enemiesPerWave: 1,
    timeLimit: 0,
    comboEnabled: false,
    spellPowerEnabled: false,
    backspaceEnabled: false,
    deleteEnabled: false,
    capsLockEnabled: false,
  }, 2),

  // L3 — Numbers 1-3
  setId({
    id: 3,
    name: '數字召喚',
    tier: 'apprentice',
    description: '頂排數字 1 2 3 召喚小妖精。',
    spells: [
      { id: 'l3-1', name: '妖精一', tokens: [{ kind: 'char', value: '1' }] },
      { id: 'l3-2', name: '妖精二', tokens: [{ kind: 'char', value: '2' }] },
      { id: 'l3-3', name: '妖精三', tokens: [{ kind: 'char', value: '3' }] },
    ],
    enemiesPerWave: 1,
    timeLimit: 0,
    comboEnabled: false,
    spellPowerEnabled: false,
    backspaceEnabled: false,
    deleteEnabled: false,
    capsLockEnabled: false,
  }, 3),

  // L4 — Numbers 4-6
  setId({
    id: 4,
    name: '數字擴展',
    tier: 'apprentice',
    description: '頂排數字 4 5 6 召喚小妖精。',
    spells: [
      { id: 'l4-4', name: '妖精四', tokens: [{ kind: 'char', value: '4' }] },
      { id: 'l4-5', name: '妖精五', tokens: [{ kind: 'char', value: '5' }] },
      { id: 'l4-6', name: '妖精六', tokens: [{ kind: 'char', value: '6' }] },
    ],
    enemiesPerWave: 1,
    timeLimit: 20,
    comboEnabled: false,
    spellPowerEnabled: false,
    backspaceEnabled: false,
    deleteEnabled: false,
    capsLockEnabled: false,
  }, 4),

  // L5 — Enter
  setId({
    id: 5,
    name: '入門結界',
    tier: 'apprentice',
    description: '打出字符後按 Enter 確認施法。',
    spells: [
      { id: 'l5-ab', name: '入門咒', tokens: [
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
  }, 5),

  // L6 — Continuous letters
  setId({
    id: 6,
    name: '連環印',
    tier: 'journeyman',
    description: '連續打 ABC 等同排序列。',
    spells: [
      { id: 'l6-abc', name: '三連印', tokens: [
        { kind: 'char', value: 'a' }, { kind: 'char', value: 'b' }, { kind: 'char', value: 'c' },
      ]},
      { id: 'l6-def', name: '另一印', tokens: [
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
  }, 6),

  // L7 — Skip letters
  setId({
    id: 7,
    name: '跳躍法',
    tier: 'journeyman',
    description: '跨手指跳躍 AJK SDF。',
    spells: [
      { id: 'l7-ajk', name: '跳躍咒', tokens: [
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
  }, 7),

  // L8 — Backspace
  setId({
    id: 8,
    name: '修正術',
    tier: 'journeyman',
    description: '打錯可用 Backspace 修正。',
    spells: [
      { id: 'l8-correct', name: '修正咒', tokens: [
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
  }, 8),

  // L9 — All numbers
  setId({
    id: 9,
    name: '頂排全攻略',
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
  }, 9),

  // L10 — Enter sequence
  setId({
    id: 10,
    name: '二段咒',
    tier: 'journeyman',
    description: '打一個字符按 Enter，打下一個再 Enter。',
    spells: [
      { id: 'l10-ab', name: '二段咒', tokens: [
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
  }, 10),

  // L11 — Caps Lock first time
  setId({
    id: 11,
    name: '雷霆印',
    tier: 'mage',
    description: '敵人是大階符文 A S D，需開啟 Caps Lock。',
    spells: [
      { id: 'l11-asd', name: '雷霆印', tokens: [
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
  }, 11),

  // L12 — Mixed case
  setId({
    id: 12,
    name: '風暴咒',
    tier: 'mage',
    description: '混合大階與小階，記得切換 Caps Lock。',
    spells: [
      { id: 'l12-mix', name: '風暴咒', tokens: [
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
  }, 12),

  // L13 — Delete
  setId({
    id: 13,
    name: '驅散術',
    tier: 'mage',
    description: '路中央會出現障礙，按 Delete 清除。',
    spells: [
      { id: 'l13-clear', name: '驅散', tokens: [
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
  }, 13),

  // L14 — Full English word
  setId({
    id: 14,
    name: '求救訊號',
    tier: 'archmage',
    description: '完整英文單詞咒語：大階 HELP + Enter。',
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
  }, 14),

  // L15 — BOSS: full combo
  setId({
    id: 15,
    name: '巨龍召喚術',
    tier: 'boss',
    description: '最終試煉！施咒 DRAGON! 召喚巨龍。',
    spells: [
      { id: 'l15-dragon', name: 'DRAGON!', tokens: [
        { kind: 'capslock' },
        { kind: 'char', value: 'D' },
        { kind: 'char', value: 'R' },
        { kind: 'char', value: 'A' },
        { kind: 'char', value: 'G' },
        { kind: 'char', value: 'O' },
        { kind: 'char', value: 'N' },
        { kind: 'enter' },
      ], requiresCapsLock: true},
    ],
    enemiesPerWave: 1,
    timeLimit: 5,
    comboEnabled: true,
    spellPowerEnabled: true,
    backspaceEnabled: true,
    deleteEnabled: true,
    capsLockEnabled: true,
  }, 15),
];

export function getLevel(id: number): Level {
  const level = LEVELS.find((l) => l.id === id);
  if (!level) throw new Error(`Level ${id} not found`);
  return level;
}