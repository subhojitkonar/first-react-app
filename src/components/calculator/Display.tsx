import React from 'react';

interface DisplayProps {
  expression: string;
  value: string;
}

export const Display: React.FC<DisplayProps> = ({ expression, value }) => {
  const length = value.length;
  // Determine font size directly (removed Tailwind-esque class indirection)
  const fontSize = length > 24 ? '1rem'
    : length > 18 ? '1.15rem'
      : length > 12 ? '1.4rem'
        : '1.75rem';
  return (
    <div className="border rounded bg-white dark-bg-dark-subtle p-3 d-flex flex-column justify-content-between text-end" aria-live="polite" style={{ flex: 1, minHeight: '4.25rem' }}>
      <div className="small text-muted" data-testid="expression" style={{ wordBreak: 'break-all' }}>{expression || '\u00A0'}</div>
      <div className="fw-semibold" data-testid="value" style={{ fontSize, lineHeight: 1.1, wordBreak: 'break-all' }}>{value}</div>
    </div>
  );
};
