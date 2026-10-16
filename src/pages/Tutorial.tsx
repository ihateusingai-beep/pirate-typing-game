// ============================================================================
// Tutorial — L0 航海圖 (keyboard zones intro)
// ============================================================================

import { useEffect, useState } from 'react';
import { KeyboardZones } from '../components/KeyboardZones';

interface TutorialProps {
  onComplete: () => void;
  onSkip: () => void;
}

type Step = 0 | 1 | 2 | 3;

const STEPS: Array<{ zone: 'main' | 'number' | 'edit' | 'all'; title: string; body: string }> = [
  {
    zone: 'main',
    title: '主鍵盤區 — 艦隊總部',
    body: '你嘅戰船控制台。26 個英文字母 (A–Z) 喺度，所有 Lv1–L10 嘅射擊指令都喺呢區。',
  },
  {
    zone: 'number',
    title: '數字區 — 彈藥庫',
    body: '頂排 10 個數字 (0–9) 控制炮彈類型。按 1 = 普通砲，5 = 火焰砲 (combo≥3)，0 = 終極導彈 (combo≥7)。',
  },
  {
    zone: 'edit',
    title: '編輯區 — 航海羅盤',
    body: 'Backspace 修正射擊，Delete 清冰山，Enter 開炮，Caps Lock 切換大階艦名。',
  },
  {
    zone: 'all',
    title: '準備好啟航了！',
    body: '認識完 3 區之後就進入 Lv1 真實海戰。你準備好做船長未？',
  },
];

export function Tutorial({ onComplete, onSkip }: TutorialProps) {
  const [step, setStep] = useState<Step>(0);
  const current = STEPS[step];

  useEffect(() => {
    if (step >= 3) return;
    const handler = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === 'Escape') return;
      e.preventDefault();
      setStep((s) => Math.min(3, (s + 1) as Step) as Step);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [step]);

  return (
    <div className="scene h-full w-full flex flex-col p-8 overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="font-serif text-xl flex items-center gap-2" style={{ color: 'var(--color-pirate-gold)' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
            <path d="M12 17h.01" />
          </svg>
          L0 · 航海圖
        </div>
        <button onClick={onSkip} className="text-xs px-3 py-1.5 rounded"
          style={{ background: 'var(--color-pirate-bg3)', border: '1px solid var(--color-pirate-line)', color: 'var(--color-pirate-ink-mute)' }}>
          跳過 →
        </button>
      </div>

      <div className="text-center mb-6">
        <h2 className="font-serif text-3xl mb-2">{current.title}</h2>
        <p className="text-sm max-w-xl mx-auto" style={{ color: 'var(--color-pirate-ink-mute)' }}>
          {current.body}
        </p>
        {step < 3 && (
          <p className="text-xs mt-3" style={{ color: 'var(--color-pirate-gold)' }}>
            👉 按任何鍵繼續
          </p>
        )}
      </div>

      <div className="flex-1 flex items-center justify-center">
        <KeyboardZones highlighted={current.zone} />
      </div>

      {step === 3 && (
        <div className="text-center mt-6">
          <button onClick={onComplete} className="btn-primary">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3" /></svg>
            啟航 Lv1
          </button>
        </div>
      )}

      {/* Step dots */}
      <div className="flex justify-center gap-2 mt-4">
        {STEPS.map((_, i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full transition-all"
            style={{
              background: i === step ? 'var(--color-pirate-gold)' : 'var(--color-pirate-line)',
              boxShadow: i === step ? '0 0 6px var(--color-pirate-gold)' : 'none',
            }}
          />
        ))}
      </div>
    </div>
  );
}