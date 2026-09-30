# 9dok24 — YouTube Subscription Migrator

<div align="center">

<p>
  <img src="public/9dok24_icon.png" alt="9dok24 logo" width="160" />
</p>

**Language / 언어 선택**

[🇰🇷 한국어](README.ko.md) | 🇺🇸 **English** | [🇫🇷 Français](README.fr.md) | [🇨🇳 中文](README.zh.md) | [🇯🇵 日本語](README.ja.md)

</div>

---

Migrate your YouTube subscriptions into another Google account from a Google Takeout CSV — no source-account login, selective, resumable, with a built-in API quota meter.

---

## Features

- **Takeout CSV import** — Load your channel list from Google Takeout's `subscriptions.csv`. Click or drag & drop. The source account never needs to log in.
- **Local persistence** — The imported list and each channel's progress (done / skipped / failed / pending) are saved locally. Import the CSV once; every later launch resumes where you left off.
- **Edit without login** — Add channels by pasting a channel URL or `UC…` ID, remove rows, select any subset. All offline.
- **Save edited list as CSV** — Persist your added/removed edits back to a Takeout-style CSV that can be re-imported anytime to resume.
- **Duplicate-aware** — Channels already subscribed in the destination are detected up front and skipped at zero quota cost.
- **Thumbnails & titles auto-filled** — After signing in, channel avatars and missing titles are fetched in cheap 50-per-call batches and cached.
- **API quota meter** — A segmented gauge in the top bar tracks the app's daily subscribe-inserts against the 200/day limit.
- **Cancellable OAuth** — Sign-in waits up to 5 minutes and can be cancelled at any moment.
- **JSON export** — Save the list (with statuses) as JSON.
- **Light / Dark theme** — Light by default, toggle in-app. UI in 한국어 / English / Français / 中文 / 日本語.

---

## Screenshot

![9dok24 console](public/screenshot.png)

*The console: channel ledger with per-row status, destination login and run controls, and the API quota meter in the top bar.*

---

## Getting Started

### 1. Google Cloud Setup (required)

On first launch, the app will prompt for OAuth credentials. Follow these steps:

1. Go to [Google Cloud Console](https://console.cloud.google.com/) → create a new project.
2. Enable **YouTube Data API v3**.
3. Configure the **OAuth consent screen** → keep the app in *Testing* mode and add your destination account as a **test user**.
4. Go to **Credentials** → **Create OAuth Client ID** → application type: **Desktop App**.
5. Enter the generated **Client ID** and **Client Secret** in the app.

### 2. Get your subscriptions CSV

1. Open [Google Takeout](https://takeout.google.com/) with the *source* account.
2. Select only **YouTube and YouTube Music** → include **subscriptions**.
3. Export, download the archive, and locate `subscriptions.csv` (`구독정보.csv` in Korean locales).

### 3. Run the app

```bash
npm install
npm run dev
```

### 4. Migration flow

1. **Import the CSV** — click the drop zone or drag the file in. The list is saved locally, so this is a one-time step.
2. **Review the list** — search, deselect, remove rows, or add extra channels by URL/ID. You can also save the edited list as a CSV that re-imports anytime (💾 in the toolbar).
3. **Sign in with the destination account** — the Google consent screen opens in your browser ("unverified app" warnings are expected for a personal OAuth client: *Advanced → Continue*).
4. **Transfer** — already-subscribed channels are skipped; the rest are subscribed one by one with live per-row status.

> **Quota note:** YouTube Data API allows ~200 subscription inserts per day (resets at midnight Pacific Time). If the limit is hit, just run again the next day — completed channels are remembered and skipped.

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

Opening `localhost:8080` in a plain browser uses a dev-only mock of the Electron API
(`?mock=list` / `?mock=empty` / `?mock=setup`) for UI work without Electron.

---

## License

[MIT](LICENSE) © 2026 9dok24
