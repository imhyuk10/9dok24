# 9dok24 — YouTube 订阅迁移工具

<div align="center">

<p>
  <img src="public/9dok24_icon.png" alt="9dok24 标志" width="160" />
</p>

**Language / 언어 선택**

[🇰🇷 한국어](README.ko.md) | [🇺🇸 English](README.md) | [🇫🇷 Français](README.fr.md) | 🇨🇳 **中文** | [🇯🇵 日本語](README.ja.md)

</div>

---

通过 Google Takeout 的 CSV 文件，把 YouTube 订阅列表迁移到另一个 Google 账号——无需登录源账号，可选择、可跨天续传，并内置 API 配额仪表。

---

## 功能特性

- **导入 Takeout CSV** — 从 Google Takeout 的 `subscriptions.csv` 加载频道列表，点击或拖放即可。源账号完全不需要登录。
- **本地持久化** — 导入的列表及每个频道的进度（完成/跳过/失败/待处理）保存在本地。CSV 只需导入一次，之后每次启动都从上次的进度继续。
- **无需登录即可编辑** — 粘贴频道 URL 或 `UC…` ID 添加频道、删除行、任意选择子集，全部离线完成。
- **编辑列表保存为 CSV** — 将添加/删除后的列表保存为 Takeout 格式的 CSV，随时可重新导入继续。
- **自动去重** — 目标账号已订阅的频道会提前检测并跳过，不消耗配额。
- **自动补全缩略图与标题** — 登录后按每次 50 个的批量请求获取头像和缺失的标题并缓存。
- **API 配额仪表** — 顶栏的分段仪表按每日 200 次的上限跟踪订阅写入次数。
- **可取消的 OAuth** — 登录最多等待 5 分钟，随时可以取消。
- **JSON 导出** — 将列表（含状态）保存为 JSON。
- **浅色 / 深色主题** — 默认浅色，可在应用内切换。界面支持 한국어 / English / Français / 中文 / 日本語。

---

## 截图

![9dok24 控制台](public/screenshot.png)

*控制台界面：带逐行状态的频道清单、目标账号连接与执行控件、顶栏的 API 配额仪表。*

---

## 快速开始

### 1. Google Cloud 设置（必需）

首次启动时应用会要求输入 OAuth 凭据：

1. 打开 [Google Cloud Console](https://console.cloud.google.com/) → 创建新项目。
2. 启用 **YouTube Data API v3**。
3. 配置 **OAuth 同意屏幕** → 保持应用为*测试*状态，并把目标账号添加为**测试用户**。
4. **凭据** → **创建 OAuth 客户端 ID** → 应用类型：**桌面应用**。
5. 在应用中输入生成的 **Client ID** 和 **Client Secret**。

### 2. 获取订阅 CSV

1. 用*源*账号打开 [Google Takeout](https://takeout.google.com/)。
2. 仅选择 **YouTube 和 YouTube Music** → 包含**订阅内容**。
3. 导出并下载压缩包，找到 `subscriptions.csv`。

### 3. 运行应用

```bash
npm install
npm run dev
```

### 4. 迁移流程

1. **导入 CSV** — 点击拖放区或直接拖入文件。列表会保存在本地，因此只需一次。
2. **检查列表** — 搜索、取消选择、删除行，或按 URL/ID 添加频道。
3. **登录目标账号** — 浏览器会打开 Google 同意屏幕（个人 OAuth 客户端出现"未经验证的应用"警告属正常：*高级 → 继续*）。
4. **开始迁移** — 已订阅的频道自动跳过，其余逐个订阅，每行实时显示状态。

> **配额提示：** YouTube Data API 每日约允许 200 次订阅写入（太平洋时间午夜重置）。达到上限后第二天再运行即可——已完成的频道会被记住并跳过。

---

## 技术栈

| 层 | 技术 |
|----|------|
| 运行时 | Electron 41 |
| UI | React 18 + TypeScript |
| 构建 | Vite + vite-plugin-electron |
| 样式 | Tailwind CSS + shadcn/ui (Radix) |
| 动画 | Framer Motion |
| API | YouTube Data API v3 (OAuth2 PKCE) |
| 测试 | Vitest + Testing Library, Playwright |

---

## 开发命令

```bash
npm run dev          # Vite 开发服务器 + Electron (localhost:8080)
npm run build        # TypeScript 编译 + Vite 生产构建
npm run lint         # ESLint
npm run test         # Vitest（单次运行）
npm run test:watch   # Vitest 监听模式
npm run pack         # electron-builder --dir → release/win-unpacked/
npm run dist         # electron-builder 完整安装包 → release/
```

在普通浏览器中打开 `localhost:8080` 会启用仅限开发的 Electron API 模拟
（`?mock=list` / `?mock=empty` / `?mock=setup`），无需 Electron 即可调试 UI。

---

## 许可证

[MIT](LICENSE) © 2026 9dok24
