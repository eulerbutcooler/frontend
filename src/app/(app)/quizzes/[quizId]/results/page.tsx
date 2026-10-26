"use client";

import { useSearchParams, useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { clientApi } from "@/lib/api-client.client";
import {
  ArrowLeft,
  RotateCw,
  CheckCircle2,
  XCircle,
  Award,
  Loader2,
  HelpCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import type { Attempt, Answer, Question, Quiz } from "@/types/quiz";

interface AttemptResults {
  attempt: Attempt;
  answers: Answer[];
  questions?: Question[];
}

interface QuizDetail {
  quiz: Quiz;
  questions: Question[];
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
      <div className="h-[calc(100vh-4rem)] -mx-6 -my-6 flex flex-col font-sans bg-[#f3f4f6] p-6">
        <div className="flex-1 min-h-0 bg-white border border-gray-200 rounded-xl flex items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-7 w-7 text-blue-600 animate-spin" />
            <p className="text-[13px] text-gray-500">
              Evaluating and calculating results...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!results || !quizDetail) {
    return (
      <div className="h-[calc(100vh-4rem)] -mx-6 -my-6 flex flex-col font-sans bg-[#f3f4f6] p-6">
        <div className="flex-1 min-h-0 bg-white border border-gray-200 rounded-xl flex flex-col items-center justify-center p-8 text-center">
          <p className="text-[14px] text-gray-500 mb-4">Results not found.</p>
          <Link
            href="/quizzes"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-medium rounded-lg"
          >
            Back to Quizzes
          </Link>
        </div>
      </div>
    );
  }

  const attempt = results.attempt;
  const answers = Array.isArray(results?.answers) ? results.answers : [];
  const questions =
    Array.isArray(results?.questions) && results.questions.length > 0
      ? results.questions
      : Array.isArray(quizDetail?.questions)
      ? quizDetail.questions
      : [];
  const score = attempt ? Math.round(attempt.score) : 0;
  const questionsMap = new Map(questions.map((q) => [q.id, q]));
  const correctCount = answers.filter((a) => a.is_correct).length;

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
          <h1 className="text-[17px] font-bold text-gray-900 tracking-tight">
            Quiz Results & Evaluation
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/quizzes/${quizId}`}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-medium rounded-lg transition-colors shadow-none"
          >
            <RotateCw className="h-3.5 w-3.5" />
            Retake Quiz
          </Link>
        </div>
      </div>

      {/* Main Giant White Container */}
      <div className="flex-1 min-h-0 bg-white border border-gray-200 rounded-xl overflow-y-auto p-8 scrollbar-hide">
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Score Hero Card */}
          <div className="bg-gradient-to-br from-gray-950 via-gray-900 to-slate-900 text-white rounded-2xl p-7 border border-gray-800 shadow-none relative overflow-hidden flex flex-wrap items-center justify-between gap-6">
            <div className="relative z-10 flex items-center gap-6">
              <div className="flex flex-col">
                <span className="text-[11px] uppercase tracking-wider text-emerald-400 font-bold mb-1">
                  Final Score
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-[48px] font-black text-white leading-none">
                    {score}%
                  </span>
                </div>
              </div>

              <div className="h-12 w-px bg-white/15" />

              <div className="flex flex-col">
                <span className="text-[15px] font-bold text-white">
                  {correctCount} of {attempt.total} Correct
                </span>
                <p className="text-[12px] text-gray-400 mt-0.5">
                  {score >= 80
                    ? "Distinction • Excellent comprehension of course concepts"
                    : score >= 60
                    ? "Passed • Satisfactory understanding of course concepts"
                    : "Review Needed • Recommend reviewing lesson materials before retaking"}
                </p>
              </div>
            </div>

            <div className="relative z-10 flex items-center gap-2.5">
              <Link
                href={`/quizzes/${quizId}`}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[13px] font-medium transition-colors shadow-none"
              >
                <RotateCw className="h-3.5 w-3.5" />
                Retake
              </Link>
              <Link
                href="/quizzes"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-white text-[13px] font-medium transition-colors border border-white/10 shadow-none"
              >
                Back to Quizzes
              </Link>
            </div>
          </div>

          {/* Detailed Question Review */}
          <div>
            <div className="flex items-center justify-between pb-3 mb-5 border-b border-gray-100">
              <div>
                <h3 className="text-[16px] font-bold text-gray-900 tracking-tight">
                  Question Breakdown & Solutions
                </h3>
                <p className="text-[12px] text-gray-500 mt-0.5">
                  Review each question, your answer, and the correct solutions
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {answers.map((answer, i) => {
                const question = questionsMap.get(answer.question_id);
                if (!question) return null;

                const choices = question.choices ?? [];

                return (
                  <div
                    key={answer.id}
                    className="border border-gray-200 rounded-xl p-5 bg-white transition-all shadow-none"
                  >
                    {/* Top Row: Question number & Status badge */}
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                        Question {i + 1}
                      </span>
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border",
                          answer.is_correct
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-red-50 text-red-700 border-red-200"
                        )}
                      >
                        {answer.is_correct ? (
                          <>
                            <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                            Correct
                          </>
                        ) : (
                          <>
                            <XCircle className="h-3 w-3 text-red-600" />
                            Incorrect
                          </>
                        )}
                      </span>
                    </div>

                    {/* Question text */}
                    <h4 className="text-[15px] font-bold text-gray-900 mb-4 leading-snug">
                      {question.question}
                    </h4>

                    {/* Choices list for MCQ */}
                    {choices.length > 0 ? (
                      <div className="space-y-2">
                        {choices.map((choice) => {
                          const isUserSelection =
                            answer.user_answer === choice.label;
                          const isCorrectChoice =
                            (question.answer && question.answer === choice.label) ||
                            (answer.is_correct && isUserSelection);

                          return (
                            <div
                              key={choice.label}
                              className={cn(
                                "p-3 rounded-lg border text-[13px] flex items-center justify-between transition-colors",
                                isUserSelection && isCorrectChoice
                                  ? "border-emerald-500 bg-emerald-50/70 text-emerald-950 font-medium"
                                  : isUserSelection && !isCorrectChoice
                                  ? "border-red-400 bg-red-50/70 text-red-950 font-medium"
                                  : isCorrectChoice
                                  ? "border-emerald-500 bg-emerald-50/40 text-emerald-950 font-medium"
                                  : "border-gray-200 bg-gray-50/40 text-gray-700"
                              )}
                            >
                              <div className="flex items-center gap-2.5">
                                <span
                                  className={cn(
                                    "w-6 h-6 rounded text-[11px] font-bold flex items-center justify-center shrink-0",
                                    isUserSelection && isCorrectChoice
                                      ? "bg-emerald-600 text-white"
                                      : isUserSelection && !isCorrectChoice
                                      ? "bg-red-600 text-white"
                                      : isCorrectChoice
                                      ? "bg-emerald-600 text-white"
                                      : "bg-gray-200 text-gray-700"
                                  )}
                                >
                                  {choice.label}
                                </span>
                                <span>{choice.text}</span>
                              </div>

                              <div>
                                {isUserSelection && isCorrectChoice && (
                                  <span className="text-[11px] font-bold text-emerald-700">
                                    ✓ Your Answer (Correct)
                                  </span>
                                )}
                                {isUserSelection && !isCorrectChoice && (
                                  <span className="text-[11px] font-bold text-red-700">
                                    ✗ Your Answer
                                  </span>
                                )}
                                {!isUserSelection && isCorrectChoice && (
                                  <span className="text-[11px] font-bold text-emerald-700">
                                    ✓ Correct Answer
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      /* Open ended question review */
                      <div className="space-y-2 text-[13px] bg-gray-50/70 p-3.5 rounded-lg border border-gray-200">
                        <p>
                          <span className="text-gray-500">Your answer: </span>
                          <span
                            className={cn(
                              "font-semibold",
                              answer.is_correct
                                ? "text-emerald-700"
                                : "text-red-700"
                            )}
                          >
                            {answer.user_answer || "No answer provided"}
                          </span>
                        </p>
                        {!answer.is_correct && question.answer && (
                          <p>
                            <span className="text-gray-500">
                              Expected answer:{" "}
                            </span>
                            <span className="font-semibold text-emerald-700">
                              {question.answer}
                            </span>
                          </p>
                        )}
                      </div>
                    )}

                    {/* Question Technical Explanation */}
                    {question.explanation && (
                      <div className="mt-4 p-3.5 rounded-xl bg-blue-50/70 border border-blue-100 flex items-start gap-2.5">
                        <HelpCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                        <div className="text-[12px] text-blue-950 leading-relaxed">
                          <span className="font-semibold text-blue-900 block mb-0.5">
                            Explanation
                          </span>
                          {question.explanation}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
