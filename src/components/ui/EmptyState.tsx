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

export function EmptyState({
  title = "No results found",
  description = "Try adjusting your filters, searching for another keyword, or resetting your selection.",
  actionText = "Clear Filters",
  onAction,
  icon,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/40 p-12 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground mb-4">
        {icon || <AlertCircle className="h-6 w-6" />}
      </div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">{description}</p>
      {onAction && (
        <Button variant="outline" size="sm" onClick={onAction} className="mt-6 gap-2">
          <RotateCcw className="h-3.5 w-3.5" />
          {actionText}
        </Button>
      )}
    </div>
  );
}
