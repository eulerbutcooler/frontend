"use client";

import React, { useState } from "react";
import {
  BookOpen,
  Layers,
  ChevronDown,
  ChevronUp,
  Clock,
  Compass,
  CheckCircle2,
  FileText,
} from "lucide-react";
import { cn, toTitleCase } from "@/lib/utils";
import { cleanSubjectDescription } from "@/lib/course-utils";
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
}

export function SubjectSyllabusRoadmap({
  course,
  lessons,
}: SubjectSyllabusRoadmapProps) {
  const [expandedLessonId, setExpandedLessonId] = useState<string | null>(
    lessons.length > 0 ? lessons[0].id : null
  );

  const totalTopics = lessons.reduce(
    (acc, l) => acc + (l.topics?.length || 0),
    0
  );
  const totalSlides = lessons.reduce(
    (acc, l) =>
      acc + (l.topics?.reduce((sAcc, t) => sAcc + (t.slides?.length || 0), 0) || 0),
    0
  );

  const toggleLesson = (id: string) => {
    setExpandedLessonId(expandedLessonId === id ? null : id);
  };

  return (
    <div className="h-full flex flex-col bg-slate-50/70 overflow-hidden border-l border-gray-200">
      {/* Header bar */}
      <div className="p-6 border-b border-gray-200 bg-white shrink-0">
        <h3 className="text-[17px] font-bold text-gray-900 tracking-tight">
          Curriculum Roadmap
        </h3>
        <p className="text-[12px] text-gray-500 mt-0.5">
          AI synthesized lesson-by-lesson flight topics and briefing notes.
        </p>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-3 gap-2 mt-4">
          <div className="bg-slate-50 border border-gray-200/80 rounded-lg p-2.5 text-center">
            <span className="block text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
              Lessons
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
              Briefing Slides
            </span>
            <span className="text-[16px] font-bold text-emerald-600">
              {totalSlides > 0 ? totalSlides : "Dynamic"}
            </span>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Executive AI Briefing Summary Card */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-2xs">
          <div className="flex items-center gap-2 mb-2">
            <Compass className="w-4 h-4 text-blue-600" />
            <h4 className="text-[13px] font-semibold text-gray-900 uppercase tracking-wider">
              Subject Overview
            </h4>
          </div>
          <p className="text-[13px] text-gray-600 leading-relaxed font-normal">
            {cleanSubjectDescription(course.description) ||
              "Comprehensive naval aviation ground school subject covering core aeronautical systems, theoretical principles, and operational maintenance procedures."}
          </p>
        </div>

        {/* Lesson-by-lesson Topic Outline */}
        <div>
          <div className="flex items-center justify-between mb-3 px-1">
            <h4 className="text-[13px] font-bold text-gray-800 uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-gray-500" />
              Syllabus Breakdown
            </h4>
            <span className="text-[11px] text-gray-400 font-medium">
              Click lesson to expand
            </span>
          </div>

          <div className="space-y-3">
            {lessons.map((lesson, idx) => {
              const isExpanded = expandedLessonId === lesson.id;
              const topics = lesson.topics || [];

              return (
                <div
                  key={lesson.id}
                  className="bg-white border border-gray-200 rounded-xl overflow-hidden transition-all shadow-2xs"
                >
                  {/* Lesson Header Accordion Trigger */}
                  <button
                    type="button"
                    onClick={() => toggleLesson(lesson.id)}
                    className="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-slate-50/70 transition-colors cursor-pointer group"
                  >
                    <div className="flex items-center gap-3 min-w-0 pr-2">
                      <span className="w-6 h-6 rounded-md bg-blue-50 text-blue-700 text-[11px] font-bold flex items-center justify-center shrink-0 border border-blue-100">
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                      <div className="min-w-0">
                        <span className="text-[13px] font-semibold text-gray-900 truncate block group-hover:text-blue-600 transition-colors">
                          {lesson.title}
                        </span>
                        <span className="text-[11px] text-gray-400 font-normal">
                          {topics.length > 0
                            ? `${topics.length} AI Briefing Topic${topics.length === 1 ? "" : "s"}`
                            : "Synthesizing curriculum topics"}
                        </span>
                      </div>
                    </div>
                    <div className="text-gray-400 group-hover:text-gray-600 transition-colors shrink-0">
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </div>
                  </button>

                  {/* Expanded Topic Details */}
                  {isExpanded && (
                    <div className="px-4 pb-4 pt-1 border-t border-gray-100 bg-slate-50/40">
                      {topics.length > 0 ? (
                        <div className="space-y-2 mt-2">
                          {topics.map((topic, tIdx) => (
                            <div
                              key={topic.id || tIdx}
                              className="p-2.5 rounded-lg bg-white border border-gray-200/90 hover:border-blue-300 transition-all flex items-start gap-2.5 group/topic"
                            >
                              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0 group-hover/topic:scale-125 transition-transform" />
                              <div className="flex-1 min-w-0">
                                <p className="text-[12px] font-medium text-gray-800 leading-snug group-hover/topic:text-blue-600 transition-colors">
                                  {toTitleCase(topic.title)}
                                </p>
                                {topic.slides && topic.slides.length > 0 && (
                                  <span className="text-[10px] text-gray-400 font-normal mt-0.5 block">
                                    {topic.slides.length} slide{topic.slides.length === 1 ? "" : "s"} &bull; Equations & diagrams
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="py-4 text-center text-gray-400">
                          <p className="text-[12px]">
                            AI topic extraction completes when manuals are ingested.
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}

            {lessons.length === 0 && (
              <div className="p-8 text-center bg-white border border-gray-200 rounded-xl">
                <p className="text-[13px] text-gray-500">
                  No lessons defined for this subject yet.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
