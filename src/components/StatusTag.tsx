import { cn } from "@/lib/utils";
import { useI18n } from "@/hooks/use-i18n";
import type { TranslationKey } from "@/lib/i18n";

export type ChannelStatus = "pending" | "migrating" | "migrated" | "failed" | "skipped";

// 계기판의 인디케이터: 점 + 라벨, 배경 없음 — 색은 상태만 말한다
const statusConfig: Record<ChannelStatus, { labelKey: TranslationKey; dot: string; text: string }> = {
  pending: { labelKey: "status.pending", dot: "bg-muted-foreground/40", text: "text-muted-foreground" },
  migrating: { labelKey: "status.migrating", dot: "bg-primary animate-pulse", text: "text-primary" },
  migrated: { labelKey: "status.migrated", dot: "bg-success", text: "text-success" },
  failed: { labelKey: "status.failed", dot: "bg-destructive", text: "text-destructive" },
  skipped: { labelKey: "status.skipped", dot: "bg-muted-foreground/40", text: "text-muted-foreground" },
};

interface StatusTagProps {
  status: ChannelStatus;
}

const StatusTag = ({ status }: StatusTagProps) => {
  const { t } = useI18n();
  const config = statusConfig[status];
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-xs font-medium whitespace-nowrap", config.text)}>
      <span className={cn("w-1.5 h-1.5 rounded-full flex-none", config.dot)} />
      {t(config.labelKey)}
    </span>
  );
};

export default StatusTag;
