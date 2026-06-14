import { cn } from "@/lib/utils";
import type { Difficulty } from "@/types/quiz";

const STYLES: Record<Difficulty, { bg: string; text: string }> = {
  easy: { bg: "bg-success/10", text: "text-success" },
  medium: { bg: "bg-warning/10", text: "text-warning" },
  hard: { bg: "bg-error/10", text: "text-error" },
};

const DEFAULT_STYLE = { bg: "bg-surface-soft", text: "text-surface-tint" };

interface DifficultyBadgeProps {
  difficulty: Difficulty | string;
  className?: string;
}

export function DifficultyBadge({ difficulty, className }: DifficultyBadgeProps) {
  const style = STYLES[difficulty as Difficulty] ?? DEFAULT_STYLE;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[13px] font-semibold capitalize",
        style.bg,
        style.text,
        className
      )}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {difficulty}
    </span>
  );
}
