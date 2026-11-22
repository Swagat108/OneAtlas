import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Trophy,
  ArrowLeft,
  Gauge,
  ExternalLink,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CompareTray } from "@/components/features/compare/CompareTray";
import { ScoreBar } from "@/components/ui/ScoreBar";
import { findBenchmarkBySlug } from "@/repositories/benchmark.repo";

export const revalidate = 60;

interface BenchmarkDetailPageProps {
  params: {
    slug: string;
  };
}

export default async function BenchmarkDetailPage({ params }: BenchmarkDetailPageProps) {
  const benchmark = await findBenchmarkBySlug(params.slug);

  if (!benchmark) {
    notFound();
  }

  const scores = benchmark.scores ?? [];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-10 py-8 w-full">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-6">
          <Link href="/benchmarks" className="hover:text-foreground">
            Benchmarks
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-medium">{benchmark.name}</span>
        </div>

        {/* Header Hero */}
        <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2.5 mb-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary">
                  {benchmark.category}
                </span>
                <span className="text-xs text-muted-foreground">
                  Max: {benchmark.maxScore} • {benchmark.higherIsBetter ? "Higher is better" : "Lower is better"}
                </span>
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
                {benchmark.name}
              </h1>
              <p className="mt-3 text-sm text-muted-foreground max-w-3xl leading-relaxed">
                {benchmark.description}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href={`/rankings?benchmark=${benchmark.slug}`}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors shadow-sm"
              >
                <Gauge className="h-4 w-4" />
                Explore on Leaderboard
              </Link>
              <Link
                href="/benchmarks"
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-background text-xs font-semibold text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                All Benchmarks
              </Link>
            </div>
          </div>
        </div>

        {/* Top Models Table */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-foreground">
              Evaluated Models ({scores.length})
            </h2>
            <span className="text-xs text-muted-foreground">
              Sorted by highest performance score
            </span>
          </div>

          <div className="overflow-hidden rounded-xl border border-border bg-card">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-border bg-muted/30 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="py-3 px-4 w-12 text-center">#</th>
                    <th className="py-3 px-4">Model & Lab</th>
                    <th className="py-3 px-4 w-48">Score</th>
                    <th className="py-3 px-4">Source</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {scores.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-muted-foreground">
                        No evaluated scores recorded for this benchmark yet.
                      </td>
                    </tr>
                  ) : (
                    scores.map((s, idx) => (
                      <tr key={s.id} className="hover:bg-muted/30 transition-colors">
                        <td className="py-3 px-4 text-center font-bold text-muted-foreground">
                          {idx + 1}
                        </td>
                        <td className="py-3 px-4">
                          <Link
                            href={`/models/${s.model.slug}`}
                            className="font-bold text-foreground hover:text-primary transition-colors text-sm block"
                          >
                            {s.model.name}
                          </Link>
                          <span className="text-[11px] text-muted-foreground">
                            {s.model.lab.name}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <ScoreBar score={s.score} maxScore={benchmark.maxScore} />
                        </td>
                        <td className="py-3 px-4 text-muted-foreground">
                          {s.source || "Official Evaluation"}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <Link
                            href={`/models/${s.model.slug}`}
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline"
                          >
                            View Specs
                            <ExternalLink className="h-3 w-3" />
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      <CompareTray />
      <Footer />
    </div>
  );
}
