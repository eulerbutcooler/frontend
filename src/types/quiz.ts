/** Matches backend domain.Quiz */
export interface Quiz {
  id: string;
  course_id: string;
  lesson_id?: string | null;
  difficulty: Difficulty;
  status: QuizStatus;
  question_count?: number;
  last_score?: number | null;
  is_attempted?: boolean;
  created_at: string;
  updated_at: string;
}

export type Difficulty = "easy" | "medium" | "hard";
export type QuizStatus = "pending" | "generating" | "ready" | "failed";

export interface Choice {
  label: string; // "A", "B", "C", "D"
  text: string;
}

/** Matches backend domain.Question */
export interface Question {
  id: string;
  quiz_id: string;
  type: QuestionType;
  question: string;
  choices: Choice[];
  answer?: string;
  order_idx: number;
  explanation?: string;
  difficulty?: "easy" | "medium" | "hard";
  topic_phrase?: string;
}

export type QuestionType = "mcq" | "open_ended";

export interface TopicSlide {
  slide_number: number;
  slide_type: "concept" | "technical_limits" | "diagram" | "emergency" | "summary";
  title: string;
  bullets: string[];
  formula_or_rule?: string;
  diagram_mermaid?: string;
  warning?: string;
}

export interface LessonTopic {
  id: string;
  lesson_id: string;
  title: string;
  order_index: number;
  slides: TopicSlide[];
  created_at?: string;
  updated_at?: string;
}

/** Matches backend domain.Attempt */
export interface Attempt {
  id: string;
  quiz_id: string;
  user_id: string;
  score: number;
  total: number;
  started_at: string;
  ended_at: string | null;
}

/** Matches backend domain.Answer */
export interface Answer {
  id: string;
  attempt_id: string;
  question_id: string;
  user_answer: string;
  is_correct: boolean;
}
