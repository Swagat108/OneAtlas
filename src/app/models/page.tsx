"use client";

import React, { useState, Suspense } from "react";
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
    router.push(`/models?${params.toString()}`);
  };

  const handleResetFilters = () => {
    router.push("/models");
  };

  const models = modelsData?.data ?? [];
  const meta = modelsData?.meta;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-border">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              AI Models Catalog
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Explore {meta?.total ?? 40}+ models with direct pricing across top providers.
            </p>
          </div>

          {/* Search bar & Sort Controls */}
          <div className="flex items-center gap-2.5">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={q}
                onChange={(e) => updateQuery("q", e.target.value)}
                placeholder="Search models..."
                className="w-full rounded-lg border border-border bg-card pl-9 pr-8 py-1.5 text-xs outline-none focus:border-primary"
              />
              {q && (
                <button
                  onClick={() => updateQuery("q", undefined)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => updateQuery("sortBy", e.target.value)}
              className="rounded-lg border border-border bg-card px-2.5 py-1.5 text-xs outline-none focus:border-primary text-foreground"
            >
              <option value="release_desc">Newest Releases</option>
              <option value="price_asc">Price: Lowest first</option>
              <option value="price_desc">Price: Highest first</option>
              <option value="context_desc">Largest Context</option>
              <option value="name_asc">Name: A to Z</option>
            </select>

            {/* Grid / List View Toggle */}
            <div className="hidden sm:flex items-center rounded-lg border border-border bg-card p-0.5">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-md ${
                  viewMode === "grid" ? "bg-accent text-foreground" : "text-muted-foreground"
                }`}
                title="Grid view"
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-1.5 rounded-md ${
                  viewMode === "list" ? "bg-accent text-foreground" : "text-muted-foreground"
                }`}
                title="List view"
              >
                <List className="h-4 w-4" />
              </button>
            </div>

            {/* Mobile Filter Toggle Button */}
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="md:hidden flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium"
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              <span>Filters</span>
            </button>
          </div>
        </div>

        {/* Catalog Body: Sidebar + Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-8">
          {/* Desktop Filter Sidebar */}
          <div className="hidden md:block md:col-span-1">
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
          <div className="md:col-span-3">
            {isLoading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {Array.from({ length: 6 }).map((_, i) => (
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {models.map((model: any) => (
                      <ModelCard key={model.slug} model={model} />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {models.map((model: any) => (
                      <ModelListItem key={model.slug} model={model} />
                    ))}
                  </div>
                )}

                {meta && (
                  <Pagination
                    currentPage={meta.page}
                    totalPages={meta.totalPages}
                    onPageChange={(newPage) => updateQuery("page", String(newPage))}
                  />
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
