import { forwardRef, type ButtonHTMLAttributes } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn, cva, type VariantProps } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 font-sans text-button font-semibold whitespace-nowrap transition-colors duration-200 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
  {
    variants: {
      variant: {
        primary: "bg-ink text-white hover:bg-ink/90",
        secondary: "bg-canvas text-ink border border-hairline hover:bg-surface-strong",
        ghost: "text-ink hover:bg-surface-card",
        "on-color": "bg-white text-ink hover:bg-surface-soft",
        destructive: "bg-error text-white hover:bg-error/90",
        link: "text-ink underline underline-offset-4 hover:text-surface-tint p-0 h-auto",
      },
      size: {
        sm: "h-9 px-4 rounded-lg text-[13px]",
        default: "h-11 px-5 rounded-xl",
        lg: "h-12 px-6 rounded-xl text-[15px]",
        icon: "h-11 w-11 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
export type { ButtonProps };
