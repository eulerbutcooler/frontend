import { auth } from "@/lib/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { api } from "@/lib/api-client";
import { CoursePhasesView } from "@/components/course/course-phases-view";
import type { Course } from "@/types/course";
import Link from "next/link";
import { Plus } from "lucide-react";

export default async function CoursesPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const isInstructor = session.user.role === "instructor";

  let courses: Course[] = [];

  try {
    const fetched = await api.get<Course[]>("/api/v1/courses");
    courses = Array.isArray(fetched) ? fetched : [];
  } catch (e) {
    console.error("Failed to fetch courses:", e);
    // Real server: bubble up error or handle gracefully
    courses = [];
  }

  return (
    <div className="h-[calc(100vh-4rem)] -mx-6 -my-6 flex flex-col font-sans bg-[#f3f4f6] p-6">
      <div className="flex items-center justify-between mb-6 px-2">
        <div>
          <h1 className="text-[20px] font-bold text-gray-900 tracking-tight">
            All your learning essentials...
          </h1>
          <p className="text-[13px] text-gray-500 mt-0.5">
            Explore available subjects, follow your curriculum, and access study materials
          </p>
        </div>
        {isInstructor && (
          <Link 
            href="/courses/new"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-medium rounded-lg transition-colors cursor-pointer shadow-xs"
          >
            <Plus className="h-4 w-4" />
            Create Subject
          </Link>
        )}
      </div>

      <div className="flex-1 min-h-0 bg-white border border-gray-200 rounded-xl overflow-y-auto p-6 scrollbar-hide">
        <div className="h-full">
          <CoursePhasesView courses={courses} isInstructor={isInstructor} />
        </div>
      </div>
    </div>
  );
}
