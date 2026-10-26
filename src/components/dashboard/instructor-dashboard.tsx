"use client";

import Link from "next/link";
import {
  BarChart3,
  BookOpen,
  ChevronRight,
  Clock,
  Plus,
} from "lucide-react";
import { capitalize, cn } from "@/lib/utils";
import { formatNavalGreeting } from "@/lib/course-utils";
import { Logo } from "@/components/icons/Logo";
import type { InstructorAnalytics } from "@/types/analytics";
import type { Course } from "@/types/course";

interface InstructorDashboardProps {
  user: {
    name?: string | null;
    rank?: string | null;
    email?: string | null;
  };
  analytics: InstructorAnalytics | null;
  courses: Course[];
}

function formatRelativeTime(dateStr: string | Date | undefined): string {
  if (!dateStr) return "Recently";
  try {
    const date = typeof dateStr === "string" ? new Date(dateStr) : dateStr;
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString("en-IN", { month: "short", day: "numeric" });
  } catch {
    return "Recently";
  }
}

export function InstructorDashboard({
  user,
  analytics,
  courses,
}: InstructorDashboardProps) {
  const safeCourses = Array.isArray(courses) ? courses : [];
  const stats = analytics?.stats ?? {
    total_courses: safeCourses.length,
    total_students_active: 0,
    total_graduates: 0,
    avg_completion_rate: 0,
    overall_avg_quiz_score: 0,
    cohort_lesson_quiz_avg: 0,
    cohort_course_quiz_avg: 0,
  };

  const courseItems = analytics?.courses && Array.isArray(analytics.courses) && analytics.courses.length > 0
    ? analytics.courses
    : safeCourses.map((c) => ({
        course_id: c.id,
        title: c.title,
        published: c.published,
        total_lessons: 0,
        enrolled_students: 0,
        completed_students: 0,
        completion_rate: 0,
        lesson_quiz_avg: 0,
        course_quiz_avg: 0,
      }));

  const recentActivity = (
    Array.isArray(analytics?.recent_activity)
      ? analytics.recent_activity
      : []
  ).slice(0, 5);

  return (
    <div className="space-y-6">
      {/* ── ROW 1: Instructor Overview Banner (8 cols) & Cohort Performance (4 cols) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Command Hero Card */}
        <div className="lg:col-span-8 bg-gradient-to-br from-gray-950 via-gray-900 to-slate-900 text-white rounded-2xl p-7 border border-gray-800 relative overflow-hidden flex flex-col justify-between min-h-[260px] shadow-none">
          {/* Subtle glow background */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
          <div className="absolute bottom-0 right-1/4 w-60 h-60 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />

          {/* Top meta row */}
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-white/10 backdrop-blur-md border border-white/15 flex items-center justify-center text-white">
                <Logo className="w-4 h-4 text-white" />
              </div>
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-blue-300">
                  Course Instructor
                </span>
                <span className="mx-2 text-white/30">•</span>
                <span className="text-[12px] font-mono text-gray-300">
                  Instructor Dashboard
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                Active
              </span>
            </div>
          </div>

          {/* Center greetings */}
          <div className="relative z-10 my-4">
            <h2 className="text-[24px] font-bold text-white tracking-tight">
              {formatNavalGreeting(user.rank, user.name)}
            </h2>
            <p className="text-[13px] text-gray-400 mt-1 max-w-xl leading-relaxed">
              Here is an overview of trainee enrollment, quiz performance, and
              completion rates across all your subjects.
            </p>
          </div>

          {/* Bottom 4 Core KPIs + Action */}
          <div className="relative z-10 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 flex-1">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-gray-400">
                  Created Subjects
                </span>
                <p className="text-[22px] font-black text-white mt-0.5">
                  {stats.total_courses}
                </p>
              </div>

              <div>
                <span className="text-[11px] uppercase tracking-wider text-gray-400">
                  Active Trainees
                </span>
                <p className="text-[22px] font-black text-white mt-0.5">
                  {stats.total_students_active}
                </p>
              </div>

              <div>
                <span className="text-[11px] uppercase tracking-wider text-gray-400">
                  Graduated Trainees
                </span>
                <p className="text-[22px] font-black text-white mt-0.5">
                  {stats.total_graduates}
                </p>
              </div>

              <div>
                <span className="text-[11px] uppercase tracking-wider text-gray-400">
                  Avg Completion
                </span>
                <p className="text-[22px] font-black text-emerald-400 mt-0.5">
                  {Math.round(stats.avg_completion_rate)}%
                </p>
              </div>
            </div>

            <Link
              href="/courses/new"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[13px] font-medium transition-all shrink-0 shadow-none"
            >
              <Plus className="h-4 w-4" />
              Create Subject
            </Link>
          </div>
        </div>

        {/* Cohort Quiz Performance Card (4 cols) */}
        <div className="lg:col-span-4 bg-[#fafbfc] border border-gray-200 rounded-2xl p-6 flex flex-col justify-between shadow-none">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <BarChart3 className="h-4 w-4" />
              </div>
              <h3 className="text-[14px] font-bold text-gray-900">
                Cohort Quiz Performance
              </h3>
            </div>
            <span className="text-[11px] font-medium text-gray-400 uppercase">
              Average
            </span>
          </div>

          <div className="my-4 space-y-4">
            <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                  Overall Trainee Average
                </span>
                <div className="text-[28px] font-black text-gray-900 leading-tight">
                  {stats.overall_avg_quiz_score > 0
                    ? `${Math.round(stats.overall_avg_quiz_score)}%`
                    : "—"}
                </div>
              </div>
              <span
                className={cn(
                  "px-2.5 py-1 rounded-full text-[11px] font-bold",
                  stats.overall_avg_quiz_score >= 80
                    ? "bg-emerald-100 text-emerald-800"
                    : stats.overall_avg_quiz_score >= 60
                    ? "bg-blue-100 text-blue-800"
                    : "bg-gray-100 text-gray-700"
                )}
              >
                {stats.overall_avg_quiz_score >= 80
                  ? "Superior"
                  : stats.overall_avg_quiz_score >= 60
                  ? "Good"
                  : "Needs Improvement"}
              </span>
            </div>

            {/* Comparison Bars */}
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between text-[12px] mb-1">
                  <span className="text-gray-600 font-medium">
                    Lesson Quizzes Average
                  </span>
                  <span className="font-bold text-gray-900">
                    {stats.cohort_lesson_quiz_avg > 0
                      ? `${Math.round(stats.cohort_lesson_quiz_avg)}%`
                      : "—"}
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-gray-200 overflow-hidden">
                  <div
                    className="h-full bg-blue-600 rounded-full"
                    style={{ width: `${stats.cohort_lesson_quiz_avg}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-[12px] mb-1">
                  <span className="text-gray-600 font-medium">
                    Course Quizzes Average
                  </span>
                  <span className="font-bold text-gray-900">
                    {stats.cohort_course_quiz_avg > 0
                      ? `${Math.round(stats.cohort_course_quiz_avg)}%`
                      : "—"}
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-gray-200 overflow-hidden">
                  <div
                    className="h-full bg-indigo-600 rounded-full"
                    style={{ width: `${stats.cohort_course_quiz_avg}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-[12px]">
            <span className="text-gray-500">Quiz Scores</span>
            <span className="font-semibold text-gray-900">
              Aggregated across all trainee attempts
            </span>
          </div>
        </div>
      </div>

      {/* ── ROW 2: Authored Courses Performance Table (8 cols) & Recent Activity Feed (4 cols) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Course Performance Table Card (8 cols) */}
        <div className="lg:col-span-8 bg-white border border-gray-200 rounded-2xl p-6 shadow-none">
          <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <BookOpen className="h-4 w-4" />
              </div>
              <h3 className="text-[15px] font-bold text-gray-900">
                Course Performance & Completion
              </h3>
            </div>
            <Link
              href="/courses"
              className="text-[12px] font-medium text-blue-600 hover:text-blue-700"
            >
              All Courses ({courseItems.length})
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-[13px]">
              <thead>
                <tr className="border-b border-gray-200 text-[11px] uppercase tracking-wider text-gray-500 font-semibold bg-gray-50/50">
                  <th className="py-2.5 px-3">Subject</th>
                  <th className="py-2.5 px-3">Lessons</th>
                  <th className="py-2.5 px-3">Trainees</th>
                  <th className="py-2.5 px-3">Completion Rate</th>
                  <th className="py-2.5 px-3 text-right">Lesson Quiz Avg</th>
                  <th className="py-2.5 px-3 text-right">Course Quiz Avg</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {courseItems.map((c) => (
                  <tr
                    key={c.course_id}
                    className="hover:bg-gray-50/80 transition-colors"
                  >
                    <td className="py-3 px-3">
                      <div className="font-semibold text-gray-900">
                        {c.title}
                      </div>
                      <span
                        className={cn(
                          "inline-block px-1.5 py-0.2 rounded text-[10px] font-medium uppercase mt-0.5",
                          c.published
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-gray-100 text-gray-600 border border-gray-200"
                        )}
                      >
                        {c.published ? "Published" : "Draft"}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-gray-600">
                      {c.total_lessons}
                    </td>

                    <td className="py-3 px-3 text-gray-600">
                      {c.enrolled_students}
                    </td>

                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 rounded-full bg-gray-200 overflow-hidden">
                          <div
                            className="h-full bg-blue-600 rounded-full"
                            style={{
                              width: `${Math.min(
                                100,
                                Math.round(c.completion_rate)
                              )}%`,
                            }}
                          />
                        </div>
                        <span className="text-[12px] font-bold text-gray-900">
                          {Math.round(c.completion_rate)}%
                        </span>
                      </div>
                      <span className="text-[10px] text-gray-400">
                        {c.completed_students} graduated
                      </span>
                    </td>

                    <td className="py-3 px-3 text-right">
                      <span className="font-semibold text-gray-800">
                        {c.lesson_quiz_avg > 0
                          ? `${Math.round(c.lesson_quiz_avg)}%`
                          : "—"}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-right">
                      <span className="font-semibold text-gray-800">
                        {c.course_quiz_avg > 0
                          ? `${Math.round(c.course_quiz_avg)}%`
                          : "—"}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-right">
                      <Link
                        href={`/courses/${c.course_id}`}
                        className="text-blue-600 hover:text-blue-700 font-medium inline-flex items-center gap-0.5"
                      >
                        View <ChevronRight className="h-3 w-3" />
                      </Link>
                    </td>
                  </tr>
                ))}

                {courseItems.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="py-8 text-center text-gray-400 text-[13px]"
                    >
                      No subjects created yet. Create your first subject to begin
                      training personnel.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Student Activity Feed (4 cols) */}
        <div className="lg:col-span-4 bg-white border border-gray-200 rounded-2xl p-6 shadow-none flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Clock className="h-4 w-4" />
                </div>
                <h3 className="text-[15px] font-bold text-gray-900">
                  Recent Trainee Activity
                </h3>
              </div>
              <span className="text-[11px] font-mono text-gray-400">Live</span>
            </div>

            <div className="space-y-3">
              {recentActivity.map((act, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl border border-gray-200 bg-[#fafbfc] hover:border-gray-300 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[13px] font-bold text-gray-900 truncate">
                          {act.student_name}
                        </span>
                        <span className="px-1.5 py-0.2 rounded text-[10px] font-medium bg-gray-200 text-gray-700">
                          {capitalize(act.rank)}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-500 truncate mt-0.5">
                        {act.course_title}
                      </p>
                    </div>

                    <span
                      className={cn(
                        "px-2 py-0.5 rounded text-[11px] font-bold shrink-0",
                        act.score >= 80
                          ? "bg-emerald-100 text-emerald-800"
                          : act.score >= 60
                          ? "bg-blue-100 text-blue-800"
                          : "bg-amber-100 text-amber-800"
                      )}
                    >
                      {Math.round(act.score)}%
                    </span>
                  </div>

                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100 text-[11px] text-gray-400">
                    <span>{act.quiz_type}</span>
                    <span>{formatRelativeTime(act.date)}</span>
                  </div>
                </div>
              ))}

              {recentActivity.length === 0 && (
                <div className="p-8 text-center text-gray-400 text-[13px]">
                  No recent trainee activity yet.
                </div>
              )}
            </div>
          </div>

          <div className="pt-3 mt-3 border-t border-gray-100 text-[11px] text-gray-500">
            Real-time quiz completions
          </div>
        </div>
      </div>
    </div>
  );
}
