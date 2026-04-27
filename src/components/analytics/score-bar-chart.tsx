import { cn } from "@/lib/utils";

const BAR_COLORS = [
  "bg-brand-lavender",
  "bg-brand-peach",
  "bg-brand-mint",
  "bg-brand-pink",
  "bg-brand-ochre",
];

interface BarItem {
  label: string;
  value: number;
}

interface ScoreBarChartProps {
  title: string;
  subtitle?: string;
  items: BarItem[];
  maxValue?: number;
}

export function ScoreBarChart({
  title,
  subtitle,
  items,
  maxValue,
}: ScoreBarChartProps) {
  const max = maxValue ?? Math.max(...items.map((i) => i.value), 1);

  return (
    <div className="bg-surface-card border border-hairline rounded-xl p-6 flex flex-col">
      <div className="mb-8">
        <h3 className="text-title-lg font-semibold text-ink">{title}</h3>
        {subtitle && (
          <p className="text-body-md text-surface-tint mt-1">{subtitle}</p>
        )}
      </div>
      <div className="flex-1 relative min-h-[240px] flex items-end gap-2 pt-8">
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-8">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="border-t border-hairline w-full" />
          ))}
        </div>
        <div className="w-full flex justify-between items-end h-full z-10 px-2">
          {items.map((item, i) => {
            const height = max > 0 ? (item.value / max) * 100 : 0;
            return (
              <div
                key={item.label}
                className={cn(
                  "w-[8%] min-w-[20px] rounded-t-sm hover:opacity-80 transition-opacity",
                  BAR_COLORS[i % BAR_COLORS.length]
                )}
                style={{ height: `${Math.max(height, 4)}%` }}
                title={`${item.label}: ${item.value}`}
              />
            );
          })}
        </div>
      </div>
      <div className="flex justify-between w-full mt-4 px-4 text-caption-uppercase uppercase text-surface-tint">
        {items.map((item) => (
          <span key={item.label} className="truncate max-w-[60px] text-center">
            {item.label}
          </span>
        ))}
      </div>
    </div>
  );
}
