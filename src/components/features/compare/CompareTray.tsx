"use client";

import React from "react";
import { useCompareTray } from "@/hooks/use-compare-tray";
import { X, ArrowRight, Layers } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function CompareTray() {
  const { selectedModels, removeModel, clearTray, navigateToCompare } = useCompareTray();

  if (selectedModels.length === 0) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 w-full max-w-2xl px-4 animate-in slide-in-from-bottom-5">
      <div className="flex items-center justify-between gap-4 rounded-2xl border border-primary/30 bg-card/95 p-3.5 shadow-2xl backdrop-blur-md">
        <div className="flex items-center gap-2 overflow-x-auto py-1">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-primary pl-1 pr-2 whitespace-nowrap">
            <Layers className="h-4 w-4" />
            <span>Compare ({selectedModels.length}/4):</span>
          </div>

          {selectedModels.map((m) => (
            <div
              key={m.slug}
              className="flex items-center gap-1.5 rounded-lg border border-border bg-accent/60 px-2.5 py-1 text-xs whitespace-nowrap"
            >
              <span className="font-medium">{m.name}</span>
              <button
                onClick={() => removeModel(m.slug)}
                className="text-muted-foreground hover:text-foreground"
                aria-label={`Remove ${m.name}`}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={clearTray}
            className="text-xs text-muted-foreground hover:text-foreground px-2 py-1"
          >
            Clear
          </button>
          <Button
            size="sm"
            disabled={selectedModels.length < 2}
            onClick={navigateToCompare}
            className="gap-1.5 shadow-md"
          >
            Compare Now
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
