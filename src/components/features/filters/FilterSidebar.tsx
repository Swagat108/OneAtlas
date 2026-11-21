"use client";

import React from "react";
import { Filter, X, RotateCcw } from "lucide-react";
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

  const hasActiveFilters = Boolean(
    selectedLab ||
      selectedProvider ||
      selectedType ||
      selectedLicense ||
      selectedCapabilities.length > 0 ||
      minContext
  );

  return (
    <aside className="w-full space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-border">
        <div className="flex items-center gap-2 font-semibold text-sm">
          <Filter className="h-4 w-4 text-primary" />
          <span>Filters</span>
        </div>

        {hasActiveFilters && (
          <button
            onClick={onResetFilters}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="h-3 w-3" />
            Reset all
          </button>
        )}

        {onCloseMobile && (
          <button onClick={onCloseMobile} className="md:hidden text-muted-foreground">
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Lab Filter */}
      {facets?.labs && facets.labs.length > 0 && (
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2.5">
            AI Research Lab
          </h4>
          <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
            <button
              onClick={() => onFilterChange("lab", undefined)}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs text-left transition-colors ${
                !selectedLab
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              }`}
            >
              <span>All Labs</span>
            </button>
            {facets.labs.map((lab) => (
              <button
                key={lab.slug}
                onClick={() => onFilterChange("lab", selectedLab === lab.slug ? undefined : lab.slug)}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs text-left transition-colors ${
                  selectedLab === lab.slug
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                }`}
              >
                <span className="truncate">{lab.name}</span>
                <span className="text-[10px] text-muted-foreground ml-2">({lab.count})</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Provider Filter */}
      {facets?.providers && facets.providers.length > 0 && (
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2.5">
            Cloud Provider
          </h4>
          <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
            <button
              onClick={() => onFilterChange("provider", undefined)}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs text-left transition-colors ${
                !selectedProvider
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              }`}
            >
              <span>All Providers</span>
            </button>
            {facets.providers.map((p) => (
              <button
                key={p.slug}
                onClick={() => onFilterChange("provider", selectedProvider === p.slug ? undefined : p.slug)}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs text-left transition-colors ${
                  selectedProvider === p.slug
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                }`}
              >
                <span className="truncate">{p.name}</span>
                <span className="text-[10px] text-muted-foreground ml-2">({p.count})</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Model Type */}
      <div>
        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2.5">
          Model Modality & Type
        </h4>
        <div className="flex flex-wrap gap-1.5">
          {["LLM", "MULTIMODAL", "EMBEDDING", "IMAGE"].map((type) => (
            <button
              key={type}
              onClick={() => onFilterChange("modelType", selectedType === type ? undefined : type)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${
                selectedType === type
                  ? "bg-primary text-primary-foreground border-primary"
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
        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2.5">
          Min Context Window
        </h4>
        <div className="grid grid-cols-2 gap-1.5">
          {[
            { label: "Any", value: undefined },
            { label: "32K+", value: "32768" },
            { label: "128K+", value: "128000" },
            { label: "1M+", value: "1000000" },
          ].map((option) => (
            <button
              key={option.label}
              onClick={() => onFilterChange("minContext", option.value)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium border text-center transition-colors ${
                minContext === option.value
                  ? "bg-primary text-primary-foreground border-primary"
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
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2.5">
            Key Capabilities
          </h4>
          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
            {facets.capabilities.map((c) => {
              const active = selectedCapabilities.includes(c.slug);
              return (
                <label
                  key={c.slug}
                  className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground cursor-pointer select-none"
                >
                  <input
                    type="checkbox"
                    checked={active}
                    onChange={() => toggleCapability(c.slug)}
                    className="rounded border-border text-primary focus:ring-primary h-3.5 w-3.5"
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
        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2.5">
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
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs text-left transition-colors ${
                selectedLicense === lic.value
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              }`}
            >
              <span>{lic.label}</span>
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
