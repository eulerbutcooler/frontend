/** Matches backend domain.Overview */
export interface AnalyticsOverview {
  total_students: number;
  total_courses: number;
  avg_score: number;
}

/** Matches backend domain.Metric */
export interface CourseMetric {
  course_id: string;
  total_students: number;
  avg_quiz_score: number;
  total_messages: number;
  total_files: number;
}

/** Matches backend domain.StudentScore */
export interface StudentScore {
  user_id: string;
  name: string;
  rank: string;
  avg_score: number;
}

// Student Analytics Domain
export interface StudentUserProfile {
  name: string;
  rank: string;
  enrollment_id: string;
  readiness_score: number;
}

export interface StudentStats {
  courses_enrolled: number;
  courses_completed: number;
  overall_completion_pct: number;
  lessons_completed: number;
  avg_lessons_per_course: number;
  quizzes_attempted: number;
  overall_avg_score: number;
  lesson_quiz_avg: number;
  course_quiz_avg: number;
}

export interface StudentCourseProgressItem {
  course_id: string;
  title: string;
  rank: string;
  total_lessons: number;
  completed_lessons: number;
  progress_pct: number;
  is_completed: boolean;
  quiz_avg: number;
}

export interface StrengthWeaknessCourse {
  title: string;
  avg_score: number;
}

export interface StrengthWeaknessLesson {
  title: string;
  course_title: string;
  score: number;
}

export interface StudentSpotlight {
  strongest_course: StrengthWeaknessCourse | null;
  weakest_course: StrengthWeaknessCourse | null;
  strongest_lesson: StrengthWeaknessLesson | null;
  weakest_lesson: StrengthWeaknessLesson | null;
}

export interface LeaderboardEntry {
  rank_position: number;
  user_id: string;
  name: string;
  enrollment_id: string;
  rank: string;
  courses_completed: number;
  courses_enrolled: number;
  lessons_completed: number;
  avg_score: number;
  readiness_score: number;
  is_current_user: boolean;
}

export interface StudentAnalytics {
  user_profile: StudentUserProfile;
  stats: StudentStats;
  course_progress: StudentCourseProgressItem[];
  spotlight: StudentSpotlight;
  leaderboard: LeaderboardEntry[];
}

// Instructor Analytics Domain
export interface InstructorCourseItem {
  course_id: string;
  title: string;
  published: boolean;
  total_lessons: number;
  enrolled_students: number;
  completed_students: number;
  completion_rate: number;
  lesson_quiz_avg: number;
  course_quiz_avg: number;
}

export interface RecentActivityItem {
  student_name: string;
  rank: string;
  enrollment_id: string;
  course_title: string;
  quiz_type: string;
  score: number;
  date: string;
}

export interface InstructorStats {
  total_courses: number;
  total_students_active: number;
  total_graduates: number;
  avg_completion_rate: number;
  overall_avg_quiz_score: number;
  cohort_lesson_quiz_avg: number;
  cohort_course_quiz_avg: number;
}

export interface StudentDirectoryItem {
  id: string;
  name: string;
  rank: string;
  enrollment_id: string;
  courses_completed: number;
  courses_enrolled: number;
  lessons_completed: number;
  avg_score: number;
  readiness_score: number;
}

export interface InstructorAnalytics {
  stats: InstructorStats;
  courses: InstructorCourseItem[];
  recent_activity: RecentActivityItem[];
  students: StudentDirectoryItem[];
}
