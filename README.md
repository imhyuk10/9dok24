# 9dok24 — YouTube Subscription Migrator

<div align="center">

**Language / 언어 선택**

[🇰🇷 한국어](README.ko.md) | 🇺🇸 **English** | [🇫🇷 Français](README.fr.md) | [🇨🇳 中文](README.zh.md) | [🇯🇵 日本語](README.ja.md)

</div>

---

Migrate your YouTube subscriptions from one Google account to another — fast, selectively, and with real-time API quota tracking.

---

## Features

- **Fetch subscriptions** — Load all subscribed channels from the source account.
- **Selective transfer** — Search channels and pick only the ones you want to move.
- **Duplicate-aware** — Channels already subscribed in the destination are skipped automatically.
- **API quota gauge** — Displays remaining daily YouTube Data API inserts (200/day limit) in real time.
- **JSON export** — Save your subscription list as a JSON file.
- **Dark / Light theme** — Toggle in-app at any time.
- **Korean / English** — Full UI localisation for both languages.

---

## Screenshot

![9dok24 migration in progress](public/screenshot.png)

*Migrating 297 subscriptions — 59 transferred, real-time API quota gauge visible in the header.*

---

## Getting Started

### 1. Google Cloud Setup (required)

On first launch, the app will prompt for OAuth credentials. Follow these steps:

1. Go to [Google Cloud Console](https://console.cloud.google.com/) → create a new project.
2. Enable **YouTube Data API v3**.
3. Configure the **OAuth consent screen** → add test users (your two Google accounts).
4. Go to **Credentials** → **Create OAuth Client ID** → application type: **Desktop App**.
5. Enter the generated **Client ID** and **Client Secret** in the app.

### 2. Run the app

```bash
npm install
npm run dev
```

### 3. Migration flow

1. **Sign in with Google** — log in with the account you want to *export from*.
2. **Fetch subscriptions** — your subscribed channels will be listed.
3. **Select channels** — search and pick the channels to migrate (all selected by default).
4. **Transfer** — sign in with the *destination* account, then start the transfer.

> **Quota note:** YouTube Data API allows ~200 subscription inserts per day. If the limit is hit, resume the next day — already-migrated channels are skipped.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Runtime | Electron 41 |
| UI | React 18 + TypeScript |
| Build | Vite + vite-plugin-electron |
| Styling | Tailwind CSS + shadcn/ui (Radix) |
| Animation | Framer Motion |
| API | YouTube Data API v3 (OAuth2 PKCE) |
| Testing | Vitest + Testing Library, Playwright |

---

## Dev Commands

```bash
npm run dev          # Vite dev server + Electron (localhost:8080)
npm run build        # TypeScript compile + Vite production build
npm run lint         # ESLint
npm run test         # Vitest (single run)
npm run test:watch   # Vitest watch mode
npm run pack         # electron-builder --dir → release/win-unpacked/
npm run dist         # electron-builder full installer → release/
```

---

## License

[MIT](LICENSE) © 2026 9dok24
