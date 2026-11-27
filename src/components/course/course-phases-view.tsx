"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronRight, ArrowLeft, Plus, CheckSquare } from "lucide-react";
import Link from "next/link";
import { CourseGrid } from "./course-grid";
import {
  getCourseBranches,
  getSpecializationMeta,
  SPECIALIZATION_BRANCHES,
  type SpecializationBranch,
} from "@/lib/course-utils";
import { cn } from "@/lib/utils";
import type { Course } from "@/types/course";

interface CoursePhasesViewProps {
  courses: Course[];
  isInstructor?: boolean;
}

export function CoursePhasesView({ courses, isInstructor }: CoursePhasesViewProps) {
  const safeCourses = Array.isArray(courses) ? courses : [];
  const associatedCourses = safeCourses.filter((course) => Boolean(course.associated));
  const hasAssociated = associatedCourses.length > 0;

  const [viewMode, setViewMode] = useState<"associated" | "all">(
    isInstructor && hasAssociated ? "associated" : "all"
  );
  const [selectedBranch, setSelectedBranch] = useState<SpecializationBranch | null>(null);
  const [associatedBranchFilter, setAssociatedBranchFilter] = useState<"all" | SpecializationBranch>("all");

  const prevHasAssociated = useRef(hasAssociated);
  useEffect(() => {
    if (isInstructor && !prevHasAssociated.current && hasAssociated) {
      setViewMode("associated");
      setSelectedBranch(null);
      setAssociatedBranchFilter("all");
    }
    prevHasAssociated.current = hasAssociated;
  }, [isInstructor, hasAssociated]);

  // Group courses by specialization
  const coursesByBranch = SPECIALIZATION_BRANCHES.reduce(
    (grouped, spec) => {
      grouped[spec.id] = safeCourses.filter(
        (course) => getCourseBranches(course).includes(spec.id)
      );
      return grouped;
    },
    {} as Record<SpecializationBranch, Course[]>
  );

  const handleModeChange = (mode: "associated" | "all") => {
    setViewMode(mode);
    setSelectedBranch(null);
    setAssociatedBranchFilter("all");
  };

  const scopeToggle = isInstructor ? (
    <div className="flex items-center bg-gray-100 p-1 rounded-lg border border-gray-200 text-[12px] font-medium shrink-0">
      <button
        type="button"
        onClick={() => handleModeChange("associated")}
        className={cn(
          "px-3 py-1 rounded-md transition-colors cursor-pointer",
          viewMode === "associated"
            ? "bg-white text-gray-900 font-semibold border border-gray-200 shadow-2xs"
            : "text-gray-600 hover:text-gray-900"
        )}
      >
        Associated Subjects ({associatedCourses.length})
      </button>
      <button
        type="button"
        onClick={() => handleModeChange("all")}
        className={cn(
          "px-3 py-1 rounded-md transition-colors cursor-pointer",
          viewMode === "all"
            ? "bg-white text-gray-900 font-semibold border border-gray-200 shadow-2xs"
            : "text-gray-600 hover:text-gray-900"
        )}
      >
        All Subjects ({safeCourses.length})
      </button>
    </div>
  ) : null;

  if (isInstructor && viewMode === "associated") {
    const representedBranches = SPECIALIZATION_BRANCHES.map((spec) => ({
      spec,
      count: associatedCourses.filter((course) =>
        getCourseBranches(course).includes(spec.id)
      ).length,
    })).filter((entry) => entry.count > 0);

    const filteredAssociatedCourses =
      associatedBranchFilter === "all"
        ? associatedCourses
        : associatedCourses.filter((course) =>
            getCourseBranches(course).includes(associatedBranchFilter)
          );

    return (
      <div className="h-full flex flex-col">
        <div className="shrink-0 flex flex-wrap items-center justify-between gap-4 pb-5 mb-5 border-b border-gray-100">
          <div>
            <h2 className="text-[16px] font-bold text-gray-900 tracking-tight">
              My Associated Subjects
            </h2>
            <p className="text-[13px] text-gray-500 mt-0.5">
              Subjects associated with your instructor profile
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {scopeToggle}
            <Link
              href="/courses/associate"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-[12px] font-medium rounded-lg transition-colors shadow-2xs"
            >
              <CheckSquare className="h-3.5 w-3.5 text-gray-500" />
              Manage
            </Link>
          </div>
        </div>

        {representedBranches.length > 1 && (
          <div className="shrink-0 flex flex-wrap items-center gap-2 mb-5">
            <button
              type="button"
              onClick={() => setAssociatedBranchFilter("all")}
              className={cn(
                "px-3 py-1 rounded-full text-[12px] font-medium border transition-colors cursor-pointer",
                associatedBranchFilter === "all"
                  ? "bg-blue-50 text-blue-700 border-blue-200 font-semibold"
                  : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
              )}
            >
              All ({associatedCourses.length})
            </button>
            {representedBranches.map(({ spec, count }) => (
              <button
                key={spec.id}
                type="button"
                onClick={() => setAssociatedBranchFilter(spec.id)}
                className={cn(
                  "px-3 py-1 rounded-full text-[12px] font-medium border transition-colors cursor-pointer",
                  associatedBranchFilter === spec.id
                    ? "bg-blue-50 text-blue-700 border-blue-200 font-semibold"
                    : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                )}
              >
                {spec.badge} ({count})
              </button>
            ))}
          </div>
        )}

        <div className="flex-1 overflow-y-auto scrollbar-hide">
          <CourseGrid
            courses={filteredAssociatedCourses}
            isInstructor={isInstructor}
            emptyTitle="No associated subjects yet"
            emptyDescription="Select subjects from the master catalogue to pin them to your profile."
            emptyActionHref="/courses/associate"
            emptyActionLabel="Associate Subjects"
            emptySecondaryAction={
              <button
                type="button"
                onClick={() => handleModeChange("all")}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-medium rounded-lg transition-colors cursor-pointer shadow-2xs"
              >
                Browse All Subjects ({safeCourses.length})
              </button>
            }
          />
        </div>
      </div>
    );
  }

  if (selectedBranch) {
    const currentSpec = getSpecializationMeta(selectedBranch);
    const branchCourses = coursesByBranch[selectedBranch];

    return (
      <div className="h-full flex flex-col">
        {/* Breadcrumb & Return Header */}
        <div className="shrink-0 flex flex-wrap items-center justify-between gap-3 pb-5 mb-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSelectedBranch(null)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-[13px] font-medium transition-colors cursor-pointer shadow-2xs"
            >
              <ArrowLeft className="w-4 h-4 text-gray-500" />
              <span>Back to Specializations</span>
            </button>

            <div className="h-4 w-[1px] bg-gray-200" />

            <div className="flex items-center gap-2">
              <span className="text-[14px] font-bold text-gray-900">
                {currentSpec.name}
              </span>
              <span className="text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full">
                {branchCourses.length} {branchCourses.length === 1 ? "Course" : "Courses"}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {scopeToggle}
            {isInstructor && (
              <Link
                href={`/courses/new?branch=${selectedBranch}`}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-medium rounded-lg transition-colors cursor-pointer shadow-xs"
              >
                <Plus className="h-4 w-4" />
                <span>Create Course</span>
              </Link>
            )}
          </div>
        </div>

        {/* Subjects Grid */}
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          <CourseGrid
            courses={branchCourses}
            isInstructor={isInstructor}
            newSubjectHref={`/courses/new?branch=${selectedBranch}`}
            emptyBranchName={currentSpec.badge}
            showAssociatedBadge={isInstructor}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-[16px] font-bold text-gray-900 tracking-tight">
            Select Specialization
          </h2>
          <p className="text-[13px] text-gray-500 mt-0.5">
            Choose your branch curriculum to access designated flight modules and training manuals
          </p>
        </div>
        {scopeToggle}
      </div>

      {/* Two Full Stretching Tabs Stacked Vertically */}
      <div className="flex flex-col gap-3.5 w-full">
        {SPECIALIZATION_BRANCHES.map((spec) => {
          const count = coursesByBranch[spec.id].length;

          return (
            <button
              key={spec.id}
              type="button"
              onClick={() => setSelectedBranch(spec.id)}
              className="w-full text-left p-5 rounded-xl border border-gray-200 bg-white hover:bg-blue-50/40 hover:border-blue-300 shadow-2xs hover:shadow-xs transition-all flex items-center justify-between gap-4 cursor-pointer group"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-14 h-12 rounded-xl bg-blue-50 border border-blue-200/80 flex items-center justify-center shrink-0 text-blue-700 font-extrabold text-[12px] tracking-wide group-hover:scale-105 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-2xs">
                  {spec.shortCode}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2.5">
                    <h3 className="text-[16px] font-bold text-gray-900 group-hover:text-blue-700 transition-colors truncate">
                      {spec.name}
                    </h3>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-600 border border-blue-100 px-2 py-0.5 rounded-full shrink-0">
                      {spec.badge}
                    </span>
                  </div>
                  <p className="text-[13px] text-gray-500 mt-1 line-clamp-1">
                    {spec.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className="text-[12px] font-semibold text-blue-700 bg-blue-50/80 border border-blue-200 px-3 py-1 rounded-full hidden sm:inline-block">
                  {count} {count === 1 ? "Course" : "Courses"}
                </span>
                <div className="w-8 h-8 rounded-lg bg-gray-50 group-hover:bg-blue-100 flex items-center justify-center text-gray-400 group-hover:text-blue-700 transition-colors">
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
