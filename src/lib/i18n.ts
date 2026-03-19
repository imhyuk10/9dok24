type Lang = "ko" | "en";

const translations = {
  // 설정 화면
  "settings.title": { ko: "초기 설정", en: "Setup" },
  "settings.description": { ko: "Google Cloud Console에서 OAuth 2.0 클라이언트 ID를 생성한 뒤 아래에 입력하세요.", en: "Create an OAuth 2.0 Client ID from Google Cloud Console and enter it below." },
  "settings.step1": { ko: "Google Cloud Console → 프로젝트 생성", en: "Google Cloud Console → Create Project" },
  "settings.step2": { ko: "YouTube Data API v3 활성화", en: "Enable YouTube Data API v3" },
  "settings.step3": { ko: "OAuth 동의 화면 설정 → 테스트 사용자 추가", en: "OAuth consent screen → Add test users" },
  "settings.step4_pre": { ko: "사용자 인증 정보 → OAuth 클라이언트 ID 생성 (유형: ", en: "Credentials → Create OAuth Client ID (type: " },
  "settings.step4_bold": { ko: "데스크톱 앱", en: "Desktop App" },
  "settings.saveBtn": { ko: "저장하고 시작", en: "Save & Start" },
  "settings.saving": { ko: "저장 중...", en: "Saving..." },
  "settings.saveFail": { ko: "설정 저장 실패", en: "Failed to save settings" },

  // 로그인 화면
  "login.subtitle": { ko: "구독이사", en: "YouTube Migration" },
  "login.description": { ko: "YouTube 구독 목록을 다른 계정으로 옮깁니다.\n먼저 구독 목록을 가져올 계정으로 로그인하세요.", en: "Migrate your YouTube subscriptions to another account.\nSign in with the account you want to export from." },
  "login.button": { ko: "Google 계정으로 로그인", en: "Sign in with Google" },
  "login.loggingIn": { ko: "브라우저에서 로그인 중...", en: "Signing in via browser..." },
  "login.cancel": { ko: "취소", en: "Cancel" },
  "login.cancelled": { ko: "로그인이 취소되었습니다.", en: "Sign-in was cancelled." },
  "login.failed": { ko: "로그인 실패", en: "Sign-in failed" },
  "login.apiSettings": { ko: "API 설정 변경", en: "Change API Settings" },

  // 대시보드
  "header.sourceAccount": { ko: "보낼 계정", en: "Source Account" },
  "header.logout": { ko: "로그아웃", en: "Logout" },
  "header.apiSettings": { ko: "API 설정", en: "API Settings" },

  "action.fetchSubs": { ko: "구독 목록 불러오기", en: "Fetch Subscriptions" },
  "action.refreshSubs": { ko: "목록 새로고침", en: "Refresh List" },
  "action.fetching": { ko: "불러오는 중...", en: "Loading..." },
  "action.transfer": { ko: "구독 옮기기", en: "Transfer Subscriptions" },

  // 이전 패널
  "transfer.destTitle": { ko: "받을 계정", en: "Destination Account" },
  "transfer.destDesc": { ko: "구독을 옮겨 받을 계정입니다.", en: "The account to receive subscriptions." },
  "transfer.destLogin": { ko: "받을 Google 계정 로그인", en: "Sign in with destination account" },
  "transfer.destLoggingIn": { ko: "브라우저에서 로그인 중...", en: "Signing in via browser..." },
  "transfer.change": { ko: "변경", en: "Change" },
  "transfer.start": { ko: "옮기기 시작", en: "Start Transfer" },
  "transfer.sameAccount": { ko: "현재 로그인된 계정과 동일합니다. 다른 계정으로 로그인하세요.", en: "Same as current account. Please sign in with a different account." },
  "transfer.destLoginFail": { ko: "받을 계정 로그인 실패", en: "Destination sign-in failed" },
  "transfer.allAlready": { ko: "선택한 채널이 모두 이미 받을 계정에서 구독 중입니다.", en: "All selected channels are already subscribed in the destination account." },
  "transfer.quotaExceeded": { ko: "API 일일 할당량 초과. 내일 남은 채널을 옮기세요.", en: "Daily API quota exceeded. Transfer remaining channels tomorrow." },
  "transfer.error": { ko: "옮기는 중 오류 발생", en: "Error during transfer" },

  // 구독 목록
  "subs.search": { ko: "채널 검색...", en: "Search channels..." },
  "subs.selectAll": { ko: "전체 선택", en: "Select All" },
  "subs.deselectAll": { ko: "전체 해제", en: "Deselect All" },
  "subs.exportJson": { ko: "JSON 내보내기", en: "Export JSON" },
  "subs.noResults": { ko: "검색 결과가 없습니다.", en: "No results found." },
  "subs.channels": { ko: "개 채널", en: " Channels" },
  "subs.selected": { ko: "개 선택", en: " Selected" },
  "subs.done": { ko: "개 완료", en: " Done" },
  "subs.failed": { ko: "개 실패", en: " Failed" },
  "subs.quotaExceeded": { ko: "할당량 초과", en: "Quota Exceeded" },
  "subs.fetchFail": { ko: "구독 목록 불러오기 실패", en: "Failed to fetch subscriptions" },

  // 설정 팝오버
  "settingsMenu.title": { ko: "설정", en: "Settings" },
  "settingsMenu.theme": { ko: "테마", en: "Theme" },
  "settingsMenu.dark": { ko: "다크", en: "Dark" },
  "settingsMenu.light": { ko: "라이트", en: "Light" },
  "settingsMenu.language": { ko: "언어", en: "Language" },
  "settingsMenu.apiSettings": { ko: "API 설정 변경", en: "Change API Settings" },
  "settingsMenu.logout": { ko: "로그아웃", en: "Logout" },

  // preload 에러
  "error.preload": { ko: "Electron preload가 로드되지 않았습니다.", en: "Electron preload not loaded." },
  "error.invalidCredentials": { ko: "Client ID 또는 Secret이 올바르지 않습니다.", en: "Invalid Client ID or Secret." },
} as const;

export type TranslationKey = keyof typeof translations;

let currentLang: Lang = (typeof localStorage !== "undefined" && localStorage.getItem("lang") as Lang) || "ko";
const listeners = new Set<() => void>();

export function getLang(): Lang {
  return currentLang;
}

export function setLang(lang: Lang) {
  currentLang = lang;
  if (typeof localStorage !== "undefined") localStorage.setItem("lang", lang);
  listeners.forEach((fn) => fn());
}

export function t(key: TranslationKey): string {
  return translations[key]?.[currentLang] ?? key;
}

export function onLangChange(fn: () => void): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}
