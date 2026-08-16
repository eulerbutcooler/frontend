import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { api } from "@/lib/api-client";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { KpiCard } from "@/components/analytics/kpi-card";
import { MetricsHorizontalBar } from "@/components/analytics/metrics-horizontal-bar";
import { DataTable } from "@/components/analytics/data-table";
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

  return (
    <div>
      {/* Header */}
      <header className="flex items-center justify-between mb-12">
        <div>
          <p className="text-caption-uppercase uppercase text-surface-tint mb-2">
            Instructor Dashboard
          </p>
          <h1 className="font-display text-display-lg text-ink">
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
        <div className="lg:col-span-2 bg-surface-card border border-hairline rounded-2xl p-6 flex flex-col justify-center items-center text-center">
          <h2 className="text-title-lg font-semibold text-ink mb-2">
            Course Performance
          </h2>
          <p className="text-body-md text-surface-tint max-w-md">Per-course averages will appear here once we expose them. For now, drill into any course below for its detailed metrics.</p>
        </div>
        <div className="bg-surface-card border border-hairline rounded-2xl p-6 flex flex-col">
          <h2 className="text-title-lg font-semibold text-ink mb-2">
            Key Metrics
          </h2>
          <p className="text-body-md text-surface-tint mb-8">
            Platform engagement breakdown
          </p>
          <div className="flex flex-col gap-6 flex-1 justify-center">
            <MetricsHorizontalBar
              label="Avg Score"
              value={Math.round(overview.avg_score)}
              maxValue={100}
              unit="%"
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
          <h2 className="text-title-lg font-semibold text-ink">
            Your Courses
          </h2>
        </div>
        {courses.length === 0 ? (
          <div className="bg-surface-card border border-hairline rounded-2xl p-12 text-center">
            <p className="text-body-md text-surface-tint">
              No courses found. Create a course to see analytics.
            </p>
          </div>
        ) : (
          <DataTable
            columns={[
              {
                key: "title",
                header: "Course",
                render: (c) => <span className="font-semibold">{c.title}</span>,
              },
              {
                key: "rank",
                header: "Rank",
                render: (c) => <span className="capitalize">{c.rank}</span>,
              },
              {
                key: "actions",
                header: "Actions",
                className: "text-right",
                render: (c) => (
                  <Link
                    href={`/analytics/${c.id}`}
                    className="focus-ring inline-flex items-center gap-1 text-button font-semibold text-ink hover:text-surface-tint transition-colors"
                  >
                    View Details
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                ),
              },
            ]}
            data={courses}
            keyExtractor={(c) => c.id}
            emptyMessage="No courses found."
          />
        )}
      </section>
    </div>
  );
}
