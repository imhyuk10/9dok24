# PRODUCT.md — 9dok24 (구독이사)

## What it is
Electron desktop tool that migrates a YouTube subscription list into another Google account.
Input is a Google Takeout `구독정보.csv` (or channels added by hand); output is real
`subscriptions.insert` calls against the YouTube Data API v3 on the destination account.

## Who uses it, where
One person at a desk, migrating their own accounts. Daylight/office lighting; the window is
~1000×720 and often sits beside a browser (OAuth happens in the system browser). Sessions are
short and task-driven: load list → connect account → run → come back tomorrow if quota ran out.

## The job (Operate)
1. Load/keep a channel list (CSV import once; list persists locally with per-channel status).
2. Edit the list locally without login (add by URL/ID, remove rows, select subset) and save the
   edited list back as a Takeout-style CSV that re-imports anytime.
3. Connect the destination Google account (OAuth, test-mode app: browser warning screens are normal).
4. Run the migration; watch per-channel results (완료/건너뜀/실패); resume across days.

## Hard constraints (design must surface these)
- **Quota is the plot.** 10,000 units/day ≈ 200 subscribe-inserts. The app tracks daily inserts
  (200 cap) and must keep the remaining budget visible at all times.
- Already-subscribed channels are pre-checked and skipped without cost.
- Login can take minutes (Google "unverified app" warnings); it is cancellable.
- All state is local (userData JSON, OS-encrypted). No server.

## Brand commitments
- **Direction (user-pinned 2026-08-21): precision pro-tool** — instrument, not marketing.
  Density, hairlines, tabular numerals, one accent. Anti-reference: the previous
  shadcn-default look (violet primary, gradient strips, glow shadows, uppercase kickers).
- **Light theme default**, dark available.
- UI voice: Pretendard (Korean-first pro tool face) + JetBrains Mono for counts/IDs/measures.
- i18n: ko default; en/fr/zh/ja supported. All UI copy via `src/lib/i18n.ts` keys.

## Platform
Electron 41, React 18 + TypeScript, Tailwind + shadcn tokens, framer-motion available.
Window: 1000×720 default, min 800×600, frameless menu bar. Renderer must degrade gracefully
without `window.electronAPI` (dev browser).
