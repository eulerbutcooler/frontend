import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { api } from "@/lib/api-client";
import { StudentDashboard } from "@/components/dashboard/student-dashboard";
import { InstructorDashboard } from "@/components/dashboard/instructor-dashboard";
import { capitalize } from "@/lib/utils";
import { getUserNavalRank } from "@/lib/course-utils";
import type { Course } from "@/types/course";
import type { StudentAnalytics, InstructorAnalytics } from "@/types/analytics";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const user = session.user;

  if (user.role === "instructor") {
    let analytics: InstructorAnalytics | null = null;
    let courses: Course[] = [];

    try {
      [analytics, courses] = await Promise.all([
        api.get<InstructorAnalytics>("/api/v1/analytics/instructor"),
        api.get<Course[]>("/api/v1/courses"),
      ]);
      courses = Array.isArray(courses) ? courses : [];
    } catch (e) {
      console.error("Failed to fetch instructor analytics:", e);
      courses = [];
    }

    return (
      <div className="h-[calc(100vh-4rem)] -mx-6 -my-6 flex flex-col font-sans bg-[#f3f4f6] p-6">
        <div className="flex items-center justify-between mb-6 px-2">
          <div>
            <h1 className="text-[20px] font-bold text-gray-900 tracking-tight">
              Instructor Overview & Analytics
            </h1>
            <p className="text-[13px] text-gray-500 mt-0.5">
              Track trainee progress, quiz performance, and subject completion
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[12px] font-medium bg-blue-50 text-blue-700 border border-blue-200">
              Instructor
            </span>
          </div>
        </div>

        <div className="flex-1 min-h-0 bg-white border border-gray-200 rounded-xl overflow-y-auto p-8 scrollbar-hide">
          <InstructorDashboard
            user={{ name: user.name, email: user.email, rank: user.rank }}
            analytics={analytics}
            courses={courses}
          />
        </div>
      </div>
    );
  }

  let analytics: StudentAnalytics | null = null;
  let courses: Course[] = [];

  try {
    [analytics, courses] = await Promise.all([
      api.get<StudentAnalytics>("/api/v1/analytics/student"),
      api.get<Course[]>("/api/v1/courses"),
    ]);
    courses = Array.isArray(courses) ? courses : [];
  } catch (e) {
    console.error("Failed to fetch student analytics:", e);
    courses = [];
  }

  return (
    <div className="h-[calc(100vh-4rem)] -mx-6 -my-6 flex flex-col font-sans bg-[#f3f4f6] p-6">
      <div className="flex items-center justify-between mb-6 px-2">
        <div>
          <h1 className="text-[20px] font-bold text-gray-900 tracking-tight">
            Trainee Overview & Performance
          </h1>
          <p className="text-[13px] text-gray-500 mt-0.5">
            Track your subject progress, quiz scores, and learning milestones
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[12px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
            {getUserNavalRank(user.rank)} Trainee
          </span>
        </div>
      </div>

      <div className="flex-1 min-h-0 bg-white border border-gray-200 rounded-xl overflow-y-auto p-8 scrollbar-hide">
        <StudentDashboard
          user={{ name: user.name, email: user.email, rank: user.rank }}
          analytics={analytics}
          courses={courses}
        />
      </div>
    </div>
  );
}
