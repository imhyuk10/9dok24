# 9dok24 — YouTube 登録チャンネル移行ツール

<div align="center">

**Language / 언어 선택**

[🇰🇷 한국어](README.ko.md) | [🇺🇸 English](README.md) | [🇫🇷 Français](README.fr.md) | [🇨🇳 中文](README.zh.md) | 🇯🇵 **日本語**

</div>

---

YouTube の登録チャンネルを別の Google アカウントへ、素早く・選択的に・API クォータをリアルタイム確認しながら移行できる Electron デスクトップアプリです。

---

## 主な機能

- **チャンネル一覧の取得** — 移行元アカウントのすべての登録チャンネルを読み込みます。
- **選択的な移行** — チャンネルを検索して、移行したいものだけを選べます。
- **重複スキップ** — 移行先アカウントで既に登録済みのチャンネルは自動でスキップします。
- **API クォータゲージ** — YouTube Data API の 1 日あたりの残り挿入数（上限 200 回）をリアルタイム表示。
- **JSON エクスポート** — 登録リストを JSON ファイルとして保存できます。
- **ダーク / ライトテーマ** — アプリ内でいつでも切り替え可能。
- **韓国語 / 英語** — 両言語の UI ローカライゼーションに対応。

---

## はじめに

### 1. Google Cloud の設定（必須）

初回起動時に OAuth 認証情報の入力画面が表示されます。以下の手順で準備してください。

1. [Google Cloud Console](https://console.cloud.google.com/) → 新しいプロジェクトを作成。
2. **YouTube Data API v3** を有効化。
3. **OAuth 同意画面** を設定 → テストユーザー（自分の 2 つの Google アカウント）を追加。
4. **認証情報** → **OAuth クライアント ID を作成** → アプリケーションの種類: **デスクトップ アプリ**。
5. 生成された **クライアント ID** と **クライアント シークレット** をアプリに入力。

### 2. アプリの起動

```bash
npm install
npm run dev
```

### 3. 移行の手順

1. **Google アカウントでログイン** — 移行*元*のアカウントでログインします。
2. **登録チャンネルを取得** — 登録しているチャンネル一覧が表示されます。
3. **チャンネルを選択** — 移行したいチャンネルを選びます（デフォルト: 全選択）。
4. **移行開始** — 移行*先*のアカウントでログインし、移行を開始します。

> **クォータについて:** YouTube Data API は 1 日あたり約 200 回の登録挿入が上限です。超過した場合は翌日以降に再開してください — 完了済みのチャンネルは自動でスキップされます。

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
npm run dev          # Vite 開発サーバー + Electron（localhost:8080）
npm run build        # TypeScript コンパイル + Vite プロダクションビルド
npm run lint         # ESLint
npm run test         # Vitest（1 回実行）
npm run test:watch   # Vitest ウォッチモード
npm run pack         # electron-builder --dir → release/win-unpacked/
npm run dist         # electron-builder 完全インストーラー → release/
```

---

## ライセンス

[MIT](LICENSE) © 2026 9dok24
