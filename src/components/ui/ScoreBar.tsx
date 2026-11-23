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
    blue: "bg-gradient-to-r from-primary to-brand-cyan shadow-xs",
    emerald: "bg-gradient-to-r from-emerald-500 to-teal-400 shadow-xs",
    purple: "bg-gradient-to-r from-purple-500 to-indigo-400 shadow-xs",
    amber: "bg-gradient-to-r from-amber-500 to-orange-400 shadow-xs",
  };

  return (
    <div className={cn("w-full space-y-1.5", className)}>
      <div className="flex justify-between items-center text-xs sm:text-sm">
        {label && <span className="font-semibold text-muted-foreground truncate">{label}</span>}
        <span className="font-bold text-foreground ml-auto">
          {displayValue ?? `${score.toFixed(1)}%`}
        </span>
      </div>
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted/80">
        <div
          className={cn("h-full rounded-full transition-all duration-500", colors[colorScheme])}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
