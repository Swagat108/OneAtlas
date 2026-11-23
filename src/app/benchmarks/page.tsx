"use client";

import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CompareTray } from "@/components/features/compare/CompareTray";
import { BenchmarksView } from "./BenchmarksView";
import { useBenchmarks } from "@/hooks/use-benchmarks";
import { Skeleton } from "@/components/ui/Skeleton";

export default function BenchmarksPage() {
  const { data: benchmarks, isLoading } = useBenchmarks();

  return (
    <div className="min-h-screen min-h-dvh flex flex-col bg-background">
      <Navbar />

      <main id="main-content" className="flex-1 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 w-full pb-24 sm:pb-8">
        {isLoading ? (
          <div className="space-y-6">
            <Skeleton className="h-10 w-64 rounded-xl" />
            <Skeleton className="h-20 w-full rounded-2xl" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-48 rounded-2xl" />
              ))}
            </div>
          </div>
        ) : (
          <BenchmarksView initialBenchmarks={benchmarks ?? []} />
        )}
      </main>

      <CompareTray />
      <Footer />
    </div>
  );
}
