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

/** Indian Navy Officer Ranks in order from Sub Lieutenant to Admiral */
export const INDIAN_NAVY_RANKS = [
  "Sub Lieutenant",
  "Lieutenant",
  "Lieutenant Commander",
  "Commander",
  "Captain",
  "Commodore",
  "Rear Admiral",
  "Vice Admiral",
  "Admiral",
] as const;

export type IndianNavyRank = (typeof INDIAN_NAVY_RANKS)[number];

/** Allowed ranks for forms and validations */
export const RANKS = [
  ...INDIAN_NAVY_RANKS,
  "officer",
  "agniveer",
] as const;

export type Rank = string;
