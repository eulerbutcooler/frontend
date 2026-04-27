"use client";

import { cn } from "@/lib/utils";
import { useQuizStore } from "@/stores/quiz-store";
import type { Question } from "@/types/quiz";

interface QuizQuestionProps {
  question: Question;
}

export function QuizQuestion({ question }: QuizQuestionProps) {
  const { answers, setAnswer } = useQuizStore();
  const selectedAnswer = answers[question.id] ?? "";

  if (question.type === "open_ended") {
    return (
      <div className="flex flex-col gap-10 mt-8">
        <h2 className="font-display text-display-md text-ink text-center">
          {question.question}
        </h2>
        <textarea
          rows={5}
          placeholder="Type your answer here..."
          value={selectedAnswer}
          onChange={(e) => setAnswer(question.id, e.target.value)}
          className="w-full bg-canvas border border-hairline rounded-2xl p-6 text-body-md text-ink focus:border-ink focus:ring-1 focus:ring-ink transition-all outline-none resize-none"
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10 mt-8">
      <h2 className="font-display text-display-md text-ink text-center">
        {question.question}
      </h2>
      <div className="flex flex-col gap-4">
        {question.choices.map((choice) => {
          const isSelected = selectedAnswer === choice.label;
          return (
            <label
              key={choice.label}
              className={cn(
                "relative flex items-center p-6 rounded-2xl cursor-pointer transition-all",
                isSelected
                  ? "bg-surface-soft border-2 border-brand-coral"
                  : "bg-white border border-hairline hover:border-brand-coral hover:bg-surface-soft"
              )}
            >
              <input
                type="radio"
                name={`question-${question.id}`}
                value={choice.label}
                checked={isSelected}
                onChange={() => setAnswer(question.id, choice.label)}
                className="absolute opacity-0"
              />
              <div
                className={cn(
                  "w-6 h-6 rounded-full border-2 mr-4 shrink-0 flex items-center justify-center",
                  isSelected ? "border-brand-coral" : "border-outline"
                )}
              >
                <div
                  className={cn(
                    "w-3 h-3 rounded-full bg-brand-coral transition-opacity",
                    isSelected ? "opacity-100" : "opacity-0"
                  )}
                />
              </div>
              <span
                className={cn(
                  "text-body-md text-ink",
                  isSelected && "font-semibold"
                )}
              >
                {choice.text}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
}
