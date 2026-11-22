"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { useCompareTray } from "@/hooks/use-compare-tray";
import { X, ArrowRight, Layers, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { BrandLogo } from "@/components/ui/BrandLogo";

export function CompareTray() {
  const { selectedModels, removeModel, clearTray, navigateToCompare } = useCompareTray();
  const pathname = usePathname();
  const isOnComparePage = pathname === "/compare";
  
  // Auto-minimize by default on compare page to prevent table overlap, allow manual toggle
  const [isMinimized, setIsMinimized] = useState(isOnComparePage);

  if (selectedModels.length === 0) return null;

  if (isMinimized) {
    return (
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 animate-in slide-in-from-bottom-3">
        <button
          onClick={() => setIsMinimized(false)}
          className="flex items-center gap-2.5 rounded-full border border-primary/40 bg-card/95 px-4 py-2.5 text-xs sm:text-sm font-bold text-foreground shadow-2xl backdrop-blur-md hover:border-primary transition-all hover:scale-105"
        >
          <div className="flex items-center justify-center h-5 w-5 rounded-full bg-primary/20 text-primary">
            <Layers className="h-3.5 w-3.5" />
          </div>
          <span>Compare Tray ({selectedModels.length}/4)</span>
          <ChevronUp className="h-4 w-4 text-muted-foreground ml-1" />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-full max-w-3xl px-4 animate-in slide-in-from-bottom-5">
      <div className="flex items-center justify-between gap-3 sm:gap-4 rounded-2xl border border-primary/40 bg-card/95 p-3.5 sm:p-4 shadow-2xl backdrop-blur-md">
        <div className="flex items-center gap-2 sm:gap-2.5 overflow-x-auto py-1 scrollbar-none [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden flex-1 min-w-0">
          <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-primary pl-1 pr-1.5 whitespace-nowrap shrink-0">
            <Layers className="h-4 w-4" />
            <span>Compare ({selectedModels.length}/4):</span>
          </div>

          {selectedModels.map((m) => (
            <div
              key={m.slug}
              className="flex items-center gap-2 rounded-xl border border-border bg-accent/70 px-2.5 py-1.5 text-xs sm:text-sm whitespace-nowrap font-semibold shadow-2xs shrink-0"
            >
              <BrandLogo
                slug={m.slug}
                name={m.name}
                size="xs"
              />
              <span className="truncate max-w-[110px] sm:max-w-[140px]">{m.name}</span>
              <button
                onClick={() => removeModel(m.slug)}
                className="text-muted-foreground hover:text-foreground transition-colors ml-0.5"
                aria-label={`Remove ${m.name}`}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={clearTray}
            className="text-xs sm:text-sm font-semibold text-muted-foreground hover:text-foreground px-2 py-1 transition-colors"
          >
            Clear
          </button>
          {!isOnComparePage && (
            <Button
              size="md"
              disabled={selectedModels.length < 2}
              onClick={navigateToCompare}
              className="gap-1.5 shadow-md rounded-xl font-bold h-9 sm:h-10 text-xs sm:text-sm px-3.5 sm:px-4"
            >
              Compare
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}
          <button
            onClick={() => setIsMinimized(true)}
            className="p-1.5 text-muted-foreground hover:text-foreground rounded-lg transition-colors"
            title="Minimize tray"
            aria-label="Minimize tray"
          >
            <ChevronDown className="h-4.5 w-4.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
