import { useI18n } from "@/hooks/use-i18n";

interface APIQuotaGaugeProps {
  used: number;
  total: number;
}

const APIQuotaGauge = ({ used, total }: APIQuotaGaugeProps) => {
  const { t } = useI18n();
  const percentage = (used / total) * 100;
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  const isHigh = used >= total - 10;

  return (
    <div className="flex items-center gap-2.5">
      <div className="relative w-10 h-10">
        <svg className="w-10 h-10 -rotate-90" viewBox="0 0 44 44">
          <circle cx="22" cy="22" r={radius} fill="none" stroke="hsl(var(--border))" strokeWidth="3" />
          <circle
            cx="22" cy="22" r={radius} fill="none"
            stroke={isHigh ? "hsl(var(--destructive))" : "hsl(var(--primary))"}
            strokeWidth="3"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-500"
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-[10px] font-mono font-semibold text-foreground tabular-nums">
          {used}
        </span>
      </div>
      <div>
        <p className="text-xs text-muted-foreground">{t("quota.label")}</p>
        <p className={`text-xs font-mono font-medium tabular-nums ${isHigh ? "text-destructive" : "text-foreground"}`}>
          {used} / {t("quota.max")} {total}
        </p>
      </div>
    </div>
  );
};

export default APIQuotaGauge;
