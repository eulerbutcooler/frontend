"use client";

import Link from "next/link";
import {
  BookOpenCheck,
  ChevronRight,
  ClipboardList,
  TableProperties,
} from "lucide-react";
import { MasterSyllabusButton } from "./master-syllabus-button";
import { SubjectReferenceMaterialButton } from "./subject-reference-material-button";
import type { Course, Lesson } from "@/types/course";

export interface LessonWithTopics extends Lesson {
  topics?: Array<{
    id: string;
    title: string;
    order_idx?: number;
    slides?: any[];
  }>;
}

interface SubjectSyllabusRoadmapProps {
  course: Course;
  lessons: LessonWithTopics[];
  isInstructor?: boolean;
  progressPct?: number;
  completedLessons?: number;
}

function ResourceLink({
  href,
  title,
  subtitle,
  icon: Icon,
}: {
  href: string;
  title: string;
  subtitle: string;
  icon: React.ElementType;
}) {
  return (
    <Link
      href={href}
      className="w-full flex items-center gap-3 p-3.5 bg-white border border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50/30 transition-colors"
    >
      <div className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center shrink-0">
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-semibold text-gray-900">{title}</p>
        <p className="text-[11px] text-gray-500 mt-0.5">{subtitle}</p>
      </div>
      <ChevronRight className="w-4 h-4 text-gray-400 shrink-0" />
    </Link>
  );
}

export function SubjectSyllabusRoadmap({
  course,
  lessons,
  isInstructor,
  progressPct = 0,
  completedLessons = 0,
}: SubjectSyllabusRoadmapProps) {
  const totalTopics = lessons.reduce(
    (acc, lesson) => acc + (lesson.topics?.length || 0),
    0
  );
  const totalSlides = lessons.reduce(
    (acc, lesson) =>
      acc +
      (lesson.topics?.reduce(
        (slideAcc, topic) => slideAcc + (topic.slides?.length || 0),
        0
      ) || 0),
    0
  );

  return (
    <div className="h-full flex flex-col bg-slate-50/70 overflow-hidden border-l border-gray-200">
      <div className="p-6 border-b border-gray-200 bg-white shrink-0">
        <h3 className="text-[17px] font-bold text-gray-900 tracking-tight">
          Curriculum Roadmap
        </h3>
        <p className="text-[12px] text-gray-500 mt-0.5">
          AI synthesized lesson plans and reference material.
        </p>

        <div className="grid grid-cols-3 gap-2 mt-4">
          <div className="bg-slate-50 border border-gray-200/80 rounded-lg p-2.5 text-center">
            <span className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
              Lectures
            </span>
            <span className="text-[16px] font-bold text-gray-900">
              {lessons.length}
            </span>
          </div>
          <div className="bg-slate-50 border border-gray-200/80 rounded-lg p-2.5 text-center">
            <span className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
              Topics
            </span>
            <span className="text-[16px] font-bold text-blue-600">
              {totalTopics}
            </span>
          </div>
          <div className="bg-slate-50 border border-gray-200/80 rounded-lg p-2.5 text-center">
            <span className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
              Slides
            </span>
            <span className="text-[16px] font-bold text-emerald-600">
              {totalSlides > 0 ? totalSlides : "Dynamic"}
            </span>
          </div>
        </div>

        <div className="mt-4 rounded-lg border border-gray-200/80 bg-slate-50 px-3 py-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
              Your Progress
            </span>
            <span className="text-[12px] font-bold text-gray-900">
              {progressPct}%
            </span>
          </div>
          <div
            className="mt-2 h-1.5 w-full rounded-full bg-gray-200/80 overflow-hidden"
            role="progressbar"
            aria-valuenow={progressPct}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Subject progress"
          >
            <div
              className="h-full rounded-full bg-emerald-500 transition-all duration-500 ease-out"
              style={{ width: `${Math.min(100, Math.max(0, progressPct))}%` }}
            />
          </div>
          <p className="mt-1.5 text-[10px] text-gray-400">
            {completedLessons} of {lessons.length} lectures complete
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {isInstructor ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1 mb-1">
              <h4 className="text-[12px] font-bold text-gray-700 uppercase tracking-wider">
                Subject Resources
              </h4>
            </div>

            <MasterSyllabusButton courseId={course.id} />

            <ResourceLink
              href={`/courses/${course.id}/lesson-plans`}
              title="Generated Lesson Plans"
              subtitle="View the lesson-plan PDFs for this subject"
              icon={ClipboardList}
            />

            <ResourceLink
              href={`/courses/${course.id}/question-bank`}
              title="Question Bank"
              subtitle="All generated questions, tagged by difficulty"
              icon={BookOpenCheck}
            />

            <ResourceLink
              href={`/courses/${course.id}/question-bank`}
              title="TOS"
              subtitle="Table of Specifications (question bank for now)"
              icon={TableProperties}
            />

            <SubjectReferenceMaterialButton
              courseId={course.id}
              instructorId={course.instructor_id}
            />
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <p className="text-[12px] text-gray-500 leading-relaxed">
              Reference material, lesson plans and assessments are available
              inside each lesson.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
