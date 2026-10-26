"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, Loader2, Send, Timer } from "lucide-react";
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
import { capitalize, cn } from "@/lib/utils";
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
  // Default to 10 minutes for course quizzes, 5 mins for lesson quizzes
  const [timeLeft, setTimeLeft] = useState<number>(10 * 60);

  useEffect(() => {
    reset();

    async function init() {
      try {
        const detail = await clientApi.get<QuizDetail>(
          `/api/v1/quizzes/${quizId}`
        );
        setQuizDetail(detail);

        const duration = detail.quiz?.lesson_id ? 5 * 60 : 10 * 60;
        setTimeLeft(duration);

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

  const handleSubmit = useCallback(async () => {
    if (!attemptId || submitting) return;
    setSubmitting(true);
    try {
      for (const [questionId, answer] of Object.entries(answers)) {
        await submitAnswer.mutateAsync({
          attemptId,
          data: { question_id: questionId, answer },
        });
      }

      const result = await finishAttempt.mutateAsync(attemptId);
      reset();
      router.push(`/quizzes/${quizId}/results?attemptId=${result.id}`);
    } catch {
      setSubmitting(false);
    }
  }, [attemptId, submitting, answers, submitAnswer, finishAttempt, reset, router, quizId]);

  // Countdown timer: 10 minutes for course-wide quizzes, auto-submits on expiration
  useEffect(() => {
    if (loading || submitting || !attemptId) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [loading, submitting, attemptId, handleSubmit]);

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
      <div className="h-[calc(100vh-4rem)] -mx-6 -my-6 flex flex-col font-sans bg-[#f3f4f6] p-6">
        <div className="flex-1 min-h-0 bg-white border border-gray-200 rounded-xl flex items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-7 w-7 text-blue-600 animate-spin" />
            <p className="text-[13px] text-gray-500">Loading assessment questions...</p>
          </div>
        </div>
      </div>
    );
  }

  const quiz = quizDetail.quiz;
  const questions = Array.isArray(quizDetail?.questions) ? quizDetail.questions : [];
  const total = questions.length;
  const current = total > 0 ? questions[currentQuestion] : undefined;
  const isFirst = currentQuestion === 0;
  const isLast = total > 0 && currentQuestion === total - 1;
  const progress = total > 0 ? Math.round(((currentQuestion + 1) / total) * 100) : 0;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeString = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  const isUrgent = timeLeft < 120;

  return (
    <div className="h-[calc(100vh-4rem)] -mx-6 -my-6 flex flex-col font-sans bg-[#f3f4f6] p-6">
      {/* Header bar */}
      <div className="flex items-center justify-between mb-6 px-2">
        <div className="flex items-center gap-3">
          <Link
            href="/quizzes"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-[13px] font-medium rounded-lg transition-colors shadow-none"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Quizzes
          </Link>
          <div className="h-4 w-px bg-gray-300" />
          <div className="flex items-center gap-2">
            <h1 className="text-[17px] font-bold text-gray-900 tracking-tight">
              {capitalize(quiz.difficulty)} Assessment
            </h1>
            <DifficultyBadge difficulty={quiz.difficulty} />
          </div>
        </div>

        {/* Center/Right Timer & Question progress */}
        <div className="flex items-center gap-3">
          {/* Sticky Countdown Timer */}
          <div
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[13px] font-mono font-bold tracking-wide transition-all shadow-none",
              isUrgent
                ? "bg-red-50 text-red-700 border-red-200 animate-pulse"
                : "bg-white text-gray-800 border-gray-200"
            )}
            title="Time Remaining"
          >
            <Timer className={cn("w-4 h-4", isUrgent ? "text-red-600" : "text-blue-600")} />
            <span>{timeString}</span>
          </div>

          <div className="h-4 w-px bg-gray-300" />

          <div className="flex items-center gap-2">
            <span className="text-[13px] font-medium text-gray-500">
              Question {currentQuestion + 1} of {total}
            </span>
            <span className="text-[11px] font-semibold text-gray-400">
              ({progress}%)
            </span>
          </div>
        </div>
      </div>

      {/* Main Giant White Box */}
      <div className="flex-1 min-h-0 bg-white border border-gray-200 rounded-xl overflow-y-auto p-8 scrollbar-hide flex flex-col justify-between">
        {/* Progress Bar Top */}
        <div className="w-full max-w-2xl mx-auto mb-6">
          <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Center: Question Component */}
        <div className="flex-1 flex flex-col justify-center">
          {current && <QuizQuestion question={current} />}
        </div>

        {/* Bottom Navigation */}
        <div className="w-full max-w-2xl mx-auto pt-6 mt-6 border-t border-gray-100 flex items-center justify-between">
          <button
            onClick={prevQuestion}
            disabled={isFirst}
            className={cn(
              "flex items-center gap-1.5 px-4 py-2 text-[13px] font-medium rounded-lg transition-colors border cursor-pointer",
              isFirst
                ? "border-transparent text-gray-300 cursor-not-allowed"
                : "border-gray-200 bg-white hover:bg-gray-50 text-gray-700 shadow-none"
            )}
          >
            <ArrowLeft className="h-4 w-4" />
            Previous
          </button>

          {isLast ? (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="flex items-center gap-1.5 px-5 py-2 text-[13px] font-medium rounded-lg transition-colors bg-emerald-600 hover:bg-emerald-700 text-white shadow-none cursor-pointer disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Submitting Quiz...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4" />
                  Submit Quiz
                </>
              )}
            </button>
          ) : (
            <button
              onClick={nextQuestion}
              className="flex items-center gap-1.5 px-5 py-2 text-[13px] font-medium rounded-lg transition-colors bg-blue-600 hover:bg-blue-700 text-white shadow-none cursor-pointer"
            >
              Next Question
              <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>
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
