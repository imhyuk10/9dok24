// 브라우저(비 Electron) 개발 환경 전용 electronAPI 목(mock).
// UI 상태를 브라우저에서 확인하기 위한 것으로, 프로덕션 번들에는 dev 가드로 제외된다.
// 활성화: dev 서버를 일반 브라우저에서 열면 자동. 시나리오는 ?mock=empty 등 쿼리로 제어.

// 가상의 채널명 — 실존 채널과 무관
const SAMPLE_TITLES = [
  "코드 한 스푼", "달빛 캠핑장", "픽셀 공방", "3분 홈트 연구소",
  "Studio Orbit", "주말 목공일지", "한 페이지 경제", "고양이 관찰기", "레트로 게임 창고",
  "바람길 자전거", "책상 위 정원", "은하수 관측소", "모닝커피 브이로그", "DevLog Daily",
];

function makeChannels() {
  return SAMPLE_TITLES.map((title, i) => ({
    channelId: `UC${String(i).padStart(2, "0")}${"x".repeat(20)}`,
    title,
    thumbnail: "",
    status: i < 4 ? "migrated" : i < 6 ? "skipped" : i === 6 ? "failed" : "pending",
  }));
}

export function installDevMock() {
  if (window.electronAPI) return;

  const params = new URLSearchParams(location.search);
  const scenario = params.get("mock") ?? "list"; // list | empty | setup

  let progressCb: ((data: unknown) => void) | null = null;
  let quota = 63;

  window.electronAPI = {
    checkConfig: async () => scenario === "setup"
      ? { configured: false }
      : { configured: true, clientId: "mock.apps.googleusercontent.com", clientSecret: "GOCSPX-mock" },
    validateConfig: async () => ({ valid: true }),
    saveConfig: async () => ({ ok: true }),
    loginDest: () => new Promise((resolve) =>
      setTimeout(() => resolve({ token: "mock-token", email: "dest@example.com", name: "받는 계정", picture: "" }), 1500)
    ),
    cancelLogin: async () => ({ ok: true }),
    clearSession: async () => ({ ok: true }),
    fetchSubscriptions: async () => ({ subscriptions: [] }),
    fetchChannelThumbnails: async () => ({ thumbnails: {}, titles: {} }),
    startMigration: (_token: string, channelIds: string[]) =>
      new Promise((resolve) => {
        let i = 0;
        const tick = () => {
          if (i >= channelIds.length) return resolve({ done: true });
          i += 1;
          quota += 1;
          progressCb?.({
            current: i, total: channelIds.length, channelId: channelIds[i - 1],
            result: i % 9 === 0 ? "fail" : "ok", quotaExceeded: false, stopped: false,
          });
          setTimeout(tick, 250);
        };
        setTimeout(tick, 400);
      }),
    onMigrateProgress: (cb: (data: unknown) => void) => {
      progressCb = cb;
      return () => { progressCb = null; };
    },
    saveImportState: async () => ({ ok: true }),
    loadImportState: async () => scenario === "list"
      ? { sourceName: "구독정보.csv", subscriptions: makeChannels() }
      : null,
    clearImportState: async () => ({ ok: true }),
    loadQuota: async () => ({ inserts: quota }),
    addQuota: async (n: number) => ({ inserts: (quota += n) }),
    setQuota: async (n: number) => ({ inserts: (quota = n) }),
  } as unknown as typeof window.electronAPI;
}
