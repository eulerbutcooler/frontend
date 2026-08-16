import { cn } from "@/lib/utils";

interface MetricsHorizontalBarProps {
  label: string;
  /** Absolute count to render as the bar fill ratio. */
  value: number;
  /** Upper bound the bar's fill is normalized against. Bars are proportional
   * to value/maxValue so they read visually even when categories differ in
   * scale, but the displayed text is the real value (never a "%"). */
  maxValue: number;
  /** Optional unit suffix appended to the value text (e.g. " courses"). */
  unit?: string;
  color: string;
}

export function MetricsHorizontalBar({
  label,
  value,
  maxValue,
  unit = "",
  color,
}: MetricsHorizontalBarProps) {
  const pct = maxValue > 0 ? Math.min((value / maxValue) * 100, 100) : 0;

  return (
    <div>
      <div className="flex justify-between text-button font-semibold text-ink mb-2">
        <span>{label}</span>
        <span>
          {value}
          {unit}
        </span>
      </div>
      <div className="w-full bg-surface-container rounded-full h-3">
        <div
          className={cn("h-3 rounded-full transition-[width] duration-500 ease-snappy", color)}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}