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

/** Indian Navy sailor ranks in order from junior to senior */
export const INDIAN_NAVY_SAILOR_RANKS = [
  "Seaman II",
  "Seaman I",
  "Leading Seaman / Leading Rate",
  "Petty Officer (PO)",
  "Chief Petty Officer (CPO)",
  "Master Chief Petty Officer II (MCPO II)",
  "Master Chief Petty Officer I (MCPO I)",
] as const;

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

/** Ranks offered at signup, junior sailor through Admiral */
export const SIGNUP_RANKS = [
  ...INDIAN_NAVY_SAILOR_RANKS,
  ...INDIAN_NAVY_RANKS,
] as const;

export type IndianNavySailorRank = (typeof INDIAN_NAVY_SAILOR_RANKS)[number];

export type IndianNavyRank = (typeof INDIAN_NAVY_RANKS)[number];

/** Allowed ranks for forms and validations */
export const RANKS = [
  ...SIGNUP_RANKS,
  "officer",
  "agniveer",
] as const;

export type Rank = string;
