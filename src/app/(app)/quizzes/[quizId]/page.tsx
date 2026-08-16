"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Loader2, Send, AlertTriangle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { QuizQuestion } from "@/components/quiz/quiz-question";
import { QuizNavigator } from "@/components/quiz/quiz-navigator";
import { DifficultyBadge } from "@/components/quiz/difficulty-badge";
import { capitalize } from "@/lib/utils";
import { useQuizStore } from "@/stores/quiz-store";
import {
  useStartAttempt,
  useSubmitAnswer,
  useFinishAttempt,
} from "@/hooks/use-quiz";
import { clientApi } from "@/lib/api-client.client";
import type { Quiz, Question } from "@/types/quiz";

interface QuizDetail {
  quiz: Quiz;
  questions: Question[];
}

export default function QuizTakePage() {
  const { quizId } = useParams<{ quizId: string }>();
  const router = useRouter();

  const {
    attemptId,
    currentQuestion,
    answers,
    setAttemptId,
    nextQuestion,
    prevQuestion,
    reset,
  } = useQuizStore();

  const startAttempt = useStartAttempt();
  const submitAnswer = useSubmitAnswer();
  const finishAttempt = useFinishAttempt();

  const [quizDetail, setQuizDetail] = useState<QuizDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  // Close the confirmation modal on Escape; trap focus inside.
  useEffect(() => {
    if (!showConfirm) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowConfirm(false);
    };
    document.addEventListener("keydown", onKey);
    // Move focus into the modal so a screen reader user lands on it.
    modalRef.current?.focus();
    return () => document.removeEventListener("keydown", onKey);
  }, [showConfirm]);

  useEffect(() => {
    reset();

    async function init() {
      try {
        const detail = await clientApi.get<QuizDetail>(
          `/api/v1/quizzes/${quizId}`
        );
        setQuizDetail(detail);

        const attempt = await startAttempt.mutateAsync(quizId);
        setAttemptId(attempt.id);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Could not load this quiz. It may have been removed or is still generating."
        );
      } finally {
        setLoading(false);
      }
    }

    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quizId]);

  if (loading || !quizDetail || !attemptId) {
    if (error) {
      return (
        <div className="max-w-2xl mx-auto">
          <div className="bg-error/5 border border-error/20 rounded-2xl p-8 text-center">
            <h1 className="font-display text-display-sm text-ink mb-2">
              Quiz unavailable
            </h1>
            <p className="text-body-md text-surface-tint mb-6">{error}</p>
            <button
              type="button"
              onClick={() => router.push("/quizzes")}
              className="focus-ring inline-flex items-center gap-2 h-11 px-5 rounded-xl bg-ink text-white text-button font-semibold hover:bg-ink/90 transition-[background-color,transform] duration-150 ease-snappy active:scale-[0.97] cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to quizzes
            </button>
          </div>
        </div>
      );
    }
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 text-surface-tint animate-spin" aria-label="Loading quiz" />
      </div>
    );
  }

  const { quiz, questions } = quizDetail;
  const total = questions.length;
  const current = questions[currentQuestion];
  const isFirst = currentQuestion === 0;
  const isLast = currentQuestion === total - 1;
  const progress = ((currentQuestion + 1) / total) * 100;

  const answeredCount = questions.filter((q) => answers[q.id]?.trim()).length;
  const unansweredCount = total - answeredCount;

  const handleSubmit = () => {
    setShowConfirm(true);
  };

  const confirmSubmit = async () => {
    setSubmitting(true);
    setShowConfirm(false);

    for (const [questionId, answer] of Object.entries(answers)) {
      await submitAnswer.mutateAsync({
        attemptId,
        data: { question_id: questionId, answer },
      });
    }

    const result = await finishAttempt.mutateAsync(attemptId);
    reset();
    router.push(`/quizzes/${quizId}/results?attemptId=${result.id}`);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="sr-only">{capitalize(quiz.difficulty)} Quiz Assessment</h1>

      {/* Progress & Meta */}
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center text-caption-uppercase uppercase text-surface-tint">
          <span>
            Question {currentQuestion + 1} of {total}
          </span>
          <span>
            {answeredCount} of {total} answered
          </span>
        </div>
        <div
          role="progressbar"
          aria-valuenow={currentQuestion + 1}
          aria-valuemin={1}
          aria-valuemax={total}
          aria-label={`Question ${currentQuestion + 1} of ${total}`}
          className="h-2 w-full bg-surface-card rounded-full overflow-hidden border border-hairline"
        >
          <div
            className="h-full bg-brand-coral rounded-full transition-[width] duration-300 ease-snappy"
            style={{ width: `${progress}%` }}
          />
        </div>
        <DifficultyBadge difficulty={quiz.difficulty} className="self-start" />
      </div>

      {/* Question Navigator */}
      <div className="mt-6 mb-10">
        <QuizNavigator questions={questions} />
      </div>

      {/* Question */}
      {current && <QuizQuestion question={current} />}

      {/* Navigation */}
      <div className="mt-12 flex justify-between items-center border-t border-hairline pt-8">
        <Button
          variant="secondary"
          onClick={prevQuestion}
          disabled={isFirst}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Previous
        </Button>

        {isLast ? (
          <Button
            onClick={handleSubmit}
            disabled={submitting}
            className="gap-2"
          >
            {submitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            {submitting ? "Submitting..." : "Submit Quiz"}
          </Button>
        ) : (
          <Button onClick={nextQuestion} className="gap-2">
            Next Question
            <ArrowRight className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Submit Confirmation Modal */}
      {showConfirm && (
        <div
          className="fixed inset-0 z-50 grid place-items-center bg-ink/40 backdrop-blur-sm animate-fade-in"
          onClick={() => setShowConfirm(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-submit-title"
        >
          <div
            ref={modalRef}
            tabIndex={-1}
            className="bg-canvas rounded-2xl border border-hairline shadow-xl max-w-md w-[90%] p-6 animate-popover focus:outline-none"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-3 mb-4">
              <div className="grid size-10 place-items-center rounded-lg bg-error/10 text-error shrink-0">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <h2 id="confirm-submit-title" className="font-display text-title-lg font-semibold text-ink">
                  Submit quiz?
                </h2>
                <p className="text-body-md text-surface-tint mt-1">
                  {unansweredCount > 0 ? (
                    <>
                      You have <span className="font-semibold text-ink">{unansweredCount} unanswered question{unansweredCount === 1 ? "" : "s"}</span>. You cannot change answers after submitting.
                    </>
                  ) : (
                    <>You answered all {total} questions. You cannot change answers after submitting.</>
                  )}
                </p>
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <Button
                variant="secondary"
                onClick={() => setShowConfirm(false)}
                className="gap-2"
              >
                <X className="h-4 w-4" />
                Keep Working
              </Button>
              <Button
                onClick={confirmSubmit}
                disabled={submitting}
                className="gap-2"
              >
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                {submitting ? "Submitting..." : "Submit now"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
