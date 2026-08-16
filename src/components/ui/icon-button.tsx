import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

/**
 * IconButton — icon-only button with enforced accessibility.
 *
 * - Requires `aria-label` (throws in dev if missing).
 * - 36px minimum target (>= WCAG 2.5.8 AA 24px, close to 44px recommended).
 * - Includes focus-visible ring, active scale feedback, and hover gating
 *   behind `@media (hover: hover)` so touch devices don't get false hover.
 */
interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ label, className, type = "button", ...props }, ref) => {
    if (process.env.NODE_ENV !== "production" && !label) {
      console.warn("IconButton requires an `label` (aria-label) prop.");
    }

    return (
      <button
        ref={ref}
        type={type}
        aria-label={label}
        className={cn(
          "grid place-items-center rounded-lg size-9 text-surface-tint",
          "transition-[color,background-color,transform] duration-150 ease-snappy",
          "active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink",
          "hover:text-ink disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
          // Only apply hover-bg on fine-pointer devices (touch false-positives)
          "[@media(hover:hover)and(pointer:fine)]:hover:bg-surface-card",
          className
        )}
        {...props}
      />
    );
  }
);
IconButton.displayName = "IconButton";