import { forwardRef, type HTMLAttributes } from "react";
import { cn, cva, type VariantProps } from "@/lib/utils";

const cardVariants = cva("overflow-hidden relative", {
  variants: {
    variant: {
      cream: "bg-surface-card text-ink border border-hairline rounded-2xl",
      outline: "bg-white text-ink border border-hairline rounded-2xl",
      pink: "bg-brand-pink text-white rounded-[24px]",
      teal: "bg-brand-teal text-white rounded-[24px]",
      lavender: "bg-brand-lavender text-ink rounded-[24px]",
      peach: "bg-brand-peach text-ink rounded-[24px]",
      ochre: "bg-brand-ochre text-ink rounded-[24px]",
      mint: "bg-brand-mint text-ink rounded-[24px]",
      ghost: "bg-transparent text-ink",
    },
    padding: {
      none: "",
      default: "p-6 md:p-8",
      compact: "p-4 md:p-6",
    },
  },
  defaultVariants: {
    variant: "cream",
    padding: "default",
  },
});

interface CardProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, padding, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardVariants({ variant, padding, className }))}
      {...props}
    />
  )
);
Card.displayName = "Card";

const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("relative z-10", className)} {...props} />
  )
);
CardHeader.displayName = "CardHeader";

const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("relative z-10", className)} {...props} />
  )
);
CardContent.displayName = "CardContent";

const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("relative z-10 mt-auto", className)}
      {...props}
    />
  )
);
CardFooter.displayName = "CardFooter";

export { Card, CardHeader, CardContent, CardFooter, cardVariants };
