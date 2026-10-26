import type { Course } from "@/types/course";

export type SpecializationBranch = "aeo" | "alo";

/**
 * Determines whether a course/subject belongs to AEO or ALO.
 * Priority:
 * 1. Client-side localStorage override (for immediate visual consistency)
 * 2. Explicit [AEO] or [ALO] tag in description or title
 * 3. Domain keyword heuristics
 * 4. Default: "aeo"
 */
export function getCourseBranch(course: Course): SpecializationBranch {
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem(`aeromentor_branch_${course.id}`);
      if (stored === "alo" || stored === "aeo") {
        return stored;
      }
    } catch {
      // ignore localStorage errors
    }
  }

  const combined = `${course.title} ${course.description || ""}`.toLowerCase();

  if (combined.includes("[alo]") || combined.includes("branch: alo") || combined.includes("branch:alo")) {
    return "alo";
  }
  if (combined.includes("[aeo]") || combined.includes("branch: aeo") || combined.includes("branch:aeo")) {
    return "aeo";
  }

  const aloKeywords = [
    "electrical",
    "electronic",
    "avionics",
    "radar",
    "telemetry",
    "power distribution",
    "instrumentation",
    "sensor",
    "radio",
    "ew suite",
    "electronic warfare",
    "alo",
    "aleo",
  ];

  if (aloKeywords.some((kw) => combined.includes(kw))) {
    return "alo";
  }

  return "aeo";
}

/**
 * Strips the [AEO] / [ALO] prefix from description for clean presentation.
 */
export function cleanSubjectDescription(desc?: string): string {
  if (!desc) return "No description provided.";
  return desc.replace(/^\[(AEO|ALO)\]\s*/i, "").trim();
}

/**
 * Resolves the user's Indian Navy rank.
 */
export function getUserNavalRank(rank?: string | null, enrollmentId?: string | null): string {
  if (typeof window !== "undefined") {
    if (enrollmentId) {
      const stored = localStorage.getItem(`aeromentor_user_rank_${enrollmentId.toLowerCase()}`);
      if (stored) return stored;
    }
    const current = localStorage.getItem("aeromentor_current_user_rank");
    if (current) return current;
  }
  if (rank && rank !== "officer" && rank !== "agniveer") {
    return rank;
  }
  return "Sub Lieutenant";
}

/**
 * Formats standard greeting: "Hello, <Rank> <FirstName>"
 */
export function formatNavalGreeting(rank?: string | null, name?: string | null, enrollmentId?: string | null): string {
  const navalRank = getUserNavalRank(rank, enrollmentId);
  const firstName = (name || "Trainee").trim().split(" ")[0];
  return `Hello, ${navalRank} ${firstName}`;
}

