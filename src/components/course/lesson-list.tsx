"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, Check, X, ChevronDown, ChevronRight } from "lucide-react";
import { FileList } from "./file-list";
import { LessonPlanButton } from "./lesson-plan-button";
import { Button } from "@/components/ui/button";
import { IconButton } from "@/components/ui/icon-button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import {
  useCreateLesson,
  useUpdateLesson,
  useDeleteLesson,
} from "@/hooks/use-courses";
import { useCourseFiles } from "@/hooks/use-course-files";
import type { Lesson } from "@/types/course";

interface LessonListProps {
  courseId: string;
  lessons: Lesson[];
  isInstructor: boolean;
  instructorId?: string;
  published?: boolean;
}

export function LessonList({ courseId, lessons, isInstructor, instructorId, published }: LessonListProps) {
  const [showAdd, setShowAdd] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const createLesson = useCreateLesson();
  const updateLesson = useUpdateLesson();
  const deleteLesson = useDeleteLesson();
  const router = useRouter();

  const fileSummary = useCourseFiles(lessons);

  const handleAdd = async () => {
    if (!newTitle.trim()) return;
    await createLesson.mutateAsync({
      courseId,
      data: { title: newTitle.trim(), order_idx: lessons.length },
    });
    setNewTitle("");
    setShowAdd(false);
    router.refresh();
  };

  const handleUpdate = async (lessonId: string) => {
    if (!editTitle.trim()) return;
    await updateLesson.mutateAsync({
      id: lessonId,
      data: { title: editTitle.trim(), order_idx: 0 },
    });
    setEditingId(null);
    router.refresh();
  };

  const handleDelete = async (lessonId: string) => {
    await deleteLesson.mutateAsync({ id: lessonId, courseId });
    router.refresh();
  };

  return (
    <div className="flex flex-col max-h-full min-h-0">
      <div className="flex items-center justify-between mb-6 shrink-0">
        <div>
          <h2 className="text-[16px] font-semibold text-gray-900">
            Lectures
          </h2>
          {isInstructor && (
            <p className="text-[13px] text-gray-500 mt-1">
              Add lectures and upload files. Each file ingests on its own — publish once all are ready.
            </p>
          )}
        </div>
        {isInstructor && (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowAdd(!showAdd)}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Lecture
          </Button>
        )}
      </div>

      <div className="border border-gray-200 rounded-xl overflow-hidden flex flex-col min-h-0">
        {/* Add lesson inline form */}
        {showAdd && (
          <div className="bg-gray-50 border-b border-gray-200 p-4 flex gap-3 items-center animate-fade-in shrink-0">
            <Input
              placeholder="Lecture title..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              className="flex-1 bg-white"
              autoFocus
            />
            <Button
              size="sm"
              onClick={handleAdd}
              disabled={createLesson.isPending}
            >
              <Check className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setShowAdd(false);
                setNewTitle("");
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}

        <div className="overflow-y-auto scrollbar-hide flex-1 min-h-0">
          {/* Lesson items */}
          {lessons.length === 0 && !showAdd && (
            <div className="bg-gray-50 p-12 text-center">
              <p className="text-[15px] font-semibold text-gray-900 mb-1">
                No lectures yet
              </p>
              <p className="text-[13px] text-gray-500">
                {isInstructor
                  ? "Add lectures to build your course curriculum."
                  : "Lectures will appear here once the instructor adds them."}
              </p>
            </div>
          )}

          {lessons.map((lesson, i) => (
            <div key={lesson.id} className="bg-white border-b border-gray-200 last:border-b-0 hover:bg-gray-50 transition-colors group">
              <div
                className="px-6 py-4 flex gap-4 items-center cursor-pointer"
                onClick={() => setExpandedId(expandedId === lesson.id ? null : lesson.id)}
              >
                <div className="flex-1 min-w-0">
                  {editingId === lesson.id ? (
                    <div className="flex gap-3 items-center" onClick={e => e.stopPropagation()}>
                      <Input
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        onKeyDown={(e) =>
                          e.key === "Enter" && handleUpdate(lesson.id)
                        }
                        className="flex-1 bg-white"
                        autoFocus
                      />
                      <Button
                        size="sm"
                        onClick={() => handleUpdate(lesson.id)}
                        disabled={updateLesson.isPending}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingId(null)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <span className="text-[13px] font-medium text-gray-400 w-5 shrink-0">
                        {i + 1}.
                      </span>
                      <h3 className="min-w-0 flex-1 text-[15px] font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                        {lesson.title}
                      </h3>
                      <LessonPlanButton lesson={lesson} compact />
                    </div>
                  )}
                </div>

                {isInstructor && editingId !== lesson.id && (
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={e => e.stopPropagation()}>
                    <button
                      onClick={() => {
                        setEditingId(lesson.id);
                        setEditTitle(lesson.title);
                      }}
                      className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-900 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(lesson.id)}
                      className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                )}

                <div className="shrink-0 flex items-center justify-center text-gray-400 group-hover:text-gray-900 transition-colors ml-2">
                  {expandedId === lesson.id ? (
                    <X className="h-4 w-4" />
                  ) : (
                    <Plus className="h-4 w-4" />
                  )}
                </div>
              </div>

              {/* Files section (expanded) */}
              {expandedId === lesson.id && (
                <div className="px-6 pb-6 bg-gray-50/50 pt-2 animate-fade-in">
                  <FileList lessonId={lesson.id} isInstructor={isInstructor} instructorId={instructorId} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
