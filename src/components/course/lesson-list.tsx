"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, Check, X, ChevronDown, ChevronRight } from "lucide-react";
import { FileList } from "./file-list";
import { PublishBar } from "./publish-bar";
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
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="font-display text-display-md text-ink">
            Course Modules
          </h2>
          {isInstructor && (
            <p className="text-body-sm text-surface-tint mt-1">
              Add modules and upload files. Each file ingests on its own — publish once all are ready.
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
            Add Lesson
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {/* Add lesson inline form */}
        {showAdd && (
          <div className="bg-surface-card border-2 border-dashed border-brand-lavender rounded-[24px] p-6 flex gap-4 items-center animate-fade-in">
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
          <div className="bg-surface-card rounded-2xl border border-hairline p-12 text-center">
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
          <div key={lesson.id} className="bg-surface-card border border-hairline rounded-[24px] overflow-hidden hover:border-outline-variant transition-colors group">
          <div className="p-6 flex gap-6 items-center">
            {editingId === lesson.id ? (
              <> 
                <div className="w-14 h-14 rounded-2xl bg-surface-card flex items-center justify-center shrink-0 border border-hairline text-ink font-display text-title-lg font-semibold">
                  {i + 1}
                </div>
                <div className="flex gap-3 items-center flex-1">
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
              </>
            ) : (
              <>
                <button
                  onClick={() => setExpandedId(expandedId === lesson.id ? null : lesson.id)}
                  aria-expanded={expandedId === lesson.id}
                  aria-controls={`lesson-content-${lesson.id}`}
                  className="focus-ring flex flex-1 items-center gap-4 cursor-pointer text-left"
                >
                  <div className="w-14 h-14 rounded-2xl bg-surface-card flex items-center justify-center shrink-0 border border-hairline text-ink font-display text-title-lg font-semibold">
                    {i + 1}
                  </div>
                  {expandedId === lesson.id ? (
                    <ChevronDown className="h-4 w-4 text-surface-tint shrink-0" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-surface-tint shrink-0" />
                  )}
                  <h3 className="text-title-lg font-semibold text-ink truncate">
                    {lesson.title}
                  </h3>
                </button>
                {isInstructor && (
                  <div className="flex gap-1 shrink-0">
                    <IconButton
                      label="Edit lesson title"
                      onClick={() => {
                        setEditingId(lesson.id);
                        setEditTitle(lesson.title);
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </IconButton>
                    <IconButton
                      label="Delete lesson"
                      onClick={() => handleDelete(lesson.id)}
                      className="hover:bg-error/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </IconButton>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Files section (expanded) */}
          {expandedId === lesson.id && (
            <div id={`lesson-content-${lesson.id}`} className="px-6 pb-6 border-t border-hairline pt-4 animate-fade-in">
              <FileList lessonId={lesson.id} isInstructor={isInstructor} instructorId={instructorId} />
            </div>
          )}
          </div>
        ))}
      </div>

      {/* Sticky publish gate — only enabled once every file is ingested */}
      {isInstructor && (
        <PublishBar
          courseId={courseId}
          published={!!published}
          summary={fileSummary}
        />
      )}
    </div>
  );
}
