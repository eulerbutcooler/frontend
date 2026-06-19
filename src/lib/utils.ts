import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export { cva, type VariantProps } from "class-variance-authority";

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function capitalize(str?: string | null): string {
  if (!str) return "—";
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export const BRAND_COLORS = [
  "bg-brand-pink",
  "bg-brand-teal",
  "bg-brand-lavender",
  "bg-brand-peach",
  "bg-brand-ochre",
] as const;

export const DARK_TEXT_COLORS = new Set(["bg-brand-teal"]);
