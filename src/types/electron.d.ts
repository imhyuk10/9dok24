interface MigrateProgress {
  current: number;
  total: number;
  channelId: string;
  result: "ok" | "already" | "quota" | "fail";
  quotaExceeded: boolean;
}

interface ElectronAPI {
  checkConfig(): Promise<{ configured: boolean; clientId?: string; clientSecret?: string }>;
  validateConfig(clientId: string, clientSecret: string): Promise<{ valid: boolean; reason?: string }>;
  saveConfig(clientId: string, clientSecret: string): Promise<{ ok: boolean }>;
  restoreSession(role: "source" | "dest"): Promise<{ ok: boolean; token?: string; email?: string; name?: string; picture?: string }>;
  clearSession(role: "source" | "dest"): Promise<{ ok: boolean }>;
  loginSource(): Promise<{ token: string; email: string; name: string; picture: string }>;
  loginDest(): Promise<{ token: string; email: string; name: string; picture: string }>;
  fetchSubscriptions(token: string): Promise<{
    subscriptions: { channelId: string; title: string; thumbnail: string }[];
    error?: string;
  }>;
  startMigration(token: string, channelIds: string[]): Promise<{ done: boolean }>;
  onMigrateProgress(cb: (data: MigrateProgress) => void): () => void;
  loadQuota(): Promise<{ inserts: number }>;
  addQuota(count: number): Promise<{ inserts: number }>;
}

declare interface Window {
  electronAPI: ElectronAPI;
}
