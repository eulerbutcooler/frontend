import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { api } from "@/lib/api-client";
import { InstructorAnalyticsView } from "@/components/analytics/instructor-analytics-view";
import type { InstructorAnalytics } from "@/types/analytics";
import type { Course } from "@/types/course";

export default async function AnalyticsPage() {
  const session = await auth();
  if (!session) return null;

  if (session.user.role !== "instructor") {
    redirect("/dashboard");
  }

  let analytics: InstructorAnalytics | null = null;
  let courses: Course[] = [];

  try {
    [analytics, courses] = await Promise.all([
      api.get<InstructorAnalytics>("/api/v1/analytics/instructor"),
      api.get<Course[]>("/api/v1/courses").then((res) => res || []),
    ]);
    courses = Array.isArray(courses) ? courses : [];
  } catch (err) {
    console.error("Failed to load instructor analytics:", err);
    courses = [];
  }

  return (
    <div className="h-[calc(100vh-4rem)] -mx-6 -my-6 flex flex-col font-sans p-6 bg-[#f3f4f6]">
      {/* Header */}
      <div className="mb-4 flex-shrink-0">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
          Trainee Performance & Analytics
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Track cohort performance, analyze learning metrics, and inspect individual trainee progress.
        </p>
      </div>

      {/* Main Giant White Scrollable Box */}
      <div className="flex-1 bg-white border border-gray-200 rounded-xl overflow-y-auto p-8 scrollbar-hide">
        <InstructorAnalyticsView analytics={analytics} courses={courses} />
      </div>
    </div>
  );
}
