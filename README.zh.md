# 9dok24 — YouTube 订阅迁移工具

<div align="center">

**Language / 언어 선택**

[🇰🇷 한국어](README.ko.md) | [🇺🇸 English](README.md) | [🇫🇷 Français](README.fr.md) | 🇨🇳 **中文** | [🇯🇵 日本語](README.ja.md)

</div>

---

将您的 YouTube 订阅从一个 Google 账户快速迁移到另一个账户，支持选择性迁移，并内置 API 配额仪表。

---

## 主要功能

- **获取订阅列表** — 加载来源账户中所有订阅的 YouTube 频道。
- **选择性迁移** — 搜索频道，仅迁移您选中的内容。
- **自动去重** — 目标账户已订阅的频道将自动跳过。
- **API 配额仪表** — 显示应用内记录的 YouTube Data API 每日插入次数，并按 200 次/天上限展示。
- **JSON 导出** — 将订阅列表保存为 JSON 文件。
- **深色 / 浅色主题** — 可在应用内随时切换。
- **韩语 / 英语** — 支持双语界面切换。

---

## 截图

![9dok24 迁移进行中](public/screenshot.png)

*正在迁移 297 个频道 — 已完成 59 个，顶部显示 API 配额仪表。*

---

## 快速开始

### 1. Google Cloud 配置（必须）

首次启动时，应用会提示输入 OAuth 凭据。请按以下步骤操作：

1. 前往 [Google Cloud Console](https://console.cloud.google.com/) → 创建新项目。
2. 启用 **YouTube Data API v3**。
3. 配置 **OAuth 同意屏幕** → 将您的两个 Google 账户添加为测试用户。
4. 前往 **凭据** → **创建 OAuth 客户端 ID** → 应用类型选择 **桌面应用**。
5. 将生成的 **客户端 ID** 和 **客户端密钥** 填入应用。

### 2. 运行应用

```bash
npm install
npm run dev
```

### 3. 迁移流程

1. **登录 Google 账户** — 使用要*导出*订阅的账户登录。
2. **获取订阅列表** — 显示该账户订阅的所有频道。
3. **选择频道** — 搜索并勾选要迁移的频道（默认全选）。
4. **开始迁移** — 用*目标*账户登录后，点击开始迁移。

> **配额说明：** YouTube Data API 每天最多允许约 200 次订阅插入。超出限制后，次日继续即可 — 已完成的频道会自动跳过。

---

## 技术栈

| 层级 | 技术 |
|------|------|
| 运行时 | Electron 41 |
| UI | React 18 + TypeScript |
| 构建工具 | Vite + vite-plugin-electron |
| 样式 | Tailwind CSS + shadcn/ui (Radix) |
| 动画 | Framer Motion |
| API | YouTube Data API v3 (OAuth2 PKCE) |
| 测试 | Vitest + Testing Library, Playwright |

---

## 开发命令

```bash
npm run dev          # Vite 开发服务器 + Electron（localhost:8080）
npm run build        # TypeScript 编译 + Vite 生产构建
npm run lint         # ESLint 检查
npm run test         # Vitest 单次运行
npm run test:watch   # Vitest 监听模式
npm run pack         # electron-builder --dir → release/win-unpacked/
npm run dist         # electron-builder 完整安装包 → release/
```

---

## 许可证

[MIT](LICENSE) © 2026 9dok24
