"use client";

import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export const Select = SelectPrimitive.Root;
export const SelectGroup = SelectPrimitive.Group;
export const SelectValue = SelectPrimitive.Value;
export const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    className={cn(
      // ——— три базовых слоя: фон, бордер, focus-ring
      "flex h-10 w-full items-center justify-between gap-2 rounded-md",
      "border border-gray-300 bg-white shadow-sm",
      "px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400",
      "transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500",
      "disabled:cursor-not-allowed disabled:opacity-50",
      className
    )}
    {...props}
  >
    {children}
    <ChevronDown className="h-4 w-4 shrink-0 text-gray-500" />
  </SelectPrimitive.Trigger>
));
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

export const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      sideOffset={4}
      className={cn(
        // фон, тень, скругление
        "z-50 min-w-[8rem] overflow-hidden rounded-md border bg-white shadow-lg",
        className
      )}
      {...props}
    >
      <SelectPrimitive.ScrollUpButton className="flex h-6 cursor-default items-center justify-center bg-white text-gray-700" />
      <SelectPrimitive.Viewport className="p-1">{children}</SelectPrimitive.Viewport>
      <SelectPrimitive.ScrollDownButton className="flex h-6 cursor-default items-center justify-center bg-white text-gray-700" />
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
));
SelectContent.displayName = SelectPrimitive.Content.displayName;

export const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm",
      "text-gray-900 outline-none",
      // состояние
      "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      // hover / focus
      "focus:bg-primary-50 focus:text-primary-900 hover:bg-primary-50",
      className
    )}
    {...props}
  >
    <span className="flex-1">{children}</span>
    <SelectPrimitive.ItemIndicator>
      <Check className="h-4 w-4 text-primary-500" />
    </SelectPrimitive.ItemIndicator>
  </SelectPrimitive.Item>
));
SelectItem.displayName = SelectPrimitive.Item.displayName;

// Вспомогательные компоненты оставим «как есть»:
export const SelectLabel = SelectPrimitive.Label;
export const SelectSeparator = SelectPrimitive.Separator;
export const SelectContentText = SelectPrimitive.Text;
export const SelectViewport = SelectPrimitive.Viewport;