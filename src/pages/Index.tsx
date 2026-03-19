import { useState, useEffect, useRef, useCallback, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Download, AlertCircle, Loader2, Settings,
  RefreshCw, ArrowRightLeft, User,
} from "lucide-react";
import ChannelRow from "@/components/ChannelRow";
import MigrationProgress from "@/components/MigrationProgress";
import APIQuotaGauge from "@/components/APIQuotaGauge";
import BrandLogo from "@/components/BrandLogo";
import SettingsPopover from "@/components/SettingsPopover";
import { useI18n } from "@/hooks/use-i18n";
import type { ChannelStatus } from "@/components/StatusTag";

type View = "idle" | "subscriptions" | "transfer" | "migrating" | "done";

interface Account { token: string; email: string; name: string; picture: string; }
interface Sub { channelId: string; title: string; thumbnail: string; status: ChannelStatus; }

export default function Index() {
  const { t } = useI18n();

  // 저장된 테마 초기 적용
  useEffect(() => {
    const theme = localStorage.getItem("theme") || "dark";
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, []);

  const [configured, setConfigured] = useState<boolean | null>(null);
  const [account, setAccount] = useState<Account | null>(null);
  const [view, setView] = useState<View>("idle");

  const [subscriptions, setSubscriptions] = useState<Sub[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState<string | null>(null);

  const [loggingIn, setLoggingIn] = useState(false);
  const [fetching, setFetching] = useState(false);

  // 이전 관련
  const [destAccount, setDestAccount] = useState<Account | null>(null);
  const [loggingInDest, setLoggingInDest] = useState(false);
  const [migCurrent, setMigCurrent] = useState(0);
  const [migTotal, setMigTotal] = useState(0);
  const [quotaUsed, setQuotaUsed] = useState(0);
  const [quotaExceeded, setQuotaExceeded] = useState(false);
  const unsubRef = useRef<(() => void) | null>(null);

  // 설정 입력
  const [inputClientId, setInputClientId] = useState("");
  const [inputClientSecret, setInputClientSecret] = useState("");
  const [saving, setSaving] = useState(false);

  const migratedCount = subscriptions.filter((c) => c.status === "migrated").length;
  const failedCount = subscriptions.filter((c) => c.status === "failed").length;
  const quotaInserts = Math.floor(quotaUsed / 50);
  const DAILY_MAX = 200;

  // ── 초기 설정 확인 + 세션 복원 ──────────────────────────────────────────
  useEffect(() => {
    if (!window.electronAPI) {
      setError(t("error.preload"));
      setConfigured(false);
      return;
    }
    window.electronAPI.checkConfig()
      .then(async (r) => {
        setConfigured(r.configured);
        if (r.clientId) setInputClientId(r.clientId);
        if (r.clientSecret) setInputClientSecret(r.clientSecret);
        // 저장된 quota 로드 (날짜 다르면 자동 0)
        try {
          const q = await window.electronAPI.loadQuota();
          setQuotaUsed(q.inserts * 50);
        } catch { /* ignore */ }
        if (!r.configured) return;
        // 저장된 소스 세션 복원 시도
        try {
          const sess = await window.electronAPI.restoreSession("source");
          if (sess.ok && sess.token) {
            setAccount({ token: sess.token, email: sess.email!, name: sess.name!, picture: sess.picture! });
          }
        } catch { /* 세션 없으면 로그인 화면 표시 */ }
      })
      .catch(() => setConfigured(false));
  }, []);

  // ── 설정 저장 (유효성 검증 후) ───────────────────────────────────────────
  const handleSaveConfig = async (e: FormEvent) => {
    e.preventDefault();
    if (!inputClientId.trim() || !inputClientSecret.trim()) return;
    setSaving(true);
    setError(null);
    try {
      const check = await window.electronAPI.validateConfig(inputClientId.trim(), inputClientSecret.trim());
      if (!check.valid) {
        setError(check.reason ?? t("error.invalidCredentials"));
        return;
      }
      await window.electronAPI.saveConfig(inputClientId.trim(), inputClientSecret.trim());
      setConfigured(true);
    } catch {
      setError(t("settings.saveFail"));
    } finally {
      setSaving(false);
    }
  };

  // ── 메인 로그인 (소스 계정) ──────────────────────────────────────────────
  const handleLogin = async () => {
    setError(null);
    setLoggingIn(true);
    try {
      const acc = await window.electronAPI.loginSource();
      setAccount(acc);
    } catch (e) {
      setError(e instanceof Error ? e.message : t("login.failed"));
    } finally {
      setLoggingIn(false);
    }
  };

  const handleLogout = () => {
    window.electronAPI.clearSession("source").catch(() => {});
    window.electronAPI.clearSession("dest").catch(() => {});
    setAccount(null);
    setSubscriptions([]);
    setSelectedIds(new Set());
    setDestAccount(null);
    setView("idle");
    setError(null);
  };

  // ── 구독 목록 불러오기 ───────────────────────────────────────────────────
  const handleFetchSubs = async () => {
    if (!account) return;
    setError(null);
    setFetching(true);
    try {
      const result = await window.electronAPI.fetchSubscriptions(account.token);
      if (result.error) throw new Error(result.error);
      const subs = result.subscriptions.map((s) => ({ ...s, status: "pending" as ChannelStatus }));
      setSubscriptions(subs);
      setSelectedIds(new Set(subs.map((s) => s.channelId)));
      setView("subscriptions");
    } catch (e) {
      setError(e instanceof Error ? e.message : t("subs.fetchFail"));
    } finally {
      setFetching(false);
    }
  };

  // ── 대상 계정 로그인 ─────────────────────────────────────────────────────
  const handleDestLogin = async () => {
    setError(null);
    setLoggingInDest(true);
    try {
      const acc = await window.electronAPI.loginDest();
      if (acc.email === account?.email) {
        throw new Error(t("transfer.sameAccount"));
      }
      setDestAccount(acc);
    } catch (e) {
      setError(e instanceof Error ? e.message : t("transfer.destLoginFail"));
    } finally {
      setLoggingInDest(false);
    }
  };

  // ── 선택 토글 ────────────────────────────────────────────────────────────
  const toggleSelect = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  const filtered = subscriptions.filter((c) =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectAll = () => {
    setSelectedIds(
      selectedIds.size === filtered.length
        ? new Set()
        : new Set(filtered.map((c) => c.channelId))
    );
  };

  // ── 이전 시작 ────────────────────────────────────────────────────────────
  const startMigration = async () => {
    if (!destAccount || selectedIds.size === 0) return;
    setError(null);

    // 대상 계정의 기존 구독 조회 → 이미 구독된 채널 사전 필터링
    let newChannelIds: string[];
    try {
      const destSubs = await window.electronAPI.fetchSubscriptions(destAccount.token);
      const existingIds = new Set(destSubs.subscriptions.map((s) => s.channelId));
      newChannelIds = Array.from(selectedIds).filter((id) => !existingIds.has(id));

      // 이미 구독된 채널은 즉시 완료 처리
      const alreadyIds = Array.from(selectedIds).filter((id) => existingIds.has(id));
      if (alreadyIds.length > 0) {
        setSubscriptions((prev) =>
          prev.map((s) => alreadyIds.includes(s.channelId) ? { ...s, status: "migrated" as ChannelStatus } : s)
        );
      }
    } catch {
      // 조회 실패 시 전체 시도
      newChannelIds = Array.from(selectedIds);
    }

    if (newChannelIds.length === 0) {
      setError(t("transfer.allAlready"));
      setSubscriptions((prev) =>
        prev.map((s) => selectedIds.has(s.channelId) ? { ...s, status: "migrated" as ChannelStatus } : s)
      );
      setView("done");
      return;
    }

    setView("migrating");
    setMigCurrent(0);
    setMigTotal(newChannelIds.length);
    setQuotaUsed(0);
    setQuotaExceeded(false);

    const idSet = new Set(newChannelIds);
    setSubscriptions((prev) =>
      prev.map((s) => ({ ...s, status: idSet.has(s.channelId) ? ("pending" as ChannelStatus) : s.status }))
    );

    unsubRef.current = window.electronAPI.onMigrateProgress((data) => {
      const status: ChannelStatus =
        data.result === "ok" || data.result === "already" ? "migrated" : "failed";
      setSubscriptions((prev) =>
        prev.map((s) => s.channelId === data.channelId ? { ...s, status } : s)
      );
      setMigCurrent(data.current);
      if (data.result === "ok") {
        setQuotaUsed((q) => q + 50);
        window.electronAPI.addQuota(1).catch(() => {});
      }
      if (data.quotaExceeded) {
        setQuotaExceeded(true);
        setError(t("transfer.quotaExceeded"));
      }
    });

    try {
      await window.electronAPI.startMigration(destAccount.token, newChannelIds);
    } catch (e) {
      setError(e instanceof Error ? e.message : t("transfer.error"));
    } finally {
      unsubRef.current?.();
      setView("done");
    }
  };

  // ── JSON 내보내기 ────────────────────────────────────────────────────────
  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(subscriptions, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "subscriptions.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  // ══════════════════════════════════════════════════════════════════════════
  // 설정 화면
  // ══════════════════════════════════════════════════════════════════════════
  if (configured === false) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="max-w-lg w-full bg-card border border-border rounded-lg p-6 space-y-5">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-muted-foreground" />
            <h2 className="font-semibold text-foreground">{t("settings.title")}</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            {t("settings.description")}
          </p>
          <ol className="text-xs text-muted-foreground space-y-1 list-decimal list-inside">
            <li>{t("settings.step1")}</li>
            <li>{t("settings.step2")}</li>
            <li>{t("settings.step3")}</li>
            <li>{t("settings.step4_pre")}<strong>{t("settings.step4_bold")}</strong>)</li>
          </ol>
          <form onSubmit={handleSaveConfig} className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Client ID</label>
              <input
                type="text"
                value={inputClientId}
                onChange={(e) => setInputClientId(e.target.value)}
                placeholder="xxxx.apps.googleusercontent.com"
                className="w-full px-3 py-2 bg-secondary border border-border rounded-md text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Client Secret</label>
              <input
                type="password"
                value={inputClientSecret}
                onChange={(e) => setInputClientSecret(e.target.value)}
                placeholder="GOCSPX-..."
                className="w-full px-3 py-2 bg-secondary border border-border rounded-md text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>
            {error && <p className="text-xs text-destructive">{error}</p>}
            <button
              type="submit"
              disabled={saving || !inputClientId.trim() || !inputClientSecret.trim()}
              className="w-full px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {saving ? t("settings.saving") : t("settings.saveBtn")}
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (configured === null) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════════════════
  // 로그인 화면
  // ══════════════════════════════════════════════════════════════════════════
  if (!account) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-primary/5 to-background z-0 pointer-events-none" />
        
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-sm w-full text-center space-y-8 z-10"
        >
          <div className="flex flex-col items-center">
            <BrandLogo size={64} showText={false} />
            <div className="mt-4">
              <h1 className="text-3xl font-black tracking-tight text-foreground uppercase">9dok<span className="text-primary">24</span></h1>
              <p className="text-xs font-bold text-muted-foreground tracking-widest uppercase opacity-70">{t("login.subtitle")}</p>
            </div>
          </div>
          
          <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
            {t("login.description")}
          </p>

          {error && (
            <div className="flex items-start gap-2 p-3 bg-destructive/10 border border-destructive/30 rounded-md text-left">
              <AlertCircle className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          <div className="space-y-3">
            {loggingIn ? (
              <div className="space-y-2">
                <div className="w-full py-3 px-4 rounded-xl bg-primary/80 text-primary-foreground text-sm font-bold flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" /> {t("login.loggingIn")}
                </div>
                <button
                  onClick={() => { setLoggingIn(false); setError(t("login.cancelled")); }}
                  className="w-full py-2 px-4 rounded-xl border border-border bg-secondary hover:bg-muted text-sm text-muted-foreground transition-colors"
                >
                  {t("login.cancel")}
                </button>
              </div>
            ) : (
              <button
                onClick={handleLogin}
                className="w-full py-4 px-4 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:shadow-lg hover:shadow-primary/20 transition-all flex items-center justify-center gap-2"
              >
                {t("login.button")}
              </button>
            )}
            
            <button
              onClick={() => setConfigured(false)}
              className="w-full py-2 text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center gap-1"
            >
              <Settings className="w-3 h-3" /> {t("login.apiSettings")}
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════════════════
  // 메인 대시보드 (로그인 완료)
  // ══════════════════════════════════════════════════════════════════════════
  const canTransfer = subscriptions.length > 0 && view !== "migrating";
  const isTransferView = view === "transfer" || view === "migrating" || view === "done";

  return (
    <div className="min-h-screen bg-background">
      {/* 헤더 */}
      <header className="border-b border-border bg-card/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <BrandLogo size={32} />
          
          <div className="flex items-center gap-3">
            <APIQuotaGauge used={quotaInserts} total={DAILY_MAX} />
            <div className="flex items-center gap-2 pl-3 border-l border-border">
              <div className="w-8 h-8 rounded-full bg-secondary border-2 border-primary/20 overflow-hidden shadow-inner">
                {account.picture ? (
                  <img src={account.picture} alt="" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-4 h-4 text-muted-foreground m-auto mt-1.5" />
                )}
              </div>
              <div className="hidden sm:flex flex-col">
                <span className="text-[10px] font-bold text-muted-foreground uppercase leading-none mb-1">{t("header.sourceAccount")}</span>
                <span className="text-xs font-semibold text-foreground leading-none">{account.email}</span>
              </div>
              <SettingsPopover
                onApiSettings={() => { handleLogout(); setConfigured(false); }}
                onLogout={handleLogout}
              />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* 에러 */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="flex items-start gap-2 p-4 bg-destructive/10 border border-destructive/20 rounded-xl"
            >
              <AlertCircle className="w-4 h-4 text-destructive mt-0.5 flex-shrink-0" />
              <p className="text-sm text-destructive font-medium">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 액션 버튼 */}
        <div className="flex gap-3">
          <button
            onClick={handleFetchSubs}
            disabled={fetching || view === "migrating"}
            className="flex items-center gap-2 px-5 py-3 rounded-xl border border-border bg-card hover:bg-secondary text-sm font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
          >
            {fetching ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
            {fetching ? t("action.fetching") : subscriptions.length > 0 ? t("action.refreshSubs") : t("action.fetchSubs")}
          </button>
          {canTransfer && (
            <button
              onClick={() => setView("transfer")}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-95"
            >
              <ArrowRightLeft className="w-4 h-4" />
              {t("action.transfer")}
            </button>
          )}
        </div>

        {/* 이전 패널 */}
        <AnimatePresence>
          {isTransferView && (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="border border-border rounded-2xl bg-card p-6 space-y-6 shadow-xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-rose-600" />
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">{t("transfer.destTitle")}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{t("transfer.destDesc")}</p>
                </div>
                {view === "transfer" && destAccount && (
                  <button
                    onClick={startMigration}
                    disabled={selectedIds.size === 0}
                    className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:shadow-lg hover:shadow-primary/20 transition-all disabled:opacity-40"
                  >
                    {t("transfer.start")} ({selectedIds.size})
                  </button>
                )}
              </div>

              {!destAccount ? (
                <button
                  onClick={handleDestLogin}
                  disabled={loggingInDest}
                  className="w-full py-4 px-4 rounded-xl border-2 border-dashed border-border bg-secondary/50 hover:bg-secondary hover:border-primary/50 text-sm font-bold transition-all disabled:opacity-60 flex items-center justify-center gap-2 group"
                >
                  {loggingInDest ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> {t("transfer.destLoggingIn")}</>
                  ) : (
                    <><User className="w-4 h-4 group-hover:text-primary transition-colors" /> {t("transfer.destLogin")}</>
                  )}
                </button>
              ) : (
                <div className="flex items-center gap-4 p-4 rounded-xl bg-secondary/30 border border-border">
                  <div className="w-12 h-12 rounded-full bg-primary/10 border-2 border-primary/20 overflow-hidden shadow-inner flex-shrink-0">
                    {destAccount.picture ? (
                      <img src={destAccount.picture} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-6 h-6 text-primary m-auto mt-2.5 opacity-50" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-foreground truncate">{destAccount.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{destAccount.email}</p>
                  </div>
                  {view === "transfer" && (
                    <button 
                      onClick={() => setDestAccount(null)}
                      className="text-xs font-bold text-muted-foreground hover:text-destructive px-2 py-1 transition-colors"
                    >
                      {t("transfer.change")}
                    </button>
                  )}
                </div>
              )}

              {/* 이전 진행 */}
              {(view === "migrating" || view === "done") && (
                <MigrationProgress
                  current={migCurrent}
                  total={migTotal}
                  isActive={view === "migrating"}
                  apiRemaining={DAILY_MAX - quotaInserts}
                  failedCount={failedCount}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* 구독 목록 */}
        {subscriptions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="border border-border rounded-2xl bg-card shadow-lg overflow-hidden flex flex-col"
          >
            <div className="flex items-center gap-3 px-5 py-4 border-b border-border bg-card/80 backdrop-blur-sm">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder={t("subs.search")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-secondary/50 border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all"
                />
              </div>
              {(view === "subscriptions" || view === "transfer") && (
                <button
                  onClick={selectAll}
                  className="px-4 py-2 text-xs font-bold text-muted-foreground hover:text-foreground border border-border rounded-xl bg-secondary/50 hover:bg-secondary transition-all whitespace-nowrap"
                >
                  {selectedIds.size === filtered.length ? t("subs.deselectAll") : t("subs.selectAll")}
                </button>
              )}
              <button
                onClick={exportJSON}
                className="p-2.5 text-muted-foreground hover:text-foreground border border-border rounded-xl bg-secondary/50 hover:bg-secondary transition-all"
                title="JSON 내보내기"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>

            <div className="max-h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-border">
              {filtered.map((ch, i) => (
                <ChannelRow
                  key={ch.channelId}
                  channel={{ id: ch.channelId, name: ch.title, avatar: ch.thumbnail, category: "", status: ch.status }}
                  selected={selectedIds.has(ch.channelId)}
                  onToggle={view === "migrating" || view === "done" ? () => {} : toggleSelect}
                  index={i}
                />
              ))}
              {filtered.length === 0 && (
                <div className="py-20 text-center">
                  <Search className="w-12 h-12 text-muted-foreground/20 mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">{t("subs.noResults")}</p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-secondary/20">
              <div className="flex items-center gap-4">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-tight font-mono tabular-nums">
                  {subscriptions.length}{t("subs.channels")}
                </p>
                {selectedIds.size > 0 && selectedIds.size < subscriptions.length && (
                  <p className="text-xs font-bold text-primary uppercase tracking-tight font-mono tabular-nums">
                    {selectedIds.size}{t("subs.selected")}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-4 font-mono tabular-nums">
                {migratedCount > 0 && (
                  <div className="flex items-center gap-1.5 text-xs font-bold text-success uppercase">
                    <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                    {migratedCount}{t("subs.done")}
                  </div>
                )}
                {failedCount > 0 && (
                  <div className="flex items-center gap-1.5 text-xs font-bold text-destructive uppercase">
                    <div className="w-1.5 h-1.5 rounded-full bg-destructive" />
                    {failedCount}{t("subs.failed")}
                  </div>
                )}
                {quotaExceeded && (
                  <div className="flex items-center gap-1.5 text-xs font-bold text-warning uppercase">
                    <AlertCircle className="w-3 h-3" />
                    {t("subs.quotaExceeded")}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
