import Link from "next/link";
import { ArrowRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { DifficultyBadge } from "./difficulty-badge";
import type { Quiz } from "@/types/quiz";

const BRAND_COLORS = [
  "bg-brand-pink",
  "bg-brand-teal",
  "bg-brand-lavender",
  "bg-brand-peach",
  "bg-brand-ochre",
] as const;

const DARK_TEXT_COLORS = new Set(["bg-brand-teal"]);

function formatStatus(status?: string | null): string {
  if (!status) return "—";
  return status.charAt(0).toUpperCase() + status.slice(1);
}

interface QuizCardProps {
  quiz: Quiz;
  index: number;
}

export function QuizCard({ quiz, index }: QuizCardProps) {
  const colorClass = BRAND_COLORS[index % BRAND_COLORS.length];
  const isDark = DARK_TEXT_COLORS.has(colorClass);
  const isReady = quiz.status === "ready";

  return (
    <div
      className={cn(
        colorClass,
        "rounded-xl p-8 min-h-[320px] flex flex-col justify-between relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300"
      )}
    >
      <div className={cn("relative z-10", isDark ? "text-white" : "text-ink")}>
        <div className="flex items-center gap-2 mb-4">
          <DifficultyBadge difficulty={quiz.difficulty} />
          {quiz.status === "generating" && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/20 text-[13px] font-semibold animate-pulse">
              <Loader2 className="h-3 w-3 animate-spin" />
              Generating
            </span>
          )}
          {quiz.status === "failed" && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-error/20 text-error text-[13px] font-semibold">
              Failed
            </span>
          )}
        </div>
        <h3 className="font-display text-display-md leading-tight mb-2">
          {formatStatus(quiz.difficulty)} Quiz
        </h3>
        <p
          className={cn(
            "text-body-md max-w-[200px]",
            isDark ? "opacity-80" : "text-surface-tint"
          )}
        >
          {quiz.status === "ready"
            ? "Test your knowledge with this assessment."
            : quiz.status === "generating"
              ? "Questions are being generated..."
              : "Quiz generation failed."}
        </p>
      </div>

      <div className="relative z-10 mt-8">
        {isReady ? (
          <Link
            href={`/quizzes/${quiz.id}`}
            className={cn(
              "inline-flex items-center gap-2 h-[44px] px-6 rounded-xl text-button font-semibold transition-colors",
              isDark
                ? "bg-white text-brand-teal hover:bg-surface-soft"
                : "bg-ink text-white hover:bg-ink/90"
            )}
          >
            Start Drill
            <ArrowRight className="h-4 w-4" />
          </Link>
        ) : (
          <span className="inline-flex items-center gap-2 h-[44px] px-6 rounded-xl bg-white/30 text-[13px] font-semibold cursor-not-allowed opacity-70">
            {formatStatus(quiz.status)}
          </span>
        )}
      </div>
    </div>
  );
}
