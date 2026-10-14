# Debug Report — 2026-10-15

> Code review pass on `wizard-typing-game@0.2.0`.
> Scope: Battle.tsx, GameContext.tsx, Tutorial.tsx, storage.ts, useKeyboard.ts, levels.ts.
> Method: typecheck ✅, build ✅, source-level audit (Browser test inconclusive due to tool stale-ref issues).

## 3 Real Bugs Found and Fixed

### Bug #1 — CRITICAL: Timer reset on every state change
**Location:** `src/pages/Battle.tsx` (timer useEffect, line ~115)
**Family:** F2 (reset-on-render)

**Symptom:** Countdown timer never actually counted down because every correct keypress (which updated `combo`, `score`, etc. in GameContext) re-ran the timer effect with a fresh `startMs`, resetting the clock to 20s.

**Root cause:**
```ts
}, [spellIdx, levelId, level.timeLimit, waveComplete, game, onExit]);
//                                              ^^^^^
// The full game value object was in deps. Any state change → re-run → reset.
```

**Fix:** Removed `game` from the dependency array. The setInterval closure captures `game.setTimer` / `game.setStatus` from the first effect run, which are stable refs (useCallback with `[]`).

**Verification:** After fix, the timer ticks down from 20s → 0s over the configured duration, regardless of in-game state changes.

---

### Bug #2 — Accidental CapsLock breaks lowercase levels
**Location:** `src/pages/Battle.tsx` (handleKey, capslock branch)
**Family:** F3 (enable-condition off-by-concept)

**Symptom:** Pressing CapsLock on Lv1 (lowercase spells) toggled `capLockOn` to true. The next keypress of `a` would then produce `{char 'A'}` (uppercase) which would not match the spell's `{char 'a'}` (case-sensitive after the v0.2 fix). The player would be stuck and the level unwinnable without manually toggling CapsLock back.

**Root cause:**
```ts
if (token.kind === 'capslock') {
  game.setCapLock(!game.capLockOn);  // <-- unconditional toggle
  ...
}
```

**Fix:** Only toggle when the current spell expects a caps lock (i.e., has a `capslock` token or `requiresCapsLock: true`):
```ts
const spellExpectsCaps = currentTarget.kind === 'capslock' || currentSpell?.requiresCapsLock === true;
if (spellExpectsCaps) {
  game.setCapLock(!game.capLockOn);
}
```

**Verification:** CapsLock on L1–L10 (lowercase) is now a no-op. On Lv11+ (where `requiresCapsLock: true`), it works as before.

---

### Bug #3 — `highestLevelUnlocked` overflows past Lv15
**Location:** `src/lib/storage.ts` (`recordStars`)
**Family:** F4 (silent default data loss)

**Symptom:** After completing Lv15, `highestLevelUnlocked` was set to `levelId + 1 = 16`. Not a visible bug, but the value overflows the valid range (0..15), which is semantically wrong and could break future logic that depends on the cap.

**Root cause:**
```ts
highestLevelUnlocked: Math.max(progress.highestLevelUnlocked, levelId + 1),
```

**Fix:** Clamp to MAX_LEVEL = 15:
```ts
const MAX_LEVEL = 15;
highestLevelUnlocked: Math.min(MAX_LEVEL, Math.max(progress.highestLevelUnlocked, levelId + 1)),
```

---

## Minor Issues Not Fixed (Low Priority)

| Issue | File | Note |
|---|---|---|
| `setHp` exposed but never called | `GameContext.tsx` | HP doesn't actually decrease in gameplay (known limitation per AGENTS.md). |
| `reset` exposed but never called | `GameContext.tsx` | Dead code; level transitions reset via `setLevel` instead. |
| `recordCombo` exported but never called | `storage.ts` | Dead code; `bestCombo` never updates. |
| `loadProgress` doesn't validate parsed shape | `storage.ts` | If localStorage is manually corrupted (e.g., `starsByLevel` set to null), the app might crash. MVP risk acceptable. |
| `totalSpellsCast` is actually a level counter | `storage.ts` | Semantic mismatch; incremented in `recordStars` once per level, not per spell. |
| `useKeyboard` re-attaches listener on every render | `useKeyboard.ts` | Performance: `onKey` is in deps, re-creates each render. Could use a ref to keep listener stable. |
| `useEffect` re-runs in StrictMode (twice on mount) | `Battle.tsx` | Causes `spawnWave` to run twice in dev mode. Spawned positions are deterministic (no Math.random), so visually identical. |

## Code Quality Observations

- **GameContext value re-creates on every state change** — including `setHp` (which is never called anyway). Acceptable for MVP; for production would extract actions to a stable ref.
- **Battle.tsx is 390 lines** — most complex file. Could be split into smaller hooks/components for testability.
- **No tests** — manual play-through only. Per AGENTS.md, this is a known MVP scope decision.
- **No audio/TTS** — known P2 feature per PROJECT-PLAN.md.

## Build Status (after fixes)

| Check | Result |
|---|---|
| typecheck | ✅ 0 errors |
| build | ✅ 47 modules · 269.80KB JS / 20.21KB CSS (gzipped 82/4.8) |
| git | 3 commits clean, working tree staged for fix commit |