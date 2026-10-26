"use client";

import { useState } from "react";
import { ChevronRight, ArrowLeft, Plus } from "lucide-react";
import Link from "next/link";
import { CourseGrid } from "./course-grid";
import { getCourseBranch, type SpecializationBranch } from "@/lib/course-utils";
import type { Course } from "@/types/course";

interface CoursePhasesViewProps {
  courses: Course[];
  isInstructor?: boolean;
}

interface SpecializationItem {
  id: SpecializationBranch;
  name: string;
  code: string;
  description: string;
}

const SPECIALIZATIONS: SpecializationItem[] = [
  {
    id: "aeo",
    name: "Air Engineer Officer",
    code: "AEO",
    description: "Aeronautical engineering, flight mechanics, propulsion systems, and naval aircraft structures.",
  },
  {
    id: "alo",
    name: "Air Electrical Officer",
    code: "ALO",
    description: "Avionics architecture, electrical power distribution, airborne radar systems, and sensor telemetry.",
  },
];

export function CoursePhasesView({ courses, isInstructor }: CoursePhasesViewProps) {
  const [selectedBranch, setSelectedBranch] = useState<SpecializationBranch | null>(null);

  // Group courses by specialization
  const safeCourses = Array.isArray(courses) ? courses : [];
  const aeoCourses = safeCourses.filter((c) => getCourseBranch(c) === "aeo");
  const aloCourses = safeCourses.filter((c) => getCourseBranch(c) === "alo");

  if (selectedBranch) {
    const currentSpec = SPECIALIZATIONS.find((s) => s.id === selectedBranch) || SPECIALIZATIONS[0];
    const branchCourses = selectedBranch === "aeo" ? aeoCourses : aloCourses;

    return (
      <div className="h-full flex flex-col">
        {/* Breadcrumb & Return Header */}
        <div className="shrink-0 flex items-center justify-between pb-5 mb-5 border-b border-gray-100">
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
                {currentSpec.name} ({currentSpec.code})
              </span>
              <span className="text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full">
                {branchCourses.length} {branchCourses.length === 1 ? "Subject" : "Subjects"}
              </span>
            </div>
          </div>

          {isInstructor && (
            <Link
              href={`/courses/new?branch=${selectedBranch}`}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-[13px] font-medium rounded-lg transition-colors cursor-pointer shadow-xs"
            >
              <Plus className="h-4 w-4" />
              <span>Create Subject</span>
            </Link>
          )}
        </div>

        {/* Subjects Grid */}
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          <CourseGrid
            courses={branchCourses}
            isInstructor={isInstructor}
            newSubjectHref={`/courses/new?branch=${selectedBranch}`}
            emptyBranchName={currentSpec.code}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="mb-6">
        <h2 className="text-[16px] font-bold text-gray-900 tracking-tight">
          Select Specialization
        </h2>
        <p className="text-[13px] text-gray-500 mt-0.5">
          Choose your branch curriculum to access designated flight modules and training manuals
        </p>
      </div>

      {/* Two Full Stretching Tabs Stacked Vertically */}
      <div className="flex flex-col gap-3.5 w-full">
        {SPECIALIZATIONS.map((spec) => {
          const count = spec.id === "aeo" ? aeoCourses.length : aloCourses.length;

          return (
            <button
              key={spec.id}
              type="button"
              onClick={() => setSelectedBranch(spec.id)}
              className="w-full text-left p-5 rounded-xl border border-gray-200 bg-white hover:bg-blue-50/40 hover:border-blue-300 shadow-2xs hover:shadow-xs transition-all flex items-center justify-between gap-4 cursor-pointer group"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200/80 flex items-center justify-center shrink-0 text-blue-700 font-extrabold text-[15px] tracking-wide group-hover:scale-105 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-2xs">
                  {spec.code}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2.5">
                    <h3 className="text-[16px] font-bold text-gray-900 group-hover:text-blue-700 transition-colors truncate">
                      {spec.name} ({spec.code})
                    </h3>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-600 border border-blue-100 px-2 py-0.5 rounded-full shrink-0">
                      Active
                    </span>
                  </div>
                  <p className="text-[13px] text-gray-500 mt-1 line-clamp-1">
                    {spec.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className="text-[12px] font-semibold text-blue-700 bg-blue-50/80 border border-blue-200 px-3 py-1 rounded-full hidden sm:inline-block">
                  {count} {count === 1 ? "Subject" : "Subjects"}
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
