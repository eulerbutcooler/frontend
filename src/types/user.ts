/** Matches backend domain.User */
export interface User {
  id: string;
  name: string;
  enrollment_id: string;
  rank: string;
  role: Role;
  is_master?: boolean;
  created_at: string;
  updated_at: string;
}

export interface CourseSummary {
  id: string;
  title: string;
  published: boolean;
  is_owner: boolean;
}

export interface AdminInstructorItem {
  id: string;
  name: string;
  enrollment_id: string;
  rank: string;
  is_master: boolean;
  owned_courses_count: number;
  associated_courses: CourseSummary[];
  created_at: string;
}

export interface AdminStudentItem {
  id: string;
  name: string;
  enrollment_id: string;
  rank: string;
  courses_completed: number;
  courses_enrolled: number;
  lessons_completed: number;
  avg_score: number;
  readiness_score: number;
  created_at: string;
}

export interface AdminUsersDirectory {
  instructors: AdminInstructorItem[];
  students: AdminStudentItem[];
}

export function isAdminUser(
  user?: {
    role?: string | null;
    is_master?: boolean;
    isMaster?: boolean;
    enrollment_id?: string | null;
    serviceNumber?: string | null;
  } | null
): boolean {
  if (user?.role !== "instructor") return false;
  const serviceId = (user.enrollment_id || user.serviceNumber || "").trim();
  return Boolean(user.is_master || user.isMaster || serviceId === "1000");
}

export type Role = "student" | "instructor";

/** Indian Navy sailor ranks in order from junior to senior */
export const INDIAN_NAVY_SAILOR_RANKS = [
  "Seaman II",
  "Seaman I",
  "Leading Seaman",
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
