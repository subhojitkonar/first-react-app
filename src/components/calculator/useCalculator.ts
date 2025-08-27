import { useCallback, useState } from 'react';

export type CalcKeyType = 'digit' | 'operator' | 'equals' | 'clear' | 'delete' | 'decimal';

export interface CalcState {
  expression: string; // expression being built (tokens joined)
  current: string; // current number being entered
  justEvaluated: boolean;
  lastOp?: { operator: string; operand: number }; // for repeat-equals
  memory?: number; // memory store
}

const initialState: CalcState = { expression: '', current: '0', justEvaluated: false, memory: 0 };

// Simple expression evaluator (supports + - * /, decimals, precedence, left-assoc)
function evaluateExpression(expr: string): string {
  if (!expr) return '0';
  const tokens = expr.match(/\d*\.?\d+|[+\-*/]/g);
  if (!tokens) return '0';
  const output: (number | string)[] = [];
  const ops: string[] = [];
  const prec: Record<string, number> = { '+': 1, '-': 1, '*': 2, '/': 2 };
  const apply = () => {
    const op = ops.pop();
    if (!op) return;
    const b = output.pop();
    const a = output.pop();
    if (typeof a !== 'number' || typeof b !== 'number') return;
    let r = 0;
    switch (op) {
      case '+': r = a + b; break;
      case '-': r = a - b; break;
      case '*': r = a * b; break;
      case '/': r = b === 0 ? NaN : a / b; break;
    }
    output.push(r);
  };
  for (const t of tokens) {
    if (/^[+\-*/]$/.test(t)) {
      while (ops.length && prec[ops[ops.length - 1]] >= prec[t]) apply();
      ops.push(t);
    } else {
      output.push(Number(t));
    }
  }
  while (ops.length) apply();
  const res = output.pop();
  if (typeof res !== 'number' || !isFinite(res)) return 'Error';
  // Trim trailing zeros
  return parseFloat(res.toPrecision(12)).toString();
}

export function useCalculator() {
  const [state, setState] = useState<CalcState>(initialState);

  const inputDigit = useCallback((d: string) => {
    setState(s => {
      if (s.justEvaluated) return { expression: '', current: d, justEvaluated: false };
      if (s.current === '0') return { ...s, current: d };
      return { ...s, current: s.current + d };
    });
  }, []);

  const inputDecimal = useCallback(() => {
    setState(s => {
      if (s.justEvaluated) return { expression: '', current: '0.', justEvaluated: false };
      if (s.current.includes('.')) return s;
      return { ...s, current: s.current + '.' };
    });
  }, []);

  const inputOperator = useCallback((op: string) => {
    setState(s => {
      const { expression, current, justEvaluated } = s;
      // start negative number
      if (!expression && current === '0' && op === '-') {
        return { expression: '-', current: '0', justEvaluated: false };
      }
      // If we just evaluated, start new expression with result
      if (justEvaluated) {
        return { expression: current + op, current: '0', justEvaluated: false };
      }
      // If expression ends with operator
      if (/[+\-*/]$/.test(expression)) {
        // If user has typed a number (current not default '0' or includes decimal), append that number then operator
        if (current !== '0' || current.includes('.')) {
          const newExprWithNum = expression + current + op;
          return { expression: newExprWithNum, current: '0', justEvaluated: false };
        }
        // Otherwise replace operator
        return { expression: expression.replace(/[+\-*/]$/, op), current: '0', justEvaluated: false };
      }
      // Normal append: existing expression + current number + operator
      const newExpr = expression + current + op;
      return { expression: newExpr, current: '0', justEvaluated: false };
    });
  }, []);

  const evaluate = useCallback(() => {
    setState(s => {
      // If we just evaluated, re-evaluating returns same state (no repeat-op feature yet)
      if (s.justEvaluated && s.lastOp) {
        // Repeat last operation on current result
        const { operator, operand } = s.lastOp;
        const expr = `${s.current}${operator}${operand}`;
        const result = evaluateExpression(expr);
        return { ...s, expression: expr, current: result, justEvaluated: true };
      } else if (s.justEvaluated) {
        return s;
      }
      let baseExpr = s.expression;
      // If expression ends with operator but user entered a number (current not default '0' or has more than one digit), keep operator and append current
      if (/[+\-*/]$/.test(baseExpr)) {
        if (s.current !== '0' || /\./.test(s.current)) {
          baseExpr = baseExpr + s.current;
        } else {
          // trailing operator without a real number -> drop operator
          baseExpr = baseExpr.slice(0, -1);
        }
      } else {
        // Append current number
        baseExpr = baseExpr + s.current;
      }
      const result = evaluateExpression(baseExpr);
      // capture last op for repeat equals (pattern number operator number)
      let lastOp: CalcState['lastOp'] | undefined;
      const match = baseExpr.match(/(\d*\.?\d+)([+\-*/])(\d*\.?\d+)$/);
      if (match) {
        lastOp = { operator: match[2], operand: Number(match[3]) };
      }
      return { ...s, expression: baseExpr, current: result, justEvaluated: true, lastOp };
    });
  }, []);

  const clear = useCallback(() => setState(initialState), []);

  // Memory operations
  const memoryAdd = useCallback(() => {
    setState(s => ({ ...s, memory: (s.memory || 0) + Number(s.current) }));
  }, []);
  const memorySubtract = useCallback(() => {
    setState(s => ({ ...s, memory: (s.memory || 0) - Number(s.current) }));
  }, []);
  const memoryRecall = useCallback(() => {
    setState(s => ({ ...s, current: (s.memory ?? 0).toString(), justEvaluated: false }));
  }, []);
  const memoryClear = useCallback(() => {
    setState(s => ({ ...s, memory: 0 }));
  }, []);

  const del = useCallback(() => {
    setState(s => {
      if (s.justEvaluated) return { expression: '', current: '0', justEvaluated: false };
      if (s.current.length <= 1) return { ...s, current: '0' };
      return { ...s, current: s.current.slice(0, -1) };
    });
  }, []);

  const toggleSign = useCallback(() => {
    setState(s => {
      if (s.current === '0') return s; // keep 0 positive
      if (s.current.startsWith('-')) return { ...s, current: s.current.slice(1) };
      return { ...s, current: '-' + s.current };
    });
  }, []);

  const percent = useCallback(() => {
    setState(s => {
      const num = Number(s.current);
      const pct = (num / 100).toString();
      return { ...s, current: pct, justEvaluated: false };
    });
  }, []);

  const handleKey = useCallback((key: string) => {
    if (/^[0-9]$/.test(key)) return inputDigit(key);
    if (key === '.') return inputDecimal();
    if (/[+\-*/]/.test(key)) return inputOperator(key);
    if (key === 'Enter' || key === '=') return evaluate();
    if (key === 'Escape' || key === 'c' || key === 'C') return clear();
    if (key === 'Backspace') return del();
    if (key === 'r' || key === 'R') return memoryRecall();
    if (key === 'p' || key === 'P') return percent();
    if (key === 'n' || key === 'N') return toggleSign();
  }, [inputDigit, inputDecimal, inputOperator, evaluate, clear, del, memoryRecall, percent, toggleSign]);

  return {
    state,
    inputDigit,
    inputDecimal,
    inputOperator,
    evaluate,
    clear,
    del,
    handleKey,
  memoryAdd,
  memorySubtract,
  memoryRecall,
  memoryClear,
  toggleSign,
  percent,
  };
}
