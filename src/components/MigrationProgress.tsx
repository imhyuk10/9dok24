import { motion } from "framer-motion";

interface MigrationProgressProps {
  current: number;
  total: number;
  isActive: boolean;
  apiRemaining: number;
  failedCount?: number;
}

const MigrationProgress = ({ current, total, isActive, apiRemaining, failedCount = 0 }: MigrationProgressProps) => {
  if (!isActive && current === 0) return null;

  const percentage = total > 0 ? (current / total) * 100 : 0;
  const isDone = current === total && total > 0;
  const succeededCount = current - failedCount;

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
            {isDone ? "이전 완료" : "이전 중"}
          </p>
          <h2 className="text-2xl font-bold text-foreground tabular-nums font-mono">
            {current} / {total}
          </h2>
        </div>
        <div className="text-right">
          <p className={`text-xs font-medium font-mono ${apiRemaining <= 10 ? "text-destructive" : "text-primary"}`}>
            API 잔여: {apiRemaining}회
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
            ? `✓ ${succeededCount}개 채널 이전 완료`
            : `완료 ${succeededCount}개 · 실패 ${failedCount}개`}
        </p>
      )}
    </motion.div>
  );
};

export default MigrationProgress;
