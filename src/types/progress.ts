import type { LessonTopic } from "./quiz";

/** File reference within a lesson for the course player */
export interface LessonFile {
  id: string;
  file_name: string;
  minio_key: string;
  file_type: "docx" | "pptx" | "ppt" | "pdf";
}

/** Lesson with its associated files, topics, and quiz */
export interface LessonWithContent {
  id: string;
  title: string;
  files: LessonFile[];
  topics?: LessonTopic[];
  quiz: any | null; // using any for now, could type Quiz later
}

export interface LessonProgressData {
  is_completed: boolean;
  completed_at: string | null;
  viewed_files: Record<string, boolean>;
}

/** Full course progress from backend */
export interface CourseProgressData {
  course_id: string;
  is_completed: boolean;
  completed_at?: string;
  lessons: Record<string, LessonProgressData>;
}
