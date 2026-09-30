# 9dok24 — YouTube 登録チャンネル移行ツール

<div align="center">

<p>
  <img src="public/9dok24_icon.png" alt="9dok24 ロゴ" width="160" />
</p>

**Language / 언어 선택**

[🇰🇷 한국어](README.ko.md) | [🇺🇸 English](README.md) | [🇫🇷 Français](README.fr.md) | [🇨🇳 中文](README.zh.md) | 🇯🇵 **日本語**

</div>

---

Google Takeout の CSV から YouTube の登録チャンネルを別の Google アカウントへ移行するデスクトップアプリ。移行元アカウントのログインは不要、選択移行・日をまたいだ再開に対応し、API クォータメーターを内蔵しています。

---

## 主な機能

- **Takeout CSV インポート** — Google Takeout の `subscriptions.csv` をクリックまたはドラッグ＆ドロップで読み込み。移行元アカウントのログインは一切不要です。
- **ローカル保存** — 読み込んだリストと各チャンネルの進行状態（完了/スキップ/失敗/待機）をローカルに保存。CSV の読み込みは最初の一度だけで、以降の起動は続きから再開します。
- **ログインなしで編集** — チャンネル URL や `UC…` ID の貼り付けで追加、行の削除、部分選択。すべてオフラインで動作します。
- **編集リストのCSV保存** — 追加・削除で編集したリストを Takeout 形式の CSV として保存し、いつでも再読み込みして再開できます。
- **重複の自動検出** — 移行先で既に登録済みのチャンネルは事前に検出し、クォータを消費せずスキップします。
- **サムネイル・タイトル自動補完** — ログイン後、アバターと欠けているタイトルを 50 件ずつのバッチで取得してキャッシュします。
- **API クォータメーター** — トップバーのセグメントゲージが 1 日 200 回の上限に対する登録挿入数を追跡します。
- **キャンセル可能な OAuth** — ログインは最大 5 分待機し、いつでもキャンセルできます。
- **JSON エクスポート** — 状態付きのリストを JSON で保存。
- **ライト / ダークテーマ** — デフォルトはライト。UI は 한국어 / English / Français / 中文 / 日本語 に対応。

---

## スクリーンショット

![9dok24 コンソール](public/screenshot.png)

*コンソール画面：行ごとの状態が表示されるチャンネル台帳、移行先アカウント接続と実行コントロール、トップバーの API クォータメーター。*

---

## はじめに

### 1. Google Cloud の設定（必須）

初回起動時に OAuth 認証情報の入力を求められます：

1. [Google Cloud Console](https://console.cloud.google.com/) → 新しいプロジェクトを作成。
2. **YouTube Data API v3** を有効化。
3. **OAuth 同意画面**を構成 → アプリは*テスト*状態のまま、移行先アカウントを**テストユーザー**に追加。
4. **認証情報** → **OAuth クライアント ID を作成** → 種類：**デスクトップアプリ**。
5. 生成された **Client ID** と **Client Secret** をアプリに入力。

### 2. 登録チャンネル CSV の取得

1. *移行元*アカウントで [Google Takeout](https://takeout.google.com/) を開く。
2. **YouTube と YouTube Music** のみ選択 → **登録チャンネル**を含める。
3. エクスポートしてアーカイブをダウンロードし、`subscriptions.csv` を見つけます。

### 3. アプリの実行

```bash
npm install
npm run dev
```

### 4. 移行の流れ

1. **CSV をインポート** — ドロップゾーンをクリックするかファイルをドラッグ。リストはローカルに保存されるため一度だけで済みます。
2. **リストを確認** — 検索、選択解除、行の削除、URL/ID でのチャンネル追加。
3. **移行先アカウントでログイン** — ブラウザに Google の同意画面が開きます（個人の OAuth クライアントでは「確認されていないアプリ」警告が出ますが正常です：*詳細 → 続行*）。
4. **移行を実行** — 登録済みチャンネルはスキップされ、残りを 1 件ずつ登録。行ごとにリアルタイムで状態が表示されます。

> **クォータについて：** YouTube Data API の登録挿入は 1 日約 200 回まで（太平洋時間の午前 0 時にリセット）。上限に達したら翌日再実行してください — 完了済みチャンネルは記憶されスキップされます。

---

## 技術スタック

| レイヤー | 技術 |
|----------|------|
| ランタイム | Electron 41 |
| UI | React 18 + TypeScript |
| ビルド | Vite + vite-plugin-electron |
| スタイル | Tailwind CSS + shadcn/ui (Radix) |
| アニメーション | Framer Motion |
| API | YouTube Data API v3 (OAuth2 PKCE) |
| テスト | Vitest + Testing Library, Playwright |

---

## 開発コマンド

```bash
npm run dev          # Vite 開発サーバー + Electron (localhost:8080)
npm run build        # TypeScript コンパイル + Vite 本番ビルド
npm run lint         # ESLint
npm run test         # Vitest（単発実行）
npm run test:watch   # Vitest ウォッチモード
npm run pack         # electron-builder --dir → release/win-unpacked/
npm run dist         # electron-builder フルインストーラー → release/
```

通常のブラウザで `localhost:8080` を開くと、開発専用の Electron API モックが有効になり
（`?mock=list` / `?mock=empty` / `?mock=setup`）、Electron なしで UI 作業ができます。

---

## ライセンス

[MIT](LICENSE) © 2026 9dok24
