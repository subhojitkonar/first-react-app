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
    <div ref={containerRef} tabIndex={0} className="card p-4 shadow-sm calculator-card" aria-label="Calculator">
      <div className="d-flex justify-content-between align-items-center gap-2 mb-2">
        <Display expression={state.expression} value={state.current} />
        {state.memory ? <span className="badge text-bg-primary align-self-start ms-1" style={{ fontSize: '0.6rem' }}>M</span> : null}
      </div>
      <div className="d-grid" style={{ gridTemplateColumns: 'repeat(4,1fr)', gap: '.5rem', fontSize: '.65rem', fontWeight: 600 }}>
        <button onClick={memoryClear} className="btn btn-secondary" aria-label="Memory Clear">MC</button>
        <button onClick={memoryRecall} className="btn btn-secondary" aria-label="Memory Recall">MR</button>
        <button onClick={memoryAdd} className="btn btn-secondary" aria-label="Memory Add">M+</button>
        <button onClick={memorySubtract} className="btn btn-secondary" aria-label="Memory Subtract">M-</button>
      </div>
      <div className="d-grid mt-2" style={{ gridTemplateColumns: 'repeat(4,1fr)', gap: '.5rem' }}>
        <button type="button" aria-label="Clear" onClick={clear} className="btn btn-danger fw-semibold">C</button>
        <button type="button" aria-label="Delete" onClick={del} className="btn btn-danger fw-semibold">DEL</button>
        <button type="button" aria-label="Percent" onClick={percent} className="btn btn-light fw-semibold">%</button>
        <button type="button" aria-label="Toggle Sign" onClick={toggleSign} className="btn btn-light fw-semibold">+/-</button>
      </div>
      <div className="d-grid mt-3" style={{ gridTemplateColumns: 'repeat(4,1fr)', gap: '.5rem' }}>
        <Keypad keys={keys} />
      </div>
      <p className="text-center text-muted small mt-2 mb-0">
        Keys: digits · + - * / · Enter(=) · Esc / C (clear) · Backspace (delete) · R (memory recall) · P (percent) · N (toggle sign)
      </p>
    </div>
  );
};
