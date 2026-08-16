import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const inputBase =
  "w-full bg-canvas text-ink font-sans text-body-md border border-hairline rounded-xl px-4 placeholder:text-surface-tint/60 transition-[border-color,box-shadow] duration-150 ease-snappy focus:outline-none focus:border-ink focus:ring-2 focus:ring-ink disabled:opacity-50 disabled:cursor-not-allowed";

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
        "text-caption-uppercase uppercase text-body font-sans",
        className
      )}
      {...props}
    />
  )
);
Label.displayName = "Label";

export { Input, Label };
