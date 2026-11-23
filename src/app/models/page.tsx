"use client";

import React, { useState, useEffect, Suspense, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Search,
  LayoutGrid,
  List,
  SlidersHorizontal,
  X,
  RotateCcw,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CompareTray } from "@/components/features/compare/CompareTray";
import { FilterSidebar } from "@/components/features/filters/FilterSidebar";
import { ModelCard } from "@/components/features/models/ModelCard";
import { ModelListItem } from "@/components/features/models/ModelListItem";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { Pagination } from "@/components/ui/Pagination";
import { useModels } from "@/hooks/use-models";
import { useFilters } from "@/hooks/use-filters";

function ModelsCatalogContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Restore saved view mode from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("oneatlas-models-view-mode");
      if (saved === "grid" || saved === "list") {
        setViewMode(saved);
      }
    } catch {
      // Ignore
    }
  }, []);

  const handleSetViewMode = (mode: "grid" | "list") => {
    setViewMode(mode);
    try {
      localStorage.setItem("oneatlas-models-view-mode", mode);
    } catch {
      // Ignore
    }
  };

  // Lock body scroll when mobile filter is open
  useEffect(() => {
    if (mobileFilterOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileFilterOpen]);

  // Read URL query values
  const q = searchParams.get("q") ?? "";
  const [searchInput, setSearchInput] = useState(q);

  useEffect(() => {
    setSearchInput(q);
  }, [q]);

  const lab = searchParams.get("lab") ?? undefined;
  const provider = searchParams.get("provider") ?? undefined;
  const modelType = searchParams.get("modelType") ?? undefined;
  const license = searchParams.get("license") ?? undefined;
  const capabilities = searchParams.get("capabilities")?.split(",").filter(Boolean) ?? [];
  const minContext = searchParams.get("minContext") ?? undefined;
  const sortBy = searchParams.get("sortBy") ?? "release_desc";
  const page = parseInt(searchParams.get("page") ?? "1", 10);

  // Queries
  const { data: filterData } = useFilters();
  const { data: modelsData, isLoading, isError } = useModels(searchParams.toString());

  // URL State Updater
  const updateQuery = useCallback(
    (key: string, value: string | undefined) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value === undefined || value === "") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
      // Reset to page 1 on any filter change except page itself
      if (key !== "page") {
        params.delete("page");
      }
      router.replace(`/models?${params.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  // Debounced search query update
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== q) {
        updateQuery("q", searchInput || undefined);
      }
    }, 250);
    return () => clearTimeout(timer);
  }, [searchInput, q, updateQuery]);

  const handleResetFilters = () => {
    setSearchInput("");
    router.replace("/models", { scroll: false });
  };

  const removeCapability = (capSlug: string) => {
    const next = capabilities.filter((c) => c !== capSlug);
    updateQuery("capabilities", next.length > 0 ? next.join(",") : undefined);
  };

  const models = modelsData?.data ?? [];
  const meta = modelsData?.meta;

  const hasActiveFilters = Boolean(
    q ||
      lab ||
      provider ||
      modelType ||
      license ||
      capabilities.length > 0 ||
      minContext
  );

  return (
    <div className="min-h-screen min-h-dvh flex flex-col bg-background">
      <Navbar />

      <main id="main-content" className="flex-1 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 w-full pb-24 sm:pb-8">
        {/* Page Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-border">
          <div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
              AI Models Catalog
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-1.5">
              Explore {meta?.total ?? 40}+ models with direct pricing across top providers.
            </p>
          </div>

          {/* Search bar & Sort Controls */}
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            {/* Prominent Search Input */}
            <div className="relative flex-1 sm:w-96 lg:w-[400px] xl:w-[460px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    updateQuery("q", searchInput || undefined);
                  }
                }}
                placeholder="Search models..."
                className="w-full rounded-xl border border-border bg-card pl-11 pr-10 py-2.5 text-sm sm:text-base outline-none focus:border-primary shadow-xs transition-all placeholder:text-muted-foreground/70"
              />
              {searchInput && (
                <button
                  onClick={() => {
                    setSearchInput("");
                    updateQuery("q", undefined);
                  }}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1"
                  aria-label="Clear search text"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => updateQuery("sortBy", e.target.value)}
              aria-label="Sort models by"
              className="rounded-xl border border-border bg-card px-4 py-2.5 text-sm outline-none focus:border-primary text-foreground font-semibold shadow-xs"
            >
              <option value="release_desc">Newest Releases</option>
              <option value="price_asc">Price: Lowest first</option>
              <option value="price_desc">Price: Highest first</option>
              <option value="context_desc">Largest Context</option>
              <option value="name_asc">Name: A to Z</option>
            </select>

            {/* Grid / List View Toggle */}
            <div className="hidden sm:flex items-center rounded-xl border border-border bg-card p-1 shadow-xs">
              <button
                onClick={() => handleSetViewMode("grid")}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === "grid" ? "bg-accent text-foreground" : "text-muted-foreground"
                }`}
                title="Grid view"
                aria-label="Grid view"
              >
                <LayoutGrid className="h-4.5 w-4.5" />
              </button>
              <button
                onClick={() => handleSetViewMode("list")}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === "list" ? "bg-accent text-foreground" : "text-muted-foreground"
                }`}
                title="List view"
                aria-label="List view"
              >
                <List className="h-4.5 w-4.5" />
              </button>
            </div>

            {/* Mobile Filter Toggle Button */}
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-semibold shadow-xs"
            >
              <SlidersHorizontal className="h-4 w-4 text-primary" />
              <span>Filters</span>
              {(lab || provider || modelType || license || capabilities.length > 0 || minContext) && (
                <span className="h-2 w-2 rounded-full bg-primary" />
              )}
            </button>
          </div>
        </div>

        {/* Active Filter Chips Strip */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 py-3 px-1 border-b border-border/60 animate-in fade-in">
            <span className="text-xs font-semibold text-muted-foreground mr-1">
              Active Filters:
            </span>

            {q && (
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-accent/60 px-2.5 py-1 text-xs font-medium text-foreground">
                Search: &ldquo;{q}&rdquo;
                <button onClick={() => updateQuery("q", undefined)} className="hover:text-primary">
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}

            {lab && (
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-accent/60 px-2.5 py-1 text-xs font-medium text-foreground">
                Lab: {filterData?.labs.find((l: any) => l.slug === lab)?.name ?? lab}
                <button onClick={() => updateQuery("lab", undefined)} className="hover:text-primary">
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}

            {provider && (
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-accent/60 px-2.5 py-1 text-xs font-medium text-foreground">
                Provider: {filterData?.providers.find((p: any) => p.slug === provider)?.name ?? provider}
                <button onClick={() => updateQuery("provider", undefined)} className="hover:text-primary">
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}

            {modelType && (
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-accent/60 px-2.5 py-1 text-xs font-medium text-foreground">
                Type: {modelType}
                <button onClick={() => updateQuery("modelType", undefined)} className="hover:text-primary">
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}

            {license && (
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-accent/60 px-2.5 py-1 text-xs font-medium text-foreground">
                License: {license.replace("_", " ")}
                <button onClick={() => updateQuery("license", undefined)} className="hover:text-primary">
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}

            {minContext && (
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-accent/60 px-2.5 py-1 text-xs font-medium text-foreground">
                Context &ge; {Number(minContext) >= 1000000 ? "1M" : `${Number(minContext) / 1000}K`}
                <button onClick={() => updateQuery("minContext", undefined)} className="hover:text-primary">
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}

            {capabilities.map((cap) => (
              <span
                key={cap}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-accent/60 px-2.5 py-1 text-xs font-medium text-foreground"
              >
                {filterData?.capabilities.find((c: any) => c.slug === cap)?.name ?? cap}
                <button onClick={() => removeCapability(cap)} className="hover:text-primary">
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}

            <button
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline ml-2"
            >
              <RotateCcw className="h-3 w-3" />
              Clear all
            </button>

            <span className="ml-auto text-xs font-semibold text-muted-foreground">
              Showing {meta?.total ?? models.length} models
            </span>
          </div>
        )}

        {/* Catalog Body: Sidebar + Main Grid */}
        <div className="flex flex-col lg:flex-row gap-8 mt-6 items-start">
          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block w-72 shrink-0 sticky top-24">
            <FilterSidebar
              facets={filterData}
              selectedLab={lab}
              selectedProvider={provider}
              selectedType={modelType}
              selectedLicense={license}
              selectedCapabilities={capabilities}
              minContext={minContext}
              onFilterChange={updateQuery}
              onResetFilters={handleResetFilters}
            />
          </div>

          {/* Models Grid/List Area */}
          <div className="flex-1 min-w-0 w-full">
            {isLoading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="rounded-2xl border border-border bg-card p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-6 w-24 rounded-full" />
                      <Skeleton className="h-5 w-16 rounded-md" />
                    </div>
                    <Skeleton className="h-6 w-3/4 rounded-md" />
                    <Skeleton className="h-12 w-full rounded-md" />
                    <div className="pt-4 border-t border-border flex justify-between">
                      <Skeleton className="h-5 w-16" />
                      <Skeleton className="h-5 w-16" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {isError && (
              <EmptyState
                title="Failed to load models"
                description="Unable to connect to the database. Please verify your connection settings."
                actionText="Retry"
                onAction={() => window.location.reload()}
              />
            )}

            {!isLoading && !isError && models.length === 0 && (
              <EmptyState
                title="No matching models"
                description="Try loosening your search terms, adjusting context requirements, or resetting filters."
                actionText="Reset All Filters"
                onAction={handleResetFilters}
              />
            )}

            {!isLoading && !isError && models.length > 0 && (
              <>
                {viewMode === "grid" ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                    {models.map((model: any) => (
                      <ModelCard key={model.slug} model={model} />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {models.map((model: any) => (
                      <ModelListItem key={model.slug} model={model} />
                    ))}
                  </div>
                )}

                {/* Pagination */}
                {meta && (
                  <div className="mt-10">
                    <Pagination
                      currentPage={meta.page}
                      totalPages={meta.totalPages}
                      onPageChange={(newPage) => updateQuery("page", String(newPage))}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>

      {/* Mobile Filter Drawer (Bottom Sheet / Slide-up Drawer) */}
      {mobileFilterOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-background/80 backdrop-blur-sm lg:hidden animate-in fade-in"
          onClick={() => setMobileFilterOpen(false)}
        >
          <div
            className="w-full sm:max-w-md max-h-[85vh] h-auto bg-card rounded-t-3xl sm:rounded-3xl border-t sm:border border-border p-6 shadow-2xl flex flex-col animate-in slide-in-from-bottom duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <FilterSidebar
              facets={filterData}
              selectedLab={lab}
              selectedProvider={provider}
              selectedType={modelType}
              selectedLicense={license}
              selectedCapabilities={capabilities}
              minContext={minContext}
              onFilterChange={updateQuery}
              onResetFilters={handleResetFilters}
              onCloseMobile={() => setMobileFilterOpen(false)}
            />
          </div>
        </div>
      )}

      <Footer />
      <CompareTray />
    </div>
  );
}

export default function ModelsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm">Loading catalog...</div>}>
      <ModelsCatalogContent />
    </Suspense>
  );
}
