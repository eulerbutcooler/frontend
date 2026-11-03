import type { Course } from "@/types/course";

export type SpecializationBranch =
  | "aeo"
  | "alo"
  | "avr_al"
  | "avr_ae"
  | "avr_aw"
  | "avr_ar";

export interface SpecializationBranchMeta {
  id: SpecializationBranch;
  name: string;
  /** Short code shown in compact badges, e.g. AEO / AVR AL. */
  shortCode: string;
  /** Full label used on subject cards. */
  badge: string;
  /** Prefix written into the course description. */
  tag: string;
  description: string;
}

export const SPECIALIZATION_BRANCHES: readonly SpecializationBranchMeta[] = [
  {
    id: "aeo",
    name: "Air Engineer Officer",
    shortCode: "AEO",
    badge: "AEO",
    tag: "AEO",
    description:
      "Aeronautical engineering, flight mechanics, propulsion systems, and naval aircraft structures.",
  },
  {
    id: "alo",
    name: "Air Electrical Officer",
    shortCode: "ALO",
    badge: "ALO",
    tag: "ALO",
    description:
      "Avionics architecture, electrical power distribution, airborne radar systems, and sensor telemetry.",
  },
  {
    id: "avr_al",
    name: "Agniveer AVR AL",
    shortCode: "AL",
    badge: "AVR AL",
    tag: "AVR-AL",
    description: "Agniveer apprentice stream for the AL specialization.",
  },
  {
    id: "avr_ae",
    name: "Agniveer AVR AE",
    shortCode: "AE",
    badge: "AVR AE",
    tag: "AVR-AE",
    description: "Agniveer apprentice stream for the AE specialization.",
  },
  {
    id: "avr_aw",
    name: "Agniveer AVR AW",
    shortCode: "AW",
    badge: "AVR AW",
    tag: "AVR-AW",
    description: "Agniveer apprentice stream for the AW specialization.",
  },
  {
    id: "avr_ar",
    name: "Agniveer AVR AR",
    shortCode: "AR",
    badge: "AVR AR",
    tag: "AVR-AR",
    description: "Agniveer apprentice stream for the AR specialization.",
  },
];

export function isSpecializationBranch(
  value: string | null | undefined
): value is SpecializationBranch {
  return SPECIALIZATION_BRANCHES.some((branch) => branch.id === value);
}

export function getSpecializationMeta(
  branch: SpecializationBranch
): SpecializationBranchMeta {
  return (
    SPECIALIZATION_BRANCHES.find((item) => item.id === branch) ??
    SPECIALIZATION_BRANCHES[0]
  );
}

/** Human-readable label for a course's stored rank / curriculum group. */
export function formatCourseRank(rank?: string | null): string {
  const normalized = (rank ?? "").trim().toLowerCase().replace(/[\s-]+/g, "_");
  if (isSpecializationBranch(normalized)) {
    return getSpecializationMeta(normalized).badge;
  }
  if (normalized === "apprentice" || normalized === "agniveer") {
    return "Apprentice";
  }
  if (normalized === "officer") {
    return "Officer";
  }
  return rank ? rank.replace(/_/g, " ") : "General";
}

/**
 * Determines whether a course/subject belongs to AEO, ALO, or one of the
 * Agniveer AVR streams.
 *
 * Priority:
 * 1. Explicit [AEO] / [ALO] / [AVR-AL] / [AVR-AE] / [AVR-AW] / [AVR-AR] tag
 * 2. Legacy [AGNIVEER] tag, apprentice rank, or Agniveer wording
 * 3. Legacy client-side localStorage override
 * 4. Domain keyword heuristics
 * 5. Default: "aeo"
 */
export function getCourseBranch(course: Course): SpecializationBranch {
  const combined = `${course.title} ${course.description || ""}`.toLowerCase();

  const avrTag = combined.match(
    /(?:\[|branch:\s*)avr[-_ ]?(al|ae|aw|ar)/
  );
  if (avrTag) {
    return `avr_${avrTag[1]}` as SpecializationBranch;
  }

  if (
    combined.includes("[agniveer]") ||
    combined.includes("branch: agniveer") ||
    combined.includes("branch:agniveer")
  ) {
    return "avr_ae";
  }
  if (
    combined.includes("[alo]") ||
    combined.includes("branch: alo") ||
    combined.includes("branch:alo")
  ) {
    return "alo";
  }
  if (
    combined.includes("[aeo]") ||
    combined.includes("branch: aeo") ||
    combined.includes("branch:aeo")
  ) {
    return "aeo";
  }

  const rankBranch = course.rank.toLowerCase().replace(/[\s-]+/g, "_");
  if (isSpecializationBranch(rankBranch)) {
    return rankBranch;
  }

  if (
    rankBranch === "apprentice" ||
    rankBranch === "agniveer" ||
    combined.includes("agniveer") ||
    combined.includes("apprentice")
  ) {
    return "avr_ae";
  }

  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem(`aeromentor_branch_${course.id}`);
      if (isSpecializationBranch(stored)) {
        return stored;
      }
      if (stored === "agniveer") {
        return "avr_ae";
      }
    } catch {
      // ignore localStorage errors
    }
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
 * Strips the [AEO] / [ALO] / [AGNIVEER] / [AVR-AL] prefix from a description.
 */
export function cleanSubjectDescription(desc?: string): string {
  if (!desc) return "No description provided.";
  return desc
    .replace(
      /^\[(AEO|ALO|AGNIVEER|AVR(?:[-_ ]?(?:AL|AE|AW|AR))?)\]\s*/i,
      ""
    )
    .trim();
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

