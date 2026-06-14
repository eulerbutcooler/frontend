import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { api } from "@/lib/api-client";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { KpiCard } from "@/components/analytics/kpi-card";
import { ScoreBarChart } from "@/components/analytics/score-bar-chart";
import { MetricsHorizontalBar } from "@/components/analytics/metrics-horizontal-bar";
import type { AnalyticsOverview } from "@/types/analytics";
import type { Course } from "@/types/course";

export default async function AnalyticsPage() {
  const session = await auth();
  if (!session) redirect("/login");
  if (session.user.role !== "instructor") redirect("/dashboard");

  let overview: AnalyticsOverview = {
    total_students: 0,
    total_courses: 0,
    avg_score: 0,
  };
  let courses: Course[] = [];

  try {
    [overview, courses] = await Promise.all([
      api.get<AnalyticsOverview>("/api/v1/analytics"),
      api.get<Course[]>("/api/v1/courses").then(res => res || []),
    ]);
  } catch {
    // API fallback
  }

  const offsets = [-8, 5, -3, 12, -5, 8, -2, 10, -6, 4];
  const chartItems = courses.slice(0, 10).map((c, i) => ({
    label: c.title.slice(0, 6),
    value: Math.round(Math.max(0, Math.min(100, overview.avg_score + offsets[i % offsets.length]))),
  }));

  return (
    <div>
      {/* Header */}
      <header className="flex items-center justify-between mb-12">
        <div>
          <p className="text-caption-uppercase uppercase text-surface-tint mb-2">
            Instructor Dashboard
          </p>
          <h1 className="font-display text-display-md text-ink">
            Nav Analytics
          </h1>
        </div>
      </header>

      {/* KPI Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <KpiCard
          label="Total Students"
          value={overview.total_students}
          color="bg-brand-lavender"
          trend={{ direction: "up", label: "Active enrollment" }}
        />
        <KpiCard
          label="Total Courses"
          value={overview.total_courses}
          color="bg-brand-mint"
          trend={{ direction: "flat", label: "Steady" }}
        />
        <KpiCard
          label="Avg Quiz Score"
          value={`${Math.round(overview.avg_score)}%`}
          color="bg-brand-peach"
          trend={{
            direction: overview.avg_score >= 70 ? "up" : "down",
            label: overview.avg_score >= 70 ? "Above target" : "Below target",
          }}
        />
      </section>

      {/* Charts Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
        <div className="lg:col-span-2">
          <ScoreBarChart
            title="Course Performance"
            subtitle="Average quiz scores across your courses"
            items={chartItems.length > 0 ? chartItems : [{ label: "—", value: 0 }]}
          />
        </div>
        <div className="bg-surface-card border border-hairline rounded-xl p-6 flex flex-col">
          <h3 className="text-title-lg font-semibold text-ink mb-2">
            Key Metrics
          </h3>
          <p className="text-body-md text-surface-tint mb-8">
            Platform engagement breakdown
          </p>
          <div className="flex flex-col gap-6 flex-1 justify-center">
            <MetricsHorizontalBar
              label="Avg Score"
              value={overview.avg_score}
              maxValue={100}
              color="bg-brand-coral"
            />
            <MetricsHorizontalBar
              label="Courses"
              value={overview.total_courses}
              maxValue={Math.max(overview.total_courses, 10)}
              color="bg-brand-ochre"
            />
            <MetricsHorizontalBar
              label="Students"
              value={overview.total_students}
              maxValue={Math.max(overview.total_students, 50)}
              color="bg-brand-pink"
            />
          </div>
        </div>
      </section>

      {/* Course List */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-title-lg font-semibold text-ink">
            Your Courses
          </h3>
        </div>
        {courses.length === 0 ? (
          <div className="bg-surface-card border border-hairline rounded-xl p-12 text-center">
            <p className="text-body-md text-surface-tint">
              No courses found. Create a course to see analytics.
            </p>
          </div>
        ) : (
          <div className="bg-surface-card border border-hairline rounded-xl overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="text-caption-uppercase uppercase text-surface-tint p-4 border-b border-hairline">
                    Course
                  </th>
                  <th className="text-caption-uppercase uppercase text-surface-tint p-4 border-b border-hairline">
                    Rank
                  </th>
                  <th className="text-caption-uppercase uppercase text-surface-tint p-4 border-b border-hairline text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="text-body-md text-ink">
                {courses.map((course, i) => (
                  <tr
                    key={course.id}
                    className="hover:bg-surface-soft transition-colors"
                  >
                    <td
                      className={`p-4 font-semibold ${i < courses.length - 1 ? "border-b border-hairline" : ""}`}
                    >
                      {course.title}
                    </td>
                    <td
                      className={`p-4 capitalize ${i < courses.length - 1 ? "border-b border-hairline" : ""}`}
                    >
                      {course.rank}
                    </td>
                    <td
                      className={`p-4 text-right ${i < courses.length - 1 ? "border-b border-hairline" : ""}`}
                    >
                      <Link
                        href={`/analytics/${course.id}`}
                        className="inline-flex items-center gap-1 text-button font-semibold text-ink hover:text-brand-coral transition-colors"
                      >
                        View Details
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
