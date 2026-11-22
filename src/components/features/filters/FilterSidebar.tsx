"use client";

import React from "react";
import { Filter, X, RotateCcw, Check } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface Facets {
  labs: { slug: string; name: string; count: number }[];
  providers: { slug: string; name: string; count: number }[];
  modalities: { slug: string; name: string; count: number }[];
  capabilities: { slug: string; name: string; count: number }[];
  modelTypes: string[];
  licenses: string[];
  priceRange: { min: number; max: number };
}

interface FilterSidebarProps {
  facets?: Facets;
  selectedLab?: string;
  selectedProvider?: string;
  selectedType?: string;
  selectedLicense?: string;
  selectedCapabilities?: string[];
  minContext?: string;
  onFilterChange: (key: string, value: string | undefined) => void;
  onResetFilters: () => void;
  onCloseMobile?: () => void;
}

export function FilterSidebar({
  facets,
  selectedLab,
  selectedProvider,
  selectedType,
  selectedLicense,
  selectedCapabilities = [],
  minContext,
  onFilterChange,
  onResetFilters,
  onCloseMobile,
}: FilterSidebarProps) {
  const toggleCapability = (capSlug: string) => {
    let next: string[];
    if (selectedCapabilities.includes(capSlug)) {
      next = selectedCapabilities.filter((c) => c !== capSlug);
    } else {
      next = [...selectedCapabilities, capSlug];
    }
    onFilterChange("capabilities", next.length > 0 ? next.join(",") : undefined);
  };

  const activeCount =
    (selectedLab ? 1 : 0) +
    (selectedProvider ? 1 : 0) +
    (selectedType ? 1 : 0) +
    (selectedLicense ? 1 : 0) +
    selectedCapabilities.length +
    (minContext ? 1 : 0);

  const hasActiveFilters = activeCount > 0;

  return (
    <aside className="w-full flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between pb-3.5 border-b border-border shrink-0">
        <div className="flex items-center gap-2 font-bold text-base text-foreground">
          <Filter className="h-4.5 w-4.5 text-primary" />
          <span>Filters</span>
          {activeCount > 0 && (
            <span className="inline-flex items-center justify-center h-5 px-1.5 rounded-full bg-primary/20 text-primary text-xs font-bold">
              {activeCount}
            </span>
          )}
        </div>

        {hasActiveFilters && (
          <button
            onClick={onResetFilters}
            className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset all
          </button>
        )}

        {onCloseMobile && (
          <button
            onClick={onCloseMobile}
            className="lg:hidden text-muted-foreground hover:text-foreground p-1 rounded-lg"
            aria-label="Close filters"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Scrollable Filter Facets */}
      <div className="flex-1 overflow-y-auto py-4 space-y-6 pr-1">
        {/* Lab Filter */}
        {facets?.labs && facets.labs.length > 0 && (
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
              AI Research Lab
            </h4>
            <div className="space-y-1 max-h-52 overflow-y-auto pr-1">
              <button
                onClick={() => onFilterChange("lab", undefined)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm text-left transition-all ${
                  !selectedLab
                    ? "bg-primary/10 text-primary font-bold shadow-xs"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground font-medium"
                }`}
              >
                <span>All Labs</span>
              </button>
              {facets.labs.map((lab) => (
                <button
                  key={lab.slug}
                  onClick={() => onFilterChange("lab", selectedLab === lab.slug ? undefined : lab.slug)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm text-left transition-all ${
                    selectedLab === lab.slug
                      ? "bg-primary/10 text-primary font-bold shadow-xs"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground font-medium"
                  }`}
                >
                  <span className="truncate">{lab.name}</span>
                  <span className="text-xs text-muted-foreground ml-2">({lab.count})</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Provider Filter */}
        {facets?.providers && facets.providers.length > 0 && (
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
              Cloud Provider
            </h4>
            <div className="space-y-1 max-h-52 overflow-y-auto pr-1">
              <button
                onClick={() => onFilterChange("provider", undefined)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm text-left transition-all ${
                  !selectedProvider
                    ? "bg-primary/10 text-primary font-bold shadow-xs"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground font-medium"
                }`}
              >
                <span>All Providers</span>
              </button>
              {facets.providers.map((p) => (
                <button
                  key={p.slug}
                  onClick={() => onFilterChange("provider", selectedProvider === p.slug ? undefined : p.slug)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm text-left transition-all ${
                    selectedProvider === p.slug
                      ? "bg-primary/10 text-primary font-bold shadow-xs"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground font-medium"
                  }`}
                >
                  <span className="truncate">{p.name}</span>
                  <span className="text-xs text-muted-foreground ml-2">({p.count})</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Model Type */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
            Model Modality & Type
          </h4>
          <div className="flex flex-wrap gap-2">
            {["LLM", "MULTIMODAL", "EMBEDDING", "IMAGE"].map((type) => (
              <button
                key={type}
                onClick={() => onFilterChange("modelType", selectedType === type ? undefined : type)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                  selectedType === type
                    ? "bg-primary text-primary-foreground border-primary shadow-xs"
                    : "border-border text-muted-foreground hover:bg-accent hover:text-foreground"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Min Context Window */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
            Min Context Window
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: "Any", value: undefined },
              { label: "32K+", value: "32768" },
              { label: "128K+", value: "128000" },
              { label: "1M+", value: "1000000" },
            ].map((option) => (
              <button
                key={option.label}
                onClick={() => onFilterChange("minContext", option.value)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border text-center transition-all ${
                  minContext === option.value
                    ? "bg-primary text-primary-foreground border-primary shadow-xs"
                    : "border-border text-muted-foreground hover:bg-accent hover:text-foreground"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Capabilities */}
        {facets?.capabilities && facets.capabilities.length > 0 && (
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
              Key Capabilities
            </h4>
            <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
              {facets.capabilities.map((c) => {
                const active = selectedCapabilities.includes(c.slug);
                return (
                  <label
                    key={c.slug}
                    className="flex items-center gap-2.5 text-sm text-muted-foreground hover:text-foreground cursor-pointer select-none font-medium"
                  >
                    <input
                      type="checkbox"
                      checked={active}
                      onChange={() => toggleCapability(c.slug)}
                      className="rounded-md border-border text-primary focus:ring-primary h-4 w-4"
                    />
                    <span>{c.name}</span>
                  </label>
                );
              })}
            </div>
          </div>
        )}

        {/* License Type */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
            License
          </h4>
          <div className="space-y-1">
            {[
              { label: "All Licenses", value: undefined },
              { label: "Open Weights", value: "OPEN_WEIGHTS" },
              { label: "Open Source", value: "OPEN_SOURCE" },
              { label: "Proprietary", value: "PROPRIETARY" },
            ].map((lic) => (
              <button
                key={lic.label}
                onClick={() => onFilterChange("license", lic.value)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm text-left transition-all ${
                  selectedLicense === lic.value
                    ? "bg-primary/10 text-primary font-bold shadow-xs"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground font-medium"
                }`}
              >
                <span>{lic.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Sticky Bottom Actions on Mobile */}
      {onCloseMobile && (
        <div className="pt-4 border-t border-border mt-auto shrink-0 flex items-center gap-3">
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="md"
              onClick={onResetFilters}
              className="flex-1"
            >
              Reset
            </Button>
          )}
          <Button
            variant="primary"
            size="md"
            onClick={onCloseMobile}
            className="flex-1 font-bold"
          >
            Apply Filters {activeCount > 0 ? `(${activeCount})` : ""}
          </Button>
        </div>
      )}
    </aside>
  );
}
