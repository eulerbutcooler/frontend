"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  GraduationCap,
  Search,
  ShieldCheck,
  UserCheck,
  Users,
  X,
} from "lucide-react";
import { capitalize, cn } from "@/lib/utils";
import type { AdminUsersDirectory } from "@/types/user";

interface AdminUsersViewProps {
  directory: AdminUsersDirectory;
}

function formatJoinedDate(dateStr?: string): string {
  if (!dateStr) return "—";
  try {
    const date = new Date(dateStr);
    if (Number.isNaN(date.getTime())) return "—";
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "—";
  }
}

export function AdminUsersView({ directory }: AdminUsersViewProps) {
  const instructors = useMemo(
    () => (Array.isArray(directory?.instructors) ? directory.instructors : []),
    [directory]
  );
  const students = useMemo(
    () => (Array.isArray(directory?.students) ? directory.students : []),
    [directory]
  );

  const [tab, setTab] = useState<"all" | "instructors" | "students">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedInstructors, setExpandedInstructors] = useState<Record<string, boolean>>({});

  const normalizedQuery = searchQuery.toLowerCase().trim();

  const filteredInstructors = useMemo(() => {
    if (!normalizedQuery) return instructors;
    return instructors.filter((inst) => {
      const associatedCourses = inst.associated_courses ?? [];
      return (
        inst.name.toLowerCase().includes(normalizedQuery) ||
        inst.enrollment_id.toLowerCase().includes(normalizedQuery) ||
        inst.rank.toLowerCase().includes(normalizedQuery) ||
        associatedCourses.some((course) =>
          course.title.toLowerCase().includes(normalizedQuery)
        )
      );
    });
  }, [instructors, normalizedQuery]);

  const filteredStudents = useMemo(() => {
    if (!normalizedQuery) return students;
    return students.filter(
      (std) =>
        std.name.toLowerCase().includes(normalizedQuery) ||
        std.enrollment_id.toLowerCase().includes(normalizedQuery) ||
        std.rank.toLowerCase().includes(normalizedQuery)
    );
  }, [students, normalizedQuery]);

  const totalAccounts = instructors.length + students.length;
  const showInstructors = tab === "all" || tab === "instructors";
  const showStudents = tab === "all" || tab === "students";

  const toggleExpandSubjects = (instructorId: string) => {
    setExpandedInstructors((prev) => ({
      ...prev,
      [instructorId]: !prev[instructorId],
    }));
  };

  return (
    <div className="space-y-8">
      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#fafbfc] border border-gray-200 rounded-xl p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-[12px] font-semibold uppercase tracking-wider">
              Total Accounts
            </span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-[28px] font-black text-gray-900">
              {totalAccounts}
            </span>
            <p className="text-[12px] text-gray-500 mt-0.5">
              Registered instructors and trainees
            </p>
          </div>
        </div>

        <div className="bg-[#fafbfc] border border-gray-200 rounded-xl p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-[12px] font-semibold uppercase tracking-wider">
              Instructors
            </span>
            <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-[28px] font-black text-gray-900">
              {instructors.length}
            </span>
            <p className="text-[12px] text-gray-500 mt-0.5">
              Faculty &amp; subject coordinators
            </p>
          </div>
        </div>

        <div className="bg-[#fafbfc] border border-gray-200 rounded-xl p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-[12px] font-semibold uppercase tracking-wider">
              Trainees
            </span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <GraduationCap className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-[28px] font-black text-gray-900">
              {students.length}
            </span>
            <p className="text-[12px] text-gray-500 mt-0.5">
              Active enrolled student accounts
            </p>
          </div>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div className="flex items-center bg-gray-100 p-1 rounded-lg border border-gray-200 text-[12px] font-medium w-fit">
          <button
            type="button"
            onClick={() => setTab("all")}
            className={cn(
              "px-3 py-1 rounded-md transition-colors cursor-pointer",
              tab === "all"
                ? "bg-white text-gray-900 font-semibold border border-gray-200 shadow-2xs"
                : "text-gray-600 hover:text-gray-900"
            )}
          >
            All Users ({totalAccounts})
          </button>
          <button
            type="button"
            onClick={() => setTab("instructors")}
            className={cn(
              "px-3 py-1 rounded-md transition-colors cursor-pointer",
              tab === "instructors"
                ? "bg-white text-gray-900 font-semibold border border-gray-200 shadow-2xs"
                : "text-gray-600 hover:text-gray-900"
            )}
          >
            Instructors ({instructors.length})
          </button>
          <button
            type="button"
            onClick={() => setTab("students")}
            className={cn(
              "px-3 py-1 rounded-md transition-colors cursor-pointer",
              tab === "students"
                ? "bg-white text-gray-900 font-semibold border border-gray-200 shadow-2xs"
                : "text-gray-600 hover:text-gray-900"
            )}
          >
            Students ({students.length})
          </button>
        </div>

        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search name, service no., rank, or subject..."
            className="w-full pl-9 pr-8 py-2 text-[13px] bg-white border border-gray-200 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5 cursor-pointer"
              title="Clear search"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Instructors Section */}
      {showInstructors && (
        <section className="bg-[#fafbfc] border border-gray-200 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-[16px] font-bold text-gray-900 tracking-tight">
                  Instructors ({filteredInstructors.length})
                </h2>
                <p className="text-[12px] text-gray-500">
                  Registered instructors and the subjects associated with their profile
                </p>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50/75 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Instructor</th>
                  <th className="py-3 px-4">Rank</th>
                  <th className="py-3 px-4">Associated Subjects</th>
                  <th className="py-3 px-4 whitespace-nowrap">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-[13px]">
                {filteredInstructors.map((inst) => {
                  const courses = inst.associated_courses ?? [];
                  const isExpanded = Boolean(expandedInstructors[inst.id]);
                  const visibleCourses = isExpanded ? courses : courses.slice(0, 3);
                  const hiddenCount = courses.length - visibleCourses.length;
                  const isMasterAdmin = inst.is_master || inst.enrollment_id === "1000";

                  return (
                    <tr
                      key={inst.id}
                      className="hover:bg-blue-50/30 transition-colors align-top"
                    >
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-gray-900">
                            {inst.name}
                          </span>
                          {isMasterAdmin && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200">
                              Admin
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] font-mono text-gray-400 mt-0.5">
                          {inst.enrollment_id}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded-full text-[11px] font-medium border bg-gray-50 text-gray-700 border-gray-200">
                          {capitalize(inst.rank || "Instructor")}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        {courses.length === 0 ? (
                          <span className="text-[12px] text-gray-400">
                            None selected
                          </span>
                        ) : (
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className="text-[11px] font-bold text-gray-500 mr-1">
                              {courses.length} {courses.length === 1 ? "subject" : "subjects"}:
                            </span>
                            {visibleCourses.map((course) => (
                              <Link
                                key={course.id}
                                href={`/courses/${course.id}`}
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-blue-50/70 hover:bg-blue-100 text-blue-700 border border-blue-200/80 transition-colors"
                              >
                                <span className="max-w-[220px] truncate">{course.title}</span>
                                {!course.published && (
                                  <span className="text-[9px] uppercase text-gray-500 font-semibold">
                                    Draft
                                  </span>
                                )}
                              </Link>
                            ))}
                            {hiddenCount > 0 && (
                              <button
                                type="button"
                                onClick={() => toggleExpandSubjects(inst.id)}
                                className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors cursor-pointer"
                              >
                                +{hiddenCount} more
                              </button>
                            )}
                            {isExpanded && courses.length > 3 && (
                              <button
                                type="button"
                                onClick={() => toggleExpandSubjects(inst.id)}
                                className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors cursor-pointer"
                              >
                                Show less
                              </button>
                            )}
                          </div>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-[12px] text-gray-500 whitespace-nowrap">
                        {formatJoinedDate(inst.created_at)}
                      </td>
                    </tr>
                  );
                })}

                {filteredInstructors.length === 0 && (
                  <tr>
                    <td
                      colSpan={4}
                      className="py-10 text-center text-gray-400 text-[13px]"
                    >
                      {searchQuery
                        ? `No instructors matching "${searchQuery}".`
                        : "No instructors registered yet."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Students / Trainees Section */}
      {showStudents && (
        <section className="bg-[#fafbfc] border border-gray-200 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <GraduationCap className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-[16px] font-bold text-gray-900 tracking-tight">
                  Students / Trainees ({filteredStudents.length})
                </h2>
                <p className="text-[12px] text-gray-500">
                  All registered trainee accounts, curriculum progress, and readiness metrics
                </p>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50/75 text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Trainee</th>
                  <th className="py-3 px-4">Rank</th>
                  <th className="py-3 px-4">Courses Done</th>
                  <th className="py-3 px-4">Lessons Done</th>
                  <th className="py-3 px-4">Quiz Average</th>
                  <th className="py-3 px-4">Readiness</th>
                  <th className="py-3 px-4 whitespace-nowrap">Joined</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-[13px]">
                {filteredStudents.map((std) => {
                  const avgScore = Math.round(std.avg_score || 0);
                  const readiness = Math.round(std.readiness_score || 0);

                  return (
                    <tr
                      key={std.id}
                      className="hover:bg-blue-50/40 transition-colors group"
                    >
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

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded-full text-[11px] font-medium border bg-purple-50 text-purple-700 border-purple-200">
                          {capitalize(std.rank || "Trainee")}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-gray-700 font-medium whitespace-nowrap">
                        <span className="text-gray-900 font-bold">
                          {std.courses_completed}
                        </span>
                        <span className="text-gray-400 font-normal">
                          {" "}/ {std.courses_enrolled}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-gray-700 font-medium">
                        {std.lessons_completed}
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
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
                              style={{
                                width: `${Math.min(100, Math.max(0, readiness))}%`,
                              }}
                            />
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-[12px] text-gray-500 whitespace-nowrap">
                        {formatJoinedDate(std.created_at)}
                      </td>

                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <Link
                          href={`/analytics/students/${std.id}`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-[12px] font-medium text-gray-700 bg-gray-100 hover:bg-blue-50 hover:text-blue-700 border border-transparent hover:border-blue-200 transition-colors"
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
                      className="py-10 text-center text-gray-400 text-[13px]"
                    >
                      {searchQuery
                        ? `No trainees matching "${searchQuery}".`
                        : "No trainees registered yet."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}
