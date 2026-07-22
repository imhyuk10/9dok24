# Repository Guidelines

## Project Structure & Module Organization

This Electron app uses React, TypeScript, and Vite. Renderer code lives in `src/`: features in `components`, shadcn/Radix primitives in `components/ui`, screens in `pages`, helpers in `lib`, and hooks in `hooks`. Main-process and preload code live in `electron/`; static assets belong in `public/`. Tests are colocated under `src`, with shared setup in `src/test/setup.ts`. Treat `dist/`, `dist-electron/`, and `release/` as generated output.

## Build, Test, and Development Commands

- `npm install` installs dependencies from `package-lock.json`.
- `npm run dev` starts Vite and the Electron development app.
- `npm run build` type-checks and creates a production build.
- `npm run lint` runs ESLint across TypeScript and React files.
- `npm test` runs Vitest once; `npm run test:watch` reruns tests while editing.
- `npm run pack` creates an unpacked desktop build; `npm run dist` produces the installer under `release/`.

## Coding Style & Naming Conventions

Use two-space indentation, semicolons, double quotes, and trailing commas in multiline structures. Use PascalCase for components (`AccountCard.tsx`), `use-` prefixes for hooks (`use-i18n.ts`), and camelCase for functions and variables. Prefer the `@/` import alias. Keep application-specific behavior outside `src/components/ui`. Run `npm run lint` before submitting.

## Testing Guidelines

Vitest runs in `jsdom` with Testing Library matchers. Name tests `*.test.ts(x)` or `*.spec.ts(x)`. Add focused tests near covered code and test observable behavior. No coverage threshold is configured, but new logic and regressions should include tests. Playwright is configured, though no end-to-end test script exists yet.

## Commit & Pull Request Guidelines

History follows concise Conventional Commit subjects, such as `feat: internationalize status tags` and `fix: harden electron security`. Use an imperative summary prefixed with `feat:`, `fix:`, `docs:`, or `test:`. Pull requests should explain the change, link issues, list verification commands, and include screenshots for UI changes. Flag changes to OAuth, Electron boundaries, or persisted credentials for security review.

## Security & Configuration

Copy `.env.example` to `.env` only for local overrides; never commit secrets. Preserve Electron context isolation and validate IPC inputs, file paths, and external URLs.
