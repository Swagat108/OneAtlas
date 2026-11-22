"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Search,
  LayoutGrid,
  List,
  SlidersHorizontal,
  X,
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
  const capabilities = searchParams.get("capabilities")?.split(",") ?? [];
  const minContext = searchParams.get("minContext") ?? undefined;
  const sortBy = searchParams.get("sortBy") ?? "release_desc";
  const page = parseInt(searchParams.get("page") ?? "1", 10);

  // Queries
  const { data: filterData } = useFilters();
  const { data: modelsData, isLoading, isError } = useModels(searchParams.toString());

  // URL State Updater
  const updateQuery = (key: string, value: string | undefined) => {
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
  };

  // Debounced search query update
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== q) {
        updateQuery("q", searchInput || undefined);
      }
    }, 250);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const handleResetFilters = () => {
    setSearchInput("");
    router.replace("/models", { scroll: false });
  };

  const models = modelsData?.data ?? [];
  const meta = modelsData?.meta;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-10 py-8 w-full">
        {/* Page Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-8 border-b border-border">
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
            <div className="relative flex-1 sm:w-96 lg:w-[420px] xl:w-[480px]">
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
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => updateQuery("sortBy", e.target.value)}
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
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === "grid" ? "bg-accent text-foreground" : "text-muted-foreground"
                }`}
                title="Grid view"
              >
                <LayoutGrid className="h-4.5 w-4.5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === "list" ? "bg-accent text-foreground" : "text-muted-foreground"
                }`}
                title="List view"
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
            </button>
          </div>
        </div>

        {/* Catalog Body: Sidebar + Main Grid */}
        <div className="flex flex-col lg:flex-row gap-8 mt-8 items-start">
          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block w-72 shrink-0">
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
                  <Skeleton key={i} className="h-64 rounded-2xl" />
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

      {/* Mobile Filter Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex bg-background/80 backdrop-blur-sm md:hidden animate-in fade-in">
          <div className="ml-auto w-full max-w-xs h-full bg-card p-6 shadow-2xl overflow-y-auto animate-in slide-in-from-right">
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
