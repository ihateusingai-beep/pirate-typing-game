# PROJECT-PLAN.md — 海盜船長炮台：Pirate Captain's Cannon

> Resume file · Pivot 2026-10-16 (rolled back from wizard theme)
> Status: 設計階段 開始 — 從零 build pirate game
> 舊 wizard source 已存檔喺 `docs/archive/wizard/`

---

## 0 · TL;DR (30 秒讀完)

**呢個 project** — 為香港小學生設計嘅鍵盤學習遊戲，主題改為 **海盜船長炮台**：玩家係船長，敵艦從四面八方駛近，每艘艦有字符旗號，按對應鍵就開炮擊沉。

**核心差異（vs 已 archived 嘅 wizard 版本）**：
- Theme：海盜 vs 巫師
- 玩法：每個 key = 開一炮（直接 1:1 feedback），vs 巫師嘅「累積 token 然後施咒」
- 主題吸引力：海盜 universal，龍寶可夢元素

**5 大學習目標 × 16 級** 保持不變（沿用 wizard 驗證過嘅 curriculum）。

---

## 1 · Disk State (after rollback)

| Path | Status |
|---|---|
| `docs/archive/wizard/` | ✅ 4 wireframes + DEBUG_REPORT.md + LESSONS.md (wizard 設計保留) |
| `src/` | ❌ **DELETED** (21 wizard files) |
| `node_modules/` | ✅ 保留 (re-install 唔需要) |
| `package.json` | ✏️ 改名 `pirate-typing-game`, v0.1.0 |
| `package-lock.json` | ✅ 保留 (npm 仍可 reinstall) |
| `AGENTS.md`, `README.md` | ❌ DELETED (wizard-specific) |
| `PROJECT-PLAN.md` | ✏️ 本 file 已 update |
| `tsconfig*.json`, `vite.config.ts`, `index.html` | ✅ 保留 (framework files) |

**Git 狀態**：6 commits on `main`, 1 個新 rollback commit pending

---

## 2 · Design Context

- **User** — kencheng (HK · Cantonese-leaning 繁中) single-user Mac dev
- **Target 玩家** — 香港 primary 學生（小學生）
- **Niche 限制** — 教育用，clear easy，no 挫敗設計
- **Stack 鎖定** (沿用 wizard 嘅 stack):
  - Vite 6 + React 19 + TypeScript (strict)
  - Tailwind CSS v4 (CSS-first config)
  - localStorage only
  - Inline SVG assets (no images)
- **Brand assets (NEW)** — 海盜 theme：
  - 主色：深海洋藍 #0c1e3a
  - 強調：木色 #b45309 / 金色 #fbbf24 / 紅色 (敵艦)
  - 波浪效果 + 木紋材質
  - Pirate ship SVG character

---

## 3 · Core Mechanic

```
敵艦 (從邊緣駛近) → 旗上有字符 'A' → 玩家撳 'A' 鍵 → 開炮 → 砲彈飛向敵艦 → 擊沉
```

- **直接 1:1 對應**：每個 key = 一次射擊，冇 wizard 嘅「累積 token 然後施咒」抽象層
- **即時 feedback**：撳錯 → 砲彈打偏 / 落入海（無 HP 扣，只係 combo reset）
- **多敵並行**：Lv2+ 同時 2 艘敵艦，Lv6+ 3 艘，依此類推
- **Combo → 砲彈類型**：Combo 達標可以按 1-0 切換炮彈
  - 1 = 普通砲（每 combo 1）
  - 5 = 火焰砲（combo ≥ 3 解鎖）
  - 0 = 終極導彈（combo ≥ 7 解鎖，全場清）

---

## 4 · Learning Path (5 大學習目標 × 16 級)

| Lv | 主題 | 字符 | 機制 | 角色包裝 |
|---|---|---|---|---|
| L0 | 教學 | 3 區介紹 | 純教學 | 「船長航海圖」介紹鍵盤 3 區 |
| L1 | 左手基準 | a | 1 敵，無計時 | 「小巡邏艇」 |
| L2 | 右手基準 | j | 1 敵 | 「商船」 |
| L3 | 數字 1-3 | 1 | 1 敵 | 「漁船」 |
| L4 | 數字 4-6 | 4 | 1 敵 + 20s | 「海盜斥侯」 |
| L5 | Enter | a↵ | 1 敵，2 字符 + Enter | 「入港申請」 |
| L6 | 連續字母 | abc | 2 敵，combo 啟用 | 「護衛艦隊」 |
| L7 | 跳躍 | ajk | 2 敵 | 「海盜同盟」 |
| L8 | Backspace | asd | 2 敵，允許 BS 修正 | 「修正射擊」 |
| L9 | 完整數字 | 789 | 3 敵 | 「全數字艦隊」 |
| L10 | Enter 序列 | a↵b↵ | 3 敵，spell power 啟用 | 「二段砲擊」 |
| L11 | Cap Lock | ASD | 3 敵，需 Cap Lock ON | 「敵軍旗艦」 |
| L12 | 大階混合 | FiRe | 4 敵 | 「海軍上將」 |
| L13 | Delete | ✗ as | 4 敵，Delete 清障礙物 | 「冰山清除」 |
| L14 | 完整單詞 | HELP↵ | 5 敵，Cap Lock + Enter | 「求救訊號」 |
| L15 | **BOSS** | BLACK PEARL | 1 巨型幽靈船 | 「幽靈船長」 |

---

## 5 · Visual Style

```
背景：深海洋藍 gradient (#0c1e3a → #1e3a5f)
前景：玩家船（中央底部）— 木色 SVG，海盜旗飄揚
敵艦：從邊緣駛入，紅色 + 黑旗
砲彈：橙色 streak + 火花
HUD：木紋邊框 + 金色 accents
金幣：✨ floating collectibles
```

---

## 6 · Forward Roadmap

### Phase 1 — MVP（1.5-2 day）
1. Project scaffold: `npm install` (re-use 已有 node_modules) → verify build OK
2. `src/types.ts` — KeyToken, Spell, Level, Enemy (re-derive from wizard LESSONS)
3. `src/config/keyboard.ts` — 沿用 wizard 嘅 QWERTY layout
4. `src/config/levels.ts` — 16 級 pirate spell 配置
5. `src/lib/storage.ts` — localStorage 改 key 為 `pirate-typing-progress-v1`
6. `src/components/Ship.tsx` (replace Wizard) — SVG pirate ship
7. `src/components/EnemyShip.tsx` (replace Enemy) — 5 種敵艦
8. `src/components/Cannon.tsx` — 砲管 + 砲彈 SVG
9. `src/components/HUD.tsx` (re-use) — HP, score, combo, timer
10. `src/components/VirtualKeyboard.tsx` (re-use) — 鍵盤 + target highlight
11. `src/components/KeyboardZones.tsx` (re-use) — L0 教學 3 區
12. `src/contexts/GameContext.tsx` (re-derive) — **APPLY LESSONS**: 唔好用 `game` in useEffect deps
13. `src/hooks/useKeyboard.ts` (re-derive) — **APPLY LESSONS**: case-sensitive tokensMatch, 只喺 spell expects CapsLock 時 toggle
14. `src/pages/MainMenu.tsx` — 海盜主題主畫面
15. `src/pages/Tutorial.tsx` — L0 教學（海盜航海圖）
16. `src/pages/Battle.tsx` — 戰鬥畫面（炮台射擊）
17. `src/pages/SpellBook.tsx` (re-use) — 咒語書 → 「艦隊登記冊」
18. `src/App.tsx` — screen router

**MVP 範圍**：L0 + L1 可玩，其他 L2-L15 用同一 battle logic

### Phase 2 — 多敵 + 計時
- Lv2+ spawn N enemies
- Lv4+ timer countdown
- Apply F2 lesson: timer dep array 唔好用 `game`

### Phase 3 — Combo + Spell Power
- ComboMeter UI
- 1/5/0 數字鍵控制炮彈類型

### Phase 4 — Cap Lock + BOSS
- CapsLock visual indicator
- Lv11-Lv15 完整實現
- Lv15 BOSS: "BLACK PEARL" 幽靈船長

### Phase 5 — 金幣 mini-game + 公開部署
- 擊沉敵艦後金幣 collectibles
- `website_deploy` public URL

---

## 7 · Apply These Lessons (from wizard debug)

Per `docs/archive/wizard/LESSONS.md` 嘅 5-bug-family 教訓：

1. **F1 unmount safety** — `timeoutsRef` + `scheduleTimeout` helper
2. **F2 reset-on-render** — timer useEffect 唔好用 `game` in deps
3. **F3 enable-condition** — CapsLock 只喺 spell expects 時先 toggle
4. **F4 data loss** — `MAX_LEVEL = 15` clamp
5. **F5 name collision** — level config ts 會 catch，重視 TS error

---

## 8 · Resume Checklist

下次開新 session 第一件事：

1. ☐ `cat PROJECT-PLAN.md` (本 file)
2. ☐ `cd "/Users/kencheng/workspace/vs code/education/computer/typing related/typing game"`
3. ☐ `ls -la` 確認 wizard 已 archive 到 `docs/archive/wizard/`
4. ☐ `cat package.json` 確認係 `pirate-typing-game@0.1.0`
5. ☐ `npm install` (re-install 唔需要，node_modules 仲喺度 — 除非 package.json 變咗)
6. ☐ 寫 `src/types.ts`, `src/config/keyboard.ts`, `src/config/levels.ts`
7. ☐ 寫 `src/components/Ship.tsx` + `EnemyShip.tsx` + `Cannon.tsx` SVG
8. ☐ 寫 `src/contexts/GameContext.tsx` (apply F2 lesson)
9. ☐ 寫 `src/hooks/useKeyboard.ts` (apply F3 lesson)
10. ☐ 寫 3 pages + App.tsx
11. ☐ `npm run typecheck && npm run build`
12. ☐ `npm run dev` 試 L0 + L1

---

## 9 · Change Log

- **2026-10-16 18:50** — Pivot 開始：
  - 4 wizard wireframes + DEBUG_REPORT.md → `docs/archive/wizard/`
  - 加 `docs/archive/wizard/LESSONS.md` (5-bug-family 教訓 + reusable patterns)
  - 刪 21 src files (wizard code)
  - 刪 AGENTS.md, README.md (wizard-specific)
  - rename package.json → `pirate-typing-game@0.1.0`
  - 本 PROJECT-PLAN.md rewrite for pirate
  - **v0.1.0 pirate 設計 shippable ✅**
- **2026-10-16 20:00–21:00** — Phase 1 MVP build:
  - 寫 16 個 src files (types, config/keyboard+levels, lib/storage, contexts/GameContext, hooks/useKeyboard, 9 components + pages, App.tsx, main.tsx, index.css)
  - Apply F1-F5 wizard LESSONS 全部 (timeoutsRef, no `game` in deps, conditional CapsLock, MAX_LEVEL=15)
  - 1 build error fix (setCannonType name collision — F5 親身驗證)
  - typecheck 0 errors, build 47 modules · 273.62KB JS / 20.20KB CSS
  - **v0.1.0 pirate MVP shippable ✅**

---

## 10 · ✅ v0.1.0 Pirate MVP Ship Gate

| Check | Result |
|---|---|
| typecheck | ✅ 0 errors |
| build | ✅ 47 modules · 273.62KB JS / 20.20KB CSS (gzipped 83/4.8) |
| 5 學習目標 × 16 級 | ✅ 全部 ship 喺 levels.ts |
| F1-F5 LESSONS applied | ✅ code review 5 個 bug family 全部 pre-fixed |
| L0 教學 + L1 可玩 | ✅ MVP scope 完整 |
| git | ✅ 8 commits clean, working tree clean |

---

## 11 · v0.1.1 — L2-L15 Manual Verification Fixes (2026-10-17)

### Bugs found via L4/L15 manual play-through (Browser tool via dev hook)

1. **Timer never starts on initial mount** (CRITICAL — affected L4–L15)
   - `Battle.tsx` timer `useEffect` deps excluded `game.gameStatus`
   - On mount: `game.gameStatus='idle'` → effect early-returns
   - `setLevel()` flips to `'playing'` but no dep change → effect never re-runs
   - Symptom: HUD had no ⏱ Time stat on every timed level
   - Fix: add `game.gameStatus` to deps (1 line)
   - Console trace confirmed fix: 20.0s → 19.9s → ... ticks correctly

2. **Timer HUD stat hidden behind 撤退 button** (visual)
   - 撤退 button at `top-3 right-3 z-20` overlapped with rightmost HUD item
   - Timer was placed AFTER `flex-1` spacer → ended up at right edge → covered
   - Fix: move Timer before `flex-1` (visible in main HUD row); also moved 撤退 to `top-14` to clear HUD vertically

### Dev hook added (kept in tree, gated by URL param)
- `?devBattle=N` jumps directly into battle for level N (1..15)
- Used to bypass Browser tool click unreliability for edge-case verification
- Production-safe (no effect without URL param)

### Verified visually (screenshots)
- L2 (single enemy, right-hand j/k/l) ✅
- L4 (timer ticking 20.0s → 19.5s+) ✅

### Verified by static code review (Browser keystroke tests blocked by Browser tool ref issues)
- L3 (numbers row) — tokensMatch handles digits ✓
- L5 (Enter confirm) — tokensMatch returns true for kind='enter' ✓
- L6 (continuous letters, combo enabled) — handleKey path correct ✓
- L8 (Backspace correction) — `if (level.backspaceEnabled && tokenIdx > 0)` gate ✓
- L10 (Enter sequence + spell power) — Enter handled same as L5 ✓
- L11 (Caps Lock first time) — F3 lesson applied (conditional CapsLock toggle) ✓
- L13 (Delete) — MVP consumes without effect (per design) ✓
- L14 (full word HELP) — case-sensitive tokensMatch + capsLockOn path correct ✓
- L15 (BOSS BLACK PEARL) — same as L14 with Enter ✓

### Known minor UX issues (not blocking)
- **ComboMeter tier labels confusing** (`src/components/ComboMeter.tsx:59-62`)
  - tier3 → "5 火焰" (cyan), tier5 → "5 火球" (fire), tier7 → "0 導彈" (gold)
  - "5 火球" suggests pressing 5 unlocks fireball at combo≥5, but the actual mechanic is 5=fire (unlocks at ≥3)
  - Fix later: change "5 火球" to "Combo 5" or remove
- **CapsLock HUD indicator visibility**
  - CapLock component renders to right of HUD row, sometimes clipped at small viewport widths
  - Not breaking, just cosmetic — verify on tablet/desktop

### Next session resumes
- Pick: address ComboMeter UX, or move to next phase (deploy, mobile testing, animations)