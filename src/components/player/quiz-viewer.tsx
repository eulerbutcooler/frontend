"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { Loader2, ChevronLeft, ChevronRight, Send, Clock, Timer, Award, CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { clientApi } from "@/lib/api-client.client";
import {
  useStartAttempt,
  useSubmitAnswer,
  useFinishAttempt,
} from "@/hooks/use-quiz";
import { useQuizStore } from "@/stores/quiz-store";
import { Logo } from "@/components/icons/Logo";
import type { Quiz, Question } from "@/types/quiz";

interface QuizDetail {
  quiz: Quiz;
  questions: Question[];
}

interface QuizViewerProps {
  quiz: Quiz;
  onPass?: (score: number) => void;
}

export function QuizViewer({ quiz, onPass }: QuizViewerProps) {
  const {
    attemptId,
    currentQuestion,
    answers,
    setAttemptId,
    nextQuestion,
    prevQuestion,
    setAnswer,
    reset,
  } = useQuizStore();

  const [state, setState] = useState<"idle" | "loading" | "attempting" | "submitting" | "results">("idle");
  const [resultsScore, setResultsScore] = useState<{ score: number; total: number } | null>(null);

  // Examination countdown timer: 5 mins for lesson quiz, 10 mins for course final exam
  const initialTimeSeconds = quiz.lesson_id ? 5 * 60 : 10 * 60;
  const [timeLeft, setTimeLeft] = useState<number>(initialTimeSeconds);

  const startAttempt = useStartAttempt();
  const submitAnswer = useSubmitAnswer();
  const finishAttempt = useFinishAttempt();

  const { data: quizDetail, isLoading: isLoadingDetail } = useQuery({
    queryKey: ["quizzes", "detail", quiz.id],
    queryFn: () => clientApi.get<QuizDetail>(`/api/v1/quizzes/${quiz.id}`),
    enabled: state !== "idle",
  });

  // Reset store if quiz changes
  useEffect(() => {
    reset();
    setState("idle");
    setResultsScore(null);
    setTimeLeft(initialTimeSeconds);
  }, [quiz.id, reset, initialTimeSeconds]);

  const handleStart = async (e?: React.MouseEvent) => {
    e?.preventDefault();
    setState("loading");
    try {
      const attempt = await startAttempt.mutateAsync(quiz.id);
      setAttemptId(attempt.id);
      setTimeLeft(initialTimeSeconds);
      setState("attempting");
    } catch (err) {
      console.error("Failed to start attempt", err);
      setState("idle");
    }
  };

  const handleSubmit = useCallback(async (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    if (!attemptId) return;
    setState("submitting");

    try {
      const submitPromises = Object.entries(answers).map(([questionId, answer]) =>
        submitAnswer
          .mutateAsync({
            attemptId,
            data: { question_id: questionId, answer },
          })
          .catch((err) => {
            console.warn("Failed to submit answer for", questionId, err);
          })
      );
      await Promise.all(submitPromises);

      const resultAttempt = await finishAttempt.mutateAsync(attemptId);
      const finalScore = Math.round(resultAttempt.score);
      setResultsScore({
        score: finalScore,
        total: resultAttempt.total,
      });
      setState("results");
      if (finalScore >= 50) {
        onPass?.(finalScore);
      }
    } catch (err) {
      console.error("Failed to submit quiz", err);
      setState("attempting");
    }
  }, [attemptId, answers, submitAnswer, finishAttempt, onPass]);

  // Countdown ticker
  useEffect(() => {
    if (state !== "attempting") return;

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
  }, [state, handleSubmit]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeString = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  const isUrgent = timeLeft < 120;

  const renderIdle = () => (
    <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
      <div className="w-[52px] h-[52px] rounded-2xl bg-white border border-gray-200/80 shadow-sm flex items-center justify-center mb-4 shrink-0">
        <Logo className="w-[28px] h-[28px] text-blue-600" />
      </div>

      <div className="mb-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">
          {quiz.lesson_id ? "Lesson Knowledge Check" : "Course Final Assessment"}
        </span>
      </div>

      <h2 className="text-xl font-bold text-gray-900 mb-1">
        {quiz.lesson_id ? "Flight Lesson Examination" : "Comprehensive Naval Flight Assessment"}
      </h2>
      <p className="text-[13px] text-gray-500 max-w-sm mb-6 leading-relaxed">
        {quiz.lesson_id
          ? "5 questions drawn at random from the 30-question bank. Difficulty calibrated via Bloom's taxonomy. 5 minutes time limit."
          : "20 questions covering all course flight modules. 10 minutes time limit. Automated submission on expiry."}
      </p>

      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-50 border border-gray-200 text-[12px] font-semibold text-gray-700">
          <Clock className="w-3.5 h-3.5 text-blue-600" />
          <span>{quiz.lesson_id ? "5 Minutes" : "10 Minutes"}</span>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-50 border border-gray-200 text-[12px] font-semibold text-gray-700 capitalize">
          <span>Difficulty: {quiz.difficulty}</span>
        </div>
      </div>

      <button
        type="button"
        onClick={handleStart}
        className="h-10 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-[13px] font-semibold transition-colors shadow-sm cursor-pointer flex items-center gap-2"
      >
        <span>Begin Examination</span>
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );

  const renderAttempting = () => {
    if (!quizDetail) return null;
    const { questions } = quizDetail;
    const total = questions.length;
    const current = questions[currentQuestion];
    if (!current) return null;

    const isFirst = currentQuestion === 0;
    const isLast = currentQuestion === total - 1;
    const selectedAnswer = answers[current.id] ?? "";

    return (
      <div className="flex-1 flex flex-col justify-between min-h-0">
        {/* Top header */}
        <div className="flex items-center justify-between pb-3 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-[12px] font-bold text-gray-700 uppercase tracking-wider">
              Question {currentQuestion + 1} of {total}
            </span>
            {current.topic_phrase && (
              <span className="text-[11px] font-medium text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100 max-w-[220px] truncate" title={current.topic_phrase}>
                {current.topic_phrase}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            <span className="text-[11px] font-semibold text-gray-600 uppercase bg-gray-50 px-2 py-0.5 rounded border border-gray-200">
              {current.difficulty || quiz.difficulty}
            </span>

            {/* Sticky Countdown Timer */}
            <div className={cn(
              "flex items-center gap-1.5 px-3 py-1 rounded-full border text-[12px] font-mono font-bold transition-all",
              isUrgent 
                ? "bg-amber-50 border-amber-300 text-amber-800 animate-pulse" 
                : "bg-slate-50 border-slate-200 text-slate-700"
            )}>
              <Clock className={cn("w-3.5 h-3.5", isUrgent ? "text-amber-600" : "text-slate-500")} />
              <span>{timeString}</span>
            </div>
          </div>
        </div>

        {/* Question + Choices */}
        <div className="flex-1 overflow-y-auto py-3 space-y-3.5 scrollbar-hide min-h-0">
          <h2 className="text-[15px] font-semibold text-gray-900 leading-snug">
            {current.question}
          </h2>

          <div className="flex flex-col gap-2">
            {current.choices?.map((choice) => {
              const isSelected = selectedAnswer === choice.text || selectedAnswer === choice.label;
              return (
                <label
                  key={choice.label}
                  className={cn(
                    "flex items-center px-3.5 py-2.5 rounded-lg border cursor-pointer transition-colors text-[13px]",
                    isSelected
                      ? "border-blue-500 bg-blue-50/50 text-blue-900 font-medium"
                      : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50/60 text-gray-800"
                  )}
                >
                  <input
                    type="radio"
                    name={`question-${current.id}`}
                    value={choice.text || choice.label}
                    checked={isSelected}
                    onChange={() => setAnswer(current.id, choice.text || choice.label)}
                    className="sr-only"
                  />
                  <div
                    className={cn(
                      "w-4 h-4 rounded-full border flex items-center justify-center mr-3 shrink-0 transition-colors",
                      isSelected ? "border-blue-600" : "border-gray-300"
                    )}
                  >
                    {isSelected && (
                      <div className="w-2 h-2 rounded-full bg-blue-600" />
                    )}
                  </div>
                  <span>{choice.text}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* Navigation row */}
        <div className="pt-3 border-t border-gray-100 flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              prevQuestion();
            }}
            disabled={isFirst}
            className="h-8 px-3 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-lg text-[13px] font-medium transition-colors shadow-none flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>

          {isLast ? (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={state === "submitting"}
              className="h-8 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[13px] font-medium transition-colors shadow-none flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
            >
              {state === "submitting" ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Send className="w-3.5 h-3.5" />
              )}
              {state === "submitting" ? "Submitting..." : "Submit Quiz"}
            </button>
          ) : (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                nextQuestion();
              }}
              className="h-8 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[13px] font-medium transition-colors shadow-none flex items-center gap-1.5 cursor-pointer"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    );
  };

  const renderResults = () => {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <div className="w-[48px] h-[48px] rounded-[14px] bg-white border border-gray-200 shadow-none flex items-center justify-center mb-4 shrink-0">
          <Logo className="w-[24px] h-[24px] text-blue-500" />
        </div>

        <div className="flex items-baseline justify-center gap-1 mb-2">
          <span className="text-4xl font-bold text-gray-900 tracking-tight">
            {resultsScore?.score ?? 0}
          </span>
          <span className="text-xl font-semibold text-gray-400">%</span>
        </div>

        <div className="mb-4">
          {(resultsScore?.score ?? 0) >= 50 ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-semibold bg-green-50 text-green-700 border border-green-200">
              <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
              Passed (≥ 50%) — Next Lesson Unlocked
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
              <XCircle className="w-3.5 h-3.5 text-amber-600" />
              Score below 50% — Score at least 50% to pass & unlock next lesson
            </span>
          )}
        </div>

        <p className="text-[13px] text-gray-500 mb-6">
          {resultsScore?.total
            ? `${Math.round(((resultsScore.score ?? 0) / 100) * resultsScore.total)} of ${resultsScore.total} questions correct`
            : "Assessment completed"}
        </p>

        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            reset();
            setState("idle");
            setResultsScore(null);
          }}
          className="h-8 px-4 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-lg text-[13px] font-medium transition-colors shadow-none cursor-pointer"
        >
          Retake Quiz
        </button>
      </div>
    );
  };

  return (
    <div className="w-full h-full flex items-center justify-center p-6 bg-gray-50/50 overflow-hidden">
      <div className="w-full max-w-3xl bg-white rounded-xl border border-gray-200 shadow-none h-[500px] flex flex-col p-7 overflow-hidden shrink-0">
        {state === "idle" && renderIdle()}
        {(state === "loading" || (state === "attempting" && isLoadingDetail)) && (
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
          </div>
        )}
        {(state === "attempting" || state === "submitting") && !isLoadingDetail && renderAttempting()}
        {state === "results" && renderResults()}
      </div>
    </div>
  );
}
