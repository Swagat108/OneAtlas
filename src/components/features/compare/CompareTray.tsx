"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCompareTray } from "@/hooks/use-compare-tray";
import {
  X,
  ArrowRight,
  Layers,
  ChevronDown,
  ChevronUp,
  Maximize2,
  Trash2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { cn } from "@/lib/utils";

export function CompareTray() {
  const { selectedModels, removeModel, clearTray, navigateToCompare } = useCompareTray();
  const pathname = usePathname();
  const isOnComparePage = pathname === "/compare";

  // Auto-minimize on compare page by default to prevent table occlusion
  const [isMinimized, setIsMinimized] = useState(isOnComparePage);
  // Full expanded drawer mode
  const [isExpanded, setIsExpanded] = useState(false);

  if (selectedModels.length === 0) return null;

  const count = selectedModels.length;
  const isFull = count >= 4;
  const canCompare = count >= 2;

  // 1. Minimized floating pill mode
  if (isMinimized) {
    return (
      <aside
        aria-label="Comparison Tray"
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 animate-in slide-in-from-bottom-3"
      >
        <button
          onClick={() => setIsMinimized(false)}
          className="flex items-center gap-2.5 rounded-full border border-primary/40 bg-card/95 px-4 py-2 text-xs sm:text-sm font-bold text-foreground shadow-2xl backdrop-blur-md hover:border-primary transition-all hover:scale-105 group"
          aria-expanded={false}
          aria-controls="compare-tray-content"
        >
          <div className="flex items-center justify-center h-5 w-5 rounded-full bg-primary/20 text-primary">
            <Layers className="h-3.5 w-3.5" />
          </div>
          <span aria-live="polite">Compare Tray ({count}/4)</span>
          <ChevronUp className="h-4 w-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 ml-0.5" />
        </button>
      </aside>
    );
  }

  // 2. Full expanded detail sheet mode (shows all 4 models as detailed rows)
  if (isExpanded) {
    return (
      <div
        id="compare-tray-content"
        role="dialog"
        aria-modal="true"
        aria-label="Compare Tray Models"
        className="fixed inset-x-0 bottom-0 z-50 flex justify-center p-3 sm:p-6 animate-in slide-in-from-bottom duration-200"
      >
        {/* Backdrop for expanded modal */}
        <div
          className="fixed inset-0 bg-background/60 backdrop-blur-xs -z-10"
          onClick={() => setIsExpanded(false)}
          aria-hidden="true"
        />

        <div className="w-full max-w-2xl rounded-3xl border border-primary/30 bg-card/95 p-5 sm:p-6 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center justify-between pb-4 border-b border-border/80">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Layers className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                  <span>Selected for Comparison</span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-primary/15 text-primary">
                    {count}/4 {isFull ? "(Maximum reached)" : ""}
                  </span>
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Side-by-side comparison matrix evaluates specs, benchmarks, and rate cards.
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsExpanded(false)}
              className="p-1.5 rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
              title="Collapse tray"
              aria-label="Collapse tray"
            >
              <ChevronDown className="h-5 w-5" />
            </button>
          </div>

          {/* Model rows in expanded view */}
          <div className="divide-y divide-border/60 py-2 max-h-60 overflow-y-auto">
            {selectedModels.map((m) => (
              <div
                key={m.slug}
                className="flex items-center justify-between py-3 px-1 gap-3 hover:bg-muted/20 rounded-xl transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <BrandLogo slug={m.slug} name={m.name} size="sm" />
                  <div className="min-w-0">
                    <span className="text-sm font-bold text-foreground block truncate" title={m.name}>
                      {m.name}
                    </span>
                    <span className="text-xs text-muted-foreground block font-medium">
                      {m.labName}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => removeModel(m.slug)}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive px-2 py-1 rounded-md transition-colors shrink-0"
                  aria-label={`Remove ${m.name}`}
                >
                  <X className="h-4 w-4" />
                  <span className="hidden sm:inline">Remove</span>
                </button>
              </div>
            ))}
          </div>

          {/* Expanded Tray Footer Controls */}
          <div className="pt-4 border-t border-border/80 flex items-center justify-between gap-3">
            <button
              onClick={clearTray}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-muted-foreground hover:text-destructive px-2.5 py-1.5 transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Clear All</span>
            </button>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsExpanded(false)}
                className="text-xs font-semibold"
              >
                Done
              </Button>

              {!isOnComparePage && (
                <Button
                  size="md"
                  disabled={!canCompare}
                  onClick={() => {
                    setIsExpanded(false);
                    navigateToCompare();
                  }}
                  className="btn-shine gap-1.5 font-bold shadow-md text-xs sm:text-sm px-4 h-9 sm:h-10"
                >
                  <span>Compare Models</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 3. Standard floating tray (responsive, wrapping, and accessible)
  return (
    <aside
      id="compare-tray-content"
      aria-label="Comparison Tray"
      className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-40 w-full max-w-4xl px-3 sm:px-4 animate-in slide-in-from-bottom-5 duration-200"
    >
      <div className="rounded-2xl border border-primary/30 bg-card/95 p-3 sm:p-3.5 shadow-2xl backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Left: Counter & Models list (all visible, flex-wrapping) */}
        <div className="flex items-center gap-2 sm:gap-2.5 flex-1 min-w-0">
          <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-primary pl-1 pr-1.5 shrink-0 whitespace-nowrap">
            <Layers className="h-4 w-4" />
            <span aria-live="polite">Compare ({count}/4):</span>
          </div>

          {/* Model Chips Area: flex-wrap so all 1-4 models are displayed without clipping */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 flex-1 min-w-0 max-h-24 overflow-y-auto pr-1">
            {selectedModels.map((m) => (
              <div
                key={m.slug}
                className="flex items-center gap-1.5 rounded-xl border border-border/80 bg-accent/60 px-2.5 py-1 text-xs font-semibold shadow-2xs transition-colors hover:border-primary/40 shrink-0 max-w-[180px] sm:max-w-none"
                title={`${m.name} (${m.labName})`}
              >
                <BrandLogo slug={m.slug} name={m.name} size="xs" />
                <span className="truncate max-w-[100px] sm:max-w-[160px] md:max-w-none text-foreground font-semibold">
                  {m.name}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeModel(m.slug);
                  }}
                  className="text-muted-foreground hover:text-destructive transition-colors p-0.5 rounded-sm ml-0.5"
                  aria-label={`Remove ${m.name}`}
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center justify-between md:justify-end gap-2 sm:gap-3 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-border/40">
          <button
            onClick={() => setIsExpanded(true)}
            className="text-xs font-semibold text-muted-foreground hover:text-foreground px-2 py-1 transition-colors flex items-center gap-1"
            title="Expand to view full details"
          >
            <Maximize2 className="h-3 w-3" />
            <span className="hidden sm:inline">Details</span>
          </button>

          <button
            onClick={clearTray}
            className="text-xs font-semibold text-muted-foreground hover:text-destructive px-2 py-1 transition-colors"
          >
            Clear
          </button>

          {!isOnComparePage && (
            <div className="relative group">
              <Button
                size="md"
                disabled={!canCompare}
                onClick={navigateToCompare}
                className="btn-shine gap-1.5 shadow-md rounded-xl font-bold h-9 sm:h-9.5 text-xs sm:text-sm px-3.5 sm:px-4"
              >
                Compare
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
              {!canCompare && (
                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover:block bg-popover text-popover-foreground text-[11px] font-medium px-2.5 py-1 rounded-md shadow-md border border-border whitespace-nowrap z-50 pointer-events-none">
                  Select at least 2 models
                </div>
              )}
            </div>
          )}

          <button
            onClick={() => setIsMinimized(true)}
            className="p-1.5 text-muted-foreground hover:text-foreground rounded-lg transition-colors"
            title="Minimize tray"
            aria-label="Minimize tray"
          >
            <ChevronDown className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
