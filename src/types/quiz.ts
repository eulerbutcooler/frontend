/** Matches backend domain.Quiz */
export interface Quiz {
  id: string;
  course_id: string;
  difficulty: Difficulty;
  status: QuizStatus;
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
  answer: string;
  order_idx: number;
}

export type QuestionType = "mcq" | "open_ended";

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
