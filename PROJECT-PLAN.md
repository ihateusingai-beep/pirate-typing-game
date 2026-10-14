# PROJECT-PLAN.md — 巫師學徒：魔法字鍵盤

> Resume file · Last session ended 2026-10-14 12:08 HKT
> Status: 設計階段完成、源碼 70% 完成、唔可以運行（未跑 `npm install`）

---

## 0 · TL;DR (30 秒讀完)

**呢個 project** — 為香港小學生設計嘅鍵盤學習遊戲，用巫師施咒嘅主題包裝 Typing of the Dead 玩法。涵蓋 **5 大學習目標**：認識鍵盤 3 區、小楷字母、英文打字、Enter/Delete/Backspace、Caps Lock 大階切換。共 **16 級** (L0 教學 + L1–L15 戰鬥)。

**目前狀態** — 4 份 wireframe (HTML) + Vite + React + TS scaffold 已 init，但**未跑 `npm install`**，亦都仲未寫 `src/App.tsx`（root component）。

**下次 resume 第一件事** — 寫 `src/App.tsx` 行 `npm install` 行 `npm run typecheck`，build 過就 ship MVP（L0 + L1）。

---

## 1 · Disk State Verification

預期 file 列表（resume 時必對）：

| Path | 預期存在 | 備註 |
|---|---|---|
| `wireframes.html` | ✅ | 3 畫面 v0.1 完整版 |
| `combat-v2.html` | ✅ | 3-axis revision (runes/combo/rhythm) |
| `combat-v3.html` | ✅ | Asset-first 多圖少字版 |
| `combat-v4.html` | ✅ | 學習目標整合版 |
| `PROJECT-PLAN.md` | ✅ | 本 file |
| `package.json` | ✅ | Vite + React 19 + Tailwind v4 |
| `vite.config.ts` | ✅ | plugin-react + tailwindcss |
| `tsconfig.{json,app.json,node.json}` | ✅ | strict mode |
| `index.html` | ✅ | Vite entry |
| `.gitignore` | ✅ | |
| `src/main.tsx` | ✅ | React root |
| `src/index.css` | ✅ | Tailwind v4 + 自訂 wizard theme |
| `src/types.ts` | ✅ | `KeyToken`、`Spell`、`Level` 等 |
| `src/config/keyboard.ts` | ✅ | QWERTY layout by zone |
| `src/config/levels.ts` | ✅ | L0–L15 完整 config |
| `src/lib/storage.ts` | ✅ | localStorage 進度 |
| `src/contexts/GameContext.tsx` | ✅ | HP/score/combo state |
| `src/hooks/useKeyboard.ts` | ✅ | keydown listener |
| `src/components/Wizard.tsx` | ✅ | SVG 巫師 |
| `src/components/MagicCircle.tsx` | ✅ | 旋轉法陣 |
| `src/components/Enemy.tsx` | ✅ | 4 種敵人 (imp/ghost/wspecter/dragon) |
| `src/components/HUD.tsx` | ✅ | 頂部 stats |
| `src/components/CapLock.tsx` | ✅ | 大階指示燈 |
| `src/components/VirtualKeyboard.tsx` | ✅ | 底部鍵盤 |
| `src/components/KeyboardZones.tsx` | ✅ | L0 教學用 3 區圖 |
| `src/pages/MainMenu.tsx` | ✅ | 主畫面 |
| `src/pages/Tutorial.tsx` | ✅ | L0 教學關 |
| `src/pages/Battle.tsx` | ✅ | L1+ 戰鬥畫面 |
| `node_modules/` | ❌ | **未跑 npm install** |
| `dist/` | ❌ | **未 build** |
| `src/App.tsx` | ❌ | **未寫（必要！）** |
| `AGENTS.md` | ❌ | **未寫** |
| `README.md` | ❌ | **未寫** |
| `public/wand.svg` | ❌ | favicon 引用但唔 critical |

---

## 2 · Project Stakeholder Context

- **User** — kencheng（HK · Cantonese-leaning 繁中）single-user Mac dev
- **Target 玩家** — 香港 primary 學生（小學生）
- **Niche 限制** — 教育用，要清晰易學；唔可以有挫敗設計
- **Stack 鎖定**（已 sign-off 2026-10-14）：
  - Frontend: **Vite + React 19 + TypeScript + Tailwind v4**
  - 單頁 web app，無 backend
  - 進度用 localStorage 存
- **品牌資產** — 巫師主題（NT-D 風格，紫 + 金配色）
- **Code style** — TS strict mode，inline SVG asset（唔用外部 image）

---

## 3 · Inventory

#### 4 份 wireframe
- `wireframes.html` — 3 畫面原始版 (主/戰鬥/書 + mobile)
- `combat-v2.html` — 戰鬥畫面修訂：敵人隨身符文 + Combo 漸進 + Wave
- `combat-v3.html` — asset-first 版本（5 個 visual sections）
- `combat-v4.html` — 學習目標整合版（5 objectives × 16 levels）

#### Source code modules
| Module | Purpose | Status |
|---|---|---|
| `types.ts` | 全 game types（KeyToken、Spell、Level、Enemy、GameState） | done |
| `config/keyboard.ts` | QWERTY layout by zone（main / number / edit） | done |
| `config/levels.ts` | L0–L15 完整 spell 配置 + 漸進能力 | done |
| `lib/storage.ts` | Progress 載入/儲存 + stars/combo 計算 | done |
| `contexts/GameContext.tsx` | HP/score/combo/capLock/level state + actions | done |
| `hooks/useKeyboard.ts` | global keydown listener，含 anti-repeat + case 轉換 | done |
| `components/Wizard.tsx` | inline SVG apprentice 巫師，bob + cast-ring animation | done |
| `components/MagicCircle.tsx` | 旋轉法陣 SVG | done |
| `components/Enemy.tsx` | 4 種敵人 SVG，帶 HP bar + target highlight | done |
| `components/HUD.tsx` | 頂部 HP / wave / combo / timer pills | done |
| `components/CapLock.tsx` | 大階 ON/OFF 指示燈 | done |
| `components/VirtualKeyboard.tsx` | 底部鍵盤，target key pulse | done |
| `components/KeyboardZones.tsx` | L0 教學 3 區 highlight 圖 | done |
| `pages/MainMenu.tsx` | 主畫面，含按鈕/進度/重置 | done |
| `pages/Tutorial.tsx` | L0 教學 step-by-step，按任何鍵 advance | done |
| `pages/Battle.tsx` | L1+ 戰鬥（單敵 MVP） | done |

#### 缺漏的關鍵 file
- **`src/App.tsx`** — 必須寫。Route 邏輯（menu/tutorial/battle）+ GameProvider mount + 載入 progress
- **`AGENTS.md`** — project memory（resume 時必寫）
- **`README.md`** — 開發指南

---

## 4 · 3-Roundtrip Audit Gates (memory rule)

下次完成 MVP 時要過：
1. `npm run typecheck` 過 (TS strict)
2. `npm run build` 過（dist/ 出現）
3. 手動行 `npm run dev` 試 L0 + L1，過到 keyboard 主鍵截圖

---

## 6 · Forward Roadmap

### Phase 1 — MVP（resume 必做）
1. 寫 `src/App.tsx`：
   - Mount `<GameProvider>`
   - `useState<screen>` 控制 `menu | tutorial | battle | gameover`
   - 從 localStorage 載 progress
   - Tutorial 完成 → 跳 L1
   - Battle 完成 → 跳回 menu（帶星數）
2. `npm install` (React 19 + Vite + Tailwind v4)
3. `npm run typecheck` → 0 errors
4. `npm run build` → 0 errors
5. 寫 `AGENTS.md`（capture decisions）
6. 寫 `README.md`（dev 啟動步驟）

### Phase 2 — L2–L5 polish（下一個 sprint）
- 加 multi-enemy 同現（Lv2+ 起 1 敵，Lv5 起 2 敵）
- 加 timer（Lv4 起）
- 加 Enter 確認（Lv5 起）
- Backspace 用法（Lv8）
- Delete 用法（Lv13）

### Phase 3 — Mid-game (Lv6–L10)
- Combo meter UI
- Spell power Q/W 鍵
- Multi-enemy 並行

### Phase 4 — Boss + Cap Lock (Lv11–L15)
- Cap Lock 系統（已有 indicator，要新 enemy types）
- BOSS Lv15 = DRAGON! 完整單詞

### Phase 5 — Public deployment
- `website_deploy` 出 public URL（記住公開前要 user 確認）

---

## 7 · Pre-existing Uncommitted Work

**4 份 wireframe 都係新 file（無 conflict）**。Scaffold 後**未 init git**，所以無 pre-existing uncommitted file — clean slate。

如果 resume 時發現 git 已 init，先 `git status` check。

---

## 8 · Cross-cutting Concerns

- **Memory rule 13** — Multi-version spec ship 前必 audit。L0–L15 spec 屬於多版本，必 senior review F1–F5 5 bug families（default-state desync / reset-on-render / enable-condition off-by-concept / silent default data loss / dead code via name collision）
- **Memory rule 11** — Single-file HTML `</script>` trap。wireframe 唔嵌入 `<script>` block，所以唔受影響
- **Memory rule 3** — SemVer 在 `package.json` single source of truth（v0.1.0 已 set）
- **Memory rule 12** — 本 file + `AGENTS.md` 係 project memory

---

## 9 · Open Questions

1. **App.tsx 嘅 routing 策略**：
   - 簡單 `useState` screen switcher（已揀呢個）
   - 定 `react-router`（overkill for MVP）
2. **Progress storage schema**：
   - 已寫 `loadProgress/saveProgress/recordStars/recordCombo`（memory rule 3 follow）
3. **音效** — 暫無 plan，要 Web Audio API 加 spell sound？
4. **TTS 吟咒** — 設計有提及但未實作，要 Web Speech API
5. **公開部署** — 何時 `website_deploy`？

---

## 10 · File Map

```
typing game/
├── wireframes.html             # 設計 v0.1
├── combat-v2.html              # 設計 v0.2 (3-axis revision)
├── combat-v3.html              # 設計 v0.3 (asset-first)
├── combat-v4.html              # 設計 v0.4 (learning-integrated)
├── PROJECT-PLAN.md              # ← 本 file
├── package.json                # v0.1.0
├── vite.config.ts
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── index.html                  # Vite entry
├── .gitignore
├── public/                     # (empty, favicon pending)
└── src/
    ├── main.tsx                # React root
    ├── index.css               # Tailwind v4 + wizard theme
    ├── App.tsx                 # ❌ MISSING — write first
    ├── types.ts
    ├── AGENTS.md               # ❌ MISSING — write second
    ├── README.md               # ❌ MISSING — write third
    ├── config/
    │   ├── keyboard.ts
    │   └── levels.ts
    ├── lib/
    │   └── storage.ts
    ├── contexts/
    │   └── GameContext.tsx
    ├── hooks/
    │   └── useKeyboard.ts
    ├── components/
    │   ├── Wizard.tsx
    │   ├── MagicCircle.tsx
    │   ├── Enemy.tsx
    │   ├── HUD.tsx
    │   ├── CapLock.tsx
    │   ├── VirtualKeyboard.tsx
    │   └── KeyboardZones.tsx
    └── pages/
        ├── MainMenu.tsx
        ├── Tutorial.tsx
        └── Battle.tsx
```

---

## 11 · Resume Checklist

下次開新 session 第一件事：

1. ☐ `cat PROJECT-PLAN.md`（讀 30s TL;DR + 呢個 checklist）
2. ☐ `cd "/Users/kencheng/workspace/vs code/education/computer/typing related/typing game"`（注意 path 有 space）
3. ☐ `ls -la` 對 §1 disk state table，missing 即係 fail，要 surface + 問 user
4. ☐ 寫 `src/App.tsx`（§3 漏空 file #1）
5. ☐ `npm install`（要有 node ≥ 20，npm ≥ 10）
6. ☐ `npm run typecheck` — 預期 0 errors
7. ☐ `npm run build` — 預期 0 errors，dist/ 出現
8. ☐ `npm run dev` 行 browser 試 L0 + L1
9. ☐ 寫 `AGENTS.md` capture stack decisions
10. ☐ 寫 `README.md` dev 指南
12. ☐ ship 訊息俾 user

---

## 12 · Change Log

- **2026-10-14 08:33–09:30** — 設計階段，4 份 wireframe (v1-4)
- **2026-10-14 09:32–12:08** — Scaffold 階段：config + 18 source files 寫咗，**未 install、未 build、未跑 App.tsx**
- **2026-10-14 12:08** — User 叫停，寫呢個 resume file
- **2026-10-14 12:30–13:00** — Resume：寫 `src/App.tsx`，`npm install` (81 packages OK)，typecheck + build 全綠 (45 modules, 261KB JS / 19KB CSS gzipped 80/4.6)，dev server 啟動正常，HTTP 200。寫 `AGENTS.md` + `README.md`。**MVP v0.1.0 shippable** ✅
- **2026-10-14 17:00–17:30** — Phase 2-4 增強：
  - **Phase 2**：multi-enemy (L2+ spawns N enemies per wave in arc) + timer countdown (L4+)
  - **Phase 3**：ComboMeter UI (7 dots, Q×3 / W×5 / E×7 tiers) + Spell power keys (Q 冰封 = 1 enemy, W 火焰 = all, E 雷電 = all + 50 score)
  - **Phase 4**：Cap Lock 邏輯修正 — `tokensMatch` 改 case-sensitive，玩家必須開 Caps Lock 先打到 Lv11+ 大階符文；`handleSpellComplete` 抽出共用 helper
  - 新增 `src/components/ComboMeter.tsx`，修改 `Battle.tsx`
  - typecheck + build 全綠，46 modules，264KB JS / 19.45KB CSS gzipped 80.87/4.64
  - dev server 啟動正常，HTTP 200，Battle.tsx 50KB transform OK
  - **v0.2.0 shippable** ✅
- **2026-10-14 20:00–20:30** — Phase 5 + bug audit:
  - `git init` + 4 commits 全部 clean
  - `SpellBook` 頁面：16 級 grid、6 個 filter tab、1–3 星、lock 狀態
  - MainMenu 加「咒語書」入口
  - Bug audit (memory rule 13, 5-bug-family)：
    - F5 fix：移除 unused `lastHandledRef`
    - F1 fix：加 `timeoutsRef` + `scheduleTimeout` helper，cleanup unmount
  - 47 modules, 269.7KB JS / 20.2KB CSS
  - **v0.2.0 + SpellBook + bug pass shippable** ✅

---

## 14 · ✅ MVP Ship Gate (2026-10-14 13:00)

- ✅ `npm run typecheck` — 0 errors
- ✅ `npm run build` — 0 errors, 45 modules, dist/ 出現
- ✅ Dev server 啟動 — HTTP 200, React HMR 正常
- ✅ AGENTS.md + README.md 齊全
- 🎮 可玩：主畫面 → L0 教學 → L1 戰鬥 → gameover

## 15 · ✅ v0.2.0 Ship Gate (2026-10-14 17:30)

- ✅ L0 教學（4 步進制）+ L1–L15 完整 spell 配置
- ✅ 多敵同現（L2+ spawn N enemies in arc 形狀）
- ✅ 計時倒數（L4+ starts at level.timeLimit）
- ✅ Combo meter UI 7 dots + Q/W/E spell power
- ✅ Cap Lock case-sensitive 驗證
- ✅ GameOver modal 1–3 星評分
- ✅ localStorage 進度持久化
- ⏳ L2–L15 真實驗證仲未行（config OK 但需要人手 play through）

---

## 14 · ✅ MVP Ship Gate (2026-10-14 13:00)

- ✅ `npm run typecheck` — 0 errors
- ✅ `npm run build` — 0 errors, 45 modules, dist/ 出現
- ✅ Dev server 啟動 — HTTP 200, React HMR 正常
- ✅ AGENTS.md + README.md 齊全
- 🎮 可玩：主畫面 → L0 教學 → L1 戰鬥 → gameover

---

## 13 · Final Note to Future Self

呢個 project 由「玩」一個具體嘅 primary 學生工具開始：
- user 自己 design 嘅 10 個構思
- user 自己設計嘅 L1–L15 進階路線圖（初階/中階/高階）
- user 自己加入嘅 5 個學習目標（key keyboard zones / lowercase / English typing / Enter+Del+BS / Cap Lock）
- 最後由 Typing of the Dead 風格嘅「敵人隨身符文」設計封裝

**下次 resume 唔好忘記嘅**：
- ⭐ 呢個係 primary 學生嘅教育工具，唔好加挫敗設計
- ⭐ 「打錯」應該係「剋學習」而唔係「扣血」
- ⭐ Cap Lock 系統要 Lv15 BOSS (`DRAGON!`) 完整發揮
- ⭐ 5 大學習目標全部要 ship

**Trust hierarchy** (memory rule 12)：
disk > project doc (PROJECT-PLAN.md + AGENTS.md) > agent memory > session memory

如果有任何唔 clear，read `combat-v4.html` (設計最新版) 先。

Good luck, future self! 🎩✨