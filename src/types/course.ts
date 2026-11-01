/** Matches backend domain.Course */
export interface Course {
  id: string;
  title: string;
  description: string;
  rank: string;
  instructor_id: string;
  published: boolean;
  thumbnail_url?: string;
  created_at: string;
  updated_at: string;
}

/** Matches backend domain.Lesson */
export type LessonPlanStatus = "pending" | "generating" | "ready" | "failed";

export interface Lesson {
  id: string;
  course_id: string;
  title: string;
  order_idx: number;
  syllabus_row_index?: number;
  lesson_plan_key?: string;
  lesson_plan_status?: LessonPlanStatus;
  lesson_plan_error?: string;
  created_at: string;
  updated_at: string;
}

/** Matches backend domain.FileAsset */
export interface FileAsset {
  id: string;
  lesson_id: string;
  file_name: string;
  file_type: FileType;
  minio_key: string;
  ingest_status: IngestStatus;
  created_at: string;
  updated_at: string;
}

export type FileType = "pdf" | "ppt" | "pptx" | "docx" | "video";

export type SyllabusStatus = "pending" | "processing" | "ready" | "failed";

export interface SyllabusRow {
  task: string;
  sub_task: string;
  objective: string;
  syllabus: string;
  periods_t: string;
  periods_p: string;
  periods_f: string;
  periods_total: string;
  sok: string;
  remarks: string;
}

/** Matches backend domain.CourseSyllabus */
export interface CourseSyllabus {
  course_id: string;
  file_name: string;
  minio_key?: string;
  subject_code?: string;
  subject_name?: string;
  status: SyllabusStatus;
  topics: string[];
  rows: SyllabusRow[];
  error?: string;
  created_at: string;
  updated_at: string;
}

export interface BankQuestion {
  id: string;
  quiz_id: string;
  type: "mcq" | "open_ended";
  question: string;
  choices?: Array<{ label: string; text: string }> | null;
  answer: string;
  order_idx: number;
  explanation?: string;
  difficulty?: "easy" | "medium" | "hard" | string;
  topic_phrase?: string;
}

export interface ImportedSubject {
  course_id: string;
  subject_code: string;
  subject_name: string;
  lesson_count: number;
  status: "created" | "existing" | "failed" | string;
  error?: string;
}

export interface SyllabusImportResult {
  file_name: string;
  subjects: ImportedSubject[];
}

/** Backend uses "ready" (not "done") for completed ingestion */
export type IngestStatus = "pending" | "processing" | "ready" | "failed";
