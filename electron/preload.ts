// preload는 Electron sandbox 환경에서 CJS로 실행되어야 함
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  checkConfig: () => ipcRenderer.invoke("config:check"),
  validateConfig: (clientId: string, clientSecret: string) =>
    ipcRenderer.invoke("config:validate", { clientId, clientSecret }),
  saveConfig: (clientId: string, clientSecret: string) =>
    ipcRenderer.invoke("config:save", { clientId, clientSecret }),
  loginSource: () => ipcRenderer.invoke("auth:source"),
  loginDest: () => ipcRenderer.invoke("auth:dest"),
  restoreSession: (role: string) => ipcRenderer.invoke("session:restore", role),
  clearSession: (role: string) => ipcRenderer.invoke("session:clear", role),
  fetchSubscriptions: (token: string) => ipcRenderer.invoke("subscriptions:fetch", token),
  startMigration: (token: string, channelIds: string[]) =>
    ipcRenderer.invoke("migrate:start", { token, channelIds }),
  onMigrateProgress: (cb: (data: unknown) => void) => {
    ipcRenderer.on("migrate:progress", (_e: unknown, data: unknown) => cb(data));
    return () => ipcRenderer.removeAllListeners("migrate:progress");
  },
  loadQuota: () => ipcRenderer.invoke("quota:load"),
  addQuota: (count: number) => ipcRenderer.invoke("quota:add", count),
  setQuota: (inserts: number) => ipcRenderer.invoke("quota:set", inserts),
});
