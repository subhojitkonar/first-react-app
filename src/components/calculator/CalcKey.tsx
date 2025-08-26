import React from 'react';

export interface CalcKeyProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'operator' | 'danger' | 'default';
  spanCols?: number;
  rowSpan?: number;
  ariaLabel?: string;
}

export const CalcKey: React.FC<CalcKeyProps> = ({ label, onPress, variant = 'default', spanCols, rowSpan, ariaLabel }) => {
  let cls = 'btn-key';
  if (variant === 'primary') cls += ' btn-accent';
  else if (variant === 'operator') cls += ' btn-operator';
  else if (variant === 'danger') cls += ' btn-danger';
  const style: React.CSSProperties = {};
  if (spanCols) style.gridColumn = `span ${spanCols}`;
  if (rowSpan) style.gridRow = `span ${rowSpan}`;
  return (
    <button type="button" aria-label={ariaLabel || label} onClick={onPress} className={cls} style={style}>
      {label}
    </button>
  );
};
