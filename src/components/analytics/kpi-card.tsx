import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

type TrendDirection = "up" | "down" | "flat";

const TREND_ICON: Record<TrendDirection, React.ElementType> = {
  up: TrendingUp,
  down: TrendingDown,
  flat: Minus,
};

interface KpiCardProps {
  label: string;
  value: string | number;
  trend?: { direction: TrendDirection; label: string };
  color: string;
}

export function KpiCard({ label, value, trend, color }: KpiCardProps) {
  const TrendIcon = trend ? TREND_ICON[trend.direction] : null;

  return (
    <div
      className={cn(
        color,
        "rounded-xl p-6 flex flex-col justify-between aspect-[3/2] relative overflow-hidden"
      )}
    >
      <div>
        <p className="text-caption-uppercase uppercase text-ink/70 mb-1">
          {label}
        </p>
        <h2 className="font-display text-display-sm text-ink">{value}</h2>
      </div>
      {TrendIcon && trend && (
        <div className="flex items-center gap-2 mt-auto">
          <span
            className="rounded-full p-1 flex items-center justify-center bg-white/30"
          >
            <TrendIcon className="h-4 w-4 text-ink" />
          </span>
          <span className="text-button font-semibold text-ink">
            {trend.label}
          </span>
        </div>
      )}
    </div>
  );
}

