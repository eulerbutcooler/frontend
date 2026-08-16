import Link from "next/link";
import { ArrowRight, Loader2 } from "lucide-react";
import { cn, capitalize, BRAND_COLORS, DARK_TEXT_COLORS } from "@/lib/utils";
import { DifficultyBadge } from "./difficulty-badge";
import type { Quiz } from "@/types/quiz";

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
        "rounded-[24px] p-8 min-h-[320px] flex flex-col justify-between relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300 ease-snappy"
      )}
    >
      <div className={cn("relative z-10", isDark ? "text-white" : "text-ink")}>
        <div className="flex items-center gap-2 mb-4">
          <DifficultyBadge difficulty={quiz.difficulty} />
          {quiz.status === "generating" && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/25 text-caption font-semibold backdrop-blur-sm">
              <Loader2 className="h-3 w-3 animate-spin" />
              Generating
            </span>
          )}
          {quiz.status === "failed" && (
            <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/85 text-error text-caption font-semibold")}>
              Failed
            </span>
          )}
        </div>
        <h3 className="font-display text-display-md leading-tight mb-2">
          {capitalize(quiz.difficulty)} Quiz
        </h3>
        <p
          className={cn(
            "text-body-md max-w-[200px]",
            isDark ? "text-white/80" : "text-ink/80"
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
              "focus-ring inline-flex items-center gap-2 h-11 px-6 rounded-xl text-button font-semibold transition-colors",
              isDark
                ? "bg-white text-brand-teal hover:bg-surface-soft"
                : "bg-ink text-white hover:bg-ink/90"
            )}
          >
            Start Drill
            <ArrowRight className="h-4 w-4" />
          </Link>
        ) : (
          <span className="inline-flex items-center gap-2 h-11 px-6 rounded-xl bg-white/40 text-caption font-semibold cursor-not-allowed">
            {capitalize(quiz.status)}
          </span>
        )}
      </div>
    </div>
  );
}
