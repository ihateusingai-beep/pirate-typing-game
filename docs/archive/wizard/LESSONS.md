# Wizard Apprentice — Archive & Lessons

> This is the **archived design + lessons** from the original wizard-themed
> typing game (built 2026-10-14, rolled back 2026-10-16). The source code
> was deleted as part of the pivot to the **Pirate Captain's Cannon** game.
> Keep this file as a reference for design patterns + 5-bug-family lessons.

## What was built

A Vite + React 19 + TypeScript + Tailwind v4 SPA targeting HK primary school
students. 16 levels (L0 tutorial + L1–L15 spells), 5 learning objectives
(鍵盤 3 區 / 小楷字母 / 英文打字 / Enter·Backspace·Delete / Cap Lock),
localStorage progress, inline SVG assets (no images).

The 4 design wireframes (now in this folder):
- `wireframes.html` — 3 畫面 v0.1 (主畫面 / 戰鬥 / 咒語書)
- `combat-v2.html` — 戰鬥畫面 v0.2 (敵人隨身符文 + Combo 漸進 + Wave 系統)
- `combat-v3.html` — 戰鬥畫面 v0.3 (asset-first 多圖少字版)
- `combat-v4.html` — 戰鬥畫面 v0.4 (學習目標整合版)

## Why it was rolled back

User decided the wizard concept wasn't the right direction. The wizard was
strong on theme (魔法 / NT-D) but the **dragon boss spell ("DRAGON!") felt
forced for primary kids** and the **multi-enemy "runic" mechanic was visually
busy without strong learning payoff**.

The new game is **Pirate Captain's Cannon (#6)** — same 5 learning objectives,
same L0–L15 progression, but with a maritime combat theme that maps more
naturally to the "type the character to fire the cannon" mechanic.

## Design decisions worth keeping

These were validated by user sign-off during the wizard build:

1. **5 學習目標 × 16 級** mapping (L0 tutorial + L1–L15):
   - ① 認識鍵盤 3 區 → L0
   - ② 小楷字母 → L1–L5
   - ③ 英文打字 → L6–L10
   - ④ Enter / Backspace / Delete → L5 / L8 / L13
   - ⑤ Cap Lock → L11+ BOSS uses full-word spell
2. **Difficulty curve**: single char → 3-char sequence → multi-token spells → BOSS
3. **3-star rating** based on mistake rate
4. **Combo meter (7 dots, Q×3 / W×5 / E×7)** for spell power at L6+
5. **localStorage `wizard-typing-progress-v1`** — keep the storage shape
   but rename the key for the pirate version

## 5-Bug-Family lessons (from `DEBUG_REPORT.md`)

These bugs were caught in code review and are likely to recur in any React
+ game-loop project. Apply to the pirate version:

- **F1 (default-state desync / unmount safety)**: Track every setTimeout in
  a `Set<id>` ref, clear all on unmount via a cleanup `useEffect`. Don't trust
  raw `setTimeout` inside event handlers.

- **F2 (reset-on-render)**: Never put a full context value (`game`) in a
  `useEffect` dep array. Each state change re-creates the value object and
  re-runs the effect. For timer/interval effects, only depend on the
  **structural** deps (level ID, spell index) and capture the action methods
  from a stable source (useCallback with `[]` or a ref).

- **F3 (enable-condition off-by-concept)**: When a key has dual meaning
  (CapsLock = both UI toggle AND spell token), only honor the toggle if the
  current spell expects it. Otherwise an accidental keypress on a non-caps
  level silently breaks case-sensitive matching.

- **F4 (silent default data loss / overflow)**: Clamp `levelId + 1` to a
  known max when computing "unlock next" — otherwise Lv15 completion sets
  the value to 16 (out of range).

- **F5 (dead code via name collision)**: After copy-pasting default level
  configs, check for duplicate `id` properties — TS `tsc` will catch it but
  only as `TS1117: An object literal cannot have multiple properties with
  the same name`, which is easy to misread as a tooling error.

## Reusable code patterns (now lost; re-derive as needed)

- **`useKeyboard` hook** with anti-repeat (60ms threshold) and case conversion
  based on a `capsLockOn` prop — keep this pattern; it's the cleanest way
  to map raw KeyboardEvent → typed `KeyToken`.
- **`tokensMatch` (case-sensitive)** for spell token comparison — critical
  for Cap Lock to actually matter.
- **`scheduleTimeout` helper** wrapping raw `setTimeout` with auto-cleanup
  via a `timeoutsRef` set.
- **GameContext shape** — separate live state (HP/score/combo/timer) from
  persistent state (highestLevelUnlocked / starsByLevel). Live state resets
  on level entry; persistent state is in localStorage.

## When to resurrect

If the user later asks for a **magic-themed** variant, the 4 wireframes +
this LESSONS file give a complete starting point. Don't just rebuild — apply
the bug fixes to the new code (e.g., no `game` in useEffect deps).
