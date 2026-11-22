import React from "react";
import Link from "next/link";
import { Trophy, ArrowRight, Gauge, Layers } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CompareTray } from "@/components/features/compare/CompareTray";
import { findAllBenchmarks } from "@/repositories/benchmark.repo";

export const revalidate = 60;

export default async function BenchmarksPage() {
  const benchmarks = await findAllBenchmarks();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 w-full">
        {/* Header */}
        <div className="pb-6 border-b border-border mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-0.5 text-xs font-semibold text-primary mb-3">
            <Trophy className="h-3.5 w-3.5" />
            <span>Evaluation Standards</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            AI Evaluation Benchmarks
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Standardized, reproducible evaluations used to measure reasoning, coding, mathematics, and multimodal capabilities across frontier models.
          </p>
        </div>

        {/* Benchmarks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benchmarks.map((benchmark) => (
            <div
              key={benchmark.slug}
              className="group flex flex-col justify-between rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-lg"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-accent text-accent-foreground">
                    {benchmark.category}
                  </span>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-primary/10 text-primary">
                    {benchmark._count.scores} models evaluated
                  </span>
                </div>

                <Link href={`/benchmarks/${benchmark.slug}`} className="block">
                  <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                    {benchmark.name}
                  </h3>
                </Link>

                <p className="mt-2 text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                  {benchmark.description}
                </p>

                <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
                  <div>
                    <span className="text-[11px] font-semibold text-foreground/80 block">
                      Max Metric
                    </span>
                    <span>{benchmark.maxScore}</span>
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold text-foreground/80 block">
                      Direction
                    </span>
                    <span>{benchmark.higherIsBetter ? "Higher is better" : "Lower is better"}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
                <Link
                  href={`/benchmarks/${benchmark.slug}`}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                >
                  View Details & Top Models
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>

                <Link
                  href={`/rankings?benchmark=${benchmark.slug}`}
                  className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground"
                >
                  <Gauge className="h-3.5 w-3.5" />
                  Leaderboard
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>

      <CompareTray />
      <Footer />
    </div>
  );
}
