"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { CourseForm } from "@/components/course/course-form";
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  Plus,
  RefreshCw,
  Rocket,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { LessonCard } from "@/components/course/lesson-card";
import { MasterSyllabusCard } from "@/components/course/master-syllabus-card";
import { SubjectMaterialCard } from "@/components/course/subject-material-card";
import { DeleteCourseButton } from "@/components/course/delete-course-button";
import {
  useCourses,
  useLessons,
  useMaterialsLesson,
  useCreateLesson,
  useGenerateContent,
  usePublishCourse,
  useRetryLessonPlans,
} from "@/hooks/use-courses";
import { useCourseFiles } from "@/hooks/use-course-files";
import { quizListOptions } from "@/hooks/use-quiz";

export default function EditCoursePage() {
  const { courseId } = useParams<{ courseId: string }>();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("curriculum");

  const { data: courses = [] } = useCourses();
  const course = courses.find((c) => c.id === courseId);

  const { data: lessons = [] } = useLessons(courseId);
  const { data: materialsLesson } = useMaterialsLesson(courseId);
  const { mutate: createLesson, isPending: isCreatingLesson } = useCreateLesson();
  const { mutate: generateContent, isPending: isGeneratingRequest } = useGenerateContent();
  const { mutate: publishCourse, isPending: isPublishing } = usePublishCourse();
  const { mutate: retryLessonPlans, isPending: isRetryingPlans } = useRetryLessonPlans();

  // Polling summary of all file ingests across all lessons plus subject-level
  // supporting material.
  const fileSummary = useCourseFiles(lessons, materialsLesson?.id);

  const { data: quizzes = [] } = useQuery({
    ...quizListOptions(courseId),
    refetchInterval: (query) => {
      const list = query.state.data ?? [];
      return list.some(
        (quiz) => quiz.status === "generating" || quiz.status === "pending"
      )
        ? 2500
        : false;
    },
    refetchIntervalInBackground: true,
  });

  const lessonQuizzes = quizzes.filter((quiz) => quiz.lesson_id);
  const quizzesGenerating = lessonQuizzes.some(
    (quiz) => quiz.status === "generating" || quiz.status === "pending"
  );
  const quizzesReady =
    lessonQuizzes.length > 0 &&
    lessonQuizzes.every((quiz) => quiz.status === "ready");
  const quizzesFailed = lessonQuizzes.some((quiz) => quiz.status === "failed");
  const filesReady =
    fileSummary.total > 0 && fileSummary.allReady && !fileSummary.busy;
  const lessonPlansGenerating = lessons.some(
    (lesson) =>
      lesson.lesson_plan_status === "generating" ||
      lesson.lesson_plan_status === "pending"
  );
  const lessonPlansFailed = lessons.some(
    (lesson) => lesson.lesson_plan_status === "failed"
  );
  const syllabusLessons = lessons.filter(
    (lesson) =>
      lesson.syllabus_row_index !== undefined &&
      lesson.syllabus_row_index !== null
  );
  const lessonPlansReady =
    syllabusLessons.length === 0 ||
    syllabusLessons.every((lesson) => lesson.lesson_plan_status === "ready");

  const canGenerate =
    filesReady && !quizzesGenerating && !isGeneratingRequest;
  const canPublish =
    filesReady &&
    quizzesReady &&
    lessonPlansReady &&
    !isPublishing &&
    !course?.published;

  // Auto-create Lesson 1 if empty
  useEffect(() => {
    if (lessons.length === 0 && !isCreatingLesson && course) {
      createLesson({ courseId, data: { title: "Lesson 1", order_idx: 0 } });
    }
  }, [lessons.length, isCreatingLesson, course, courseId, createLesson]);

  const handleNewLesson = () => {
    createLesson({
      courseId,
      data: {
        title: `Lesson ${lessons.length + 1}`,
        order_idx: lessons.length,
      },
    });
  };

  const handleGenerate = () => {
    generateContent(courseId, {
      onSuccess: () =>
        toast.success("Generating slides, question bank and quizzes."),
      onError: (err) =>
        toast.error(
          err instanceof Error ? err.message : "Content generation failed."
        ),
    });
  };

  const handlePublish = () => {
    publishCourse(courseId, {
      onSuccess: () => {
        toast.success("Subject published.");
        router.push(`/courses/${courseId}`);
      },
      onError: (err) =>
        toast.error(
          err instanceof Error ? err.message : "Failed to publish subject."
        ),
    });
  };

  const handleRetryLessonPlans = () => {
    retryLessonPlans(courseId, {
      onSuccess: () => toast.success("Regenerating lesson plans."),
      onError: (err) =>
        toast.error(
          err instanceof Error ? err.message : "Lesson-plan generation failed."
        ),
    });
  };

  let generationHint = "";
  let generationTone = "text-gray-500";
  if (lessonPlansFailed) {
    generationHint =
      "Some lesson plans failed. Retry lesson plans before publishing.";
    generationTone = "text-red-600";
  } else if (lessonPlansGenerating) {
    generationHint = "Lesson plans are generating in the background…";
    generationTone = "text-blue-600";
  } else if (fileSummary.total === 0) {
    generationHint =
      "Add PDFs/PPTs to the lessons first, then generate slides, question bank and quizzes.";
  } else if (fileSummary.processing > 0) {
    generationHint = `${fileSummary.processing} file${
      fileSummary.processing === 1 ? "" : "s"
    } still processing…`;
    generationTone = "text-amber-600";
  } else if (fileSummary.failed > 0) {
    generationHint = `${fileSummary.failed} file${
      fileSummary.failed === 1 ? "" : "s"
    } failed. Remove or re-upload before generating content.`;
    generationTone = "text-red-600";
  } else if (quizzesGenerating) {
    generationHint =
      "Generating slides, question bank and quizzes. This can take a few minutes…";
    generationTone = "text-blue-600";
  } else if (quizzesFailed) {
    generationHint =
      "Some quizzes failed. Regenerate content, then review the subject.";
    generationTone = "text-red-600";
  } else if (quizzesReady) {
    generationHint =
      "Content is ready. Review the slides and question bank, then publish.";
    generationTone = "text-emerald-700";
  } else {
    generationHint =
      "Files are ready. Generate slides, question bank and quizzes.";
  }

  if (!course) {
    return (
      <div className="h-[calc(100vh-4rem)] flex items-center justify-center bg-[#f3f4f6]">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  let effectiveCourse = course;
  let effectiveLessons = lessons;

  return (
    <div className="h-[calc(100vh-4rem)] -mx-6 -my-6 flex flex-col font-sans bg-[#f3f4f6] p-6">
      <div className="flex items-center justify-between mb-3 px-2 gap-4">
        <h1 className="text-[20px] font-bold text-gray-900 tracking-tight">
          Subject builder studio...
        </h1>
        <div className="flex items-center gap-2">
          {lessonPlansFailed && (
            <button
              onClick={handleRetryLessonPlans}
              disabled={isRetryingPlans}
              className="flex items-center gap-2 h-8 px-3 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-lg text-[12px] font-medium transition-colors disabled:opacity-50"
            >
              {isRetryingPlans ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <RefreshCw className="w-3.5 h-3.5" />
              )}
              Retry lesson plans
            </button>
          )}
          <button
            onClick={handleGenerate}
            disabled={!canGenerate}
            title={
              filesReady
                ? "Generate slides, question bank and quizzes from the uploaded files"
                : "Upload and finish ingesting at least one PDF or PPT first"
            }
            className="flex items-center gap-2 h-8 px-3 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-lg text-[12px] font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGeneratingRequest || quizzesGenerating ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Sparkles className="w-3.5 h-3.5" />
            )}
            {isGeneratingRequest || quizzesGenerating
              ? "Generating..."
              : quizzesReady
                ? "Regenerate Content"
                : "Generate Content"}
          </button>
          <button
            onClick={handlePublish}
            disabled={!canPublish || isPublishing}
            className="flex items-center gap-2 h-8 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[12px] font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPublishing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Rocket className="w-3.5 h-3.5" />
            )}
            {isPublishing
              ? "Publishing..."
              : course.published
                ? "Published"
                : "Publish Subject"}
          </button>
        </div>
      </div>

      <div className="mb-5 px-2">
        <span
          className={`inline-flex items-center gap-2 text-[12px] font-medium ${generationTone}`}
        >
          {lessonPlansFailed ||
          fileSummary.failed > 0 ||
          quizzesFailed ? (
            <AlertCircle className="w-3.5 h-3.5" />
          ) : quizzesReady &&
            !quizzesGenerating &&
            !lessonPlansGenerating ? (
            <CheckCircle2 className="w-3.5 h-3.5" />
          ) : lessonPlansGenerating ||
            quizzesGenerating ||
            fileSummary.processing > 0 ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Sparkles className="w-3.5 h-3.5" />
          )}
          {generationHint}
        </span>
      </div>

      <div className="flex-1 min-h-0 bg-white border border-gray-200 rounded-xl overflow-y-auto p-8 flex justify-center">
        <div className="w-full max-w-4xl flex flex-col h-full">
          
          {/* Internal Studio Navigation */}
          <div className="flex items-center shrink-0 w-full border border-gray-200 rounded-lg overflow-hidden bg-white mb-12 divide-x divide-gray-200">
            {[
              { id: "curriculum", label: "Curriculum" },
              { id: "basic", label: "Basic Info" },
              { id: "settings", label: "Settings" }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "h-11 text-[14px] font-semibold transition-colors text-center flex-1",
                  activeTab === tab.id 
                    ? "bg-gray-50 text-gray-900" 
                    : "bg-white text-gray-500 hover:bg-gray-50/50 hover:text-gray-700"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Studio Content */}
          <div className="flex-1 overflow-y-auto pb-10 scrollbar-hide">
            {activeTab === "basic" && (
              <div className="animate-in fade-in duration-300">
                <CourseForm initialData={effectiveCourse} />
              </div>
            )}

            {activeTab === "curriculum" && (
              <div className="animate-in fade-in duration-300 space-y-4">
                {materialsLesson && (
                  <SubjectMaterialCard
                    lesson={materialsLesson}
                    instructorId={effectiveCourse.instructor_id}
                  />
                )}
                <MasterSyllabusCard
                  courseId={courseId}
                  courseTitle={effectiveCourse.title}
                />
                {effectiveLessons.map(lesson => (
                  <LessonCard 
                    key={lesson.id} 
                    lesson={lesson} 
                    courseId={courseId} 
                    instructorId={effectiveCourse.instructor_id} 
                  />
                ))}

                <div className="flex justify-end mt-6">
                  <button 
                    onClick={handleNewLesson}
                    disabled={isCreatingLesson}
                    className="flex items-center gap-1.5 h-8 px-3 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-[13px] font-medium rounded-lg transition-colors disabled:opacity-50"
                  >
                    {isCreatingLesson ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                    New Lesson
                  </button>
                </div>
              </div>
            )}

            {activeTab === "settings" && (
              <div className="animate-in fade-in duration-300">
                <p className="text-[13px] text-gray-500 mb-6">Irreversible and destructive actions.</p>
                <div className="border border-red-200 bg-red-50/50 rounded-xl p-5 flex items-center justify-between">
                  <div>
                    <h3 className="text-[14px] font-bold text-red-900">Delete Subject</h3>
                    <p className="text-[12px] text-red-700 mt-0.5">Permanently remove this subject and all of its content.</p>
                  </div>
                  <DeleteCourseButton courseId={course.id} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
