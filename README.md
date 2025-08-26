# First React App (TypeScript + Vite + Vitest)

Bootstrapped manually (no CRA) with Vite for fast dev and modern build.

## Scripts

- `npm run dev` – Start dev server
- `npm run build` – Type-check + production build
- `npm run preview` – Preview production build
- `npm run lint` – ESLint checks
- `npm run typecheck` – Isolated type check
- `npm test` – Run tests in watch mode
- `npm run test:ui` – Vitest UI
- `npm run test:coverage` – Run tests once with coverage

## Getting Started

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Testing

Stack:
- Vitest (runner + assertions)
- @testing-library/react for component tests
- jsdom for DOM environment
- @testing-library/jest-dom for extended matchers

Commands:
```bash
npm test
npm run test:ui
npm run test:coverage
```

Coverage output includes text summary and `lcov` (for CI or services like Codecov).

## Tech Stack

- React 18
- TypeScript 5
- Vite 5
- Vitest + Testing Library
- ESLint (TS + Hooks + React Refresh rule)

## Calculator Feature

An accessible calculator component showcasing:

- Expression parsing with operator precedence (no `eval`).
- Keyboard support: digits, + - * /, Enter/`=`, Esc (clear), Backspace (delete), `r` for memory recall.
- Repeat equals: pressing `=` again repeats the last operation.
- Memory keys: MC, MR, M+, M- (indicator `M` appears when memory non‑zero).
- Additional keys: `%` (percent), `+/-` (toggle sign).
- Auto-resizing display font for long numbers.
- Dark mode aware styling.

### Dark Mode Toggle

Implemented via a button that:
- Persists preference (`pref-theme`) in `localStorage`.
- Falls back to system `prefers-color-scheme`.
- Applies Tailwind `dark` class to `<html>` root.

### Extending

- Add additional functions (%, +/-) by enhancing `useCalculator` and inserting keys.
- Add history: store past expressions/results in an array and render a scrollable list.
- Internationalization: wrap button labels with an i18n solution (e.g., `react-intl`).

## Adjustments

- Update `engines.node` in `package.json` if you need a different Node version.
- Add Prettier, TailwindCSS, or CI workflows later if desired.
- Add path aliases by updating `tsconfig.json` and `vite.config.ts`.

## License

Add a LICENSE file if needed.
