/** Matches backend domain.ChatSession */
export interface ChatSession {
  id: string;
  user_id: string;
  course_id: string | null;
  title: string;
  created_at: string;
  updated_at: string;
}

/** Matches backend domain.Citation / RAG CitationItem */
export interface Citation {
  file_name: string;
  file_id: string;
  score: number | null;
}

/** Matches backend domain.Message */
export interface Message {
  id: string;
  session_id?: string;
  role: "user" | "assistant";
  content: string;
  citations: Citation[];
  created_at: string;
}
