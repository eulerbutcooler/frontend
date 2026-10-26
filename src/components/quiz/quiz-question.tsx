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

  if (question.type === "mcq") {
    const choices = question.choices ?? [];
    if (choices.length === 0) {
      return (
        <div className="flex flex-col gap-6 my-6 text-center">
          <h2 className="text-[20px] font-bold text-gray-900">
            {question.question}
          </h2>
          <p className="text-[14px] text-gray-500">
            No options available for this question.
          </p>
        </div>
      );
    }
    return (
      <div className="flex flex-col gap-6 my-4 w-full max-w-2xl mx-auto">
        <h2 className="text-[19px] font-bold text-gray-900 leading-snug">
          {question.question}
        </h2>
        <div className="flex flex-col gap-3">
          {choices.map((choice) => {
            const isSelected = selectedAnswer === choice.label;
            return (
              <label
                key={choice.label}
                className={cn(
                  "relative flex items-center p-4 rounded-xl cursor-pointer border transition-all",
                  isSelected
                    ? "border-blue-600 bg-blue-50/40 ring-1 ring-blue-600 shadow-none"
                    : "border-gray-200 bg-white hover:border-blue-300 hover:bg-gray-50/70"
                )}
              >
                <input
                  type="radio"
                  name={`question-${question.id}`}
                  value={choice.label}
                  checked={isSelected}
                  onChange={() => setAnswer(question.id, choice.label)}
                  className="sr-only"
                />

                {/* Choice Pill (A, B, C, D) */}
                <div
                  className={cn(
                    "w-7 h-7 rounded-lg text-[13px] font-bold flex items-center justify-center mr-3.5 shrink-0 transition-colors",
                    isSelected
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700"
                  )}
                >
                  {choice.label}
                </div>

                {/* Text */}
                <span
                  className={cn(
                    "text-[15px] flex-1",
                    isSelected
                      ? "font-semibold text-gray-900"
                      : "text-gray-700"
                  )}
                >
                  {choice.text}
                </span>

                {/* Radio Circle */}
                <div
                  className={cn(
                    "w-5 h-5 rounded-full border-2 ml-3 shrink-0 flex items-center justify-center transition-colors",
                    isSelected ? "border-blue-600" : "border-gray-300"
                  )}
                >
                  {isSelected && (
                    <div className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                  )}
                </div>
              </label>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 my-4 w-full max-w-2xl mx-auto">
      <h2 className="text-[19px] font-bold text-gray-900 leading-snug">
        {question.question}
      </h2>
      <textarea
        rows={5}
        aria-label="Your answer"
        placeholder="Type your answer here..."
        value={selectedAnswer}
        onChange={(e) => setAnswer(question.id, e.target.value)}
        className="w-full bg-white border border-gray-200 rounded-xl p-4 text-[15px] text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors outline-none resize-none"
      />
    </div>
  );
}
