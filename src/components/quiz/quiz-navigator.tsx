"use client";

import { cn } from "@/lib/utils";
import { useQuizStore } from "@/stores/quiz-store";
import type { Question } from "@/types/quiz";

interface QuizNavigatorProps {
  questions: Question[];
}

/**
 * Compact pill navigator showing answered/active state per question.
 * Lets quiz takers jump to any question and see progress at a glance.
 */
export function QuizNavigator({ questions }: QuizNavigatorProps) {
  const { currentQuestion, answers, setCurrentQuestion } = useQuizStore();

  return (
    <nav aria-label="Quiz questions" className="flex flex-wrap gap-2">
      {questions.map((q, i) => {
        const isActive = i === currentQuestion;
        const isAnswered = !!answers[q.id]?.trim();

        return (
          <button
            key={q.id}
            type="button"
            onClick={() => setCurrentQuestion(i)}
            aria-current={isActive ? "step" : undefined}
            aria-label={`Question ${i + 1}${isAnswered ? ", answered" : ""}`}
            className={cn(
              "focus-ring size-9 rounded-lg text-button font-semibold transition-[background-color,border-color,transform] duration-150 ease-snappy active:scale-[0.95] cursor-pointer",
              isActive
                ? "bg-ink text-white border border-ink"
                : isAnswered
                  ? "bg-brand-mint/30 text-ink border border-brand-mint"
                  : "bg-surface-card text-surface-tint border border-hairline hover:border-outline-variant hover:text-ink"
            )}
          >
            {i + 1}
          </button>
        );
      })}
    </nav>
  );
}