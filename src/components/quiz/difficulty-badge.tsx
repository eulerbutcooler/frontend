import { cn } from "@/lib/utils";
import type { Difficulty } from "@/types/quiz";

const STYLES: Record<Difficulty, { bg: string; text: string; border: string; dot: string }> = {
  easy: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
    dot: "bg-emerald-500",
  },
  medium: {
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
    dot: "bg-blue-500",
  },
  hard: {
    bg: "bg-amber-50",
    text: "text-amber-800",
    border: "border-amber-200",
    dot: "bg-amber-500",
  },
};

const DEFAULT_STYLE = {
  bg: "bg-gray-100",
  text: "text-gray-700",
  border: "border-gray-200",
  dot: "bg-gray-400",
};

interface DifficultyBadgeProps {
  difficulty: Difficulty | string;
  className?: string;
}

export function DifficultyBadge({ difficulty, className }: DifficultyBadgeProps) {
  const style = STYLES[difficulty as Difficulty] ?? DEFAULT_STYLE;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[12px] font-semibold capitalize border",
        style.bg,
        style.text,
        style.border,
        className
      )}
    >
      <span className={cn("w-1.5 h-1.5 rounded-full", style.dot)} />
      {difficulty}
    </span>
  );
}
