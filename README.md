# 巫師學徒：魔法字鍵盤

> 為香港小學生設計嘅鍵盤學習遊戲 — Wizard Apprentice Typing Game

![Status](https://img.shields.io/badge/status-v0.1.0%20MVP-blueviolet)
![Stack](https://img.shields.io/badge/stack-Vite%20%2B%20React%2019%20%2B%20TS%20%2B%20Tailwind%20v4-6366f1)

透過巫師施咒嘅主題，包裝 **Typing of the Dead** 玩法，涵蓋 5 大鍵盤學習目標：

| # | 學習目標 | 涵蓋關卡 |
|---|---|---|
| ① | 認識鍵盤 3 大區域 | L0 教學關 |
| ② | 小楷英文字母輸入 | L1–L5 |
| ③ | 英文打字遊戲 | L6–L10 |
| ④ | Enter / Backspace / Delete 用法 | L5 / L8 / L13 |
| ⑤ | Caps Lock 大階切換 | L11 起 + L15 BOSS |

**Boss Lv15 咒語**：`DRAGON!` (全大階 + Enter) — 完美總結 5 大學習目標。

---

## 快速開始

```bash
# 1. 安裝依賴
npm install

# 2. 啟動 dev server (http://localhost:5173)
npm run dev

# 3. 驗證 TS strict 通過
npm run typecheck

# 4. 生產 build (dist/)
npm run build

# 5. 預覽 build 結果
npm run preview
```

需要 Node.js ≥ 20 同 npm ≥ 10。

---

## 開發指南

詳細 codebase 結構、conventions、anti-patterns 見 [`AGENTS.md`](./AGENTS.md)。

高層 roadmap 見 [`PROJECT-PLAN.md`](./PROJECT-PLAN.md)。

### 設計文件

呢個 repo 有 4 份 HTML wireframe，可以喺瀏覽器直接開：

- `wireframes.html` — 3 畫面 v0.1 (主畫面 / 戰鬥 / 咒語書 + mobile)
- `combat-v2.html` — 戰鬥畫面 v0.2 (敵人隨身符文 + Combo 漸進 + Wave 系統)
- `combat-v3.html` — 戰鬥畫面 v0.3 (asset-first 多圖少字版)
- `combat-v4.html` — 戰鬥畫面 v0.4 (學習目標整合版)

呢啲係 design comps，唔係 production code。

---

## 玩法速覽

1. **打開** http://localhost:5173 → 主畫面
2. **按「開始歷險」** → L0 教學關
3. **按任何鍵** 過 L0 嘅 3 區介紹 (主鍵盤區 → 數字區 → 編輯區)
4. **進入 L1「光之舞咒」** → 單隻敵人帶住字符 `a`，按下 `a` 擊敗
5. **完成 spell** → 自動跳 gameover screen → 計星 → 下一關 / 重試

進度自動儲存喺 localStorage (`wizard-typing-progress-v1`)，重置進度喺主畫面。

---

## MVP 範圍 (v0.1.0)

✅ 已有功能：
- 主畫面 + 進度顯示
- L0 教學關 (3-zone keyboard intro)
- L1–L15 完整 level 配置
- L1 可玩（單敵 + 單字符 + 無計時 + 無 combo）
- Game over screen + 1–3 星評分
- localStorage 進度持久化
- Caps Lock 切換 + HUD 指示

⏳ 未完成 / Roadmap：
- L2–L15 真實戰鬥（而家共用 L1 邏輯，未做多敵同計時）
- Combo meter UI 視覺化
- Backspace / Delete 關卡實際運用
- Spell power Q/W/E 按鍵
- BOSS Lv15 視覺特效
- 音效 + TTS 吟咒
- Mobile 優化

詳細見 `PROJECT-PLAN.md` §6 Forward Roadmap。

---

## 技術棧

| Layer | 技術 |
|---|---|
| Build | Vite 6 |
| Framework | React 19 + TypeScript (strict) |
| Styling | Tailwind CSS v4 (CSS-first config) |
| State | React Context (無 Redux) |
| Persistence | localStorage |
| Assets | Inline SVG (無外部 image) |

---

## License

Private project. Not licensed for redistribution.