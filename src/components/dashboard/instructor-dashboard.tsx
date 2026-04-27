import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import type { Course } from "@/types/course";
import type { AnalyticsOverview } from "@/types/analytics";

interface InstructorDashboardProps {
  user: { name?: string | null };
  overview: AnalyticsOverview | null;
  courses: Course[];
}

function formatRank(rank?: string | null): string {
  if (!rank) return "—";
  return rank.charAt(0).toUpperCase() + rank.slice(1);
}

export function InstructorDashboard({
  user,
  overview,
  courses,
}: InstructorDashboardProps) {
  return (
    <div className="space-y-12">
      {/* Welcome Header */}
      <header>
        <p className="text-caption-uppercase uppercase text-outline mb-2">
          Command Center
        </p>
        <h1 className="font-display text-display-lg text-ink">
          Welcome, {user.name?.split(" ")[0] ?? "Instructor"}.
        </h1>
        <p className="text-body-md text-surface-tint mt-2 max-w-2xl">
          Your training command overview. Monitor student progress, manage
          courses, and review quiz performance.
        </p>
      </header>

      {/* KPI Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Students — Lavender */}
        <div className="bg-brand-lavender rounded-[24px] p-8 flex flex-col justify-between min-h-[200px] relative overflow-hidden">
          <div>
            <p className="text-caption-uppercase uppercase text-ink/70 mb-1">
              Total Students
            </p>
            <h2 className="font-display text-display-sm text-ink">
              {overview?.total_students ?? 0}
            </h2>
          </div>
          <div className="flex items-center gap-2 mt-auto">
            <span className="text-button font-semibold text-ink">
              Enrolled across all courses
            </span>
          </div>
        </div>

        {/* Total Courses — Mint */}
        <div className="bg-brand-mint rounded-[24px] p-8 flex flex-col justify-between min-h-[200px] relative overflow-hidden">
          <div>
            <p className="text-caption-uppercase uppercase text-ink/70 mb-1">
              Total Courses
            </p>
            <h2 className="font-display text-display-sm text-ink">
              {overview?.total_courses ?? 0}
            </h2>
          </div>
          <div className="flex items-center gap-2 mt-auto">
            <span className="text-button font-semibold text-ink">
              Active training modules
            </span>
          </div>
        </div>

        {/* Avg Quiz Score — Peach */}
        <div className="bg-brand-peach rounded-[24px] p-8 flex flex-col justify-between min-h-[200px] relative overflow-hidden">
          <div>
            <p className="text-caption-uppercase uppercase text-ink/70 mb-1">
              Avg Quiz Score
            </p>
            <h2 className="font-display text-display-sm text-ink">
              {overview?.avg_score
                ? `${Math.round(overview.avg_score)}%`
                : "—"}
            </h2>
          </div>
          <div className="flex items-center gap-2 mt-auto">
            <span className="text-button font-semibold text-ink">
              Across all quizzes
            </span>
          </div>
        </div>
      </section>

      {/* Your Courses Table */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-title-lg font-semibold text-ink">
            Your Courses
          </h3>
          <Link
            href="/courses"
            className="text-button font-semibold text-ink underline underline-offset-4 hover:text-surface-tint transition-colors"
          >
            Manage All
          </Link>
        </div>

        {courses.length === 0 ? (
          <div className="bg-surface-card rounded-2xl border border-hairline p-12 text-center">
            <p className="text-title-md font-semibold text-ink mb-2">
              No courses yet
            </p>
            <p className="text-body-md text-surface-tint mb-6">
              Create your first course to get started.
            </p>
            <Link href="/courses">
              <button className="bg-ink text-white h-11 px-6 rounded-xl text-button font-semibold hover:bg-ink/90 transition-colors inline-flex items-center gap-2">
                Create Course
                <ArrowRight className="h-4 w-4" />
              </button>
            </Link>
          </div>
        ) : (
          <div className="bg-surface-card rounded-2xl border border-hairline overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Course</TableHead>
                  <TableHead>Rank</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {courses.map((course) => (
                  <TableRow key={course.id}>
                    <TableCell className="font-semibold">
                      {course.title}
                    </TableCell>
                    <TableCell>
                      <Badge variant="default">{formatRank(course.rank)}</Badge>
                    </TableCell>
                    <TableCell className="text-surface-tint">
                      {new Date(course.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Link
                        href={`/courses/${course.id}`}
                        className="text-button font-semibold text-ink hover:text-surface-tint transition-colors"
                      >
                        View →
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </section>
    </div>
  );
}
