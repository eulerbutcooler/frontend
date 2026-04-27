"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, Check, X, ChevronDown, ChevronRight } from "lucide-react";
import { FileUploadZone } from "./file-upload-zone";
import { FileList } from "./file-list";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import {
  useCreateLesson,
  useUpdateLesson,
  useDeleteLesson,
} from "@/hooks/use-courses";
import type { Lesson } from "@/types/course";

interface LessonListProps {
  courseId: string;
  lessons: Lesson[];
  isInstructor: boolean;
  instructorId?: string;
}

export function LessonList({ courseId, lessons, isInstructor, instructorId }: LessonListProps) {
  const [showAdd, setShowAdd] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const createLesson = useCreateLesson();
  const updateLesson = useUpdateLesson();
  const deleteLesson = useDeleteLesson();
  const router = useRouter();

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
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="font-display text-display-md text-ink">
          Course Modules
        </h2>
        {isInstructor && (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowAdd(!showAdd)}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Add Lesson
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {/* Add lesson inline form */}
        {showAdd && (
          <div className="bg-white border-2 border-dashed border-brand-lavender rounded-[24px] p-6 flex gap-4 items-center animate-fade-in">
            <div className="w-14 h-14 rounded-2xl bg-brand-lavender/20 flex items-center justify-center shrink-0">
              <Plus className="h-5 w-5 text-brand-lavender" />
            </div>
            <Input
              placeholder="Lesson title..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              className="flex-1"
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

        {/* Lesson items */}
        {lessons.length === 0 && !showAdd && (
          <div className="bg-surface-card rounded-[24px] border border-hairline p-12 text-center">
            <p className="text-title-md font-semibold text-ink mb-1">
              No lessons yet
            </p>
            <p className="text-body-md text-surface-tint">
              {isInstructor
                ? "Add lessons to build your course curriculum."
                : "Lessons will appear here once the instructor adds them."}
            </p>
          </div>
        )}

        {lessons.map((lesson, i) => (
          <div key={lesson.id} className="bg-white border border-hairline rounded-[24px] overflow-hidden hover:border-outline-variant transition-colors group">
          <div
            className="p-6 flex gap-6 items-center cursor-pointer"
            onClick={() => setExpandedId(expandedId === lesson.id ? null : lesson.id)}
          >
            <div className="w-14 h-14 rounded-2xl bg-surface-card flex items-center justify-center shrink-0 border border-hairline text-ink font-display text-title-lg font-semibold">
              {i + 1}
            </div>
            {expandedId === lesson.id ? (
              <ChevronDown className="h-4 w-4 text-surface-tint shrink-0 md:hidden" />
            ) : (
              <ChevronRight className="h-4 w-4 text-surface-tint shrink-0 md:hidden" />
            )}
            <div className="flex-1 min-w-0">
              {editingId === lesson.id ? (
                <div className="flex gap-3 items-center">
                  <Input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && handleUpdate(lesson.id)
                    }
                    className="flex-1"
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
                <h3 className="text-title-lg font-semibold text-ink truncate">
                  {lesson.title}
                </h3>
              )}
            </div>

            {isInstructor && editingId !== lesson.id && (
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => {
                    setEditingId(lesson.id);
                    setEditTitle(lesson.title);
                  }}
                  className="w-8 h-8 flex items-center justify-center text-surface-tint hover:text-ink rounded-lg hover:bg-surface-container transition-colors"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(lesson.id)}
                  className="w-8 h-8 flex items-center justify-center text-surface-tint hover:text-error rounded-lg hover:bg-error/10 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>

          {/* Files section (expanded) */}
          {expandedId === lesson.id && (
            <div className="px-6 pb-6 border-t border-hairline pt-4 animate-fade-in">
              <FileList lessonId={lesson.id} isInstructor={isInstructor} />
              {isInstructor && instructorId && (
                <div className="mt-4">
                  <FileUploadZone lessonId={lesson.id} instructorId={instructorId} />
                </div>
              )}
            </div>
          )}
          </div>
        ))}
      </div>
    </div>
  );
}
