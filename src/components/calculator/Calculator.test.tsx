import { render, screen, fireEvent } from '@testing-library/react';
import { Calculator } from './Calculator';

function press(label: string) {
  fireEvent.click(screen.getByRole('button', { name: label }));
}

describe('Calculator UI', () => {
  it('computes 2+3*4 with precedence = 14', () => {
    render(<Calculator />);
    press('2');
    press('+');
    press('3');
    press('*');
    press('4');
    press('=');
    expect(screen.getByTestId('value').textContent).toBe('14');
  });

  it('handles division and decimals 10/4 = 2.5', () => {
    render(<Calculator />);
    press('1');
    press('0');
    press('/');
    press('4');
    press('=');
    expect(screen.getByTestId('value').textContent).toBe('2.5');
  });

  it('supports keyboard input', () => {
    render(<Calculator />);
    fireEvent.keyDown(window, { key: '9' });
    fireEvent.keyDown(window, { key: '-' });
    fireEvent.keyDown(window, { key: '5' });
    fireEvent.keyDown(window, { key: 'Enter' });
    expect(screen.getByTestId('value').textContent).toBe('4');
  });
});
