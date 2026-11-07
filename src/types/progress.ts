import type { LessonTopic, Quiz } from "./quiz";
import type { FileAsset, Lesson } from "./course";

/** File reference within a lesson for the course player */
export interface LessonFile {
  id: string;
  file_name: string;
  minio_key: string;
  file_type: "docx" | "pptx" | "ppt" | "pdf" | "video";
}

/** Lesson with its associated files, topics, and quiz */
export interface LessonWithContent extends Lesson {
  files: FileAsset[];
  topics?: LessonTopic[];
  quiz: Quiz | null;
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
