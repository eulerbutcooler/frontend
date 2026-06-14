"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { QuizQuestion } from "@/components/quiz/quiz-question";
import { DifficultyBadge } from "@/components/quiz/difficulty-badge";
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
      } catch {
        router.push("/quizzes");
      } finally {
        setLoading(false);
      }
    }

    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quizId]);

  if (loading || !quizDetail || !attemptId) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 text-surface-tint animate-spin" />
      </div>
    );
  }

  const { quiz, questions } = quizDetail;
  const total = questions.length;
  const current = questions[currentQuestion];
  const isFirst = currentQuestion === 0;
  const isLast = currentQuestion === total - 1;
  const progress = ((currentQuestion + 1) / total) * 100;

  const handleSubmit = async () => {
    setSubmitting(true);

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
      {/* Progress & Meta */}
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center text-caption-uppercase uppercase text-outline">
          <span>
            Question {currentQuestion + 1} of {total}
          </span>
          <DifficultyBadge difficulty={quiz.difficulty} />
        </div>
        <div className="h-2 w-full bg-surface-card rounded-full overflow-hidden border border-hairline">
          <div
            className="h-full bg-brand-coral rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="mt-2">
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-surface-card border border-hairline text-caption-uppercase uppercase text-ink gap-2">
            <span className="w-2 h-2 rounded-full bg-brand-mint" />
            Quiz Assessment
          </span>
        </div>
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
    </div>
  );
}
