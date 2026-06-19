import { type HTMLAttributes } from "react";
import { cn, cva, type VariantProps } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 font-sans text-[13px] font-medium leading-snug whitespace-nowrap",
  {
    variants: {
      variant: {
        default: "bg-surface-card text-ink px-3 py-1 rounded-full",
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
