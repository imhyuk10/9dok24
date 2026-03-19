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

const MigrationProgress = ({ current, total, isActive, quotaUsed, quotaMax, failedCount = 0 }: MigrationProgressProps) => {
  const { t } = useI18n();
  if (!isActive && current === 0) return null;

  const percentage = total > 0 ? (current / total) * 100 : 0;
  const isDone = current === total && total > 0;
  const succeededCount = current - failedCount;
  const clampedUsed = Math.min(quotaUsed, quotaMax);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.2, 0, 0, 1] }}
      className="w-full bg-card border border-border rounded-lg p-5 shadow-elevated"
    >
      <div className="flex justify-between items-end mb-4">
        <div>
          <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
            {isDone ? t("migration.complete") : t("migration.inProgress")}
          </p>
          <h2 className="text-2xl font-bold text-foreground tabular-nums font-mono">
            {current} / {total}
          </h2>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground">{t("migration.apiUsed")}</p>
          <p className={`text-xs font-medium font-mono tabular-nums ${clampedUsed >= quotaMax - 10 ? "text-destructive" : "text-primary"}`}>
            {clampedUsed} / {t("quota.max")} {quotaMax}
          </p>
        </div>
      </div>

      <div className="h-1.5 w-full bg-border rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${isDone ? (failedCount > 0 ? "bg-warning" : "bg-success") : "bg-primary"}`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: "circOut" }}
        />
      </div>

      {isDone && (
        <p className={`text-xs mt-3 font-medium ${failedCount > 0 ? "text-warning" : "text-success"}`}>
          {failedCount === 0
            ? `✓ ${succeededCount}${t("migration.channelsMigrated")}`
            : `${succeededCount}${t("subs.done")} · ${failedCount}${t("subs.failed")}`}
        </p>
      )}
    </motion.div>
  );
};

export default MigrationProgress;
