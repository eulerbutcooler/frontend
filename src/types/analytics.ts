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
