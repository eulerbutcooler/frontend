"use client";

import { useMemo } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Flame,
  ShieldCheck,
  Sparkles,
  Target,
  Trophy,
} from "lucide-react";
import { capitalize, cn } from "@/lib/utils";
import { formatNavalGreeting, getUserNavalRank } from "@/lib/course-utils";
import { Logo } from "@/components/icons/Logo";
import type { StudentAnalytics } from "@/types/analytics";
import type { Course } from "@/types/course";

interface StudentDashboardProps {
  user: {
    name?: string | null;
    rank?: string | null;
    email?: string | null;
  };
  analytics: StudentAnalytics | null;
  courses: Course[];
  isInstructorView?: boolean;
  titleOverride?: string;
  descriptionOverride?: string;
}

export function StudentDashboard({
  user,
  analytics,
  courses,
  isInstructorView = false,
  titleOverride,
  descriptionOverride,
}: StudentDashboardProps) {
  // Graceful defaults if analytics hasn't loaded or is empty
  const profile = analytics?.user_profile ?? {
    name: user.name || "Trainee",
    rank: user.rank || "Sub Lieutenant",
    enrollment_id: "AF-2026-9041",
    readiness_score: 0,
  };

  const safeCourses = Array.isArray(courses) ? courses : [];
  const stats = analytics?.stats ?? {
    courses_enrolled: safeCourses.length,
    courses_completed: 0,
    overall_completion_pct: 0,
    lessons_completed: 0,
    avg_lessons_per_course: 0,
    quizzes_attempted: 0,
    overall_avg_score: 0,
    lesson_quiz_avg: 0,
    course_quiz_avg: 0,
  };

  const courseProgress = analytics?.course_progress && Array.isArray(analytics.course_progress) && analytics.course_progress.length > 0
    ? analytics.course_progress
    : safeCourses.map((c) => ({
        course_id: c.id,
        title: c.title,
        rank: c.rank,
        total_lessons: 0,
        completed_lessons: 0,
        progress_pct: 0,
        is_completed: false,
        quiz_avg: 0,
      }));

  const spotlight = analytics?.spotlight;
  const leaderboard = Array.isArray(analytics?.leaderboard) ? analytics.leaderboard : [];

  // On instructor view, filter to ONLY that specific student's entry; on student dashboard show all
  const entriesToShow = useMemo(() => {
    if (!isInstructorView) {
      return leaderboard;
    }
    const studentEntry = leaderboard.find(
      (e) => e.is_current_user || e.enrollment_id === profile.enrollment_id
    );
    if (studentEntry) {
      return [studentEntry];
    }
    return [
      {
        rank_position: 1,
        user_id: "",
        name: profile.name,
        enrollment_id: profile.enrollment_id,
        rank: profile.rank,
        courses_completed: stats.courses_completed,
        courses_enrolled: stats.courses_enrolled,
        lessons_completed: stats.lessons_completed,
        avg_score: stats.overall_avg_score,
        readiness_score: profile.readiness_score,
        is_current_user: true,
      },
    ];
  }, [isInstructorView, leaderboard, profile, stats]);

  // Active or next course to resume
  const nextCourse =
    courseProgress.find((c) => !c.is_completed) || courseProgress[0];

  const readinessScore = Math.round(profile.readiness_score || 0);

  return (
    <div className="space-y-6">
      {/* ── ROW 1: Hero Identity Banner (8 cols) & Milestones Matrix (4 cols) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Student Profile & Progress Hero Card */}
        <div className="lg:col-span-8 bg-gradient-to-br from-gray-950 via-gray-900 to-slate-900 text-white rounded-2xl p-7 border border-gray-800 relative overflow-hidden flex flex-col justify-between min-h-[260px] shadow-none">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
          <div className="absolute bottom-0 right-1/4 w-60 h-60 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />

          {/* Top meta row */}
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-white/10 backdrop-blur-md border border-white/15 flex items-center justify-center text-white">
                <Logo className="w-4 h-4 text-white" />
              </div>
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-blue-300">
                  Technical Training
                </span>
                <span className="mx-2 text-white/30">•</span>
                <span className="text-[12px] font-mono text-gray-300">
                  {profile.enrollment_id || "AF-2026-9041"}
                </span>
              </div>
                      <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-white/10 backdrop-blur-md border border-white/15 text-gray-200">
                Rank: {getUserNavalRank(profile.rank, profile.enrollment_id)}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Active Trainee
              </span>
            </div>
          </div>

          {/* Center greetings */}
          <div className="relative z-10 my-4">
            <h2 className="text-[24px] font-bold text-white tracking-tight">
              {titleOverride || (isInstructorView ? profile.name : formatNavalGreeting(profile.rank, profile.name, profile.enrollment_id))}
            </h2>
            <p className="text-[13px] text-gray-400 mt-1 max-w-xl leading-relaxed">
              {descriptionOverride ||
                (isInstructorView
                  ? "Comprehensive learning progress, completed lessons, and quiz scores across all enrolled courses."
                  : "Here is a summary of your learning progress, completed lessons, and quiz scores across all enrolled courses.")}
            </p>
          </div>

          {/* Bottom Readiness Indicator & Actions */}
          <div className="relative z-10 pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-baseline gap-1.5">
                <span className="text-[32px] font-black text-white tracking-tight">
                  {readinessScore}%
                </span>
                <span className="text-[12px] font-semibold text-emerald-400 uppercase tracking-wide">
                  Learning Readiness
                </span>
              </div>
              <div className="hidden sm:block text-[11px] text-gray-400 border-l border-white/15 pl-4 py-0.5">
                Composite performance score
                <br />
                <span className="text-gray-300">
                  60% Quiz Accuracy • 40% Course Completion
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              {!isInstructorView && nextCourse && (
                <Link
                  href={`/courses/${nextCourse.course_id}`}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[13px] font-medium transition-all shadow-none"
                >
                  Resume Course
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              )}
              {!isInstructorView && (
                <Link
                  href="/quizzes"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-white text-[13px] font-medium transition-all border border-white/10 shadow-none"
                >
                  Quizzes
                </Link>
              )}
              {isInstructorView && (
                <span className="px-3.5 py-1.5 rounded-lg bg-white/10 text-white text-[13px] font-medium border border-white/15">
                  Full Trainee Record
                </span>
              )}
            </div>      </div>
          </div>
        </div>

        {/* Course Milestones Card (4 cols) */}
        <div className="lg:col-span-4 bg-[#fafbfc] border border-gray-200 rounded-2xl p-6 flex flex-col justify-between shadow-none">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <Target className="h-4 w-4" />
              </div>
              <h3 className="text-[14px] font-bold text-gray-900">
                Course Milestones
              </h3>
            </div>
            <span className="text-[11px] font-medium text-gray-400 uppercase">
              Curriculum
            </span>
          </div>

          <div className="my-4 space-y-4">
            <div>
              <div className="flex items-baseline justify-between mb-1.5">
                <span className="text-[12px] font-medium text-gray-600">
                  Courses Completed
                </span>
                <span className="text-[13px] font-bold text-gray-900">
                  {stats.courses_completed} / {stats.courses_enrolled}
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-gray-200 overflow-hidden">
                <div
                  className="h-full bg-blue-600 rounded-full transition-all duration-500"
                  style={{ width: `${stats.overall_completion_pct}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="bg-white border border-gray-200 rounded-xl p-3">
                <span className="text-[11px] font-medium text-gray-500 uppercase">
                  Lessons Done
                </span>
                <p className="text-[20px] font-bold text-gray-900 mt-0.5">
                  {stats.lessons_completed}
                </p>
                <span className="text-[11px] text-gray-500">
                  {stats.avg_lessons_per_course.toFixed(1)} avg/course
                </span>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-3">
                <span className="text-[11px] font-medium text-gray-500 uppercase">
                  Quizzes Taken
                </span>
                <p className="text-[20px] font-bold text-gray-900 mt-0.5">
                  {stats.quizzes_attempted}
                </p>
                <span className="text-[11px] text-gray-500">
                  {stats.overall_avg_score > 0
                    ? `${Math.round(stats.overall_avg_score)}% avg`
                    : "No attempts"}
                </span>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-[12px]">
            <span className="text-gray-500">Overall Progress</span>
            <span className="font-semibold text-gray-900">
              {stats.overall_completion_pct}% Complete
            </span>
          </div>
        </div>
      </div>

      {/* ── ROW 2: Quiz Performance (4 cols), Spotlight (4 cols), Enrolled Courses (4 cols) ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
        {/* Quiz Performance Card (4 cols) */}
        <div className="lg:col-span-4 bg-white border border-gray-200 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Award className="h-4 w-4" />
                </div>
                <h3 className="text-[14px] font-bold text-gray-900">
                  Quiz Performance
                </h3>
              </div>
              <span className="text-[11px] font-mono text-gray-400">
                {stats.quizzes_attempted} tests
              </span>
            </div>

            {/* Overall average */}
            <div className="bg-[#fafbfc] border border-gray-200 rounded-xl p-4 mb-4 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">
                  Overall Quiz Average
                </span>
                <div className="text-[28px] font-black text-gray-900 leading-tight">
                  {stats.quizzes_attempted > 0
                    ? `${Math.round(stats.overall_avg_score)}%`
                    : "—"}
                </div>
              </div>
              <div
                className={cn(
                  "px-2.5 py-1 rounded-full text-[11px] font-bold",
                  stats.overall_avg_score >= 80
                    ? "bg-emerald-100 text-emerald-800"
                    : stats.overall_avg_score >= 60
                    ? "bg-blue-100 text-blue-800"
                    : "bg-gray-100 text-gray-700"
                )}
              >
                {stats.overall_avg_score >= 80
                  ? "Distinction"
                  : stats.overall_avg_score >= 60
                  ? "Proficient"
                  : "Needs Practice"}
              </div>
            </div>

            {/* Comparison Bars: Lesson Quiz vs Course Quiz */}
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between text-[12px] mb-1">
                  <span className="text-gray-600 font-medium">
                    Lesson Quizzes
                  </span>
                  <span className="font-bold text-gray-900">
                    {stats.lesson_quiz_avg > 0
                      ? `${Math.round(stats.lesson_quiz_avg)}%`
                      : "—"}
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-gray-100 overflow-hidden">
                  <div
                    className="h-full bg-blue-600 rounded-full"
                    style={{ width: `${stats.lesson_quiz_avg}%` }}
                  />
                </div>
                <span className="text-[10px] text-gray-400">
                  Topic-level quizzes
                </span>
              </div>

              <div>
                <div className="flex items-center justify-between text-[12px] mb-1">
                  <span className="text-gray-600 font-medium">
                    Course Quizzes
                  </span>
                  <span className="font-bold text-gray-900">
                    {stats.course_quiz_avg > 0
                      ? `${Math.round(stats.course_quiz_avg)}%`
                      : "—"}
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-gray-100 overflow-hidden">
                  <div
                    className="h-full bg-indigo-600 rounded-full"
                    style={{ width: `${stats.course_quiz_avg}%` }}
                  />
                </div>
                <span className="text-[10px] text-gray-400">
                  Full course quizzes
                </span>
              </div>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-gray-100 text-[11px] text-gray-500 flex items-center justify-between">
            <span>Passing standard: 60%</span>
            <Link
              href="/quizzes"
              className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
            >
              All Quizzes <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
        </div>

        {/* Performance Highlights: Strengths & Weaknesses (4 cols) */}
        <div className="lg:col-span-4 bg-white border border-gray-200 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Sparkles className="h-4 w-4" />
                </div>
                <h3 className="text-[14px] font-bold text-gray-900">
                  Performance Highlights
                </h3>
              </div>
              <span className="text-[11px] font-medium text-gray-400 uppercase">
                Strengths & Focus
              </span>
            </div>

            <div className="space-y-3">
              {/* Strongest Area */}
              <div className="p-3 rounded-xl border border-emerald-100 bg-emerald-50/40">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                    Top Performing Course
                  </span>
                  {spotlight?.strongest_course && (
                    <span className="text-[12px] font-extrabold text-emerald-700">
                      {Math.round(spotlight.strongest_course.avg_score)}%
                    </span>
                  )}
                </div>
                <p className="text-[13px] font-semibold text-gray-900 truncate">
                  {spotlight?.strongest_course?.title ||
                    "Complete quizzes to see highlights"}
                </p>
              </div>

              {/* Top Lesson Drill */}
              <div className="p-3 rounded-xl border border-blue-100 bg-blue-50/40">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-blue-800 flex items-center gap-1">
                    <Flame className="h-3.5 w-3.5 text-blue-600" />
                    Highest Scoring Lesson
                  </span>
                  {spotlight?.strongest_lesson && (
                    <span className="text-[12px] font-extrabold text-blue-700">
                      {Math.round(spotlight.strongest_lesson.score)}%
                    </span>
                  )}
                </div>
                <p className="text-[13px] font-semibold text-gray-900 truncate">
                  {spotlight?.strongest_lesson?.title ||
                    "No lesson quiz taken yet"}
                </p>
                {spotlight?.strongest_lesson?.course_title && (
                  <p className="text-[11px] text-gray-500 truncate mt-0.5">
                    {spotlight.strongest_lesson.course_title}
                  </p>
                )}
              </div>

              {/* Area to Improve */}
              <div className="p-3 rounded-xl border border-amber-100 bg-amber-50/40">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1">
                    <Target className="h-3.5 w-3.5 text-amber-600" />
                    Needs Improvement
                  </span>
                  {spotlight?.weakest_course && (
                    <span className="text-[12px] font-extrabold text-amber-700">
                      {Math.round(spotlight.weakest_course.avg_score)}%
                    </span>
                  )}
                </div>
                <p className="text-[13px] font-semibold text-gray-900 truncate">
                  {spotlight?.weakest_course?.title ||
                    (spotlight?.strongest_course
                      ? "Great job! Keep maintaining your scores"
                      : "Pending quiz attempts")}
                </p>
              </div>
            </div>
          </div>

          <div className="pt-3 mt-3 border-t border-gray-100 text-[11px] text-gray-500">
            Personalized insights based on quiz evaluations
          </div>
        </div>

        {/* Enrolled Courses Progress (4 cols) */}
        <div className="lg:col-span-4 bg-white border border-gray-200 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <BookOpen className="h-4 w-4" />
                </div>
                <h3 className="text-[14px] font-bold text-gray-900">
                  Enrolled Courses
                </h3>
              </div>
              <Link
                href="/courses"
                className="text-[12px] text-blue-600 hover:text-blue-700 font-medium"
              >
                View all ({courseProgress.length})
              </Link>
            </div>

            <div className="space-y-3">
              {courseProgress.slice(0, 3).map((item) => (
                <div
                  key={item.course_id}
                  className="p-3 rounded-xl border border-gray-200 bg-[#fafbfc] hover:border-gray-300 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="min-w-0">
                      <h4 className="text-[13px] font-bold text-gray-900 truncate">
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        {item.completed_lessons} of {item.total_lessons} lessons
                        completed
                      </p>
                    </div>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase bg-gray-200/70 text-gray-700 shrink-0">
                      {item.rank || "General"}
                    </span>
                  </div>

                  <div className="w-full h-1.5 rounded-full bg-gray-200 overflow-hidden mb-2">
                    <div
                      className="h-full bg-blue-600 rounded-full"
                      style={{ width: `${item.progress_pct}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-gray-500">
                      {item.is_completed ? (
                        <span className="text-emerald-600 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3" /> Completed
                        </span>
                      ) : (
                        `${item.progress_pct}% completed`
                      )}
                    </span>
                    <Link
                      href={`/courses/${item.course_id}`}
                      className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-0.5"
                    >
                      Resume <ChevronRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              ))}

              {courseProgress.length === 0 && (
                <div className="p-6 text-center text-gray-400 text-[13px]">
                  No courses enrolled yet.
                </div>
              )}
            </div>
          </div>

          <div className="pt-3 mt-3 border-t border-gray-100 flex items-center justify-between text-[12px]">
            <span className="text-gray-500">Browse new courses</span>
            <Link
              href="/courses"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Browse Catalog →
            </Link>
          </div>
        </div>
      </div>

      {/* ── ROW 3: Student Leaderboard / Standing Slate (12 cols) ── */}
      <div className="bg-[#fafbfc] border border-gray-200 rounded-2xl p-6 shadow-none">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-gray-200">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <Trophy className="h-4 w-4" />
              </div>
              <h3 className="text-[16px] font-bold text-gray-900 tracking-tight">
                {isInstructorView ? "Trainee Category Standing" : "Trainee Leaderboard"}
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-200">
                {capitalize(profile.rank)} Category
              </span>
            </div>
            <p className="text-[12px] text-gray-500">
              {isInstructorView
                ? `Official standing for ${profile.name} in the ${capitalize(profile.rank)} cohort.`
                : `Top-ranking trainees in the ${capitalize(profile.rank)} category based on average quiz score and completed courses.`}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-gray-500 font-medium">
              {isInstructorView ? "Cohort Category:" : "Category filter:"}
            </span>
            <span className="px-2.5 py-1 rounded-md text-[12px] font-semibold bg-white border border-gray-200 text-gray-800">
              {capitalize(profile.rank)}
            </span>
          </div>
        </div>

        {/* Directory-Style Table */}
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
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-[13px]">
              {entriesToShow.map((entry) => {
                const rankPos = entry.rank_position;
                const readiness = Math.round(entry.readiness_score || 0);
                const avgScore = Math.round(entry.avg_score || 0);
                const isUser = entry.is_current_user;

                return (
                  <tr
                    key={entry.user_id || entry.enrollment_id}
                    className={cn(
                      "transition-colors",
                      isUser
                        ? "bg-blue-50/60 font-medium"
                        : "hover:bg-blue-50/30"
                    )}
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
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900">
                          {entry.name}
                        </span>
                        {isUser && !isInstructorView && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-blue-600 text-white">
                            YOU
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] font-mono text-gray-400 mt-0.5">
                        {entry.enrollment_id}
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4">
                      <span
                        className={cn(
                          "px-2 py-0.5 rounded-full text-[11px] font-medium border",
                          entry.rank.toLowerCase() === "officer"
                            ? "bg-blue-50 text-blue-700 border-blue-200"
                            : "bg-purple-50 text-purple-700 border-purple-200"
                        )}
                      >
                        {capitalize(entry.rank)}
                      </span>
                    </td>

                    {/* Courses Done */}
                    <td className="py-3.5 px-4 text-gray-700 font-medium">
                      <span className="text-gray-900 font-bold">
                        {entry.courses_completed}
                      </span>
                      <span className="text-gray-400 font-normal">
                        {" "}/ {entry.courses_enrolled || courses.length}
                      </span>
                    </td>

                    {/* Lessons Done */}
                    <td className="py-3.5 px-4 text-gray-700 font-medium">
                      {entry.lessons_completed}
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
                            style={{
                              width: `${Math.min(100, Math.max(0, readiness))}%`,
                            }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 text-right">
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        Active
                      </span>
                    </td>
                  </tr>
                );
              })}

              {entriesToShow.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
                    className="py-8 text-center text-gray-400 text-[13px]"
                  >
                    No trainees on the leaderboard yet.
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
