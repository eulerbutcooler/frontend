"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Award,
  BarChart3,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  GraduationCap,
  Search,
  Trophy,
  Users,
  X,
  Sparkles,
} from "lucide-react";
import { capitalize, cn } from "@/lib/utils";
import type { InstructorAnalytics, StudentDirectoryItem } from "@/types/analytics";
import type { Course } from "@/types/course";

interface InstructorAnalyticsViewProps {
  analytics: InstructorAnalytics | null;
  courses: Course[];
}

export function InstructorAnalyticsView({
  analytics,
  courses,
}: InstructorAnalyticsViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [rankFilter, setRankFilter] = useState<"all" | "officer" | "agniveer">("all");

  const stats = analytics?.stats ?? {
    total_courses: courses.length,
    total_students_active: 0,
    total_graduates: 0,
    avg_completion_rate: 0,
    overall_avg_quiz_score: 0,
    cohort_lesson_quiz_avg: 0,
    cohort_course_quiz_avg: 0,
  };

  const students = useMemo(() => analytics?.students ?? [], [analytics?.students]);

  // Compute counts for category filter tabs
  const officerCount = useMemo(
    () => students.filter((s) => s.rank.toLowerCase() === "officer").length,
    [students]
  );
  const agniveerCount = useMemo(
    () => students.filter((s) => s.rank.toLowerCase() === "agniveer").length,
    [students]
  );

  // Filter students based on search query and category tab
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const matchesRank =
        rankFilter === "all" || s.rank.toLowerCase() === rankFilter;
      const q = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !q ||
        s.name.toLowerCase().includes(q) ||
        s.enrollment_id.toLowerCase().includes(q);
      return matchesRank && matchesQuery;
    });
  }, [students, rankFilter, searchQuery]);

  return (
    <div className="space-y-8">
      {/* ── SECTION 1: Macro Cohort Performance ── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-[17px] font-bold text-gray-900 tracking-tight">
              Cohort Overview
            </h2>
            <p className="text-[13px] text-gray-500 mt-0.5">
              High-level training progress and aggregate assessment metrics.
            </p>
          </div>
        </div>

        {/* 4 KPI summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#fafbfc] border border-gray-200 rounded-xl p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between text-gray-500">
              <span className="text-[12px] font-semibold uppercase tracking-wider">
                Active Trainees
              </span>
              <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-[28px] font-black text-gray-900">
                {stats.total_students_active}
              </span>
              <p className="text-[12px] text-gray-500 mt-0.5">
                Trainees actively enrolled in subjects
              </p>
            </div>
          </div>

          <div className="bg-[#fafbfc] border border-gray-200 rounded-xl p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between text-gray-500">
              <span className="text-[12px] font-semibold uppercase tracking-wider">
                Graduates
              </span>
              <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <GraduationCap className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-[28px] font-black text-gray-900">
                {stats.total_graduates}
              </span>
              <p className="text-[12px] text-gray-500 mt-0.5">
                Course completions achieved
              </p>
            </div>
          </div>

          <div className="bg-[#fafbfc] border border-gray-200 rounded-xl p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between text-gray-500">
              <span className="text-[12px] font-semibold uppercase tracking-wider">
                Completion Rate
              </span>
              <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-[28px] font-black text-gray-900">
                {Math.round(stats.avg_completion_rate)}%
              </span>
              <p className="text-[12px] text-gray-500 mt-0.5">
                Cohort curriculum progress
              </p>
            </div>
          </div>

          <div className="bg-[#fafbfc] border border-gray-200 rounded-xl p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between text-gray-500">
              <span className="text-[12px] font-semibold uppercase tracking-wider">
                Overall Quiz Accuracy
              </span>
              <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <BarChart3 className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-[28px] font-black text-gray-900">
                {Math.round(stats.overall_avg_quiz_score)}%
              </span>
              <p className="text-[12px] text-gray-500 mt-0.5">
                Cohort assessment average
              </p>
            </div>
          </div>
        </div>

        {/* Evaluation breakdown & Course Curriculum Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
          {/* Cohort Assessment Distribution (5 cols) */}
          <div className="lg:col-span-5 bg-[#fafbfc] border border-gray-200 rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                    <BarChart3 className="h-4 w-4" />
                  </div>
                  <h3 className="text-[14px] font-bold text-gray-900">
                    Assessment Performance Breakdown
                  </h3>
                </div>
                <span className="text-[11px] font-medium text-gray-400 uppercase">
                  Cohort
                </span>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between text-[13px] mb-1.5">
                    <span className="font-semibold text-gray-700">
                      Lesson Quizzes
                    </span>
                    <span className="font-extrabold text-gray-900">
                      {Math.round(stats.cohort_lesson_quiz_avg)}%
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-gray-200 overflow-hidden">
                    <div
                      className="h-full bg-blue-600 rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(100, Math.max(0, stats.cohort_lesson_quiz_avg))}%`,
                      }}
                    />
                  </div>
                  <p className="text-[11px] text-gray-500 mt-1">
                    Evaluations taken after individual lessons
                  </p>
                </div>

                <div>
                  <div className="flex items-center justify-between text-[13px] mb-1.5">
                    <span className="font-semibold text-gray-700">
                      Full Course Assessments
                    </span>
                    <span className="font-extrabold text-gray-900">
                      {Math.round(stats.cohort_course_quiz_avg)}%
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-gray-200 overflow-hidden">
                    <div
                      className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(100, Math.max(0, stats.cohort_course_quiz_avg))}%`,
                      }}
                    />
                  </div>
                  <p className="text-[11px] text-gray-500 mt-1">
                    Comprehensive final assessments per course
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-[12px] text-gray-500 mt-4">
              <span>Overall Average</span>
              <span className="font-bold text-gray-900">
                {Math.round(stats.overall_avg_quiz_score)}%
              </span>
            </div>
          </div>

          {/* Course Curriculum Stats (7 cols) */}
          <div className="lg:col-span-7 bg-[#fafbfc] border border-gray-200 rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <BookOpen className="h-4 w-4" />
                  </div>
                  <h3 className="text-[14px] font-bold text-gray-900">
                    Course Completion & Scores
                  </h3>
                </div>
                <span className="text-[11px] font-medium text-gray-400">
                  {analytics?.courses?.length || 0} Courses
                </span>
              </div>

              <div className="space-y-3 max-h-[190px] overflow-y-auto pr-1">
                {(analytics?.courses || []).map((course) => (
                  <div
                    key={course.course_id}
                    className="p-3 bg-white rounded-xl border border-gray-200 flex items-center justify-between gap-4"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[13px] font-semibold text-gray-900 truncate">
                          {course.title}
                        </span>
                        {course.published ? (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                            Published
                          </span>
                        ) : (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-gray-100 text-gray-600">
                            Draft
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-gray-500 mt-0.5">
                        {course.total_lessons} Lessons • {course.enrolled_students} Enrolled • {course.completed_students} Finished
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <div className="text-[13px] font-bold text-gray-900">
                        {Math.round(course.completion_rate)}%
                      </div>
                      <div className="text-[11px] text-gray-500">
                        completion
                      </div>
                    </div>
                  </div>
                ))}

                {(!analytics?.courses || analytics.courses.length === 0) && (
                  <p className="text-[13px] text-gray-400 text-center py-6">
                    No courses available yet.
                  </p>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-[12px] text-gray-500 mt-4">
              <span>Platform Courses</span>
              <Link
                href="/courses"
                className="inline-flex items-center gap-1 font-semibold text-blue-600 hover:text-blue-700 transition-colors"
              >
                Manage Courses <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── SECTION 2: Live Student Directory & Standings ── */}
      <div className="bg-[#fafbfc] border border-gray-200 rounded-2xl p-6 space-y-6">
        {/* Header & Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-gray-200">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <Trophy className="w-4 h-4" />
              </div>
              <h2 className="text-[16px] font-bold text-gray-900 tracking-tight">
                Live Trainee Rankings & Directory
              </h2>
            </div>
            <p className="text-[13px] text-gray-500 mt-0.5">
              Live standings calculated from assessment scores, completed lessons, and curriculum progress.
            </p>
          </div>

          {/* Search bar & filter pills */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search trainee or service no..."
                className="w-full pl-9 pr-8 py-2 text-[13px] bg-white border border-gray-200 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5"
                  title="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center bg-gray-100 p-1 rounded-lg border border-gray-200 text-[12px] font-medium">
              <button
                onClick={() => setRankFilter("all")}
                className={cn(
                  "px-3 py-1 rounded-md transition-all",
                  rankFilter === "all"
                    ? "bg-white text-gray-900 font-semibold shadow-none border border-gray-200"
                    : "text-gray-600 hover:text-gray-900"
                )}
              >
                All ({students.length})
              </button>
              <button
                onClick={() => setRankFilter("officer")}
                className={cn(
                  "px-3 py-1 rounded-md transition-all",
                  rankFilter === "officer"
                    ? "bg-white text-gray-900 font-semibold shadow-none border border-gray-200"
                    : "text-gray-600 hover:text-gray-900"
                )}
              >
                Officers ({officerCount})
              </button>
              <button
                onClick={() => setRankFilter("agniveer")}
                className={cn(
                  "px-3 py-1 rounded-md transition-all",
                  rankFilter === "agniveer"
                    ? "bg-white text-gray-900 font-semibold shadow-none border border-gray-200"
                    : "text-gray-600 hover:text-gray-900"
                )}
              >
                Agniveers ({agniveerCount})
              </button>
            </div>
          </div>
        </div>

        {/* Directory Table */}
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50/75 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                <th className="py-3 px-4 w-16">Rank</th>
                <th className="py-3 px-4">Trainee</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Courses Done</th>
                <th className="py-3 px-4">Lessons Done</th>
                <th className="py-3 px-4">Quiz Average</th>
                <th className="py-3 px-4">Readiness Index</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-[13px]">
              {filteredStudents.map((std, idx) => {
                const rankPos = idx + 1;
                const readiness = Math.round(std.readiness_score || 0);
                const avgScore = Math.round(std.avg_score || 0);

                return (
                  <tr
                    key={std.id}
                    className="hover:bg-blue-50/40 transition-colors group"
                  >
                    {/* Rank Position */}
                    <td className="py-3.5 px-4 font-mono">
                      {rankPos === 1 ? (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-100 text-amber-800 text-[11px] font-black border border-amber-300">
                          1
                        </span>
                      ) : rankPos === 2 ? (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-200 text-slate-800 text-[11px] font-black border border-slate-300">
                          2
                        </span>
                      ) : rankPos === 3 ? (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-orange-100 text-orange-800 text-[11px] font-black border border-orange-200">
                          3
                        </span>
                      ) : (
                        <span className="text-gray-400 font-bold ml-1.5">
                          {rankPos}
                        </span>
                      )}
                    </td>

                    {/* Student Info */}
                    <td className="py-3.5 px-4">
                      <Link
                        href={`/analytics/students/${std.id}`}
                        className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors flex items-center gap-1.5"
                      >
                        {std.name}
                        <ArrowRight className="w-3.5 h-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-blue-600" />
                      </Link>
                      <div className="text-[11px] font-mono text-gray-400 mt-0.5">
                        {std.enrollment_id}
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4">
                      <span
                        className={cn(
                          "px-2 py-0.5 rounded-full text-[11px] font-medium border",
                          std.rank.toLowerCase() === "officer"
                            ? "bg-blue-50 text-blue-700 border-blue-200"
                            : "bg-purple-50 text-purple-700 border-purple-200"
                        )}
                      >
                        {capitalize(std.rank)}
                      </span>
                    </td>

                    {/* Courses Done */}
                    <td className="py-3.5 px-4 text-gray-700 font-medium">
                      <span className="text-gray-900 font-bold">
                        {std.courses_completed}
                      </span>
                      <span className="text-gray-400 font-normal">
                        {" "}/ {std.courses_enrolled}
                      </span>
                    </td>

                    {/* Lessons Done */}
                    <td className="py-3.5 px-4 text-gray-700 font-medium">
                      {std.lessons_completed}
                    </td>

                    {/* Quiz Average */}
                    <td className="py-3.5 px-4">
                      <span
                        className={cn(
                          "px-2 py-0.5 rounded text-[12px] font-bold border",
                          avgScore >= 80
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : avgScore >= 60
                            ? "bg-blue-50 text-blue-700 border-blue-200"
                            : avgScore > 0
                            ? "bg-amber-50 text-amber-700 border-amber-200"
                            : "bg-gray-100 text-gray-500 border-gray-200"
                        )}
                      >
                        {avgScore > 0 ? `${avgScore}%` : "No Attempts"}
                      </span>
                    </td>

                    {/* Readiness Index */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-gray-900 w-8">
                          {readiness}%
                        </span>
                        <div className="w-20 h-1.5 rounded-full bg-gray-200 overflow-hidden hidden sm:block">
                          <div
                            className={cn(
                              "h-full rounded-full transition-all",
                              readiness >= 75
                                ? "bg-emerald-500"
                                : readiness >= 50
                                ? "bg-blue-500"
                                : "bg-amber-500"
                            )}
                            style={{ width: `${Math.min(100, Math.max(0, readiness))}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        href={`/analytics/students/${std.id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-[12px] font-medium text-gray-700 bg-gray-100 hover:bg-blue-50 hover:text-blue-700 border border-transparent hover:border-blue-200 transition-colors shadow-none"
                      >
                        View Profile
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                );
              })}

              {filteredStudents.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="py-12 text-center text-gray-400 text-[13px]"
                  >
                    {searchQuery ? (
                      <div>
                        <p className="font-medium text-gray-600">
                          No trainees matching &quot;{searchQuery}&quot;
                        </p>
                        <p className="text-[12px] text-gray-400 mt-1">
                          Try searching by another name or service number.
                        </p>
                      </div>
                    ) : (
                      "No trainees registered in this category."
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
