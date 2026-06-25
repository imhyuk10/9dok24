import { cn } from "@/lib/utils";
import { useI18n } from "@/hooks/use-i18n";
import type { TranslationKey } from "@/lib/i18n";

export type ChannelStatus = "pending" | "migrating" | "migrated" | "failed" | "skipped";

const statusConfig: Record<ChannelStatus, { labelKey: TranslationKey; className: string }> = {
  pending: { labelKey: "status.pending", className: "bg-muted text-muted-foreground" },
  migrating: { labelKey: "status.migrating", className: "bg-warning/15 text-warning" },
  migrated: { labelKey: "status.migrated", className: "bg-success/15 text-success" },
  failed: { labelKey: "status.failed", className: "bg-destructive/15 text-destructive" },
  skipped: { labelKey: "status.skipped", className: "bg-muted text-muted-foreground" },
};

interface StatusTagProps {
  status: ChannelStatus;
}

const StatusTag = ({ status }: StatusTagProps) => {
  const { t } = useI18n();
  const config = statusConfig[status];
  return (
    <span className={cn("px-2 py-0.5 rounded text-xs font-medium font-mono", config.className)}>
      {t(config.labelKey)}
    </span>
  );
};

export default StatusTag;
