interface MigrateProgress {
  current: number;
  total: number;
  channelId: string;
  result: "ok" | "already" | "quota" | "accountSuspended" | "restricted" | "fail";
  quotaExceeded: boolean;
  stopped: boolean;
}

interface ElectronAPI {
  checkConfig(): Promise<{ configured: boolean; clientId?: string; clientSecret?: string }>;
  validateConfig(clientId: string, clientSecret: string): Promise<{ valid: boolean; reason?: string }>;
  saveConfig(clientId: string, clientSecret: string): Promise<{ ok: boolean }>;
  clearSession(): Promise<{ ok: boolean }>;
  loginDest(): Promise<{ token: string; email: string; name: string; picture: string }>;
  cancelLogin(): Promise<{ ok: boolean }>;
  fetchSubscriptions(token: string): Promise<{
    subscriptions: { channelId: string; title: string; thumbnail: string }[];
    error?: string;
  }>;
  fetchChannelThumbnails(token: string, channelIds: string[]): Promise<{
    thumbnails: Record<string, string>;
    titles: Record<string, string>;
  }>;
  startMigration(token: string, channelIds: string[]): Promise<{ done: boolean }>;
  onMigrateProgress(cb: (data: MigrateProgress) => void): () => void;
  saveImportState(state: {
    sourceName: string;
    subscriptions: { channelId: string; title: string; thumbnail: string; status: string }[];
  }): Promise<{ ok: boolean }>;
  loadImportState(): Promise<{
    sourceName?: string;
    subscriptions?: { channelId: string; title: string; thumbnail: string; status: string }[];
  } | null>;
  clearImportState(): Promise<{ ok: boolean }>;
  loadQuota(): Promise<{ inserts: number }>;
  addQuota(count: number): Promise<{ inserts: number }>;
  setQuota(inserts: number): Promise<{ inserts: number }>;
}

declare interface Window {
  electronAPI: ElectronAPI;
}
