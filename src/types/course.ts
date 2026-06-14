/** Matches backend domain.Course */
export interface Course {
  id: string;
  title: string;
  description: string;
  rank: string;
  instructor_id: string;
  published: boolean;
  created_at: string;
  updated_at: string;
}

/** Matches backend domain.Lesson */
export interface Lesson {
  id: string;
  course_id: string;
  title: string;
  order_idx: number;
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

export type FileType = "pdf" | "ppt" | "docx";

/** Backend uses "ready" (not "done") for completed ingestion */
export type IngestStatus = "pending" | "processing" | "ready" | "failed";
