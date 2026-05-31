"use client";
import { cn, getCriticalityColor, getStatusColor } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "criticality" | "status" | "domain" | "default";
  value?: string;
  className?: string;
}

export function IndustrialBadge({ children, variant = "default", value = "", className }: BadgeProps) {
  let cls = "badge-blue";
  if (variant === "criticality") cls = getCriticalityColor(value);
  if (variant === "status") cls = getStatusColor(value);

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full label-tag",
        cls,
        className
      )}
    >
      {children}
    </span>
  );
}
