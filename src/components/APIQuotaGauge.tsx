import { useI18n } from "@/hooks/use-i18n";

interface APIQuotaGaugeProps {
  used: number;
  total: number;
}

// 상단바의 계측 스트립: 10칸 세그먼트 미터 + 탭ular 카운터
const SEGMENTS = 10;

const APIQuotaGauge = ({ used, total }: APIQuotaGaugeProps) => {
  const { t } = useI18n();
  const clamped = Math.min(used, total);
  const filled = Math.round((clamped / total) * SEGMENTS);
  const isHigh = used >= total - 10;

  return (
    <div
      className="flex items-center gap-2"
      title={`${t("quota.label")} ${clamped} / ${total}`}
      role="meter"
      aria-valuemin={0}
      aria-valuemax={total}
      aria-valuenow={clamped}
      aria-label={t("quota.label")}
    >
      <span className="text-[11px] font-medium text-muted-foreground whitespace-nowrap hidden md:inline">
        {t("quota.label")}
      </span>
      <div className="flex items-center gap-[3px]">
        {Array.from({ length: SEGMENTS }, (_, i) => (
          <span
            key={i}
            className={`w-[5px] h-3 rounded-[1px] transition-colors duration-300 ${
              i < filled
                ? isHigh ? "bg-destructive" : "bg-primary"
                : "bg-border"
            }`}
          />
        ))}
      </div>
      <span
        className={`font-mono text-[11px] font-semibold tabular-nums whitespace-nowrap ${
          isHigh ? "text-destructive" : "text-foreground"
        }`}
      >
        {clamped}<span className="text-muted-foreground font-normal">/{total}</span>
      </span>
    </div>
  );
};

export default APIQuotaGauge;
