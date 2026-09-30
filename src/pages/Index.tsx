/*
  DIRECTION CONTRACT — 9dok24 redesign (2026-08-21)
  THESIS: 배치 이전 계측기. 채널 원장(ledger)이 곧 인터페이스다 — 마케팅 카드 대시보드를 거부한다.
  OWN-WORLD: 종이빛 차가운 그라운드 위 흰 패널과 1px 헤어라인, 잉크 전경, 단 하나의 코발트 액센트가
    실행·선택·포커스·계측을 전담. Pretendard가 말하고 JetBrains Mono가 모든 수치와 ID를 센다.
    6px 라디우스, 세그먼트 할당량 미터, 점-인디케이터 상태.
  STORY: 켜면 내 채널 원장이 즉시 보인다 → 받을 계정을 연결한다 → 실행을 누른다 → 행들이 완료로 가라앉는다.
  FIRST VIEWPORT: 48px 상단바(워드마크·소스 칩·할당량 미터·설정) / 컨트롤 스트립(대상 계정 + 실행) /
    남은 높이를 채우는 밀도 있는 원장 / 하단 상태바(전체·선택·완료·실패 카운트).
  FORM: 사용자 지정 방향(프로 도구 정밀 계측, 라이트 기본) — seed roll 없음(user-pinned).
  FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review,
    the verdict, DESIGN.md, and every shipping raster carrying its provenance.
*/
import { useState, useEffect, useRef, useCallback, ChangeEvent, FormEvent, DragEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Download, Save, AlertCircle, Loader2, Settings,
  ArrowRightLeft, User, Upload, FileSpreadsheet, Plus, X,
} from "lucide-react";
import ChannelRow from "@/components/ChannelRow";
import MigrationProgress from "@/components/MigrationProgress";
import APIQuotaGauge from "@/components/APIQuotaGauge";
import BrandLogo from "@/components/BrandLogo";
import SettingsPopover from "@/components/SettingsPopover";
import { useI18n } from "@/hooks/use-i18n";
import type { ChannelStatus } from "@/components/StatusTag";
import { parseSubscriptionsCsv, toSubscriptionsCsv } from "@/lib/subscriptions-csv";

type View = "idle" | "subscriptions" | "transfer" | "migrating" | "done";
interface Account { token: string; email: string; name: string; picture: string; }
interface Sub { channelId: string; title: string; thumbnail: string; status: ChannelStatus; }

function useMapError() {
  const { t } = useI18n();
  return (e: unknown): string => {
    const msg = e instanceof Error ? e.message : "";
    if (msg === "error:accountSuspended") return t("error.accountSuspended");
    return msg || t("transfer.error");
  };
}

// 백엔드가 반환하는 error:xxx 코드를 번역. 매핑되지 않으면 원문 반환.
const ERROR_CODE_KEYS = [
  "error.invalidClientIdFormat", "error.invalidClientId",
  "error.invalidClientSecretFormat", "error.invalidClientSecret",
  "error.connectionFailed", "error.invalidCredentials",
] as const;

function useMapReason() {
  const { t } = useI18n();
  return (reason?: string): string => {
    if (reason && (ERROR_CODE_KEYS as readonly string[]).includes(reason)) {
      return t(reason as (typeof ERROR_CODE_KEYS)[number]);
    }
    return reason ?? t("error.invalidCredentials");
  };
}

export default function Index() {
  const { t } = useI18n();
  const mapError = useMapError();
  const mapReason = useMapReason();

  // 저장된 테마 초기 적용 (라이트 기본)
  useEffect(() => {
    const theme = localStorage.getItem("theme") || "light";
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, []);

  const [configured, setConfigured] = useState<boolean | null>(null);
  const [sourceName, setSourceName] = useState("");
  const [view, setView] = useState<View>("idle");

  const [subscriptions, setSubscriptions] = useState<Sub[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState<string | null>(null);

  const [importingCsv, setImportingCsv] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const csvInputRef = useRef<HTMLInputElement>(null);

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
  // quotaUsed 는 항상 inserts(횟수) 단위로 통일. 표시 시 ×50 units 로 환산.
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
          setQuotaUsed(q.inserts);
        } catch { /* ignore */ }
        // 저장된 구독 목록 복원 — CSV를 다시 고를 필요 없이 이어서 진행
        try {
          const saved = await window.electronAPI.loadImportState();
          if (saved?.subscriptions && saved.subscriptions.length > 0) {
            const subs = saved.subscriptions.map((s) => ({
              channelId: s.channelId,
              title: s.title,
              thumbnail: s.thumbnail ?? "",
              status: (s.status ?? "pending") as ChannelStatus,
            }));
            setSourceName(saved.sourceName || "저장된 목록");
            setSubscriptions(subs);
            setSelectedIds(new Set(
              subs
                .filter((s) => s.status !== "migrated" && s.status !== "skipped")
                .map((s) => s.channelId)
            ));
            setView("transfer");
          }
        } catch { /* ignore */ }
      })
      .catch(() => setConfigured(false));
  }, [t]);

  // 구독 목록/상태가 바뀌면 자동 저장 (연속 변경은 400ms 디바운스)
  useEffect(() => {
    if (!window.electronAPI) return;
    if (subscriptions.length === 0) {
      // 목록이 있었는데 전부 삭제된 경우 저장 파일도 비운다 (초기 마운트는 sourceName이 없어 제외)
      if (sourceName) window.electronAPI.clearImportState().catch(() => {});
      return;
    }
    const id = setTimeout(() => {
      window.electronAPI.saveImportState({
        sourceName,
        subscriptions: subscriptions.map(({ channelId, title, thumbnail, status }) => ({
          channelId, title, thumbnail, status,
        })),
      }).catch(() => {});
    }, 400);
    return () => clearTimeout(id);
  }, [subscriptions, sourceName]);

  // ── 설정 저장 (유효성 검증 후) ───────────────────────────────────────────
  const handleSaveConfig = async (e: FormEvent) => {
    e.preventDefault();
    if (!inputClientId.trim() || !inputClientSecret.trim()) return;
    setSaving(true);
    setError(null);
    try {
      const check = await window.electronAPI.validateConfig(inputClientId.trim(), inputClientSecret.trim());
      if (!check.valid) {
        setError(mapReason(check.reason));
        return;
      }
      await window.electronAPI.saveConfig(inputClientId.trim(), inputClientSecret.trim());
      setQuotaUsed(0);
      setConfigured(true);
    } catch {
      setError(t("settings.saveFail"));
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    window.electronAPI.clearSession().catch(() => {});
    setSourceName("");
    setSubscriptions([]);
    setSelectedIds(new Set());
    setDestAccount(null);
    setView("idle");
    setError(null);
  };

  // CSV 파일 처리 — 파일선택과 드래그&드롭이 공유
  const importCsvFile = async (file: File) => {
    setImportingCsv(true);
    setError(null);
    try {
      const result = parseSubscriptionsCsv(await file.text());
      const subs = result.subscriptions.map((subscription) => ({
        ...subscription,
        thumbnail: "",
        status: "pending" as ChannelStatus,
      }));

      setSourceName(file.name);
      setSubscriptions(subs);
      setSelectedIds(new Set(subs.map((subscription) => subscription.channelId)));
      setDestAccount(null);
      setSearchQuery("");
      setView("transfer");
    } catch (e) {
      const reason = e instanceof Error ? e.message : "";
      if (reason === "csv:empty") setError(t("csv.errorEmpty"));
      else if (reason === "csv:missingChannelId") setError(t("csv.errorHeader"));
      else setError(t("csv.errorInvalid"));
    } finally {
      setImportingCsv(false);
    }
  };

  const handleImportCsv = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (file) importCsvFile(file);
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) importCsvFile(file);
  };

  // ── 썸네일/제목 채우기 (CSV·수동 추가 채널은 로그인 토큰으로 보완) ──────
  useEffect(() => {
    if (!destAccount) return;
    const missing = subscriptions
      .filter((s) => !s.thumbnail || s.title === s.channelId)
      .map((s) => s.channelId);
    if (missing.length === 0) return;

    let cancelled = false;
    window.electronAPI
      .fetchChannelThumbnails(destAccount.token, missing)
      .then(({ thumbnails, titles }) => {
        if (cancelled) return;
        if (Object.keys(thumbnails).length === 0 && Object.keys(titles).length === 0) return;
        setSubscriptions((prev) =>
          prev.map((s) => ({
            ...s,
            thumbnail: s.thumbnail || thumbnails[s.channelId] || "",
            title: s.title === s.channelId && titles[s.channelId] ? titles[s.channelId] : s.title,
          }))
        );
      })
      .catch(() => { /* 부가 정보 — 실패해도 무시 */ });
    return () => { cancelled = true; };
    // subscriptions 변경마다 재실행하지 않도록 destAccount 기준으로만 트리거
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [destAccount]);

  // ── 목록 편집 (로그인 불필요) ────────────────────────────────────────────
  const [addInput, setAddInput] = useState("");

  const removeChannel = useCallback((id: string) => {
    setSubscriptions((prev) => prev.filter((s) => s.channelId !== id));
    setSelectedIds((prev) => {
      if (!prev.has(id)) return prev;
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }, []);

  const handleAddChannel = () => {
    const match = addInput.match(/UC[A-Za-z0-9_-]{22}/);
    if (!match) {
      setError(t("subs.addInvalid"));
      return;
    }
    const channelId = match[0];
    if (subscriptions.some((s) => s.channelId === channelId)) {
      setError(t("subs.addDuplicate"));
      return;
    }
    setError(null);
    // 제목은 일단 ID로 두고, 로그인하면 API로 실제 제목/썸네일이 채워진다
    setSubscriptions((prev) => [
      { channelId, title: channelId, thumbnail: "", status: "pending" as ChannelStatus },
      ...prev,
    ]);
    setSelectedIds((prev) => new Set(prev).add(channelId));
    setAddInput("");
  };

  // ── 대상 계정 로그인 ─────────────────────────────────────────────────────
  const handleDestLogin = async () => {
    setError(null);
    setLoggingInDest(true);
    try {
      const acc = await window.electronAPI.loginDest();
      setDestAccount(acc);
    } catch (e) {
      // 사용자가 직접 취소한 경우는 에러로 취급하지 않음
      if (!(e instanceof Error && e.message.includes("error:cancelled"))) {
        setError(mapError(e));
      }
    } finally {
      setLoggingInDest(false);
    }
  };

  // ── 선택 토글 ────────────────────────────────────────────────────────────
  const toggleSelect = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
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
          prev.map((s) => alreadyIds.includes(s.channelId) ? { ...s, status: "skipped" as ChannelStatus } : s)
        );
      }
    } catch {
      // 중복 확인에 실패하면 구독 쓰기 요청을 보내지 않는다.
      setError(t("transfer.precheckFailed"));
      return;
    }

    if (newChannelIds.length === 0) {
      setError(t("transfer.allAlready"));
      setSubscriptions((prev) =>
        prev.map((s) => selectedIds.has(s.channelId) ? { ...s, status: "skipped" as ChannelStatus } : s)
      );
      setView("done");
      return;
    }

    const latestQuota = await window.electronAPI.loadQuota();
    const remainingCapacity = Math.max(0, DAILY_MAX - latestQuota.inserts);
    setQuotaUsed(latestQuota.inserts);
    if (remainingCapacity === 0) {
      setQuotaExceeded(true);
      setError(t("transfer.quotaExceeded"));
      return;
    }

    const queuedChannelIds = newChannelIds.slice(0, remainingCapacity);
    const deferredCount = newChannelIds.length - queuedChannelIds.length;

    setView("migrating");
    setMigCurrent(0);
    setMigTotal(queuedChannelIds.length);
    setQuotaExceeded(false);

    const idSet = new Set(queuedChannelIds);
    setSubscriptions((prev) =>
      prev.map((s) => ({ ...s, status: idSet.has(s.channelId) ? ("pending" as ChannelStatus) : s.status }))
    );

    let stoppedEarly = false;
    unsubRef.current = window.electronAPI.onMigrateProgress((data) => {
      if (data.stopped) stoppedEarly = true;
      const status: ChannelStatus =
        data.result === "ok" ? "migrated" : data.result === "already" ? "skipped" : "failed";
      if (data.result === "accountSuspended") {
        setError(t("error.accountSuspended"));
      }
      if (data.result === "restricted") {
        setError(t("transfer.subscriptionRestricted"));
      }
      setSubscriptions((prev) =>
        prev.map((s) => s.channelId === data.channelId ? { ...s, status } : s)
      );
      setMigCurrent(data.current);
      if (data.result === "ok") {
        setQuotaUsed((q) => q + 1);
        window.electronAPI.addQuota(1).catch(() => {});
      }
      if (data.quotaExceeded) {
        setQuotaExceeded(true);
        setQuotaUsed(DAILY_MAX);
        window.electronAPI.setQuota(DAILY_MAX).catch(() => {});
        setError(t("transfer.quotaExceeded"));
      }
    });

    try {
      await window.electronAPI.startMigration(destAccount.token, queuedChannelIds);
      if (deferredCount > 0 && !stoppedEarly) {
        setQuotaExceeded(true);
        setError(t("transfer.quotaExceeded"));
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : t("transfer.error"));
    } finally {
      unsubRef.current?.();
      setView("done");
    }
  };

  // ── 파일 내보내기 ────────────────────────────────────────────────────────
  const downloadFile = (filename: string, content: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportJSON = () => {
    downloadFile("subscriptions.json", JSON.stringify(subscriptions, null, 2), "application/json");
  };

  // 편집(추가/제거) 결과를 Takeout 형식 CSV로 저장 — 저장한 파일은 다시 가져오기로 복원 가능
  const saveListCsv = () => {
    const base = sourceName.replace(/\.[^.]+$/, "") || "subscriptions";
    const csv = toSubscriptionsCsv(
      subscriptions.map(({ channelId, title }) => ({ channelId, title }))
    );
    downloadFile(`${base}-9dok24.csv`, csv, "text/csv;charset=utf-8");
  };

  // ══════════════════════════════════════════════════════════════════════════
  // 설정 화면
  // ══════════════════════════════════════════════════════════════════════════
  if (configured === false) {
    return (
      <div className="h-screen bg-background flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="mb-6">
            <BrandLogo size={28} />
          </div>

          <div className="bg-card border border-border rounded-lg shadow-card overflow-hidden">
            <div className="px-6 pt-5 pb-4 border-b border-border">
              <h1 className="text-[15px] font-semibold text-foreground">{t("settings.title")}</h1>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{t("settings.description")}</p>
            </div>

            <ol className="px-6 py-4 space-y-2 border-b border-border bg-secondary/40">
              {[t("settings.step1"), t("settings.step2"), t("settings.step3")].map((step, i) => (
                <li key={i} className="flex items-start gap-2.5 text-xs text-secondary-foreground">
                  <span className="font-mono text-[10px] font-semibold text-muted-foreground w-3 text-right flex-none leading-[1.6]">{i + 1}</span>
                  {step}
                </li>
              ))}
              <li className="flex items-start gap-2.5 text-xs text-secondary-foreground">
                <span className="font-mono text-[10px] font-semibold text-muted-foreground w-3 text-right flex-none leading-[1.6]">4</span>
                <span>{t("settings.step4_pre")}<strong className="font-semibold text-foreground">{t("settings.step4_bold")}</strong>)</span>
              </li>
            </ol>

            <form onSubmit={handleSaveConfig} className="px-6 py-5 space-y-4">
              <div>
                <label htmlFor="client-id" className="block text-xs font-medium text-foreground mb-1.5">Client ID</label>
                <input
                  id="client-id"
                  type="text"
                  value={inputClientId}
                  onChange={(e) => setInputClientId(e.target.value)}
                  placeholder="xxxx.apps.googleusercontent.com"
                  className="w-full px-3 py-2 bg-card border border-input rounded-md font-mono text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-ring focus:ring-2 focus:ring-ring/15 transition-shadow"
                />
              </div>
              <div>
                <label htmlFor="client-secret" className="block text-xs font-medium text-foreground mb-1.5">Client Secret</label>
                <input
                  id="client-secret"
                  type="password"
                  value={inputClientSecret}
                  onChange={(e) => setInputClientSecret(e.target.value)}
                  placeholder="GOCSPX-…"
                  className="w-full px-3 py-2 bg-card border border-input rounded-md font-mono text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-ring focus:ring-2 focus:ring-ring/15 transition-shadow"
                />
              </div>
              {error && (
                <p className="flex items-start gap-1.5 text-xs text-destructive">
                  <AlertCircle className="w-3.5 h-3.5 mt-px flex-none" />{error}
                </p>
              )}
              <button
                type="submit"
                disabled={saving || !inputClientId.trim() || !inputClientSecret.trim()}
                className="w-full h-9 rounded-md bg-primary text-primary-foreground text-[13px] font-semibold hover:bg-primary/90 active:bg-primary/95 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                {saving ? t("settings.saving") : t("settings.saveBtn")}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  if (configured === null) {
    return (
      <div className="h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════════════════
  // 인테이크 화면 (목록 없음) — CSV를 놓는 곳
  // ══════════════════════════════════════════════════════════════════════════
  if (!sourceName) {
    return (
      <div className="h-screen bg-background flex flex-col">
        <header className="h-12 flex-none border-b border-border bg-card flex items-center justify-between px-4">
          <BrandLogo size={22} />
          <button
            onClick={() => setConfigured(false)}
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground px-2 py-1.5 rounded-md hover:bg-secondary transition-colors"
          >
            <Settings className="w-3.5 h-3.5" /> {t("login.apiSettings")}
          </button>
        </header>

        <div className="flex-1 grid place-items-center p-8">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: [0.2, 0, 0, 1] }}
            className="w-full max-w-md"
          >
            <h1 className="text-lg font-semibold text-foreground tracking-tight">{t("csv.landingSubtitle")}</h1>
            <p className="text-[13px] text-muted-foreground mt-1.5 mb-5 leading-relaxed whitespace-pre-line">
              {t("csv.landingDescription")}
            </p>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="flex items-start gap-2 px-3 py-2.5 mb-4 bg-destructive/8 border border-destructive/25 rounded-md">
                    <AlertCircle className="w-4 h-4 text-destructive mt-px flex-none" />
                    <p className="text-xs text-destructive leading-relaxed">{error}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <input
              ref={csvInputRef}
              type="file"
              accept=".csv,text/csv"
              className="hidden"
              onChange={handleImportCsv}
            />
            <button
              onClick={() => csvInputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              disabled={importingCsv}
              className={`w-full h-36 rounded-lg border transition-all duration-150 grid place-content-center gap-2 text-center group ${
                dragOver
                  ? "border-primary bg-accent border-solid"
                  : "border-dashed border-input bg-card hover:border-primary/50 hover:bg-accent/40"
              } disabled:opacity-50`}
            >
              <span className={`mx-auto grid place-content-center w-10 h-10 rounded-md transition-colors ${dragOver ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground group-hover:text-primary"}`}>
                {importingCsv ? <Loader2 className="w-5 h-5 animate-spin" /> : <FileSpreadsheet className="w-5 h-5" />}
              </span>
              <span className="text-[13px] font-medium text-foreground">
                {importingCsv ? t("csv.importing") : t("csv.import")}
              </span>
              <span className="font-mono text-[10px] text-muted-foreground">구독정보.csv · subscriptions.csv</span>
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  // ══════════════════════════════════════════════════════════════════════════
  // 콘솔 (원장 + 컨트롤)
  // ══════════════════════════════════════════════════════════════════════════
  const isMigrating = view === "migrating";

  return (
    <div className="h-screen bg-background flex flex-col">
      {/* 상단바 — 워드마크 · 소스 칩 · 할당량 미터 · 설정 */}
      <header className="h-12 flex-none border-b border-border bg-card flex items-center gap-3 px-4 z-40">
        <BrandLogo size={22} />

        <span className="w-px h-4 bg-border" />

        <div className="flex items-center gap-1.5 min-w-0" title={sourceName}>
          <FileSpreadsheet className="w-3.5 h-3.5 text-muted-foreground flex-none" />
          <span className="text-xs font-medium text-foreground truncate max-w-44">{sourceName}</span>
          <span className="font-mono text-[10px] text-muted-foreground tabular-nums flex-none">
            {subscriptions.length}
          </span>
        </div>

        <div className="flex-1" />

        <APIQuotaGauge used={quotaUsed} total={DAILY_MAX} />

        <span className="w-px h-4 bg-border" />

        <SettingsPopover
          onApiSettings={() => { handleLogout(); setConfigured(false); }}
          onLogout={() => {
            // 초기화 시 저장된 구독 목록도 함께 삭제
            window.electronAPI.clearImportState().catch(() => {});
            handleLogout();
          }}
        />
      </header>

      {/* 에러 스트립 */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="flex-none overflow-hidden bg-destructive/8 border-b border-destructive/25"
          >
            <div className="flex items-center gap-2 px-4 py-2">
              <AlertCircle className="w-3.5 h-3.5 text-destructive flex-none" />
              <p className="text-xs text-destructive font-medium flex-1">{error}</p>
              <button
                onClick={() => setError(null)}
                className="p-0.5 rounded text-destructive/60 hover:text-destructive hover:bg-destructive/10 transition-colors"
                aria-label={t("login.cancel")}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-1 min-h-0 flex flex-col gap-3 p-4 max-w-5xl w-full mx-auto">
        {/* 컨트롤 스트립 — 대상 계정 + 실행 (이전 중엔 진행 레일로 전환) */}
        <section className="flex-none bg-card border border-border rounded-lg shadow-card px-4 py-3">
          {(view === "migrating" || view === "done") ? (
            <div className="space-y-3">
              <MigrationProgress
                current={migCurrent}
                total={migTotal}
                isActive={isMigrating}
                quotaUsed={quotaUsed}
                quotaMax={DAILY_MAX}
                failedCount={failedCount}
              />
              {view === "done" && (
                <button
                  onClick={() => setView("transfer")}
                  className="h-8 px-3.5 rounded-md border border-border bg-card text-xs font-semibold text-foreground hover:bg-secondary transition-colors inline-flex items-center gap-1.5"
                >
                  <ArrowRightLeft className="w-3.5 h-3.5" />
                  {t("action.transfer")}
                </button>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex-1 min-w-56">
                {!destAccount ? (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleDestLogin}
                      disabled={loggingInDest}
                      className="h-9 px-4 rounded-md border border-input bg-card text-[13px] font-medium text-foreground hover:border-primary/50 hover:bg-accent/40 transition-colors disabled:opacity-60 inline-flex items-center gap-2"
                    >
                      {loggingInDest
                        ? <><Loader2 className="w-4 h-4 animate-spin text-primary" /> {t("transfer.destLoggingIn")}</>
                        : <><User className="w-4 h-4 text-muted-foreground" /> {t("csv.destinationLogin")}</>}
                    </button>
                    {loggingInDest && (
                      <button
                        onClick={() => window.electronAPI.cancelLogin().catch(() => {})}
                        className="h-9 px-3 rounded-md text-xs font-medium text-muted-foreground hover:text-destructive hover:bg-destructive/8 transition-colors"
                      >
                        {t("login.cancel")}
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-full overflow-hidden border border-border flex-none bg-secondary grid place-content-center">
                      {destAccount.picture
                        ? <img src={destAccount.picture} alt="" className="w-full h-full object-cover" />
                        : <User className="w-4 h-4 text-muted-foreground" />}
                    </div>
                    <div className="min-w-0 leading-tight">
                      <p className="text-[13px] font-semibold text-foreground truncate">{destAccount.name}</p>
                      <p className="text-[11px] text-muted-foreground truncate">{t("csv.destinationTitle")}</p>
                    </div>
                    <button
                      onClick={() => setDestAccount(null)}
                      className="ml-1 text-[11px] font-medium text-muted-foreground hover:text-foreground px-1.5 py-1 rounded hover:bg-secondary transition-colors flex-none"
                    >
                      {t("transfer.change")}
                    </button>
                  </div>
                )}
              </div>

              <p className="text-[11px] text-muted-foreground hidden xl:block">{t("csv.destinationDescription")}</p>

              <button
                onClick={startMigration}
                disabled={!destAccount || selectedIds.size === 0}
                className="h-9 px-4 rounded-md bg-primary text-primary-foreground text-[13px] font-semibold hover:bg-primary/90 active:bg-primary/95 transition-colors disabled:opacity-35 disabled:cursor-not-allowed inline-flex items-center gap-2"
              >
                <ArrowRightLeft className="w-4 h-4" />
                {t("transfer.start")}
                <span className="font-mono text-[11px] font-semibold tabular-nums bg-primary-foreground/15 rounded px-1.5 py-0.5">
                  {selectedIds.size}
                </span>
              </button>
            </div>
          )}
        </section>

        {/* 원장 — 검색/편집 툴바 · 행 목록 · 상태바 */}
        {subscriptions.length > 0 && (
          <section className="flex-1 min-h-0 flex flex-col bg-card border border-border rounded-lg shadow-card overflow-hidden">
            <div className="flex-none flex items-center gap-2 px-3 h-11 border-b border-border">
              <div className="relative flex-1 min-w-32 max-w-64">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder={t("subs.search")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-7 pl-8 pr-2.5 bg-secondary/60 border border-transparent rounded-md text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:bg-card focus:border-ring focus:ring-2 focus:ring-ring/15 transition-all"
                />
              </div>

              {!isMigrating && (
                <button
                  onClick={selectAll}
                  className="h-7 px-2.5 text-[11px] font-medium text-muted-foreground hover:text-foreground rounded-md hover:bg-secondary transition-colors whitespace-nowrap"
                >
                  {selectedIds.size === filtered.length ? t("subs.deselectAll") : t("subs.selectAll")}
                </button>
              )}

              <span className="w-px h-4 bg-border" />

              {!isMigrating && (
                <div className="flex items-center gap-1.5 flex-1 min-w-40">
                  <input
                    type="text"
                    placeholder={t("subs.addPlaceholder")}
                    value={addInput}
                    onChange={(e) => setAddInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") handleAddChannel(); }}
                    className="flex-1 h-7 px-2.5 bg-secondary/60 border border-transparent rounded-md font-mono text-[11px] text-foreground placeholder:text-muted-foreground placeholder:font-sans focus:outline-none focus:bg-card focus:border-ring focus:ring-2 focus:ring-ring/15 transition-all"
                  />
                  <button
                    onClick={handleAddChannel}
                    disabled={!addInput.trim()}
                    className="h-7 px-2 text-[11px] font-medium text-muted-foreground hover:text-foreground rounded-md hover:bg-secondary transition-colors disabled:opacity-40 inline-flex items-center gap-1 whitespace-nowrap"
                  >
                    <Plus className="w-3 h-3" /> {t("subs.addBtn")}
                  </button>
                </div>
              )}

              <input
                ref={csvInputRef}
                type="file"
                accept=".csv,text/csv"
                className="hidden"
                onChange={handleImportCsv}
              />
              <button
                onClick={() => csvInputRef.current?.click()}
                disabled={importingCsv || isMigrating}
                className="h-7 w-7 grid place-content-center text-muted-foreground hover:text-foreground rounded-md hover:bg-secondary transition-colors disabled:opacity-40"
                title={t("csv.importShort")}
              >
                {importingCsv ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={saveListCsv}
                className="h-7 w-7 grid place-content-center text-muted-foreground hover:text-foreground rounded-md hover:bg-secondary transition-colors"
                title={t("subs.saveCsv")}
              >
                <Save className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={exportJSON}
                className="h-7 w-7 grid place-content-center text-muted-foreground hover:text-foreground rounded-md hover:bg-secondary transition-colors"
                title={t("subs.exportJson")}
              >
                <Download className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto">
              {filtered.map((ch, i) => (
                <ChannelRow
                  key={ch.channelId}
                  channel={{ id: ch.channelId, name: ch.title, avatar: ch.thumbnail, category: "", status: ch.status }}
                  selected={selectedIds.has(ch.channelId)}
                  onToggle={view === "migrating" || view === "done" ? () => {} : toggleSelect}
                  index={i}
                  onRemove={isMigrating ? undefined : removeChannel}
                  removeLabel={t("subs.remove")}
                />
              ))}
              {filtered.length === 0 && (
                <div className="py-16 text-center">
                  <Search className="w-8 h-8 text-muted-foreground/25 mx-auto mb-2.5" />
                  <p className="text-[13px] text-muted-foreground">{t("subs.noResults")}</p>
                </div>
              )}
            </div>

            {/* 상태바 — 에디터처럼 수치가 상주한다 */}
            <div className="flex-none flex items-center gap-4 px-4 h-8 border-t border-border bg-secondary/40 font-mono text-[11px] tabular-nums">
              <span className="text-muted-foreground">
                <span className="font-semibold text-foreground">{subscriptions.length}</span>{t("subs.channels")}
              </span>
              {selectedIds.size > 0 && (
                <span className="text-primary font-medium">
                  {selectedIds.size}{t("subs.selected")}
                </span>
              )}
              <span className="flex-1" />
              {migratedCount > 0 && (
                <span className="text-success font-medium">{migratedCount}{t("subs.done")}</span>
              )}
              {failedCount > 0 && (
                <span className="text-destructive font-medium">{failedCount}{t("subs.failed")}</span>
              )}
              {quotaExceeded && (
                <span className="inline-flex items-center gap-1 text-warning font-medium">
                  <AlertCircle className="w-3 h-3" />
                  {t("subs.quotaExceeded")}
                </span>
              )}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
