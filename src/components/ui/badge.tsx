import { type HTMLAttributes } from "react";
import { cn, cva, type VariantProps } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 font-sans text-[13px] font-medium leading-snug whitespace-nowrap",
  {
    variants: {
      variant: {
        default: "bg-surface-card text-ink px-3 py-1 rounded-full",
        success: "bg-success/10 text-success px-3 py-1 rounded-full",
        warning: "bg-warning/10 text-warning px-3 py-1 rounded-full",
        error: "bg-error/10 text-error px-3 py-1 rounded-full",
        info: "bg-brand-teal text-white px-3 py-1 rounded-full",
        outline: "border border-hairline text-ink px-3 py-1 rounded-full",
        ghost: "bg-white/10 text-white px-3 py-1 rounded-full backdrop-blur-sm",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant, className }))} {...props} />
  );
}

export { Badge, badgeVariants };
