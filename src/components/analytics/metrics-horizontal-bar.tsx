import { cn } from "@/lib/utils";

interface MetricsHorizontalBarProps {
  label: string;
  value: number;
  maxValue: number;
  color: string;
}

export function MetricsHorizontalBar({
  label,
  value,
  maxValue,
  color,
}: MetricsHorizontalBarProps) {
  const pct = maxValue > 0 ? Math.min((value / maxValue) * 100, 100) : 0;

  return (
    <div>
      <div className="flex justify-between text-button font-semibold text-ink mb-2">
        <span>{label}</span>
        <span>{Math.round(pct)}%</span>
      </div>
      <div className="w-full bg-surface-container rounded-full h-3">
        <div
          className={cn("h-3 rounded-full transition-all duration-500", color)}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
