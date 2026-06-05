import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/shared/lib/utils";

const statCardVariants = cva(
  " rounded-xl p-5 shadow-sm border-l-4 flex flex-col justify-between",
  {
    variants: {
      variant: {
        green: "border-success text-success",
        blue: "border-info-300 text-info-300",
        yellow: "border-warning text-warning",
        red: "border-error text-error",
        success2: "border-emerald-600 text-emerald-600",
        orange: "border-orange-600 text-orange-600",
        gray: "border-slate-500 text-slate-500",
      },
    },
    defaultVariants: {
      variant: "green",
    },
  },
);

interface StatCardProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof statCardVariants> {
  title: string;
  value: string | number;
  description: string;
}

export function StatCard({
  title,
  value,
  description,
  variant,
  className,
}: StatCardProps) {
  return (
    <div className={cn(statCardVariants({ variant }), className)}>
      <p className="text-sm font-semibold text-black">{title}</p>

      <h2 className={cn("text-4xl font-semibold")}>{value}</h2>

      <p className="text-xs font-semibold text-black">{description}</p>
    </div>
  );
}
