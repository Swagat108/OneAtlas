import React from "react";
import { AlertCircle, RotateCcw } from "lucide-react";
import { Button } from "./Button";

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

function AtlasCompassIllustration() {
  return (
    <div className="relative mb-5 flex h-20 w-20 items-center justify-center" aria-hidden="true">
      <div className="absolute inset-0 rounded-full bg-primary/10 blur-xl" />
      <svg
        className="relative h-20 w-20 text-muted-foreground/40"
        viewBox="0 0 80 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Concentric Coordinate Rings */}
        <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
        <circle cx="40" cy="40" r="26" stroke="currentColor" strokeWidth="1" />
        <circle cx="40" cy="40" r="14" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" />
        
        {/* Crosshair reticles */}
        <line x1="40" y1="2" x2="40" y2="78" stroke="currentColor" strokeWidth="1" opacity="0.5" />
        <line x1="2" y1="40" x2="78" y2="40" stroke="currentColor" strokeWidth="1" opacity="0.5" />
        
        {/* Diagonal ticks */}
        <circle cx="40" cy="14" r="2" fill="currentColor" />
        <circle cx="40" cy="66" r="2" fill="currentColor" />
        <circle cx="14" cy="40" r="2" fill="currentColor" />
        <circle cx="66" cy="40" r="2" fill="currentColor" />

        {/* Central Atlas Core */}
        <circle cx="40" cy="40" r="4" className="fill-primary" />
        <circle cx="40" cy="40" r="8" className="stroke-primary" strokeWidth="1.5" />
      </svg>
    </div>
  );
}

export function EmptyState({
  title = "No results found",
  description = "Try adjusting your filters, searching for another keyword, or resetting your selection.",
  actionText = "Clear Filters",
  onAction,
  icon,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/80 bg-card/40 p-10 sm:p-14 text-center relative overflow-hidden">
      <div className="absolute inset-0 bg-dot-pattern opacity-15 pointer-events-none" aria-hidden="true" />
      <div className="relative z-10 flex flex-col items-center">
        {icon ? (
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground mb-4">
            {icon}
          </div>
        ) : (
          <AtlasCompassIllustration />
        )}
        <h3 className="text-base sm:text-lg font-bold text-foreground">{title}</h3>
        <p className="mt-1.5 max-w-sm text-xs sm:text-sm text-muted-foreground leading-relaxed">{description}</p>
        {onAction && (
          <Button variant="outline" size="sm" onClick={onAction} className="mt-5 gap-2 shadow-2xs font-semibold">
            <RotateCcw className="h-3.5 w-3.5" />
            {actionText}
          </Button>
        )}
      </div>
    </div>
  );
}
