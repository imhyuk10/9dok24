import { app, BrowserWindow, shell, ipcMain } from "electron";
import { createHash, randomBytes } from "crypto";
import http from "http";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isDev = !app.isPackaged;
const OAUTH_PORT = 18234;

// ── 설정 파일 (userData/config.json) ────────────────────────────────────────────
function configPath(): string {
  return path.join(app.getPath("userData"), "config.json");
}

function loadCredentials(): { clientId: string; clientSecret: string } {
  try {
    const data = JSON.parse(fs.readFileSync(configPath(), "utf-8"));
    return {
      clientId: data.clientId?.trim() ?? "",
      clientSecret: data.clientSecret?.trim() ?? "",
    };
  } catch {
    return { clientId: "", clientSecret: "" };
  }
}

function saveCredentials(clientId: string, clientSecret: string) {
  fs.writeFileSync(configPath(), JSON.stringify({ clientId, clientSecret }, null, 2));
}

// ── 세션 파일 (userData/session-source.json, session-dest.json) ─────────────
interface Session {
  refreshToken: string;
  email: string;
  name: string;
  picture: string;
}

function sessionPath(role: "source" | "dest"): string {
  return path.join(app.getPath("userData"), `session-${role}.json`);
}

function loadSession(role: "source" | "dest"): Session | null {
  try {
    return JSON.parse(fs.readFileSync(sessionPath(role), "utf-8"));
  } catch {
    return null;
  }
}

function saveSession(role: "source" | "dest", session: Session) {
  fs.writeFileSync(sessionPath(role), JSON.stringify(session, null, 2));
}

function clearSession(role: "source" | "dest") {
  try { fs.unlinkSync(sessionPath(role)); } catch { /* ignore */ }
}

async function refreshAccessToken(refreshToken: string): Promise<string> {
  const { clientId, clientSecret } = loadCredentials();
  const resp = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      refresh_token: refreshToken,
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: "refresh_token",
    }),
  });
  const data = await resp.json() as Record<string, unknown>;
  if (!resp.ok) throw new Error((data.error_description as string) ?? "토큰 갱신 실패");
  return data.access_token as string;
}

// ── PKCE ────────────────────────────────────────────────────────────────────────
function generatePKCE() {
  const verifier = randomBytes(64).toString("base64url");
  const challenge = createHash("sha256").update(verifier).digest("base64url");
  return { verifier, challenge };
}

// ── OAuth ────────────────────────────────────────────────────────────────────────
let activeServer: http.Server | null = null;

async function doOAuth(scope: string, role: "source" | "dest") {
  if (activeServer) {
    activeServer.close();
    activeServer = null;
  }

  const { clientId, clientSecret } = loadCredentials();
  if (!clientId) throw new Error("Google Client ID가 설정되지 않았습니다.");

  const { verifier, challenge } = generatePKCE();
  const redirectUri = `http://127.0.0.1:${OAUTH_PORT}/oauth/callback`;

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope,
    code_challenge: challenge,
    code_challenge_method: "S256",
    access_type: "offline",
    prompt: "select_account",
  });

  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params}`;

  const code = await new Promise<string>((resolve, reject) => {
    const server = http.createServer((req, res) => {
      if (!req.url?.startsWith("/oauth/callback")) return;
      const url = new URL(req.url, `http://127.0.0.1:${OAUTH_PORT}`);
      const code = url.searchParams.get("code");
      const error = url.searchParams.get("error");

      const html = error
        ? `<html><body style="font-family:sans-serif;text-align:center;padding:60px"><h2>인증 실패</h2><p>${error}</p><p>이 창을 닫고 다시 시도하세요.</p></body></html>`
        : `<html><body style="font-family:sans-serif;text-align:center;padding:60px"><h2>인증 완료!</h2><p>이 창을 닫아도 됩니다.</p><script>setTimeout(()=>window.close(),1500)</script></body></html>`;

      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.end(html);
      server.close();
      activeServer = null;

      if (error || !code) reject(new Error(error ?? "인증 코드 없음"));
      else resolve(code);
    });

    activeServer = server;
    server.listen(OAUTH_PORT, "127.0.0.1", () => shell.openExternal(authUrl));
    server.on("error", (err) => { activeServer = null; reject(err); });
    setTimeout(() => { server.close(); activeServer = null; reject(new Error("OAuth 타임아웃 (2분).")); }, 120_000);
  });

  // 토큰 교환
  const tokenResp = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
      code_verifier: verifier,
    }),
  });

  const tokenData = await tokenResp.json() as Record<string, unknown>;
  if (!tokenResp.ok) throw new Error((tokenData.error_description as string) ?? "토큰 교환 실패");

  const accessToken = tokenData.access_token as string;
  const refreshToken = tokenData.refresh_token as string | undefined;

  // 사용자 정보 — YouTube 채널 API로 조회 (별도 scope 불필요)
  const chResp = await fetch(
    "https://www.googleapis.com/youtube/v3/channels?part=snippet&mine=true",
    { headers: { Authorization: `Bearer ${accessToken}` } },
  );
  if (!chResp.ok) {
    const errData = await chResp.json().catch(() => null) as any;
    const msg = errData?.error?.message ?? `HTTP ${chResp.status}`;
    console.error("[channels]", chResp.status, msg);
    throw new Error(`채널 정보 조회 실패: ${msg}`);
  }
  const chData = await chResp.json() as any;
  const ch = chData.items?.[0];

  const email = ch?.snippet?.title ?? "YouTube User";
  const name = ch?.snippet?.title ?? "YouTube User";
  const picture = ch?.snippet?.thumbnails?.default?.url ?? "";

  // 세션 저장 (refresh_token이 있을 때만)
  if (refreshToken) {
    saveSession(role, { refreshToken, email, name, picture });
  }

  return { token: accessToken, email, name, picture };
}

// ── 구독 목록 ────────────────────────────────────────────────────────────────────
async function fetchSubscriptions(token: string) {
  const subs: { channelId: string; title: string; thumbnail: string }[] = [];
  let pageToken = "";

  do {
    const params = new URLSearchParams({
      part: "snippet",
      mine: "true",
      maxResults: "50",
      ...(pageToken ? { pageToken } : {}),
    });

    const resp = await fetch(`https://www.googleapis.com/youtube/v3/subscriptions?${params}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!resp.ok) {
      const err = await resp.json() as any;
      throw new Error(err?.error?.message ?? "구독 목록 조회 실패");
    }

    const data = await resp.json() as any;
    for (const item of data.items ?? []) {
      subs.push({
        channelId: item.snippet.resourceId.channelId,
        title: item.snippet.title,
        thumbnail: item.snippet.thumbnails?.default?.url ?? "",
      });
    }
    pageToken = data.nextPageToken ?? "";
  } while (pageToken);

  return { subscriptions: subs };
}

// ── 구독 옮기기 ────────────────────────────────────────────────────────────────────
async function migrateSubscriptions(
  event: Electron.IpcMainInvokeEvent,
  token: string,
  channelIds: string[],
) {
  const total = channelIds.length;

  for (let i = 0; i < total; i++) {
    const channelId = channelIds[i];
    let result = "ok";
    let quotaExceeded = false;

    try {
      const resp = await fetch("https://www.googleapis.com/youtube/v3/subscriptions?part=snippet", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          snippet: { resourceId: { kind: "youtube#channel", channelId } },
        }),
      });

      if (!resp.ok) {
        const err = await resp.json() as any;
        const reason = err?.error?.errors?.[0]?.reason ?? "";
        if (reason === "subscriptionDuplicate") result = "already";
        else if (reason === "quotaExceeded" || resp.status === 429) { result = "quota"; quotaExceeded = true; }
        else result = "fail";
      }
    } catch {
      result = "fail";
    }

    event.sender.send("migrate:progress", { current: i + 1, total, channelId, result, quotaExceeded });
    if (quotaExceeded) break;
    if (i < total - 1) await new Promise((r) => setTimeout(r, 300));
  }

  return { done: true };
}

// ── IPC ──────────────────────────────────────────────────────────────────────────
function registerIPC() {
  ipcMain.handle("config:check", () => {
    const { clientId, clientSecret } = loadCredentials();
    return { configured: !!(clientId && clientSecret), clientId, clientSecret };
  });

  ipcMain.handle("config:save", (_e, { clientId, clientSecret }: { clientId: string; clientSecret: string }) => {
    saveCredentials(clientId, clientSecret);
    return { ok: true };
  });

  // 설정값 유효성 검증
  ipcMain.handle("config:validate", async (_e, { clientId, clientSecret }: { clientId: string; clientSecret: string }) => {
    try {
      const resp = await fetch(`https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&response_type=code&scope=openid&redirect_uri=http://127.0.0.1:18234/oauth/callback`);
      if (resp.status === 400) {
        const text = await resp.text();
        if (text.includes("invalid_client")) return { valid: false, reason: "Client ID가 올바르지 않습니다." };
      }
      return { valid: true };
    } catch {
      return { valid: false, reason: "연결 실패" };
    }
  });

  ipcMain.handle("auth:source", () =>
    doOAuth("https://www.googleapis.com/auth/youtube.readonly", "source")
  );

  ipcMain.handle("auth:dest", () =>
    doOAuth("https://www.googleapis.com/auth/youtube", "dest")
  );

  // 저장된 세션 복원
  ipcMain.handle("session:restore", async (_e, role: "source" | "dest") => {
    const session = loadSession(role);
    if (!session) return { ok: false };
    try {
      const token = await refreshAccessToken(session.refreshToken);
      return { ok: true, token, email: session.email, name: session.name, picture: session.picture };
    } catch {
      clearSession(role);
      return { ok: false };
    }
  });

  ipcMain.handle("session:clear", (_e, role: "source" | "dest") => {
    clearSession(role);
    return { ok: true };
  });

  ipcMain.handle("subscriptions:fetch", (_e, token: string) =>
    fetchSubscriptions(token)
  );

  ipcMain.handle("migrate:start", (event, { token, channelIds }: { token: string; channelIds: string[] }) =>
    migrateSubscriptions(event, token, channelIds)
  );
}

// ── 프로덕션 정적 파일 서버 (포트 18235) ─────────────────────────────────────────
// ES 모듈(type="module")은 file:// 프로토콜에서 로드 불가 → 로컬 HTTP 서버로 서빙
const STATIC_PORT = 18235;
let staticServer: http.Server | null = null;

function startStaticServer(): Promise<void> {
  return new Promise((resolve, reject) => {
    const distPath = path.join(__dirname, "..", "dist");
    const mimeTypes: Record<string, string> = {
      ".html": "text/html; charset=utf-8",
      ".js": "application/javascript",
      ".mjs": "application/javascript",
      ".css": "text/css",
      ".png": "image/png",
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".svg": "image/svg+xml",
      ".ico": "image/x-icon",
      ".json": "application/json",
      ".woff": "font/woff",
      ".woff2": "font/woff2",
      ".ttf": "font/ttf",
    };

    staticServer = http.createServer((req, res) => {
      const urlPath = (req.url ?? "/").split("?")[0];
      let filePath = path.join(distPath, urlPath === "/" ? "index.html" : urlPath);

      if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
        filePath = path.join(distPath, "index.html");
      }

      const ext = path.extname(filePath).toLowerCase();
      const contentType = mimeTypes[ext] ?? "application/octet-stream";

      fs.readFile(filePath, (err, data) => {
        if (err) {
          res.writeHead(404);
          res.end("Not found");
          return;
        }
        res.writeHead(200, { "Content-Type": contentType });
        res.end(data);
      });
    });

    staticServer.listen(STATIC_PORT, "127.0.0.1", () => resolve());
    staticServer.on("error", reject);
  });
}

// ── 앱 초기화 ────────────────────────────────────────────────────────────────────
let mainWindow: BrowserWindow | null = null;
let splashWindow: BrowserWindow | null = null;
let appStartTime = Date.now();

function createSplash() {
  const splashPath = isDev
    ? path.join(__dirname, "..", "public", "splash.html")
    : path.join(__dirname, "..", "dist", "splash.html");

  splashWindow = new BrowserWindow({
    width: 480,
    height: 280,
    frame: false,
    resizable: false,
    alwaysOnTop: true,
    center: true,
    show: false,
    backgroundColor: "#0d0f14",
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    }
  });

  if (fs.existsSync(splashPath)) {
    splashWindow.loadFile(splashPath);
    splashWindow.once("ready-to-show", () => splashWindow?.show());
  } else {
    console.error("Splash file not found:", splashPath);
  }
}

function createWindow() {
  const iconPath = isDev
    ? path.join(__dirname, "..", "public", "9dok24_icon.png")
    : path.join(__dirname, "..", "dist", "9dok24_icon.png");

  mainWindow = new BrowserWindow({
    width: 1000,
    height: 720,
    minWidth: 800,
    minHeight: 600,
    title: "9dok24",
    icon: fs.existsSync(iconPath) ? iconPath : undefined,
    show: false,
    backgroundColor: "#0d0f14",
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  mainWindow.setMenuBarVisibility(false);

  if (isDev) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL || "http://localhost:8080");
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadURL(`http://127.0.0.1:${STATIC_PORT}`);
    // 디버깅을 위해 운영 모드에서도 개발자 도구를 엽니다.
    mainWindow.webContents.openDevTools();
  }

  let isMainShown = false;
  const showMain = () => {
    if (isMainShown) return;
    isMainShown = true;
    
    const elapsed = Date.now() - appStartTime;
    const remaining = Math.max(0, 1500 - elapsed);
    
    setTimeout(() => {
      splashWindow?.close();
      splashWindow = null;
      mainWindow?.show();
      mainWindow?.focus();
    }, remaining);
  };

  mainWindow.webContents.on("did-finish-load", showMain);
  mainWindow.webContents.on("did-fail-load", (_e, code, desc) => {
    console.error("[Renderer] load failed:", code, desc);
    showMain();
  });

  // 10초 후 강제 표시 세이프가드
  setTimeout(showMain, 10000);

  mainWindow.on("closed", () => { mainWindow = null; });
}

app.whenReady().then(async () => {
  appStartTime = Date.now();
  registerIPC();
  if (!isDev) {
    await startStaticServer().catch((e) => console.error("[static-server]", e));
  }
  createSplash();
  createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
