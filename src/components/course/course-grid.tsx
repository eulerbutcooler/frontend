import { Plus } from "lucide-react";
import Link from "next/link";
import { CourseCard } from "./course-card";
import type { Course } from "@/types/course";

interface CourseGridProps {
  courses: Course[];
  isInstructor?: boolean;
}

export function CourseGrid({ courses, isInstructor }: CourseGridProps) {
  if (courses.length === 0) {
    return (
      <div className="bg-surface-card rounded-2xl border border-hairline p-16 text-center">
        <h3 className="font-display text-display-sm text-ink mb-2">
          No courses available
        </h3>
        <p className="text-body-md text-surface-tint mb-8 max-w-md mx-auto">
          {isInstructor
            ? "Create your first course to start training cadets."
            : "Check back soon — courses are being prepared for your rank."}
        </p>
        {isInstructor && (
          <Link
            href="/courses/new"
            className="inline-flex items-center gap-2 bg-ink text-white h-11 px-6 rounded-xl text-button font-semibold hover:bg-ink/90 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Create Course
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {courses.map((course, i) => (
        <CourseCard key={course.id || i} course={course} index={i} />
      ))}
    </div>
  );
}
