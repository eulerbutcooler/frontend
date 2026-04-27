/** Matches backend domain.User */
export interface User {
  id: string;
  name: string;
  enrollment_id: string;
  rank: string;
  role: Role;
  created_at: string;
  updated_at: string;
}

export type Role = "student" | "instructor";

/** Rank values used by the backend validator */
export const RANKS = ["officer", "agniveer"] as const;

export type Rank = (typeof RANKS)[number];
