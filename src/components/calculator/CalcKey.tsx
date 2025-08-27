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
  let cls = 'btn';
  switch (variant) {
    case 'primary': cls += ' btn-primary'; break;
    case 'operator': cls += ' btn-outline-primary'; break;
    case 'danger': cls += ' btn-danger'; break;
    default: cls += ' btn-light';
  }
  const style: React.CSSProperties = { fontWeight: 600 };
  if (spanCols) style.gridColumn = `span ${spanCols}`;
  if (rowSpan) style.gridRow = `span ${rowSpan}`;
  return <button type="button" aria-label={ariaLabel || label} onClick={onPress} className={cls} style={style}>{label}</button>;
};
