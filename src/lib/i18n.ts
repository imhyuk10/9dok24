type Lang = "ko" | "en" | "fr" | "zh" | "ja";

const translations = {
  // 설정 화면
  "settings.title": {
    ko: "초기 설정",
    en: "Setup",
    fr: "Configuration",
    zh: "初始设置",
    ja: "初期設定",
  },
  "settings.description": {
    ko: "Google Cloud Console에서 OAuth 2.0 클라이언트 ID를 생성한 뒤 아래에 입력하세요.",
    en: "Create an OAuth 2.0 Client ID from Google Cloud Console and enter it below.",
    fr: "Créez un Client ID OAuth 2.0 depuis Google Cloud Console et entrez-le ci-dessous.",
    zh: "在 Google Cloud Console 中创建 OAuth 2.0 客户端 ID 后，输入到下方。",
    ja: "Google Cloud ConsoleでOAuth 2.0クライアントIDを作成し、以下に入力してください。",
  },
  "settings.step1": {
    ko: "Google Cloud Console → 프로젝트 생성",
    en: "Google Cloud Console → Create Project",
    fr: "Google Cloud Console → Créer un projet",
    zh: "Google Cloud Console → 创建项目",
    ja: "Google Cloud Console → プロジェクト作成",
  },
  "settings.step2": {
    ko: "YouTube Data API v3 활성화",
    en: "Enable YouTube Data API v3",
    fr: "Activer YouTube Data API v3",
    zh: "启用 YouTube Data API v3",
    ja: "YouTube Data API v3を有効化",
  },
  "settings.step3": {
    ko: "OAuth 동의 화면 설정 → 테스트 사용자 추가",
    en: "OAuth consent screen → Add test users",
    fr: "Écran de consentement OAuth → Ajouter des utilisateurs de test",
    zh: "OAuth 同意屏幕设置 → 添加测试用户",
    ja: "OAuth同意画面設定 → テストユーザー追加",
  },
  "settings.step4_pre": {
    ko: "사용자 인증 정보 → OAuth 클라이언트 ID 생성 (유형: ",
    en: "Credentials → Create OAuth Client ID (type: ",
    fr: "Identifiants → Créer un Client ID OAuth (type : ",
    zh: "凭据 → 创建 OAuth 客户端 ID（类型：",
    ja: "認証情報 → OAuthクライアントID作成（種類：",
  },
  "settings.step4_bold": {
    ko: "데스크톱 앱",
    en: "Desktop App",
    fr: "Application de bureau",
    zh: "桌面应用",
    ja: "デスクトップアプリ",
  },
  "settings.saveBtn": {
    ko: "저장하고 시작",
    en: "Save & Start",
    fr: "Enregistrer et démarrer",
    zh: "保存并开始",
    ja: "保存して開始",
  },
  "settings.saving": {
    ko: "저장 중...",
    en: "Saving...",
    fr: "Enregistrement...",
    zh: "保存中...",
    ja: "保存中...",
  },
  "settings.saveFail": {
    ko: "설정 저장 실패",
    en: "Failed to save settings",
    fr: "Échec de l'enregistrement",
    zh: "设置保存失败",
    ja: "設定の保存に失敗しました",
  },

  // 로그인 화면
  "login.subtitle": {
    ko: "구독이사",
    en: "YouTube Migration",
    fr: "Migration YouTube",
    zh: "订阅迁移",
    ja: "登録移行",
  },
  "login.description": {
    ko: "YouTube 구독 목록을 다른 계정으로 옮깁니다.\n먼저 구독 목록을 가져올 계정으로 로그인하세요.",
    en: "Migrate your YouTube subscriptions to another account.\nSign in with the account you want to export from.",
    fr: "Migrez vos abonnements YouTube vers un autre compte.\nConnectez-vous avec le compte dont vous souhaitez exporter les abonnements.",
    zh: "将您的 YouTube 订阅迁移到另一个账户。\n请先用要导出订阅的账户登录。",
    ja: "YouTubeの登録チャンネルを別のアカウントに移行します。\nエクスポート元のアカウントでサインインしてください。",
  },
  "login.button": {
    ko: "Google 계정으로 로그인",
    en: "Sign in with Google",
    fr: "Se connecter avec Google",
    zh: "使用 Google 账户登录",
    ja: "Googleアカウントでサインイン",
  },
  "login.loggingIn": {
    ko: "브라우저에서 로그인 중...",
    en: "Signing in via browser...",
    fr: "Connexion via le navigateur...",
    zh: "正在通过浏览器登录...",
    ja: "ブラウザでサインイン中...",
  },
  "login.cancel": {
    ko: "취소",
    en: "Cancel",
    fr: "Annuler",
    zh: "取消",
    ja: "キャンセル",
  },
  "login.cancelled": {
    ko: "로그인이 취소되었습니다.",
    en: "Sign-in was cancelled.",
    fr: "La connexion a été annulée.",
    zh: "登录已取消。",
    ja: "サインインがキャンセルされました。",
  },
  "login.failed": {
    ko: "로그인 실패",
    en: "Sign-in failed",
    fr: "Échec de la connexion",
    zh: "登录失败",
    ja: "サインインに失敗しました",
  },
  "login.apiSettings": {
    ko: "API 설정 변경",
    en: "Change API Settings",
    fr: "Modifier les paramètres API",
    zh: "更改 API 设置",
    ja: "API設定を変更",
  },

  // 대시보드
  "header.sourceAccount": {
    ko: "보낼 계정",
    en: "Source Account",
    fr: "Compte source",
    zh: "来源账户",
    ja: "移行元アカウント",
  },
  "header.logout": {
    ko: "로그아웃",
    en: "Logout",
    fr: "Déconnexion",
    zh: "退出登录",
    ja: "ログアウト",
  },
  "header.apiSettings": {
    ko: "API 설정",
    en: "API Settings",
    fr: "Paramètres API",
    zh: "API 设置",
    ja: "API設定",
  },

  "action.fetchSubs": {
    ko: "구독 목록 불러오기",
    en: "Fetch Subscriptions",
    fr: "Récupérer les abonnements",
    zh: "获取订阅列表",
    ja: "登録リストを取得",
  },
  "action.refreshSubs": {
    ko: "목록 새로고침",
    en: "Refresh List",
    fr: "Actualiser la liste",
    zh: "刷新列表",
    ja: "リストを更新",
  },
  "action.fetching": {
    ko: "불러오는 중...",
    en: "Loading...",
    fr: "Chargement...",
    zh: "加载中...",
    ja: "読み込み中...",
  },
  "action.transfer": {
    ko: "구독 옮기기",
    en: "Transfer Subscriptions",
    fr: "Transférer les abonnements",
    zh: "迁移订阅",
    ja: "登録を移行",
  },

  // 이전 패널
  "transfer.destTitle": {
    ko: "받을 계정",
    en: "Destination Account",
    fr: "Compte de destination",
    zh: "目标账户",
    ja: "移行先アカウント",
  },
  "transfer.destDesc": {
    ko: "구독을 옮겨 받을 계정입니다.",
    en: "The account to receive subscriptions.",
    fr: "Le compte qui recevra les abonnements.",
    zh: "接收订阅的账户。",
    ja: "登録を受け取るアカウントです。",
  },
  "transfer.destLogin": {
    ko: "받을 Google 계정 로그인",
    en: "Sign in with destination account",
    fr: "Se connecter avec le compte de destination",
    zh: "登录目标 Google 账户",
    ja: "移行先Googleアカウントでサインイン",
  },
  "transfer.destLoggingIn": {
    ko: "브라우저에서 로그인 중...",
    en: "Signing in via browser...",
    fr: "Connexion via le navigateur...",
    zh: "正在通过浏览器登录...",
    ja: "ブラウザでサインイン中...",
  },
  "transfer.change": {
    ko: "변경",
    en: "Change",
    fr: "Modifier",
    zh: "更改",
    ja: "変更",
  },
  "transfer.start": {
    ko: "옮기기 시작",
    en: "Start Transfer",
    fr: "Démarrer le transfert",
    zh: "开始迁移",
    ja: "移行を開始",
  },
  "transfer.sameAccount": {
    ko: "현재 로그인된 계정과 동일합니다. 다른 계정으로 로그인하세요.",
    en: "Same as current account. Please sign in with a different account.",
    fr: "Même compte que celui connecté. Veuillez vous connecter avec un autre compte.",
    zh: "与当前登录账户相同，请使用其他账户登录。",
    ja: "現在サインイン中のアカウントと同じです。別のアカウントでサインインしてください。",
  },
  "transfer.destLoginFail": {
    ko: "받을 계정 로그인 실패",
    en: "Destination sign-in failed",
    fr: "Échec de la connexion au compte de destination",
    zh: "目标账户登录失败",
    ja: "移行先アカウントのサインインに失敗しました",
  },
  "transfer.allAlready": {
    ko: "선택한 채널이 모두 이미 받을 계정에서 구독 중입니다.",
    en: "All selected channels are already subscribed in the destination account.",
    fr: "Tous les canaux sélectionnés sont déjà abonnés dans le compte de destination.",
    zh: "所选频道在目标账户中均已订阅。",
    ja: "選択したチャンネルはすべて移行先アカウントで既に登録済みです。",
  },
  "transfer.quotaExceeded": {
    ko: "API 일일 할당량 초과. 내일 남은 채널을 옮기세요.",
    en: "Daily API quota exceeded. Transfer remaining channels tomorrow.",
    fr: "Quota API journalier dépassé. Transférez les canaux restants demain.",
    zh: "已超出 API 每日配额，请明天继续迁移剩余频道。",
    ja: "API日次クォータを超えました。明日、残りのチャンネルを移行してください。",
  },
  "transfer.error": {
    ko: "옮기는 중 오류 발생",
    en: "Error during transfer",
    fr: "Erreur lors du transfert",
    zh: "迁移过程中发生错误",
    ja: "移行中にエラーが発生しました",
  },

  // 구독 목록
  "subs.search": {
    ko: "채널 검색...",
    en: "Search channels...",
    fr: "Rechercher des chaînes...",
    zh: "搜索频道...",
    ja: "チャンネルを検索...",
  },
  "subs.selectAll": {
    ko: "전체 선택",
    en: "Select All",
    fr: "Tout sélectionner",
    zh: "全选",
    ja: "すべて選択",
  },
  "subs.deselectAll": {
    ko: "전체 해제",
    en: "Deselect All",
    fr: "Tout désélectionner",
    zh: "取消全选",
    ja: "すべて解除",
  },
  "subs.exportJson": {
    ko: "JSON 내보내기",
    en: "Export JSON",
    fr: "Exporter JSON",
    zh: "导出 JSON",
    ja: "JSONエクスポート",
  },
  "subs.noResults": {
    ko: "검색 결과가 없습니다.",
    en: "No results found.",
    fr: "Aucun résultat.",
    zh: "未找到结果。",
    ja: "結果が見つかりません。",
  },
  "subs.channels": {
    ko: "개 채널",
    en: " Channels",
    fr: " Chaînes",
    zh: " 个频道",
    ja: " チャンネル",
  },
  "subs.selected": {
    ko: "개 선택",
    en: " Selected",
    fr: " Sélectionnées",
    zh: " 个已选",
    ja: " 件選択",
  },
  "subs.done": {
    ko: "개 완료",
    en: " Done",
    fr: " Terminées",
    zh: " 个完成",
    ja: " 件完了",
  },
  "subs.failed": {
    ko: "개 실패",
    en: " Failed",
    fr: " Échecs",
    zh: " 个失败",
    ja: " 件失敗",
  },
  "subs.quotaExceeded": {
    ko: "할당량 초과",
    en: "Quota Exceeded",
    fr: "Quota dépassé",
    zh: "超出配额",
    ja: "クォータ超過",
  },
  "subs.fetchFail": {
    ko: "구독 목록 불러오기 실패",
    en: "Failed to fetch subscriptions",
    fr: "Échec de la récupération des abonnements",
    zh: "获取订阅列表失败",
    ja: "登録リストの取得に失敗しました",
  },

  // 설정 팝오버
  "settingsMenu.title": {
    ko: "설정",
    en: "Settings",
    fr: "Paramètres",
    zh: "设置",
    ja: "設定",
  },
  "settingsMenu.theme": {
    ko: "테마",
    en: "Theme",
    fr: "Thème",
    zh: "主题",
    ja: "テーマ",
  },
  "settingsMenu.dark": {
    ko: "다크",
    en: "Dark",
    fr: "Sombre",
    zh: "深色",
    ja: "ダーク",
  },
  "settingsMenu.light": {
    ko: "라이트",
    en: "Light",
    fr: "Clair",
    zh: "浅色",
    ja: "ライト",
  },
  "settingsMenu.language": {
    ko: "언어",
    en: "Language",
    fr: "Langue",
    zh: "语言",
    ja: "言語",
  },
  "settingsMenu.apiSettings": {
    ko: "API 설정 변경",
    en: "Change API Settings",
    fr: "Modifier les paramètres API",
    zh: "更改 API 设置",
    ja: "API設定を変更",
  },
  "settingsMenu.logout": {
    ko: "로그아웃",
    en: "Logout",
    fr: "Déconnexion",
    zh: "退出登录",
    ja: "ログアウト",
  },

  // API 할당량 게이지
  "quota.label": {
    ko: "API 할당량",
    en: "API Quota",
    fr: "Quota API",
    zh: "API 配额",
    ja: "APIクォータ",
  },
  "quota.max": {
    ko: "최대",
    en: "max",
    fr: "max",
    zh: "最多",
    ja: "最大",
  },

  // 이전 진행
  "migration.inProgress": {
    ko: "이전 중",
    en: "In Progress",
    fr: "En cours",
    zh: "迁移中",
    ja: "移行中",
  },
  "migration.complete": {
    ko: "이전 완료",
    en: "Complete",
    fr: "Terminé",
    zh: "迁移完成",
    ja: "移行完了",
  },
  "migration.apiUsed": {
    ko: "API 사용",
    en: "API used",
    fr: "API utilisée",
    zh: "API 已用",
    ja: "API使用",
  },
  "migration.channelsMigrated": {
    ko: "개 채널 이전 완료",
    en: " channels migrated",
    fr: " chaînes migrées",
    zh: " 个频道迁移完成",
    ja: " チャンネル移行完了",
  },

  // preload 에러
  "error.preload": {
    ko: "Electron preload가 로드되지 않았습니다.",
    en: "Electron preload not loaded.",
    fr: "Le preload Electron n'est pas chargé.",
    zh: "Electron preload 未加载。",
    ja: "Electron preloadがロードされていません。",
  },
  "error.invalidCredentials": {
    ko: "Client ID 또는 Secret이 올바르지 않습니다.",
    en: "Invalid Client ID or Secret.",
    fr: "Client ID ou Secret invalide.",
    zh: "Client ID 或 Secret 无效。",
    ja: "Client IDまたはSecretが正しくありません。",
  },
  "error.accountSuspended": {
    ko: "이 YouTube 계정은 영구 정지된 상태입니다. Google 고객센터에 문의하세요.",
    en: "This YouTube account has been permanently suspended. Please contact Google Support.",
    fr: "Ce compte YouTube a été définitivement suspendu. Veuillez contacter le support Google.",
    zh: "该 YouTube 账户已被永久封禁，请联系 Google 客服。",
    ja: "このYouTubeアカウントは永久停止されています。Googleサポートにお問い合わせください。",
  },
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
