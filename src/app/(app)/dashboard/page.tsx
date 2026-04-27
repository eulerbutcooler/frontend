import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { api } from "@/lib/api-client";
import { StudentDashboard } from "@/components/dashboard/student-dashboard";
import { InstructorDashboard } from "@/components/dashboard/instructor-dashboard";
import type { Course } from "@/types/course";
import type { AnalyticsOverview } from "@/types/analytics";

export default async function DashboardPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const user = session.user;

  if (user.role === "instructor") {
    let overview: AnalyticsOverview | null = null;
    let courses: Course[] = [];

    try {
      [overview, courses] = await Promise.all([
        api.get<AnalyticsOverview>("/api/v1/analytics"),
        api.get<Course[]>("/api/v1/courses"),
      ]);
    } catch {
      // API may be unreachable — render with empty data
    }

    return (
      <InstructorDashboard
        user={{ name: user.name }}
        overview={overview}
        courses={courses}
      />
    );
  }

  let courses: Course[] = [];
  try {
    courses = await api.get<Course[]>("/api/v1/courses");
  } catch {
    // API may be unreachable — render with empty data
  }

  return (
    <StudentDashboard
      user={{ name: user.name, rank: user.rank }}
      courses={courses}
    />
  );
}
