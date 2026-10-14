# AGENTS.md — 巫師學徒：魔法字鍵盤

> Project memory for AI agents working in this codebase.
> Read this file FIRST when resuming. See also `PROJECT-PLAN.md` for high-level roadmap.

## Project Snapshot

- **Name**: 巫師學徒：魔法字鍵盤 (Wizard Apprentice: Magic Typing Keyboard)
- **Purpose**: Keyboard learning game for Hong Kong primary school students
- **Audience**: 小學生 (primary kids), teachers may use as classroom tool
- **Target browser**: Modern Chromium / Safari, desktop + mobile
- **Status**: v0.1.0 MVP — L0 tutorial + L1 battle playable

## Stack (locked 2026-10-14)

- **Build**: Vite 6
- **Framework**: React 19 + TypeScript (strict mode)
- **Styling**: Tailwind CSS v4 (CSS-first config in `src/index.css`)
- **State**: React Context (no Redux/Zustand needed for MVP)
- **Persistence**: localStorage only (`wizard-typing-progress-v1`)
- **No backend**: pure SPA, all client-side

## Directory Layout

```
src/
├── main.tsx                # React root — do not edit unless changing mount logic
├── index.css               # Tailwind v4 + wizard theme custom properties
├── App.tsx                 # Screen router: menu / tutorial / battle / gameover
├── types.ts                # Core game types (KeyToken, Spell, Level, Enemy, GameState)
├── config/
│   ├── keyboard.ts         # QWERTY layout by zone (main / number / edit)
│   └── levels.ts           # L0–L15 spell configs (15 levels total)
├── lib/
│   └── storage.ts          # localStorage helpers (loadProgress / saveProgress / recordStars)
├── contexts/
│   └── GameContext.tsx     # Live game state (HP/score/combo/capLock)
├── hooks/
│   └── useKeyboard.ts      # Global keydown listener with anti-repeat
├── components/
│   ├── Wizard.tsx          # Bobbing apprentice SVG
│   ├── MagicCircle.tsx     # Rotating floor circle SVG
│   ├── Enemy.tsx           # 4 enemy types (imp/ghost/specter/dragon)
│   ├── HUD.tsx             # Top stats bar
│   ├── CapLock.tsx         # Caps Lock ON/OFF indicator
│   ├── VirtualKeyboard.tsx # Bottom keyboard with target highlight
│   └── KeyboardZones.tsx   # L0 tutorial 3-zone diagram
└── pages/
    ├── MainMenu.tsx        # Landing screen
    ├── Tutorial.tsx        # L0 step-by-step keyboard zones
    └── Battle.tsx          # L1+ gameplay
```

## Conventions

- **Inline SVG only** — no external image assets in v0.1.0 (per design decision 2026-10-14)
- **Wizard theme colors** live in `index.css` as CSS custom properties (`--color-wizard-*`)
  - Use Tailwind theme tokens (`bg-wizard-bg3`, etc.) when possible
  - Use `var(--color-wizard-*)` directly for inline styles / SVG fills
- **Levels are data, not code** — adding a new level means editing `src/config/levels.ts` only
- **Game types in `types.ts`** — extend types here, don't redefine elsewhere
- **TS strict mode is on** — fix all `noUnusedLocals`, `noUnusedParameters` warnings

## Level Progression (5 Learning Objectives)

| Objective | Levels | Mechanism |
|---|---|---|
| ① 認識鍵盤 3 區 | L0 教學關 | Press any key to advance through 3 zones |
| ② 小楷英文字母 | L1–L5 | All lowercase runes |
| ③ 英文打字遊戲 | L6–L10 | Sequences (abc, jkl, 123) |
| ④ Enter / Delete / Backspace | L5 / L8 / L13 | Enter = confirm, Backspace = undo, Delete = clear obstacle |
| ⑤ Cap Lock 大階切換 | L11 起 / L15 BOSS | Caps Lock ON required for uppercase spells |

**Boss Lv15 spell**: `DRAGON!` (all caps + Enter) — exercises all 5 objectives.

## State Management

- **Persistent state** (`Progress`): highest level unlocked, stars per level, total spells, best combo
  - Loaded once at App mount via `loadProgress()`
  - Saved via `saveProgress()` after every level completion
- **Live state** (`GameState` in GameContext): HP, score, combo, current level/wave, timer, caps lock
  - Reset on level entry via `game.setLevel(id, totalWaves)`
  - Read by HUD, VirtualKeyboard, Battle, etc.

## Anti-patterns to Avoid

- ❌ **Don't add backend** — localStorage only, this is a kid-friendly offline-first SPA
- ❌ **Don't use external image assets** — keep everything inline SVG (build load fast, no asset CDN)
- ❌ **Don't add defeat penalties** — losing should NOT deduct HP harshly for primary kids
  - Current: mistakes counted for star rating only (no HP drain in MVP)
- ❌ **Don't break the L0–L15 progression** — levels are pedagogical, not arbitrary difficulty
- ❌ **Don't hardcode colors** — use the wizard theme tokens
- ❌ **Don't add router** unless going beyond menu/tutorial/battle/gameover (state is fine)

## When Adding a New Level

1. Add config to `src/config/levels.ts` following existing pattern
2. Verify the spell's tokens are achievable with `level.capsLockEnabled` / `backspaceEnabled` flags
3. Test by playing through the level manually
4. Update `PROJECT-PLAN.md` if scope changed

## Bug-Family Watchlist (memory rule 13)

If shipping a multi-version feature, audit for:
- F1: default-state desync (component re-mount loses state)
- F2: reset-on-render (state reset mid-game)
- F3: enable-condition off-by-concept (Cap Lock logic inverse, etc.)
- F4: silent default data loss (localStorage migration)
- F5: dead code via name collision (duplicate `id` properties — caught in v0.1 typecheck)

## Resume Checklist

When picking up this project:
1. `cat AGENTS.md` (this file)
2. `cat PROJECT-PLAN.md` (high-level plan + design history)
3. `cd "/Users/kencheng/workspace/vs code/education/computer/typing related/typing game"`
4. `npm run typecheck` — should be 0 errors
5. `npm run build` — should produce `dist/`
7. Pick up from TODO in `PROJECT-PLAN.md` §6 Forward Roadmap

## Quick Reference Commands

```bash
npm run dev        # Start dev server on :5173
npm run typecheck  # TS strict typecheck
npm run build      # Production build → dist/
npm run preview    # Preview production build on :4173
```

## Known Limitations (v0.2.0)

- L2–L15 logic is wired (multi-enemy + timer + combo + capslock) but not manually play-tested
- HP loss is cosmetic — actual HP drain happens via `game.setHp` calls (not yet wired in MVP)
- No audio (Web Audio API + spell sounds is a P2 feature)
- No TTS (Web Speech API 吟咒 is P2)
- L15 BOSS spell rendering uses generic enemy type (no dragon-specific visuals yet)
- Mobile layout not specifically tuned (works but UI is desktop-first)
- Spell power Q/W/E clears enemies but doesn't auto-complete spell — player must type remaining tokens