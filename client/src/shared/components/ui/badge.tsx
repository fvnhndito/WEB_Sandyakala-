import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/shared/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center border justify-center rounded-full px-8 py-2 text-sm font-semibold transition-colors",
  {
    variants: {
      variant: {
        primary: "bg-primary text-white border-primary",
        info: "bg-info-100 text-info-300 border-info-300",
        warning: "bg-warning-100 text-warning-300 border-warning-300",
        error: "bg-error-200 text-error-300 border-error-300",
        success: "bg-success-100 text-success-300 border-success-300",
        gray: "bg-slate-200 text-slate-600 border border-slate-200",
        orange: "bg-orange-300 text-orange-700",
        success2: "bg-emerald-200 text-emerald-700 border border-emerald-200"
      },
      size: {
        sm: "px-2 py-1 text-xs",
        md: "px-3 py-1 text-sm",
        lg: "px-4 py-1.5 text-base",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export interface BadgeProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <div
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    />
  );
}
