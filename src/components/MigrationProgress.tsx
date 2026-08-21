import { motion } from "framer-motion";
import { useI18n } from "@/hooks/use-i18n";

interface MigrationProgressProps {
  current: number;
  total: number;
  isActive: boolean;
  quotaUsed: number;
  quotaMax: number;
  failedCount?: number;
}

// 실행 레일: 진행 카운터 + 게이지 + 할당량. 계기판처럼 숫자가 주인공.
const MigrationProgress = ({ current, total, isActive, quotaUsed, quotaMax, failedCount = 0 }: MigrationProgressProps) => {
  const { t } = useI18n();
  if (!isActive && current === 0) return null;

  const percentage = total > 0 ? (current / total) * 100 : 0;
  const isDone = current === total && total > 0;
  const succeededCount = current - failedCount;
  const clampedUsed = Math.min(quotaUsed, quotaMax);

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: [0.2, 0, 0, 1] }}
      className="w-full"
    >
      <div className="flex items-end justify-between mb-2.5">
        <div className="flex items-baseline gap-3">
          <span className="font-mono text-2xl font-bold text-foreground tabular-nums leading-none">
            {current}<span className="text-muted-foreground font-medium text-base">/{total}</span>
          </span>
          <span className="text-xs font-medium text-muted-foreground">
            {isDone ? t("migration.complete") : t("migration.inProgress")}
          </span>
        </div>
        <span className={`font-mono text-[11px] tabular-nums ${clampedUsed >= quotaMax - 10 ? "text-destructive font-semibold" : "text-muted-foreground"}`}>
          {t("migration.apiUsed")} {clampedUsed}/{quotaMax}
        </span>
      </div>

      <div className="h-1 w-full bg-border rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${isDone ? (failedCount > 0 ? "bg-warning" : "bg-success") : "bg-primary"}`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.4, ease: "circOut" }}
        />
      </div>

      {isDone && (
        <p className={`text-xs mt-2.5 font-medium tabular-nums ${failedCount > 0 ? "text-warning" : "text-success"}`}>
          {failedCount === 0
            ? `${succeededCount}${t("migration.channelsMigrated")}`
            : `${succeededCount}${t("subs.done")} · ${failedCount}${t("subs.failed")}`}
        </p>
      )}
    </motion.div>
  );
};

export default MigrationProgress;
