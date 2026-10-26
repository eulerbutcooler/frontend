"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { DocViewer } from "./doc-viewer";
import { QuizViewer } from "./quiz-viewer";
import { CertificateViewer } from "./certificate-viewer";
import { TopicSlidesViewer } from "./topic-slides-viewer";
import { LessonSidebar } from "./lesson-sidebar";
import { useProgress } from "@/hooks/use-progress";
import { clientApi } from "@/lib/api-client.client";
import type { LessonWithContent } from "@/types/progress";
import type { LessonTopic } from "@/types/quiz";

interface CoursePlayerProps {
  courseId: string;
  courseTitle?: string;
  lessons: LessonWithContent[];
  initialLessonIdx?: number;
  initialFileIdx?: number;
  isInstructor?: boolean;
}

export function CoursePlayer({
  courseId,
  courseTitle,
  lessons,
  initialProgress,
  initialLessonIdx = 0,
  initialFileIdx = 0,
  isInstructor = false,
}: CoursePlayerProps & { initialProgress: any }) {
  const {
    markFileViewed,
    markLessonComplete,
    markCourseComplete,
    isLessonComplete,
    isFileViewed,
    isCourseComplete,
    completedCount,
    percentage,
  } = useProgress(courseId, lessons.length, initialProgress);

  const [currentLessonIdx, setCurrentLessonIdx] = useStateWithCallback(initialLessonIdx);
  const [currentFileIdx, setCurrentFileIdx] = useStateWithCallback(initialFileIdx);
  const [currentTopicIdx, setCurrentTopicIdx] = useState(0);

  // Client-side cache for dynamically loaded topics
  const [topicsCache, setTopicsCache] = useState<Record<string, LessonTopic[]>>(() => {
    const map: Record<string, LessonTopic[]> = {};
    lessons.forEach((l) => {
      if (l.topics && l.topics.length > 0) {
        map[l.id] = l.topics;
      }
    });
    return map;
  });

  const currentLesson = lessons[currentLessonIdx];
  const currentTopics = topicsCache[currentLesson?.id] || currentLesson?.topics || [];
  const currentFile = currentLesson?.files?.[currentFileIdx];
  const totalFilesInLesson = currentLesson?.files?.length ?? 0;
  const totalTopicsInLesson = currentTopics.length;
  const hasQuiz = !!currentLesson?.quiz;

  const [viewState, setViewState] = useState<"slides" | "file" | "quiz" | "certificate">(() => {
    const initLesson = lessons[initialLessonIdx];
    if (initLesson?.topics && initLesson.topics.length > 0) return "slides";
    if (initLesson?.files && initLesson.files.length > 0) return "file";
    if (initLesson?.quiz) return "quiz";
    return "slides";
  });

  // Lazy-load topics if not present in initial SSR payload
  useEffect(() => {
    if (!currentLesson?.id) return;
    if (!topicsCache[currentLesson.id] && (!currentLesson.topics || currentLesson.topics.length === 0)) {
      clientApi
        .get<LessonTopic[]>(`/api/v1/lessons/${currentLesson.id}/topics`)
        .then((data) => {
          if (Array.isArray(data) && data.length > 0) {
            setTopicsCache((prev) => ({ ...prev, [currentLesson.id]: data }));
          }
        })
        .catch(() => {});
    }
  }, [currentLesson?.id, topicsCache]);

  // Mark file as viewed when navigating to it
  useEffect(() => {
    if (viewState === "file" && currentLesson && currentFile) {
      markFileViewed(currentLesson.id, currentFile.id);
    }
  }, [
    currentLessonIdx,
    currentFileIdx,
    viewState,
    currentLesson,
    currentFile,
    markFileViewed,
  ]);

  const canGoPrev =
    currentLessonIdx > 0 ||
    (viewState === "slides" && currentTopicIdx > 0) ||
    (viewState === "file" && (currentFileIdx > 0 || totalTopicsInLesson > 0)) ||
    viewState === "quiz" ||
    viewState === "certificate";

  const isCurrentLessonComplete = currentLesson
    ? isLessonComplete(currentLesson.id)
    : false;

  // Lesson is unlocked if it's the first lesson, or if all previous lessons are complete (>= 50% score), or if instructor previewing
  const isLessonUnlocked = useCallback(
    (lessonIdx: number) => {
      if (isInstructor) return true;
      if (lessonIdx === 0) return true;
      for (let i = 0; i < lessonIdx; i++) {
        if (!isLessonComplete(lessons[i].id)) {
          return false;
        }
      }
      return true;
    },
    [lessons, isLessonComplete, isInstructor]
  );

  const allLessonsPassed = useMemo(() => {
    if (isInstructor) return true;
    return lessons.length > 0 && lessons.every((l) => isLessonComplete(l.id));
  }, [lessons, isLessonComplete, isInstructor]);

  const canGoNext =
    (viewState === "slides" && (currentTopicIdx < totalTopicsInLesson - 1 || totalFilesInLesson > 0 || hasQuiz || (currentLessonIdx < lessons.length - 1 && isCurrentLessonComplete))) ||
    (viewState === "file" && (currentFileIdx < totalFilesInLesson - 1 || hasQuiz || (currentLessonIdx < lessons.length - 1 && isCurrentLessonComplete))) ||
    (viewState === "quiz" && ((currentLessonIdx < lessons.length - 1 && isCurrentLessonComplete) || (currentLessonIdx === lessons.length - 1 && allLessonsPassed)));

  const isLastItemInLesson =
    viewState === "quiz" ||
    (!hasQuiz && viewState === "file" && currentFileIdx === totalFilesInLesson - 1) ||
    (!hasQuiz && totalFilesInLesson === 0 && viewState === "slides" && currentTopicIdx === totalTopicsInLesson - 1);

  const goNext = useCallback(() => {
    if (viewState === "slides") {
      if (currentTopicIdx < totalTopicsInLesson - 1) {
        setCurrentTopicIdx(currentTopicIdx + 1);
      } else if (totalFilesInLesson > 0) {
        setViewState("file");
        setCurrentFileIdx(0);
      } else if (hasQuiz) {
        setViewState("quiz");
      } else if (currentLessonIdx < lessons.length - 1) {
        if (!currentLesson || !isLessonComplete(currentLesson.id)) return;
        const nextIdx = currentLessonIdx + 1;
        setCurrentLessonIdx(nextIdx);
        setCurrentTopicIdx(0);
        setCurrentFileIdx(0);
        const nextLesson = lessons[nextIdx];
        const nextTopics = topicsCache[nextLesson?.id] || nextLesson?.topics || [];
        setViewState(nextTopics.length > 0 ? "slides" : "file");
      } else {
        if (allLessonsPassed) {
          setViewState("certificate");
        }
      }
    } else if (viewState === "file") {
      if (currentFileIdx < totalFilesInLesson - 1) {
        setCurrentFileIdx(currentFileIdx + 1);
      } else if (hasQuiz) {
        setViewState("quiz");
      } else if (currentLessonIdx < lessons.length - 1) {
        if (!currentLesson || !isLessonComplete(currentLesson.id)) return;
        const nextIdx = currentLessonIdx + 1;
        setCurrentLessonIdx(nextIdx);
        setCurrentTopicIdx(0);
        setCurrentFileIdx(0);
        const nextLesson = lessons[nextIdx];
        const nextTopics = topicsCache[nextLesson?.id] || nextLesson?.topics || [];
        setViewState(nextTopics.length > 0 ? "slides" : "file");
      } else {
        if (allLessonsPassed) {
          setViewState("certificate");
        }
      }
    } else if (viewState === "quiz") {
      if (currentLessonIdx < lessons.length - 1) {
        if (!currentLesson || !isLessonComplete(currentLesson.id)) return;
        const nextIdx = currentLessonIdx + 1;
        setCurrentLessonIdx(nextIdx);
        setCurrentTopicIdx(0);
        setCurrentFileIdx(0);
        const nextLesson = lessons[nextIdx];
        const nextTopics = topicsCache[nextLesson?.id] || nextLesson?.topics || [];
        setViewState(nextTopics.length > 0 ? "slides" : "file");
      } else {
        if (allLessonsPassed) {
          setViewState("certificate");
        }
      }
    }
  }, [
    viewState,
    currentTopicIdx,
    totalTopicsInLesson,
    currentFileIdx,
    totalFilesInLesson,
    hasQuiz,
    currentLessonIdx,
    currentLesson,
    lessons,
    topicsCache,
    isLessonComplete,
    allLessonsPassed,
    setCurrentFileIdx,
    setCurrentLessonIdx,
  ]);

  const goPrev = useCallback(() => {
    if (viewState === "certificate") {
      const lastLesson = lessons[lessons.length - 1];
      setCurrentLessonIdx(lessons.length - 1);
      if (lastLesson?.quiz) {
        setViewState("quiz");
      } else if (lastLesson?.files?.length) {
        setViewState("file");
        setCurrentFileIdx(lastLesson.files.length - 1);
      } else {
        setViewState("slides");
      }
    } else if (viewState === "quiz") {
      if (totalFilesInLesson > 0) {
        setViewState("file");
        setCurrentFileIdx(totalFilesInLesson - 1);
      } else if (totalTopicsInLesson > 0) {
        setViewState("slides");
        setCurrentTopicIdx(Math.max(0, totalTopicsInLesson - 1));
      }
    } else if (viewState === "file") {
      if (currentFileIdx > 0) {
        setCurrentFileIdx(currentFileIdx - 1);
      } else if (totalTopicsInLesson > 0) {
        setViewState("slides");
        setCurrentTopicIdx(Math.max(0, totalTopicsInLesson - 1));
      } else if (currentLessonIdx > 0) {
        const prevLesson = lessons[currentLessonIdx - 1];
        setCurrentLessonIdx(currentLessonIdx - 1);
        if (prevLesson.quiz) {
          setViewState("quiz");
        } else {
          setCurrentFileIdx(Math.max(0, (prevLesson.files?.length || 1) - 1));
          setViewState("file");
        }
      }
    } else if (viewState === "slides") {
      if (currentTopicIdx > 0) {
        setCurrentTopicIdx(currentTopicIdx - 1);
      } else if (currentLessonIdx > 0) {
        const prevIdx = currentLessonIdx - 1;
        const prevLesson = lessons[prevIdx];
        setCurrentLessonIdx(prevIdx);
        if (prevLesson.quiz) {
          setViewState("quiz");
        } else if (prevLesson.files?.length) {
          setCurrentFileIdx(prevLesson.files.length - 1);
          setViewState("file");
        } else {
          setViewState("slides");
        }
      }
    }
  }, [
    viewState,
    currentTopicIdx,
    totalTopicsInLesson,
    currentFileIdx,
    totalFilesInLesson,
    currentLessonIdx,
    lessons,
    setCurrentFileIdx,
    setCurrentLessonIdx,
  ]);

  const goToTopic = useCallback(
    (lessonIdx: number, topicIdx: number) => {
      if (!isLessonUnlocked(lessonIdx)) return;
      setCurrentLessonIdx(lessonIdx);
      setCurrentTopicIdx(topicIdx);
      setViewState("slides");
    },
    [setCurrentLessonIdx, isLessonUnlocked]
  );

  const goToFile = useCallback(
    (lessonIdx: number, fileIdx: number) => {
      if (!isLessonUnlocked(lessonIdx)) return;
      setCurrentLessonIdx(lessonIdx);
      setCurrentFileIdx(fileIdx);
      setViewState("file");
    },
    [setCurrentLessonIdx, setCurrentFileIdx, isLessonUnlocked]
  );

  const goToQuiz = useCallback(
    (lessonIdx: number) => {
      if (!isLessonUnlocked(lessonIdx)) return;
      setCurrentLessonIdx(lessonIdx);
      setViewState("quiz");
    },
    [setCurrentLessonIdx, isLessonUnlocked]
  );

  const goToCertificate = useCallback(() => {
    if (!allLessonsPassed) return;
    setViewState("certificate");
  }, [allLessonsPassed]);

  const handleMarkComplete = useCallback(() => {
    if (currentLesson) {
      markLessonComplete(currentLesson.id);
      goNext();
    }
  }, [currentLesson, markLessonComplete, goNext]);

  return (
    <div className="flex-1 min-h-0 bg-white border border-gray-200 rounded-xl overflow-hidden flex">
      {/* Left: Main Content Stage */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Navigation & Mode Switcher Header */}
        {viewState !== "certificate" && (
          <div className="shrink-0 px-6 py-2.5 border-b border-gray-200 flex items-center justify-between bg-white gap-4">
            {/* Mode Switcher Tabs */}
            <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-xl">
              <button
                type="button"
                onClick={() => setViewState("slides")}
                className={cn(
                  "px-3.5 py-1.5 rounded-lg text-[13px] font-semibold transition-all cursor-pointer",
                  viewState === "slides"
                    ? "bg-white text-blue-700 shadow-xs"
                    : "text-gray-600 hover:text-gray-900"
                )}
              >
                AI Briefing
              </button>

              <button
                type="button"
                onClick={() => setViewState("file")}
                className={cn(
                  "px-3.5 py-1.5 rounded-lg text-[13px] font-semibold transition-all cursor-pointer",
                  viewState === "file"
                    ? "bg-white text-gray-900 shadow-xs"
                    : "text-gray-600 hover:text-gray-900"
                )}
              >
                Reference Manuals
              </button>

              {hasQuiz && (
                <button
                  type="button"
                  onClick={() => setViewState("quiz")}
                  className={cn(
                    "px-3.5 py-1.5 rounded-lg text-[13px] font-semibold transition-all cursor-pointer",
                    viewState === "quiz"
                      ? "bg-white text-purple-700 shadow-xs"
                      : "text-gray-600 hover:text-purple-900"
                  )}
                >
                  Exam
                </button>
              )}
            </div>

            {/* Context Info on Current Selection */}
            <div className="flex items-center gap-2 min-w-0">
              {viewState === "slides" && (
                <span className="text-[12px] text-gray-500 truncate">
                  Lesson {currentLessonIdx + 1}: <strong className="text-gray-900 font-semibold">{currentLesson?.title}</strong>
                </span>
              )}

              {viewState === "file" && currentFile && (
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-[12px] font-semibold text-gray-900 truncate">
                    {currentFile.file_name}
                  </span>
                  <span className="text-[10px] font-bold text-gray-500 uppercase px-1.5 py-0.5 bg-gray-100 rounded shrink-0">
                    {currentFile.file_type}
                  </span>
                  <span className="text-[11px] text-gray-400 shrink-0 ml-1">
                    ({currentFileIdx + 1}/{totalFilesInLesson})
                  </span>
                </div>
              )}

              {viewState === "quiz" && (
                <span className="text-[12px] font-semibold text-purple-900 bg-purple-50 px-2.5 py-1 rounded-md border border-purple-100">
                  Cadet Timed Knowledge Assessment
                </span>
              )}
            </div>
          </div>
        )}

        {/* Content Area */}
        <div className={cn(
          "flex-1 min-h-0 overflow-hidden",
          viewState === "slides" ? "bg-white p-0" : "bg-gray-50/50 p-3"
        )}>
          {viewState === "slides" && (
            <TopicSlidesViewer
              key={`slides-${currentLesson?.id}-${currentTopicIdx}`}
              topics={currentTopics}
              activeTopicIndex={currentTopicIdx}
              courseId={courseId}
              subjectTitle={courseTitle || currentLesson?.title}
              onTopicChange={(idx) => setCurrentTopicIdx(idx)}
              onCompleteLesson={() => {
                if (hasQuiz) {
                  setViewState("quiz");
                } else {
                  handleMarkComplete();
                }
              }}
            />
          )}

          {viewState === "file" && currentFile && (
            <DocViewer key={`${currentLesson?.id}-${currentFile.id}`} file={currentFile} />
          )}

          {viewState === "quiz" && currentLesson?.quiz && (
            <QuizViewer
              key={`quiz-${currentLesson?.id}`}
              quiz={currentLesson.quiz}
              onPass={(score) => {
                if (currentLesson) {
                  markLessonComplete(currentLesson.id);
                }
              }}
            />
          )}

          {viewState === "certificate" && (
            <CertificateViewer
              courseId={courseId}
              onComplete={markCourseComplete}
              isCompleted={isCourseComplete}
            />
          )}
        </div>

        {/* Bottom Navigation */}
        <div className="shrink-0 px-6 py-3 border-t border-gray-200 flex items-center justify-between bg-white">
          <button
            onClick={goPrev}
            disabled={!canGoPrev}
            className={cn(
              "flex items-center gap-1.5 text-[13px] font-medium rounded-lg px-3 py-1.5 transition-colors cursor-pointer",
              canGoPrev
                ? "text-gray-700 hover:bg-gray-100"
                : "text-gray-300 cursor-not-allowed"
            )}
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>

          {/* Center: Mark Complete / Lesson info */}
          <div className="flex items-center gap-3">
            {isLastItemInLesson && !hasQuiz && !isCurrentLessonComplete && (
              <button
                onClick={handleMarkComplete}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-[13px] font-medium rounded-lg transition-colors cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                Mark Lesson Complete
              </button>
            )}
            {isCurrentLessonComplete && (
              <span className="flex items-center gap-1.5 text-[12px] font-medium text-green-600">
                <CheckCircle2 className="w-4 h-4" />
                Lesson Complete
              </span>
            )}
          </div>

          <button
            onClick={goNext}
            disabled={!canGoNext}
            className={cn(
              "flex items-center gap-1.5 text-[13px] font-medium rounded-lg px-3 py-1.5 transition-colors cursor-pointer",
              canGoNext
                ? "text-gray-700 hover:bg-gray-100"
                : "text-gray-300 cursor-not-allowed"
            )}
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Right: Detailed Lesson Sidebar with Topics Outline */}
      <LessonSidebar
        lessons={lessons.map((l) => ({
          ...l,
          topics: topicsCache[l.id] || l.topics || [],
        }))}
        currentLessonIdx={currentLessonIdx}
        currentFileIdx={currentFileIdx}
        currentTopicIdx={currentTopicIdx}
        viewState={viewState}
        isLessonComplete={isLessonComplete}
        isFileViewed={isFileViewed}
        percentage={percentage}
        completedCount={completedCount}
        isLessonUnlocked={isLessonUnlocked}
        allLessonsPassed={allLessonsPassed}
        onTopicSelect={goToTopic}
        onFileSelect={goToFile}
        onQuizSelect={goToQuiz}
        onCertificateSelect={goToCertificate}
      />
    </div>
  );
}

// Simple useState wrapper that returns a stable setter
function useStateWithCallback<T>(initial: T): [T, (val: T) => void] {
  const [state, setState] = useState(initial);
  return [state, setState];
}

