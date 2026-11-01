"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Loader2 } from "lucide-react";
import { QuizViewer } from "@/components/player/quiz-viewer";
import { clientApi } from "@/lib/api-client.client";
import { capitalize } from "@/lib/utils";
import type { Quiz, Question } from "@/types/quiz";

interface QuizDetail {
  quiz: Quiz;
  questions: Question[];
}

export default function QuizTakePage() {
  const { quizId } = useParams<{ quizId: string }>();
  const { data: session } = useSession();
  const isInstructor = session?.user?.role === "instructor";

  const { data, isLoading, error } = useQuery({
    queryKey: ["quizzes", "detail", quizId],
    queryFn: () => clientApi.get<QuizDetail>(`/api/v1/quizzes/${quizId}`),
    enabled: !!quizId,
  });

  return (
    <div className="h-[calc(100vh-4rem)] -mx-6 -my-6 flex flex-col font-sans bg-[#f3f4f6] p-6">
      <div className="flex items-center justify-between mb-6 px-2">
        <Link
          href="/quizzes"
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-[13px] font-medium rounded-lg transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Quizzes
        </Link>

        {data?.quiz && (
          <div className="flex items-center gap-2">
            <span className="text-[12px] font-medium text-gray-500">
              {data.quiz.lesson_id ? "Lesson Quiz" : "Subject Quiz"}
            </span>
            <span className="text-[12px] font-bold text-gray-900">
              {capitalize(data.quiz.difficulty)}
            </span>
            {isInstructor && (
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-50 border border-purple-100 px-2 py-0.5 rounded-full">
                Instructor Preview
              </span>
            )}
          </div>
        )}
      </div>

      <div className="flex-1 min-h-0 bg-white border border-gray-200 rounded-xl overflow-hidden">
        {isLoading ? (
          <div className="h-full flex items-center justify-center">
            <Loader2 className="w-7 h-7 text-blue-600 animate-spin" />
          </div>
        ) : error ? (
          <div className="h-full flex flex-col items-center justify-center gap-3 p-8 text-center">
            <p className="text-[14px] font-semibold text-gray-900">
              Quiz unavailable
            </p>
            <p className="text-[13px] text-gray-500">
              {error instanceof Error
                ? error.message
                : "Could not load this quiz."}
            </p>
          </div>
        ) : data ? (
          <QuizViewer
            quiz={data.quiz}
            isInstructor={isInstructor}
            onPass={() => undefined}
          />
        ) : null}
      </div>
    </div>
  );
}
