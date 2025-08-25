import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

describe('App', () => {
  it('renders heading and increments counter', () => {
    render(<App />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/First React \+ TypeScript App/i);
    const button = screen.getByRole('button', { name: /Count:/i });
    expect(button).toHaveTextContent('Count: 0');
    fireEvent.click(button);
    expect(button).toHaveTextContent('Count: 1');
  });
});
