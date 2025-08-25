import { useState } from 'react';
import './App.css';

function App() {
  const [count, setCount] = useState(0);

  return (
    <main className="app-root">
      <h1>First React + TypeScript App</h1>
      <p>Welcome! Edit <code>src/App.tsx</code> and save to reload.</p>
      <button onClick={() => setCount(c => c + 1)}>
        Count: {count}
      </button>
      <p>
        Built with{' '}
        <a href="https://vitejs.dev" target="_blank" rel="noreferrer">Vite</a> and{' '}
        <a href="https://www.typescriptlang.org/" target="_blank" rel="noreferrer">TypeScript</a>.
      </p>
    </main>
  );
}

export default App;
