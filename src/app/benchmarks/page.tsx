import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CompareTray } from "@/components/features/compare/CompareTray";
import { findAllBenchmarks } from "@/repositories/benchmark.repo";
import { BenchmarksView } from "./BenchmarksView";

export const revalidate = 60;

export default async function BenchmarksPage() {
  const benchmarks = await findAllBenchmarks();

  return (
    <div className="min-h-screen min-h-dvh flex flex-col bg-background">
      <Navbar />

      <main id="main-content" className="flex-1 mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-10 py-8 w-full pb-24 sm:pb-8">
        <BenchmarksView initialBenchmarks={benchmarks} />
      </main>

      <CompareTray />
      <Footer />
    </div>
  );
}
