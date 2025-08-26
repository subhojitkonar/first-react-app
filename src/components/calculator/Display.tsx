import React from 'react';

interface DisplayProps {
  expression: string;
  value: string;
}

export const Display: React.FC<DisplayProps> = ({ expression, value }) => {
  const length = value.length;
  // Determine size scale thresholds
  let sizeClass = 'text-2xl';
  if (length > 12) sizeClass = 'text-xl';
  if (length > 18) sizeClass = 'text-lg';
  if (length > 24) sizeClass = 'text-base';
  const sizeMap: Record<string,string> = { 'text-2xl':'1.75rem','text-xl':'1.4rem','text-lg':'1.15rem','text-base':'1rem'};
  return (
  <div className="calc-display" aria-live="polite" style={{ flex: 1 }}>
      <div className="calc-display-expression" data-testid="expression">{expression || '\u00A0'}</div>
      <div className="calc-display-value" data-testid="value" style={{ fontSize: sizeMap[sizeClass] }}>{value}</div>
    </div>
  );
};
