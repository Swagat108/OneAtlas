"use client";

import React from "react";
import { useCompareTray } from "@/hooks/use-compare-tray";
import { X, ArrowRight, Layers } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ModelLogo } from "@/components/ui/ModelLogo";

export function CompareTray() {
  const { selectedModels, removeModel, clearTray, navigateToCompare } = useCompareTray();

  if (selectedModels.length === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-full max-w-3xl px-4 animate-in slide-in-from-bottom-5">
      <div className="flex items-center justify-between gap-4 rounded-2xl border border-primary/40 bg-card/95 p-4 shadow-2xl backdrop-blur-md">
        <div className="flex items-center gap-2.5 overflow-x-auto py-1">
          <div className="flex items-center gap-2 text-sm font-bold text-primary pl-1 pr-2 whitespace-nowrap">
            <Layers className="h-4.5 w-4.5" />
            <span>Compare ({selectedModels.length}/4):</span>
          </div>

          {selectedModels.map((m) => (
            <div
              key={m.slug}
              className="flex items-center gap-2 rounded-xl border border-border bg-accent/70 px-2.5 py-1.5 text-xs sm:text-sm whitespace-nowrap font-semibold shadow-2xs"
            >
              <ModelLogo
                labSlug={m.labName?.toLowerCase()}
                modelSlug={m.slug}
                name={m.name}
                size="xs"
              />
              <span>{m.name}</span>
              <button
                onClick={() => removeModel(m.slug)}
                className="text-muted-foreground hover:text-foreground transition-colors ml-0.5"
                aria-label={`Remove ${m.name}`}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={clearTray}
            className="text-xs sm:text-sm font-semibold text-muted-foreground hover:text-foreground px-2.5 py-1.5 transition-colors"
          >
            Clear
          </button>
          <Button
            size="md"
            disabled={selectedModels.length < 2}
            onClick={navigateToCompare}
            className="gap-2 shadow-md rounded-xl font-bold"
          >
            Compare Now
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
