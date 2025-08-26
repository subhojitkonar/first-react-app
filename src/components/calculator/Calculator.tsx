import React, { useEffect, useRef } from 'react';
import { useCalculator } from './useCalculator';
import { Display } from './Display';
import { Keypad } from './Keypad';

export const Calculator: React.FC = () => {
  const { state, inputDigit, inputDecimal, inputOperator, evaluate, clear, del, handleKey, memoryAdd, memorySubtract, memoryRecall, memoryClear, toggleSign, percent } = useCalculator();
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      handleKey(e.key);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [handleKey]);

  useEffect(() => {
    containerRef.current?.focus();
  }, []);

  // Rows: each has 3 number related keys + 1 operator on the right
  const keypadRows = [
    [ '7', '8', '9', '/' ],
    [ '4', '5', '6', '*' ],
    [ '1', '2', '3', '-' ],
    [ '0', '.', '=', '+' ],
  ];

  const keys = keypadRows.flatMap(row => row.map(symbol => {
    if (/^[0-9]$/.test(symbol)) return { label: symbol, action: () => inputDigit(symbol) };
    if (symbol === '.') return { label: '.', action: inputDecimal };
    if (symbol === '=') return { label: '=', action: evaluate, variant: 'primary' as const };
    // operators
    return { label: symbol, action: () => inputOperator(symbol as any), variant: 'operator' as const };
  }));

  return (
    <div ref={containerRef} tabIndex={0} className="card" aria-label="Calculator">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Display expression={state.expression} value={state.current} />
        {state.memory ? <span style={{ marginLeft: '0.5rem', fontSize: '0.7rem', color: 'var(--accent)', fontWeight: 600 }}>M</span> : null}
      </div>
      <div className="memory-row" style={{ fontSize: '.65rem', fontWeight: 600 }}>
        <button onClick={memoryClear} className="btn-key" aria-label="Memory Clear">MC</button>
        <button onClick={memoryRecall} className="btn-key" aria-label="Memory Recall">MR</button>
        <button onClick={memoryAdd} className="btn-key" aria-label="Memory Add">M+</button>
        <button onClick={memorySubtract} className="btn-key" aria-label="Memory Subtract">M-</button>
      </div>
      <div className="control-row">
        <button type="button" aria-label="Clear" onClick={clear} className="btn-key btn-danger">C</button>
        <button type="button" aria-label="Delete" onClick={del} className="btn-key btn-danger">DEL</button>
        <button type="button" aria-label="Percent" onClick={percent} className="btn-key">%</button>
        <button type="button" aria-label="Toggle Sign" onClick={toggleSign} className="btn-key">+/-</button>
      </div>
      <Keypad
        keys={keys}
        className="keypad"
      />
      <p className="footer-hint">Keys: digits · + - * / · Enter(=) · Esc(clear) · Backspace(delete)</p>
    </div>
  );
};
