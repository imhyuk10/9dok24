import { cn } from "@/lib/utils";

export type ChannelStatus = "pending" | "migrating" | "migrated" | "failed" | "skipped";

const statusConfig: Record<ChannelStatus, { label: string; className: string }> = {
  pending: { label: "대기", className: "bg-muted text-muted-foreground" },
  migrating: { label: "이전 중", className: "bg-warning/15 text-warning" },
  migrated: { label: "완료", className: "bg-success/15 text-success" },
  failed: { label: "실패", className: "bg-destructive/15 text-destructive" },
  skipped: { label: "건너뜀", className: "bg-muted text-muted-foreground" },
};

interface StatusTagProps {
  status: ChannelStatus;
}

const StatusTag = ({ status }: StatusTagProps) => {
  const config = statusConfig[status];
  return (
    <span className={cn("px-2 py-0.5 rounded text-xs font-medium font-mono", config.className)}>
      {config.label}
    </span>
  );
};

export default StatusTag;
