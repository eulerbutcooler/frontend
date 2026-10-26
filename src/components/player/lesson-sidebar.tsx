"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  FileText,
  Presentation,
  FileType,
  Check,
  Play,
  Circle,
  HelpCircle,
  Award,
  Sparkles,
  BookOpen,
  Timer,
  Lock,
} from "lucide-react";
import { cn, toTitleCase } from "@/lib/utils";
import type { LessonWithContent } from "@/types/progress";

interface LessonSidebarProps {
  lessons: LessonWithContent[];
  currentLessonIdx: number;
  currentFileIdx: number;
  currentTopicIdx?: number;
  viewState: "slides" | "file" | "quiz" | "certificate";
  isLessonComplete: (lessonId: string) => boolean;
  isFileViewed: (lessonId: string, fileId: string) => boolean;
  isLessonUnlocked?: (lessonIdx: number) => boolean;
  allLessonsPassed?: boolean;
  percentage: number;
  completedCount: number;
  onTopicSelect?: (lessonIdx: number, topicIdx: number) => void;
  onFileSelect: (lessonIdx: number, fileIdx: number) => void;
  onQuizSelect: (lessonIdx: number) => void;
  onCertificateSelect: () => void;
}

const FILE_TYPE_ICON: Record<string, typeof FileText> = {
  docx: FileText,
  pdf: FileType,
  pptx: Presentation,
};

const FILE_TYPE_COLOR: Record<string, string> = {
  docx: "text-blue-500",
  pdf: "text-red-500",
  pptx: "text-orange-500",
};

export function LessonSidebar({
  lessons,
  currentLessonIdx,
  currentFileIdx,
  currentTopicIdx = 0,
  viewState,
  isLessonComplete,
  isFileViewed,
  isLessonUnlocked,
  allLessonsPassed = false,
  percentage,
  completedCount,
  onTopicSelect,
  onFileSelect,
  onQuizSelect,
  onCertificateSelect,
}: LessonSidebarProps) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(() => {
    // Auto-expand current lesson
    const initial = new Set<string>();
    if (lessons[currentLessonIdx]) {
      initial.add(lessons[currentLessonIdx].id);
    }
    return initial;
  });

  const toggleExpand = (lessonId: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(lessonId)) {
        next.delete(lessonId);
      } else {
        next.add(lessonId);
      }
      return next;
    });
  };

  // Auto-expand current lesson when it changes
  const currentLesson = lessons[currentLessonIdx];
  if (currentLesson && !expandedIds.has(currentLesson.id)) {
    setExpandedIds((prev) => new Set([...prev, currentLesson.id]));
  }

  return (
    <div className="w-[300px] shrink-0 border-l border-gray-200 flex flex-col bg-gray-50/30">
      {/* Progress Header */}
      <div className="p-5 border-b border-gray-200">
        <div className="flex items-center justify-between mb-2.5">
          <h3 className="text-[13px] font-semibold text-gray-900">
            Course Progress
          </h3>
          <span className="text-[12px] font-bold text-blue-600">
            {percentage}%
          </span>
        </div>

        {/* Progress bar */}
        <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden mb-2">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-700 ease-out"
            style={{ width: `${percentage}%` }}
          />
        </div>

        <p className="text-[11px] text-gray-500">
          {completedCount} of {lessons.length} lessons complete
        </p>
      </div>

      {/* Lesson List */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {lessons.map((lesson, lessonIdx) => {
          const isExpanded = expandedIds.has(lesson.id);
          const isCurrent = lessonIdx === currentLessonIdx;
          const isComplete = isLessonComplete(lesson.id);
          const isUnlocked = isLessonUnlocked ? isLessonUnlocked(lessonIdx) : lessonIdx === 0;

          return (
            <div key={lesson.id} className="border-b border-gray-100 last:border-b-0">
              {/* Lesson Header */}
              <button
                onClick={() => toggleExpand(lesson.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-5 py-3.5 text-left transition-colors cursor-pointer",
                  !isUnlocked
                    ? "hover:bg-gray-50/70"
                    : isCurrent
                    ? "bg-blue-50/50"
                    : "hover:bg-gray-50",
                )}
              >
                {/* Status icon */}
                <div className="shrink-0">
                  {!isUnlocked ? (
                    <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center">
                      <Lock className="w-3 h-3 text-gray-400" />
                    </div>
                  ) : isComplete ? (
                    <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" strokeWidth={3} />
                    </div>
                  ) : isCurrent ? (
                    <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                      <Play className="w-3 h-3 text-white ml-0.5" fill="white" />
                    </div>
                  ) : (
                    <Circle className="w-5 h-5 text-gray-300" strokeWidth={1.5} />
                  )}
                </div>

                {/* Lesson info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p
                      className={cn(
                        "text-[13px] font-semibold truncate",
                        !isUnlocked
                          ? "text-gray-400"
                          : isCurrent
                          ? "text-blue-700"
                          : isComplete
                          ? "text-gray-500"
                          : "text-gray-900",
                      )}
                    >
                      Lesson {lessonIdx + 1}
                    </p>
                    {!isUnlocked && (
                      <span className="text-[9px] font-bold uppercase tracking-wider bg-gray-100 text-gray-500 px-1 py-0.2 rounded shrink-0">
                        Locked
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-gray-500 truncate">
                    {lesson.title}
                  </p>
                </div>

                {/* Expand arrow */}
                <div className="shrink-0 text-gray-400">
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </div>
              </button>

              {/* Expanded lesson content */}
              {isExpanded && (
                <div className="pb-3 animate-in slide-in-from-top-1 duration-200 space-y-2">
                  {/* 1. AI Topics Briefing */}
                  {lesson.topics && lesson.topics.length > 0 && (
                    <div>
                      <div className="px-5 py-1 text-[10px] font-bold uppercase tracking-wider text-blue-600 flex items-center gap-1.5">
                        <Sparkles className="w-3 h-3 text-blue-500" />
                        <span>AI Briefing Topics</span>
                      </div>
                      <div className="mt-0.5 space-y-0.5">
                        {lesson.topics.map((topic, topicIdx) => {
                          const isCurrentTopic =
                            lessonIdx === currentLessonIdx &&
                            topicIdx === currentTopicIdx &&
                            viewState === "slides";

                          return (
                            <button
                              key={topic.id || topicIdx}
                              disabled={!isUnlocked}
                              onClick={() => isUnlocked && onTopicSelect?.(lessonIdx, topicIdx)}
                              className={cn(
                                "w-full flex items-center gap-2.5 pl-8 pr-5 py-2 text-left transition-all",
                                !isUnlocked
                                  ? "opacity-50 cursor-not-allowed"
                                  : isCurrentTopic
                                  ? "bg-blue-50/80 border-l-2 border-blue-600 text-blue-900 font-semibold cursor-pointer"
                                  : "hover:bg-gray-50 border-l-2 border-transparent text-gray-700 cursor-pointer",
                              )}
                            >
                              <BookOpen
                                className={cn(
                                  "w-3.5 h-3.5 shrink-0",
                                  isCurrentTopic ? "text-blue-600" : "text-gray-400"
                                )}
                              />
                              <span className="text-[12px] truncate">
                                {toTitleCase(topic.title)}
                              </span>
                              <span className="ml-auto text-[10px] font-semibold text-blue-600/70 bg-blue-50 px-1 rounded shrink-0">
                                {topic.slides?.length || 4}s
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* 2. Quiz / Examination */}
                  {lesson.quiz && (
                    <div>
                      <div className="px-5 py-1 text-[10px] font-bold uppercase tracking-wider text-purple-600 flex items-center gap-1.5">
                        <Timer className="w-3 h-3 text-purple-500" />
                        <span>Examination</span>
                      </div>
                      <div className="mt-0.5">
                        <button
                          disabled={!isUnlocked}
                          onClick={() => isUnlocked && onQuizSelect(lessonIdx)}
                          className={cn(
                            "w-full flex items-center gap-2.5 pl-8 pr-5 py-2 text-left transition-all",
                            !isUnlocked
                              ? "opacity-50 cursor-not-allowed"
                              : lessonIdx === currentLessonIdx && viewState === "quiz"
                              ? "bg-purple-50 border-l-2 border-purple-500 text-purple-900 font-semibold cursor-pointer"
                              : "hover:bg-gray-50 border-l-2 border-transparent text-gray-700 cursor-pointer",
                          )}
                        >
                          <div className="w-3.5 h-3.5 shrink-0 flex items-center justify-center">
                            <HelpCircle className="w-3.5 h-3.5 text-purple-500" />
                          </div>
                          <span className="text-[12px] truncate font-medium">
                            Lesson Examination
                          </span>
                          <span className="ml-auto text-[10px] font-medium text-purple-600 bg-purple-100/70 px-1.5 py-0.5 rounded shrink-0">
                            5m Exam
                          </span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {/* Certificate Item */}
        <div className="border-t border-gray-200">
          <button
            onClick={allLessonsPassed ? onCertificateSelect : undefined}
            disabled={!allLessonsPassed}
            className={cn(
              "w-full flex items-center gap-3 px-5 py-4 text-left transition-colors",
              !allLessonsPassed
                ? "opacity-60 cursor-not-allowed bg-gray-50/50"
                : viewState === "certificate"
                ? "bg-yellow-50 border-l-4 border-yellow-500 cursor-pointer"
                : "hover:bg-gray-50 border-l-4 border-transparent cursor-pointer",
            )}
          >
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                allLessonsPassed ? "bg-yellow-100" : "bg-gray-200"
              )}
            >
              {allLessonsPassed ? (
                <Award className="w-4 h-4 text-yellow-600" />
              ) : (
                <Lock className="w-4 h-4 text-gray-500" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p
                  className={cn(
                    "text-[13px] font-bold",
                    allLessonsPassed
                      ? viewState === "certificate"
                        ? "text-yellow-900"
                        : "text-gray-900"
                      : "text-gray-500",
                  )}
                >
                  Course Certificate
                </p>
                {!allLessonsPassed && (
                  <span className="text-[9px] font-bold uppercase tracking-wider bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded">
                    Locked
                  </span>
                )}
              </div>
              <p className="text-[11px] text-gray-500">
                {allLessonsPassed ? "Claim Certificate" : "Score ≥ 50% on all exams to unlock"}
              </p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
