"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Layers, ArrowRight, PlusCircle, Compass, Sparkles } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CompareTray } from "@/components/features/compare/CompareTray";
import { ComparisonMatrix } from "@/components/features/compare/ComparisonMatrix";
import { Skeleton } from "@/components/ui/Skeleton";
import { Button } from "@/components/ui/Button";
import { useCompareModels } from "@/hooks/use-compare";
import { useCompareTray } from "@/hooks/use-compare-tray";

function ComparePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { selectedModels } = useCompareTray();

  // Read slugs from URL query param `models` or `slugs`
  const modelsParam = searchParams.get("models") || searchParams.get("slugs") || "";
  const slugs = modelsParam
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const { data: compareData, isLoading, isError, error } = useCompareModels(slugs);

  const presets = [
    {
      title: "Frontier Flagships",
      desc: "Top closed proprietary models compared head-to-head",
      slugs: "gpt-4o,claude-3-5-sonnet,gemini-1-5-pro",
    },
    {
      title: "Open Weights Champions",
      desc: "The world's highest performing open-weights foundation models",
      slugs: "llama-3-1-405b,deepseek-v3,qwen-2-5-72b-instruct",
    },
    {
      title: "Cost & Speed Optimized",
      desc: "Sub-second inference and ultra-low price per million tokens",
      slugs: "llama-3-1-70b,gpt-4o-mini,gemini-1-5-flash",
    },
    {
      title: "Advanced Code Generation",
      desc: "Frontier programming synthesis and SWE-bench powerhouses",
      slugs: "claude-3-5-sonnet,deepseek-v3,qwen-2-5-coder-32b",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Page Title */}
        <div className="pb-6 border-b border-border mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-0.5 text-xs font-semibold text-primary mb-3">
            <Layers className="h-3.5 w-3.5" />
            <span>Side-by-Side Evaluation</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            AI Model Comparison Matrix
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Evaluate architecture, context window, pricing per provider, and benchmark performance across models.
          </p>
        </div>

        {/* State 1: Fewer than 2 models specified in URL */}
        {slugs.length < 2 && (
          <div className="space-y-10">
            <div className="rounded-2xl border border-dashed border-border bg-card/60 p-12 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
                <Layers className="h-6 w-6" />
              </div>
              <h2 className="text-xl font-bold">Select Models to Compare</h2>
              <p className="mt-2 max-w-md mx-auto text-sm text-muted-foreground">
                You can select up to 4 models from the catalog or pick one of our curated benchmark comparison presets below.
              </p>

              {selectedModels.length >= 2 ? (
                <div className="mt-6">
                  <Button
                    onClick={() => {
                      const joined = selectedModels.map((m) => m.slug).join(",");
                      router.push(`/compare?models=${joined}`);
                    }}
                    className="gap-2"
                  >
                    Compare {selectedModels.length} Models from Your Tray
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="mt-6">
                  <Link href="/models">
                    <Button variant="outline" className="gap-2">
                      <Compass className="h-4 w-4" />
                      Browse Catalog to Select Models
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Curated Presets */}
            <div>
              <h3 className="text-base font-bold mb-4 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                Featured Comparison Presets
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {presets.map((p) => (
                  <div
                    key={p.title}
                    onClick={() => router.push(`/compare?models=${p.slugs}`)}
                    className="group cursor-pointer rounded-2xl border border-border bg-card p-5 transition-all hover:border-primary/50 hover:shadow-md flex flex-col justify-between"
                  >
                    <div>
                      <h4 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors">
                        {p.title}
                      </h4>
                      <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                        {p.desc}
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-xs font-semibold text-primary">
                      <span>Launch Matrix</span>
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* State 2: Loading matrix */}
        {slugs.length >= 2 && isLoading && (
          <div className="space-y-4">
            <Skeleton className="h-10 w-full rounded-xl" />
            <Skeleton className="h-96 w-full rounded-2xl" />
          </div>
        )}

        {/* State 3: Error */}
        {slugs.length >= 2 && isError && (
          <div className="rounded-2xl border border-destructive/20 bg-destructive/10 p-8 text-center text-sm text-destructive">
            <p className="font-semibold">Unable to load comparison</p>
            <p className="mt-1 text-xs opacity-90">
              {error instanceof Error ? error.message : "One or more model slugs could not be found."}
            </p>
            <div className="mt-4">
              <Link href="/models">
                <Button variant="outline" size="sm">
                  Return to Catalog
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* State 4: Matrix Loaded */}
        {slugs.length >= 2 && compareData && (
          <ComparisonMatrix data={compareData} />
        )}
      </main>

      <Footer />
      <CompareTray />
    </div>
  );
}

export default function ComparePage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm">Loading comparison matrix...</div>}>
      <ComparePageContent />
    </Suspense>
  );
}
