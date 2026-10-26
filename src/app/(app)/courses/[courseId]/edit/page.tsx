"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { CourseForm } from "@/components/course/course-form";
import { Plus, Save, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { LessonCard } from "@/components/course/lesson-card";
import { DeleteCourseButton } from "@/components/course/delete-course-button";
import { useCourses, useLessons, useCreateLesson, useFinalizeCourse } from "@/hooks/use-courses";
import { useCourseFiles } from "@/hooks/use-course-files";

export default function EditCoursePage() {
  const { courseId } = useParams<{ courseId: string }>();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("curriculum");

  const { data: courses = [] } = useCourses();
  const course = courses.find((c) => c.id === courseId);

  const { data: lessons = [] } = useLessons(courseId);
  const { mutate: createLesson, isPending: isCreatingLesson } = useCreateLesson();
  const { mutate: finalizeCourse, isPending: isFinalizing } = useFinalizeCourse();

  // Polling summary of all file ingests across all lessons
  const fileSummary = useCourseFiles(lessons);

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

  const handlePublish = () => {
    finalizeCourse(courseId, {
      onSuccess: () => {
        router.push("/courses");
      },
    });
  };

  const canPublish = fileSummary.total > 0 && fileSummary.allReady && !fileSummary.busy;

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
      <div className="flex items-center justify-between mb-6 px-2">
        <h1 className="text-[20px] font-bold text-gray-900 tracking-tight">
          Subject builder studio...
        </h1>
        <div className="flex items-center gap-4">
          <span className="text-[12px] font-medium text-gray-500 flex items-center gap-1.5">
            <Save className="w-3.5 h-3.5"/> All changes saved
          </span>
          <button 
            onClick={handlePublish}
            disabled={!canPublish || isFinalizing}
            className="flex items-center gap-2 h-8 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[13px] font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isFinalizing && <Loader2 className="w-4 h-4 animate-spin" />}
            Publish
          </button>
        </div>
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
