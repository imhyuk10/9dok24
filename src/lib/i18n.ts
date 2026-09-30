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
  "csv.landingSubtitle": {
    ko: "CSV 구독 가져오기",
    en: "CSV Subscription Import",
    fr: "Import d'abonnements CSV",
    zh: "CSV 订阅导入",
    ja: "CSV登録チャンネル読込",
  },
  "csv.landingDescription": {
    ko: "Google Takeout에서 받은 구독정보.csv를 불러오세요.\n목록을 확인한 다음 구독을 적용할 Google 계정으로 로그인합니다.",
    en: "Import the subscriptions CSV from Google Takeout.\nAfter reviewing it, sign in to the Google account that should receive the subscriptions.",
    fr: "Importez le CSV d'abonnements de Google Takeout.\nAprès vérification, connectez-vous au compte Google qui recevra les abonnements.",
    zh: "导入 Google Takeout 的订阅 CSV。\n确认列表后，登录要应用这些订阅的 Google 账号。",
    ja: "Google Takeoutの登録チャンネルCSVを読み込みます。\n確認後、登録を適用するGoogleアカウントでログインします。",
  },
  "csv.destinationTitle": {
    ko: "구독을 적용할 계정",
    en: "Account to receive subscriptions",
    fr: "Compte qui recevra les abonnements",
    zh: "要应用订阅的账号",
    ja: "登録を適用するアカウント",
  },
  "csv.destinationDescription": {
    ko: "CSV의 채널을 구독할 Google 계정입니다.",
    en: "This Google account will subscribe to the channels in the CSV.",
    fr: "Ce compte Google s'abonnera aux chaînes du CSV.",
    zh: "此 Google 账号将订阅 CSV 中的频道。",
    ja: "このGoogleアカウントでCSV内のチャンネルを登録します。",
  },
  "csv.destinationLogin": {
    ko: "구독을 적용할 Google 계정으로 로그인",
    en: "Sign in to the account receiving subscriptions",
    fr: "Se connecter au compte qui recevra les abonnements",
    zh: "登录要应用订阅的 Google 账号",
    ja: "登録を適用するGoogleアカウントでログイン",
  },
  "csv.or": {
    ko: "또는",
    en: "or",
    fr: "ou",
    zh: "或",
    ja: "または",
  },
  "csv.import": {
    ko: "Google Takeout CSV 가져오기",
    en: "Import Google Takeout CSV",
    fr: "Importer un CSV Google Takeout",
    zh: "导入 Google Takeout CSV",
    ja: "Google Takeout CSVを読み込む",
  },
  "csv.importShort": {
    ko: "CSV 가져오기",
    en: "Import CSV",
    fr: "Importer un CSV",
    zh: "导入 CSV",
    ja: "CSVを読み込む",
  },
  "csv.importing": {
    ko: "CSV 읽는 중...",
    en: "Reading CSV...",
    fr: "Lecture du CSV...",
    zh: "正在读取 CSV...",
    ja: "CSVを読み込み中...",
  },
  "csv.sourceLabel": {
    ko: "가져온 구독 목록",
    en: "Imported subscriptions",
    fr: "Abonnements importés",
    zh: "已导入的订阅",
    ja: "読み込んだ登録チャンネル",
  },
  "csv.errorEmpty": {
    ko: "CSV에 구독 채널이 없습니다.",
    en: "The CSV does not contain any subscriptions.",
    fr: "Le CSV ne contient aucun abonnement.",
    zh: "CSV 中没有订阅频道。",
    ja: "CSVに登録チャンネルがありません。",
  },
  "csv.errorHeader": {
    ko: "채널 ID 열을 찾을 수 없습니다. Google Takeout 구독 CSV인지 확인하세요.",
    en: "No channel ID column was found. Select a Google Takeout subscriptions CSV.",
    fr: "Colonne d'identifiant de chaîne introuvable. Sélectionnez un CSV Google Takeout.",
    zh: "找不到频道 ID 列。请选择 Google Takeout 订阅 CSV。",
    ja: "チャンネルID列がありません。Google Takeoutの登録チャンネルCSVを選択してください。",
  },
  "csv.errorInvalid": {
    ko: "유효한 채널 ID를 읽지 못했습니다.",
    en: "No valid channel IDs could be read.",
    fr: "Aucun identifiant de chaîne valide n'a pu être lu.",
    zh: "无法读取有效的频道 ID。",
    ja: "有効なチャンネルIDを読み込めませんでした。",
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
  "transfer.subscriptionRestricted": {
    ko: "YouTube가 추가 구독을 제한했습니다. 몇 시간 후 다시 시도하거나 계정의 구독 한도를 확인하세요.",
    en: "YouTube restricted additional subscriptions. Try again in a few hours or check the account's subscription limit.",
    fr: "YouTube a limité les nouveaux abonnements. Réessayez dans quelques heures ou vérifiez la limite du compte.",
    zh: "YouTube 限制了新增订阅。请几小时后重试或检查该账号的订阅上限。",
    ja: "YouTubeが追加登録を制限しました。数時間後に再試行するか、アカウントの登録上限を確認してください。",
  },
  "transfer.precheckFailed": {
    ko: "기존 구독 목록을 확인하지 못해 중단했습니다. 중복 구독 요청을 방지하기 위해 다시 시도해 주세요.",
    en: "Stopped because existing subscriptions could not be checked. Try again to avoid duplicate requests.",
    fr: "Arrêt : les abonnements existants n'ont pas pu être vérifiés. Réessayez pour éviter les doublons.",
    zh: "无法检查现有订阅，操作已停止。请重试以避免重复请求。",
    ja: "既存の登録を確認できないため停止しました。重複リクエストを避けるため再試行してください。",
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

  // 채널 상태 라벨
  "status.pending": {
    ko: "대기", en: "Pending", fr: "En attente", zh: "等待", ja: "待機",
  },
  "status.migrating": {
    ko: "이전 중", en: "Migrating", fr: "Migration", zh: "迁移中", ja: "移行中",
  },
  "status.migrated": {
    ko: "완료", en: "Done", fr: "Terminé", zh: "完成", ja: "完了",
  },
  "status.failed": {
    ko: "실패", en: "Failed", fr: "Échec", zh: "失败", ja: "失敗",
  },
  "status.skipped": {
    ko: "건너뜀", en: "Skipped", fr: "Ignoré", zh: "跳过", ja: "スキップ",
  },

  // 목록 편집 (추가/삭제 — 로그인 불필요)
  "subs.addPlaceholder": {
    ko: "채널 URL 또는 ID (UC...)를 붙여넣어 추가",
    en: "Paste a channel URL or ID (UC...) to add",
    fr: "Collez une URL ou un ID de chaîne (UC...) pour ajouter",
    zh: "粘贴频道 URL 或 ID（UC...）以添加",
    ja: "チャンネルURLまたはID（UC...）を貼り付けて追加",
  },
  "subs.addBtn": {
    ko: "추가",
    en: "Add",
    fr: "Ajouter",
    zh: "添加",
    ja: "追加",
  },
  "subs.addInvalid": {
    ko: "채널 ID를 인식할 수 없습니다. youtube.com/channel/UC... 주소 또는 UC로 시작하는 24자 ID를 입력하세요.",
    en: "Could not recognize a channel ID. Enter a youtube.com/channel/UC... URL or a 24-character ID starting with UC.",
    fr: "ID de chaîne non reconnu. Entrez une URL youtube.com/channel/UC... ou un ID de 24 caractères commençant par UC.",
    zh: "无法识别频道 ID。请输入 youtube.com/channel/UC... 地址或以 UC 开头的 24 位 ID。",
    ja: "チャンネルIDを認識できません。youtube.com/channel/UC... のURLまたはUCで始まる24文字のIDを入力してください。",
  },
  "subs.addDuplicate": {
    ko: "이미 목록에 있는 채널입니다.",
    en: "This channel is already in the list.",
    fr: "Cette chaîne est déjà dans la liste.",
    zh: "该频道已在列表中。",
    ja: "このチャンネルはすでにリストにあります。",
  },
  "subs.remove": {
    ko: "목록에서 삭제",
    en: "Remove from list",
    fr: "Retirer de la liste",
    zh: "从列表中删除",
    ja: "リストから削除",
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
  "subs.saveCsv": {
    ko: "편집한 목록 CSV로 저장 (다시 불러오기 가능)",
    en: "Save edited list as CSV (reimportable)",
    fr: "Enregistrer la liste modifiée en CSV (réimportable)",
    zh: "将编辑后的列表保存为 CSV（可重新导入）",
    ja: "編集したリストをCSVで保存（再読み込み可能）",
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
  "error.invalidClientIdFormat": {
    ko: "Client ID 형식이 올바르지 않습니다 (.apps.googleusercontent.com 포함 필요).",
    en: "Invalid Client ID format (must include .apps.googleusercontent.com).",
    fr: "Format de Client ID invalide (doit inclure .apps.googleusercontent.com).",
    zh: "Client ID 格式无效（必须包含 .apps.googleusercontent.com）。",
    ja: "Client IDの形式が正しくありません（.apps.googleusercontent.com を含む必要があります）。",
  },
  "error.invalidClientId": {
    ko: "Client ID가 올바르지 않습니다.",
    en: "Invalid Client ID.",
    fr: "Client ID invalide.",
    zh: "Client ID 无效。",
    ja: "Client IDが正しくありません。",
  },
  "error.invalidClientSecretFormat": {
    ko: "Client Secret 형식이 올바르지 않습니다 (GOCSPX- 로 시작 필요).",
    en: "Invalid Client Secret format (must start with GOCSPX-).",
    fr: "Format de Client Secret invalide (doit commencer par GOCSPX-).",
    zh: "Client Secret 格式无效（必须以 GOCSPX- 开头）。",
    ja: "Client Secretの形式が正しくありません（GOCSPX- で始まる必要があります）。",
  },
  "error.invalidClientSecret": {
    ko: "Client Secret이 올바르지 않습니다.",
    en: "Invalid Client Secret.",
    fr: "Client Secret invalide.",
    zh: "Client Secret 无效。",
    ja: "Client Secretが正しくありません。",
  },
  "error.connectionFailed": {
    ko: "연결 실패. 네트워크를 확인하세요.",
    en: "Connection failed. Check your network.",
    fr: "Échec de connexion. Vérifiez votre réseau.",
    zh: "连接失败，请检查网络。",
    ja: "接続に失敗しました。ネットワークを確認してください。",
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
