import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { api } from "@/lib/api-client";
import Link from "next/link";
import {
  ArrowLeft,
} from "lucide-react";
import { KpiCard } from "@/components/analytics/kpi-card";
import { DataTable } from "@/components/analytics/data-table";
import { DifficultyBadge } from "@/components/quiz/difficulty-badge";
import type { CourseMetric } from "@/types/analytics";
import type { Course, Lesson, FileAsset } from "@/types/course";
import type { Quiz } from "@/types/quiz";

interface PageProps {
  params: Promise<{ courseId: string }>;
}

export default async function CourseAnalyticsPage({ params }: PageProps) {
  const { courseId } = await params;
  const session = await auth();
  if (!session) redirect("/login");
  if (session.user.role !== "instructor") redirect("/dashboard");

  let course: Course;
  let metrics: CourseMetric;
  let lessons: Lesson[] = [];
  let quizzes: Quiz[] = [];

  try {
    [course, metrics, lessons, quizzes] = await Promise.all([
      api.get<Course>(`/api/v1/courses/${courseId}`),
      api.get<CourseMetric>(`/api/v1/analytics/${courseId}`),
      api.get<Lesson[]>(`/api/v1/courses/${courseId}/lessons`),
      api.get<Quiz[]>(`/api/v1/courses/${courseId}/quizzes`),
    ]);
  } catch {
    notFound();
  }

  let allFiles: (FileAsset & { lesson_title: string })[] = [];
  const fileResults = await Promise.allSettled(
    lessons.map((lesson) =>
      api
        .get<FileAsset[]>(`/api/v1/lessons/${lesson.id}/files`)
        .then((files) => files.map((f) => ({ ...f, lesson_title: lesson.title })))
    )
  );
  for (const r of fileResults) {
    if (r.status === "fulfilled") allFiles = allFiles.concat(r.value);
  }

  const statusBadge = (status: string) => {
    const styles: Record<string, string> = {
      ready: "bg-success/15 text-success",
      processing: "bg-warning/15 text-warning",
      pending: "bg-surface-card text-surface-tint",
      failed: "bg-error/15 text-error",
      generating: "bg-warning/15 text-warning",
    };
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-caption font-semibold ${styles[status] ?? styles.pending}`}>
        <span className="w-1.5 h-1.5 rounded-full bg-current" />
        {status ? status.charAt(0).toUpperCase() + status.slice(1) : "—"}
      </span>
    );
  };

  return (
    <div>
      {/* Back link */}
      <Link
        href="/analytics"
        className="focus-ring inline-flex items-center gap-2 text-button font-semibold text-surface-tint hover:text-ink transition-colors mb-8"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Analytics
      </Link>

      {/* Header */}
      <header className="mb-12">
        <p className="text-caption-uppercase uppercase text-surface-tint mb-2">
          Course Analytics
        </p>
        <h1 className="font-display text-display-lg text-ink">
          {course.title}
        </h1>
      </header>

      {/* KPI Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <KpiCard
          label="Students"
          value={metrics.total_students}
          color="bg-brand-lavender"
        />
        <KpiCard
          label="Avg Quiz Score"
          value={`${Math.round(metrics.avg_quiz_score)}%`}
          color="bg-brand-mint"
        />
        <KpiCard
          label="Chat Messages"
          value={metrics.total_messages}
          color="bg-brand-peach"
        />
        <KpiCard
          label="Files Uploaded"
          value={metrics.total_files}
          color="bg-brand-ochre"
        />
      </section>

      {/* File Ingest Table */}
      <section className="mb-12">
        <h2 className="text-title-lg font-semibold text-ink mb-6">
          Uploaded Files
        </h2>
        <DataTable
          columns={[
            {
              key: "file_name",
              header: "File Name",
              render: (f) => (
                <span className="font-semibold">{f.file_name}</span>
              ),
            },
            {
              key: "lesson",
              header: "Lesson",
              render: (f) => f.lesson_title,
            },
            {
              key: "type",
              header: "Type",
              render: (f) => (
                <span className="uppercase text-caption-uppercase">
                  {f.file_type}
                </span>
              ),
            },
            {
              key: "status",
              header: "Status",
              render: (f) => statusBadge(f.ingest_status),
            },
          ]}
          data={allFiles}
          keyExtractor={(f) => f.id}
          emptyMessage="No files uploaded for this course."
        />
      </section>

      {/* Quiz Performance */}
      <section>
        <h2 className="text-title-lg font-semibold text-ink mb-6">
          Quiz Performance
        </h2>
        <DataTable
          columns={[
            {
              key: "difficulty",
              header: "Difficulty",
              render: (q) => <DifficultyBadge difficulty={q.difficulty} />,
            },
            {
              key: "status",
              header: "Status",
              render: (q) => statusBadge(q.status),
            },
            {
              key: "created",
              header: "Created",
              render: (q) =>
                new Date(q.created_at).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                }),
            },
          ]}
          data={quizzes}
          keyExtractor={(q) => q.id}
          emptyMessage="No quizzes generated for this course."
        />
      </section>
    </div>
  );
}
