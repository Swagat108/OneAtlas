"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Trophy, Medal, ExternalLink, Plus, Check } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CompareTray } from "@/components/features/compare/CompareTray";
import { Badge } from "@/components/ui/Badge";
import { ScoreBar } from "@/components/ui/ScoreBar";
import { Skeleton } from "@/components/ui/Skeleton";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { formatCurrency, formatTokenCount } from "@/lib/utils";
import { useRankings } from "@/hooks/use-rankings";
import { useCompareTray } from "@/hooks/use-compare-tray";

function RankingsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isInTray, addModel, removeModel } = useCompareTray();

  const category = searchParams.get("category") ?? undefined;
  const benchmark = searchParams.get("benchmark") ?? undefined;

  const { data, isLoading } = useRankings(category, benchmark);

  const categories = [
    { label: "All Categories", value: undefined },
    { label: "Reasoning", value: "REASONING" },
    { label: "Coding", value: "CODING" },
    { label: "Math", value: "MATH" },
    { label: "Knowledge", value: "KNOWLEDGE" },
    { label: "Multimodal", value: "MULTIMODAL" },
    { label: "Agentic", value: "AGENTIC" },
  ];

  const updateParam = (key: string, val: string | undefined) => {
    const params = new URLSearchParams(searchParams.toString());
    if (val === undefined) {
      params.delete(key);
    } else {
      params.set(key, val);
    }
    // If category changed, clear specific benchmark slug to re-trigger default
    if (key === "category") {
      params.delete("benchmark");
    }
    router.replace(`/rankings?${params.toString()}`, { scroll: false });
  };

  const rankings = data?.rankings ?? [];
  const currentBenchmark = data?.benchmark;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-10 py-8 w-full">
        {/* Header */}
        <div className="pb-8 border-b border-border mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs sm:text-sm font-bold text-primary mb-3">
            <Trophy className="h-4 w-4" />
            <span>Standardized Evaluation</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
            AI Model Benchmark Leaderboards
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-2 leading-relaxed">
            Independently verified evaluations across reasoning, automated coding, mathematics, and multimodal comprehension.
          </p>
        </div>

        {/* Category Tabs & Dropdowns */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 mb-8 border-b border-border/60">
          {/* Quick Category Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
            {categories.map((cat) => {
              const active = category === cat.value;
              return (
                <button
                  key={cat.label}
                  onClick={() => updateParam("category", cat.value)}
                  className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                    active
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "border border-border bg-card text-muted-foreground hover:bg-accent hover:text-foreground"
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Direct Benchmark Selector */}
          <div className="flex items-center gap-2 shrink-0">
            <label htmlFor="rankings-benchmark-select" className="text-xs font-bold uppercase tracking-wider text-muted-foreground hidden sm:inline">
              Benchmark:
            </label>
            <select
              id="rankings-benchmark-select"
              value={benchmark ?? currentBenchmark?.slug ?? ""}
              onChange={(e) => updateParam("benchmark", e.target.value || undefined)}
              className="rounded-xl border border-border bg-card px-3.5 py-2 text-xs sm:text-sm font-semibold outline-none focus:border-primary text-foreground shadow-xs cursor-pointer max-w-[220px] truncate"
            >
              <option value="mmlu-pro">MMLU-Pro</option>
              <option value="arena-elo">Chatbot Arena Elo</option>
              <option value="gsm8k">GSM8K (Math)</option>
              <option value="math-500">MATH-500 (Math)</option>
              <option value="humaneval">HumanEval (Coding)</option>
              <option value="swe-bench-verified">SWE-bench (Agentic)</option>
              <option value="gpqa-diamond">GPQA Diamond</option>
              <option value="mmmu">MMMU (Vision)</option>
              <option value="ifeval">IFEval (Reasoning)</option>
              <option value="arc-challenge">ARC-Challenge</option>
            </select>
          </div>
        </div>

        {/* Benchmark Info Card */}
        {currentBenchmark && (
          <div className="rounded-2xl border border-border bg-card p-6 mb-8 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-bold text-primary uppercase tracking-wider block">
                  Active Benchmark • {currentBenchmark.category}
                </span>
                <h3 className="text-xl font-extrabold text-foreground mt-1">
                  {currentBenchmark.name}
                </h3>
              </div>
              <Badge variant="outline" size="md" className="font-semibold">
                Scale: {currentBenchmark.maxScore === 100 ? "0 – 100%" : `Max ${currentBenchmark.maxScore}`}
              </Badge>
            </div>
            <p className="mt-3 text-sm text-muted-foreground max-w-3xl leading-relaxed">
              {currentBenchmark.description}
            </p>
          </div>
        )}

        {/* Leaderboard Table */}
        <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-xs">
          {isLoading ? (
            <div className="p-6 space-y-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-14 w-full" />
              ))}
            </div>
          ) : rankings.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-border bg-muted/40 font-bold text-muted-foreground uppercase tracking-wider text-xs">
                    <th className="p-4 w-16 text-center">Rank</th>
                    <th className="p-4 min-w-[14rem]">Model</th>
                    <th className="p-4 min-w-[16rem]">Benchmark Score</th>
                    <th className="p-4">Context</th>
                    <th className="p-4">Min Price (1M)</th>
                    <th className="p-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {rankings.map((item: any) => {
                    const inTray = isInTray(item.model.slug);
                    const isTop3 = item.rank <= 3;

                    return (
                      <tr key={item.model.slug} className="hover:bg-muted/20">
                        {/* Rank */}
                        <td className="p-4 text-center font-bold">
                          {item.rank === 1 ? (
                            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-amber-500/20 text-amber-500 font-extrabold text-xs">
                              1
                            </span>
                          ) : item.rank === 2 ? (
                            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-slate-300/20 text-slate-400 font-extrabold text-xs">
                              2
                            </span>
                          ) : item.rank === 3 ? (
                            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-amber-700/20 text-amber-600 font-extrabold text-xs">
                              3
                            </span>
                          ) : (
                            <span className="text-muted-foreground">{item.rank}</span>
                          )}
                        </td>

                        {/* Model & Lab */}
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <BrandLogo
                              logoUrl={item.model.lab?.logoUrl}
                              slug={item.model.lab?.slug}
                              name={item.model.name}
                              size="sm"
                            />
                            <div>
                              <span className="text-[11px] text-primary font-medium block">
                                {item.model.lab?.name}
                              </span>
                              <Link
                                href={`/models/${item.model.slug}`}
                                className="font-bold text-sm text-foreground hover:text-primary transition-colors inline-flex items-center gap-1"
                              >
                                {item.model.name}
                                <ExternalLink className="h-3 w-3 text-muted-foreground" />
                              </Link>
                            </div>
                          </div>
                        </td>

                        {/* Benchmark Score Bar */}
                        <td className="p-4">
                          <ScoreBar
                            score={item.rawScore}
                            maxScore={currentBenchmark?.maxScore ?? 100}
                            displayValue={
                              currentBenchmark?.maxScore === 100
                                ? `${item.rawScore.toFixed(1)}%`
                                : String(item.rawScore)
                            }
                            colorScheme={isTop3 ? "emerald" : "blue"}
                          />
                        </td>

                        {/* Context */}
                        <td className="p-4 font-semibold text-foreground">
                          {formatTokenCount(item.model.contextWindow)}
                        </td>

                        {/* Min Price */}
                        <td className="p-4 font-bold text-foreground">
                          {item.model.minInputPricePerMillion !== null
                            ? formatCurrency(item.model.minInputPricePerMillion)
                            : "Free"}
                        </td>

                        {/* Compare Action */}
                        <td className="p-4 text-right">
                          <button
                            onClick={() => {
                              if (inTray) {
                                removeModel(item.model.slug);
                              } else {
                                addModel({
                                  slug: item.model.slug,
                                  name: item.model.name,
                                  labName: item.model.lab.name,
                                });
                              }
                            }}
                            className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium border transition-colors ${
                              inTray
                                ? "bg-primary text-primary-foreground border-primary"
                                : "border-border text-muted-foreground hover:bg-accent hover:text-foreground"
                            }`}
                          >
                            {inTray ? <Check className="h-3 w-3" /> : <Plus className="h-3 w-3" />}
                            {inTray ? "Added" : "Compare"}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 text-center text-sm text-muted-foreground">
              No benchmark scores recorded for this category yet.
            </div>
          )}
        </div>
      </main>

      <Footer />
      <CompareTray />
    </div>
  );
}

export default function RankingsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm">Loading leaderboards...</div>}>
      <RankingsContent />
    </Suspense>
  );
}
