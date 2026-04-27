"use client";

import { useSearchParams, useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { clientApi } from "@/lib/api-client.client";
import { ArrowLeft, RotateCw, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import Link from "next/link";
import type { Attempt, Answer, Question, Quiz } from "@/types/quiz";

interface AttemptResults {
  attempt: Attempt;
  answers: Answer[];
}

interface QuizDetail {
  Quiz: Quiz;
  Questions: Question[];
}

export default function QuizResultsPage() {
  const { quizId } = useParams<{ quizId: string }>();
  const searchParams = useSearchParams();
  const attemptId = searchParams.get("attemptId") ?? "";

  const { data: results, isLoading: loadingResults } = useQuery({
    queryKey: ["attempts", attemptId],
    queryFn: () =>
      clientApi.get<AttemptResults>(`/api/v1/attempts/${attemptId}/results`),
    enabled: !!attemptId,
  });

  const { data: quizDetail, isLoading: loadingQuiz } = useQuery({
    queryKey: ["quizzes", "detail", quizId],
    queryFn: () => clientApi.get<QuizDetail>(`/api/v1/quizzes/${quizId}`),
    enabled: !!quizId,
  });

  if (loadingResults || loadingQuiz) {
    return (
      <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
        <Skeleton className="h-48 rounded-[24px]" />
        <Skeleton className="h-8 w-48" />
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-2xl" />
        ))}
      </div>
    );
  }

  if (!results || !quizDetail) {
    return (
      <div className="text-center py-16">
        <p className="text-body-md text-surface-tint">
          Results not found.
        </p>
        <Link href="/quizzes">
          <Button variant="secondary" className="mt-4">
            Back to Quizzes
          </Button>
        </Link>
      </div>
    );
  }

  const { attempt, answers } = results;
  const { Questions: questions } = quizDetail;
  const score = Math.round(attempt.score);
  const questionsMap = new Map(questions.map((q) => [q.id, q]));

  return (
    <div className="max-w-3xl mx-auto">
      {/* Score Card */}
      <div className="bg-brand-teal rounded-[24px] p-8 text-white text-center mb-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent" />
        <div className="relative z-10">
          <p className="text-caption-uppercase uppercase tracking-widest opacity-80 mb-4">
            Your Score
          </p>
          <div className="flex items-end justify-center gap-1 mb-2">
            <span className="font-display text-[80px] leading-none">
              {score}
            </span>
            <span className="text-display-sm mb-2">%</span>
          </div>
          <p className="text-body-md opacity-80">
            {attempt.total > 0
              ? `${Math.round((score / 100) * attempt.total)} of ${attempt.total} correct`
              : "No answers submitted"}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="font-display text-display-sm text-ink">
          Question Breakdown
        </h2>
        <div className="flex gap-3">
          <Link href="/quizzes">
            <Button variant="secondary" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              All Quizzes
            </Button>
          </Link>
          <Link href={`/quizzes/${quizId}`}>
            <Button className="gap-2">
              <RotateCw className="h-4 w-4" />
              Retake
            </Button>
          </Link>
        </div>
      </div>

      {/* Per-question breakdown */}
      <div className="space-y-4">
        {answers.map((answer, i) => {
          const question = questionsMap.get(answer.question_id);
          if (!question) return null;

          return (
            <div
              key={answer.id}
              className={cn(
                "rounded-2xl p-6 border",
                answer.is_correct
                  ? "bg-success/5 border-success/20"
                  : "bg-error/5 border-error/20"
              )}
            >
              <div className="flex items-start gap-4">
                {answer.is_correct ? (
                  <CheckCircle2 className="h-6 w-6 text-success shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="h-6 w-6 text-error shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <p className="text-caption-uppercase uppercase text-outline mb-1">
                    Question {i + 1}
                  </p>
                  <p className="text-title-md font-semibold text-ink mb-3">
                    {question.question}
                  </p>
                  <div className="flex flex-col gap-1.5 text-body-sm">
                    <p>
                      <span className="text-surface-tint">Your answer: </span>
                      <span
                        className={cn(
                          "font-semibold",
                          answer.is_correct ? "text-success" : "text-error"
                        )}
                      >
                        {answer.user_answer}
                      </span>
                    </p>
                    {!answer.is_correct && (
                      <p>
                        <span className="text-surface-tint">
                          Correct answer:{" "}
                        </span>
                        <span className="font-semibold text-success">
                          {question.answer}
                        </span>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
