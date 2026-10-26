import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { api } from "@/lib/api-client";
import Link from "next/link";
import { ArrowLeft, UserX } from "lucide-react";
import { capitalize, cn } from "@/lib/utils";
import { getUserNavalRank } from "@/lib/course-utils";
import { StudentDashboard } from "@/components/dashboard/student-dashboard";
import type { StudentAnalytics } from "@/types/analytics";
import type { Course } from "@/types/course";

interface PageProps {
  params: Promise<{ studentId: string }>;
}

export default async function StudentDetailPage({ params }: PageProps) {
  const { studentId } = await params;
  const session = await auth();
  if (!session) return null;

  if (session.user.role !== "instructor") {
    redirect("/dashboard");
  }

  let studentAnalytics: StudentAnalytics | null = null;
  let courses: Course[] = [];

  try {
    [studentAnalytics, courses] = await Promise.all([
      api.get<StudentAnalytics>(`/api/v1/analytics/students/${studentId}`),
      api.get<Course[]>("/api/v1/courses").then((res) => res || []),
    ]);
    courses = Array.isArray(courses) ? courses : [];
  } catch (err) {
    console.error("Failed to load student analytics:", err);
    courses = [];
  }

  return (
    <div className="h-[calc(100vh-4rem)] -mx-6 -my-6 flex flex-col font-sans p-6 bg-[#f3f4f6]">
      {/* Top Navigation & Student Header */}
      <div className="mb-4 flex-shrink-0 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            href="/analytics"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-none"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Analytics
          </Link>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              {studentAnalytics?.user_profile?.name || "Trainee Profile"}
            </h1>
            {studentAnalytics?.user_profile && (
              <>
                <span className="text-gray-400 font-light text-base select-none">•</span>
                <span className="text-base font-mono text-gray-500">
                  {studentAnalytics.user_profile.enrollment_id}
                </span>
                <span className="text-gray-400 font-light text-base select-none">•</span>
                <span className="text-base text-gray-500">
                  {getUserNavalRank(studentAnalytics.user_profile.rank, studentAnalytics.user_profile.enrollment_id)}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Giant White Scrollable Box */}
      <div className="flex-1 bg-white border border-gray-200 rounded-xl overflow-y-auto p-8 scrollbar-hide">
        {studentAnalytics ? (
          <StudentDashboard
            user={{
              name: studentAnalytics.user_profile.name,
              rank: studentAnalytics.user_profile.rank,
              email: null,
            }}
            analytics={studentAnalytics}
            courses={courses}
            isInstructorView={true}
            titleOverride={studentAnalytics.user_profile.name}
            descriptionOverride="Comprehensive trainee learning dossier showing course completion, lesson progress, and quiz evaluation scores."
          />
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 mb-4">
              <UserX className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">
              Trainee Record Not Found
            </h3>
            <p className="text-sm text-gray-500 mt-1 max-w-sm">
              The requested trainee profile could not be found or has not generated any records yet.
            </p>
            <Link
              href="/analytics"
              className="mt-5 inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-none"
            >
              <ArrowLeft className="w-4 h-4" />
              Return to Trainee Directory
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
