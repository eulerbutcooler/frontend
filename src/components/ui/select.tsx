"use client";

import * as SelectPrimitive from "@radix-ui/react-select";
import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown, Check } from "lucide-react";

const Select = SelectPrimitive.Root;
const SelectGroup = SelectPrimitive.Group;
const SelectValue = SelectPrimitive.Value;

const SelectTrigger = forwardRef<
  HTMLButtonElement,
  ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      "flex h-11 w-full items-center justify-between bg-canvas border border-hairline rounded-xl px-4 font-sans text-body-md text-ink placeholder:text-surface-tint/60 transition-[border-color,box-shadow] duration-150 ease-snappy focus:outline-none focus:border-ink focus:ring-2 focus:ring-ink disabled:opacity-50 disabled:cursor-not-allowed data-[placeholder]:text-surface-tint",
      className
    )}
    {...props}
  >
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown className="h-4 w-4 text-surface-tint" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
));
SelectTrigger.displayName = "SelectTrigger";

const SelectContent = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = "popper", sideOffset = 4, ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      position={position}
      sideOffset={sideOffset}
      className={cn(
        "relative z-50 max-h-72 min-w-[8rem] overflow-hidden bg-surface-card border border-hairline rounded-xl shadow-lg animate-popover [transform-origin:var(--radix-select-content-transform-origin)]",
        position === "popper" && "w-[var(--radix-select-trigger-width)]",
        className
      )}
      {...props}
    >
      <SelectPrimitive.Viewport className="p-1">
        {children}
      </SelectPrimitive.Viewport>
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
));
SelectContent.displayName = "SelectContent";

const SelectItem = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex w-full cursor-pointer items-center rounded-lg py-2.5 px-3 font-sans text-body-sm text-ink outline-none select-none hover:bg-surface-soft data-[highlighted]:bg-surface-soft data-[disabled]:opacity-50 data-[disabled]:pointer-events-none",
      className
    )}
    {...props}
  >
    <span className="absolute right-3 flex h-4 w-4 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <Check className="h-4 w-4 text-ink" />
      </SelectPrimitive.ItemIndicator>
    </span>
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </SelectPrimitive.Item>
));
SelectItem.displayName = "SelectItem";

const SelectLabel = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn(
      "py-2 px-3 text-caption-uppercase uppercase text-surface-tint font-sans",
      className
    )}
    {...props}
  />
));
SelectLabel.displayName = "SelectLabel";

export { Select, SelectGroup, SelectValue, SelectTrigger, SelectContent, SelectItem, SelectLabel };
