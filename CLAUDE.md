# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start Vite dev server (localhost:8080) + Electron
npm run build        # tsc + Vite production build → dist/ + dist-electron/
npm run lint         # ESLint
npm run test         # Vitest once
npm run test:watch   # Vitest watch mode
npm run pack         # electron-builder --dir → release/win-unpacked/
npm run dist         # electron-builder full installer → release/
```

## Architecture

**9dok24 (구독이사)** — an Electron desktop app for migrating YouTube subscriptions between Google accounts.

### Electron ↔ Renderer split

- `electron/main.ts` — Main process: OAuth2 PKCE flow, YouTube Data API calls, session/credential persistence, IPC handlers, splash screen, production static server.
- `electron/preload.ts` — Exposes `window.electronAPI` bridge via `contextBridge`. All renderer↔main communication goes through this typed API.
- `src/types/electron.d.ts` — TypeScript definitions for `window.electronAPI`. Keep in sync with preload.
- `src/` — React renderer loaded by Electron's BrowserWindow.

### IPC contract

All IPC is invoke/handle (request-response) except `migrate:progress` which is a one-way event (main→renderer via `event.sender.send`). The full API surface is defined in `electron/preload.ts` and typed in `src/types/electron.d.ts`.

### Production loading

In production, Vite outputs ES modules (`type="module"` scripts) which cannot load via `file://` protocol in Chromium. The main process runs a local HTTP server on port 18235 to serve `dist/` files. OAuth callback uses port 18234.

### Key renderer files

- `src/pages/Index.tsx` — All core UI state and migration logic in one component. Views: idle → subscriptions → transfer → migrating → done.
- `src/components/SettingsPopover.tsx` — Theme (dark/light) and language (ko/en) toggle with inline flag SVGs.
- `src/lib/i18n.ts` — Lightweight i18n: `t("key")` returns Korean or English string. Language persisted in localStorage.
- `src/hooks/use-i18n.ts` — React hook wrapping i18n with auto re-render on language change.

### Styling

- CSS custom properties (HSL) in `src/index.css`. `:root` = light theme, `.dark` = dark theme.
- Dark mode toggled via `document.documentElement.classList`. Tailwind `darkMode: "class"`.
- Do not hardcode hex colors — use CSS variable tokens defined in `tailwind.config.ts`.
- `src/components/ui/` — shadcn/ui primitives (Radix-based). Do not edit manually; regenerate via `shadcn` CLI.

### Path alias

`@/*` resolves to `./src/*` (configured in `tsconfig.app.json` and `vite.config.ts`).

### Vite plugins

- `vite-plugin-electron` — Builds main.ts and preload.ts alongside the renderer.
- `vite-plugin-electron-renderer` — Handles Electron renderer environment.
- `removeCrossOrigin()` — Custom plugin that strips `crossorigin` attributes from built HTML (required for Electron compatibility).

### Testing

Vitest + jsdom + `@testing-library/react`. Tests in `src/**/*.{test,spec}.{ts,tsx}`. Playwright configured for e2e.

## Git Commit Convention

- Format: `label: commit message`
- Language: English only, single line
- Commit unit: per feature/fix (follow global best practice when unclear)
- Common labels: `feat`, `fix`, `refactor`, `chore`, `docs`, `test`, `style`
