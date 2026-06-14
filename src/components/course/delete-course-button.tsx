"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useDeleteCourse } from "@/hooks/use-courses";
import { Trash2 } from "lucide-react";

interface DeleteCourseButtonProps {
  courseId: string;
}

export function DeleteCourseButton({ courseId }: DeleteCourseButtonProps) {
  const router = useRouter();
  const deleteCourse = useDeleteCourse();

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this course?")) return;
    await deleteCourse.mutateAsync(courseId);
    router.push("/courses");
  };

  return (
    <Button
      variant="destructive"
      className="gap-2"
      disabled={deleteCourse.isPending}
      onClick={handleDelete}
    >
      <Trash2 className="h-4 w-4" />
      {deleteCourse.isPending ? "Deleting..." : "Delete"}
    </Button>
  );
}
