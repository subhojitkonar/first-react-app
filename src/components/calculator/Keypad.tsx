import React from 'react';
import { CalcKey } from './CalcKey';

export interface KeyDef {
  label: string;
  action: () => void;
  variant?: 'primary' | 'operator' | 'danger' | 'default';
  spanCols?: number;
  ariaLabel?: string;
}

interface KeypadProps {
  keys: KeyDef[];
  className?: string;
}

export const Keypad: React.FC<KeypadProps> = ({ keys, className }) => (
  <div className={className || 'keypad'}>
    {keys.map(k => (
      <CalcKey
        key={k.label + (k.ariaLabel || '')}
        label={k.label}
        onPress={k.action}
        variant={k.variant}
        spanCols={k.spanCols}
        ariaLabel={k.ariaLabel}
      />
    ))}
  </div>
);
