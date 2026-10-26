import { forwardRef, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const inputBase =
  "w-full bg-white text-[#0a0a0a] font-sans text-[15px] border border-gray-200 rounded-lg px-4 placeholder:text-gray-400 transition-colors focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm";

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
        "text-[13px] font-medium text-gray-700 font-sans mb-1.5 block",
        className
      )}
      {...props}
    />
  )
);
Label.displayName = "Label";

export { Input, Label };
