import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { api } from "@/lib/api-client";
import { CourseGrid } from "@/components/course/course-grid";
import type { Course } from "@/types/course";
import Link from "next/link";
import { Plus } from "lucide-react";

export default async function CoursesPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const isInstructor = session.user.role === "instructor";
  let courses: Course[] = [];

  try {
    courses = await api.get<Course[]>("/api/v1/courses");
  } catch {
    // API unreachable
  }

  return (
    <div>
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <h1 className="font-display text-display-lg text-ink mb-4">
            Flight Curriculum
          </h1>
          <p className="text-body-md text-surface-tint max-w-2xl">
            {isInstructor
              ? "Manage your training modules. Create, edit, and organize course content."
              : "Master the skies with our comprehensive training modules. Select a course below to begin your briefing."}
          </p>
        </div>
        {isInstructor && (
          <Link
            href="/courses/new"
            className="inline-flex items-center gap-2 bg-ink text-white h-11 px-6 rounded-xl text-button font-semibold hover:bg-ink/90 transition-colors shrink-0"
          >
            <Plus className="h-4 w-4" />
            New Course
          </Link>
        )}
      </header>

      <CourseGrid courses={courses} isInstructor={isInstructor} />
    </div>
  );
}
