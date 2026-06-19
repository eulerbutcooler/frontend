import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const inputBase =
  "w-full bg-canvas text-ink font-sans text-body-md border border-hairline rounded-xl px-4 placeholder:text-outline transition-colors focus:outline-none focus:border-ink disabled:opacity-50 disabled:cursor-not-allowed";

const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type = "text", ...props }, ref) => (
    <input
      type={type}
      ref={ref}
      className={cn(inputBase, "h-11", className)}
      {...props}
    />
  )
);
Input.displayName = "Input";

type LabelProps = React.LabelHTMLAttributes<HTMLLabelElement>;

const Label = forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, ...props }, ref) => (
    <label
      ref={ref}
      className={cn(
        "text-caption-uppercase font-semibold tracking-[1.5px] uppercase text-body font-sans",
        className
      )}
      {...props}
    />
  )
);
Label.displayName = "Label";

export { Input, Label };
