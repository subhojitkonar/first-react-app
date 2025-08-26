import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import { Calculator } from './components/calculator/Calculator';
import { openCalculatorPiP } from './pip';

type ThemeMode = 'light' | 'dark' | 'system';

function ThemeToggle({ mode, setMode }: { mode: ThemeMode; setMode: React.Dispatch<React.SetStateAction<ThemeMode>> }) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (!open) return;
      if (e.key === 'Escape') { setOpen(false); }
    }
    function onClick(e: MouseEvent) {
      if (!(e.target instanceof HTMLElement)) return;
      if (!e.target.closest('.theme-dropdown')) setOpen(false);
    }
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onClick);
    return () => { document.removeEventListener('keydown', onKey); document.removeEventListener('mousedown', onClick); };
  }, [open]);

  const labels: Record<ThemeMode, string> = { light: 'Light', dark: 'Dark', system: 'System' };

  return (
    <div className="theme-dropdown">
      <button
        type="button"
        className="theme-trigger"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen(o => !o)}
      >
        {labels[mode]} <span style={{ fontSize: '.65rem' }}>{open ? '▴' : '▾'}</span>
      </button>
      {open && (
        <div className="theme-menu" role="menu" aria-label="Theme">
          {(['light', 'dark', 'system'] as ThemeMode[]).map(opt => (
            <button
              key={opt}
              role="menuitemradio"
              aria-checked={mode === opt}
              aria-selected={mode === opt}
              className="theme-option"
              onClick={() => { setMode(opt); setOpen(false); }}
              type="button"
            >
              <span>{labels[opt]}</span>
              {mode === opt ? '✓' : ''}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [mode, setMode] = useState<ThemeMode>(() => {
    if (typeof window === 'undefined') return 'system';
    const saved = localStorage.getItem('pref-theme');
    if (saved === 'light' || saved === 'dark' || saved === 'system') return saved;
    return 'system';
  });

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    function apply(currentMode: ThemeMode) {
      const useDark = currentMode === 'dark' || (currentMode === 'system' && mq.matches);
      document.body.classList.toggle('dark', useDark);
      window.dispatchEvent(new CustomEvent('theme-change', { detail: { mode: currentMode, dark: useDark } }));
    }
    apply(mode);
    localStorage.setItem('pref-theme', mode);
    if (mode === 'system') {
      mq.addEventListener('change', () => apply('system'));
      return () => mq.removeEventListener('change', () => apply('system'));
    }
  }, [mode]);

  return (
    <div className="app-container">
      <div className="header-bar">
        <h1>Calculator</h1>
        <div style={{ display: 'flex', gap: '.5rem', alignItems: 'center' }}>
          <ThemeToggle mode={mode} setMode={setMode} />
          <button type="button" className="btn-key btn-operator" style={{ fontSize: '.7rem', padding: '.45rem .7rem' }} onClick={openCalculatorPiP} title="Open Picture-in-Picture calculator">PiP</button>
        </div>
      </div>
      <Calculator />
    </div>
  );
}

