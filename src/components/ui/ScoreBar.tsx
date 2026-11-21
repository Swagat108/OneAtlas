import React from "react";
import { cn } from "@/lib/utils";

interface ScoreBarProps {
  score: number;
  maxScore?: number;
  label?: string;
  displayValue?: string;
  className?: string;
  colorScheme?: "blue" | "emerald" | "purple" | "amber";
}

export function ScoreBar({
  score,
  maxScore = 100,
  label,
  displayValue,
  className,
  colorScheme = "blue",
}: ScoreBarProps) {
  const percentage = Math.min(100, Math.max(0, (score / maxScore) * 100));

  const colors = {
    blue: "bg-primary",
    emerald: "bg-emerald-500",
    purple: "bg-purple-500",
    amber: "bg-amber-500",
  };

  return (
    <div className={cn("w-full space-y-1.5", className)}>
      <div className="flex justify-between items-center text-xs">
        {label && <span className="font-medium text-muted-foreground truncate">{label}</span>}
        <span className="font-semibold text-foreground ml-auto">
          {displayValue ?? `${score.toFixed(1)}%`}
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-muted/80">
        <div
          className={cn("h-full rounded-full transition-all duration-500", colors[colorScheme])}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
