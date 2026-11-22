"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Trophy,
  ArrowRight,
  Gauge,
  Search,
  Calculator,
  Brain,
  Code2,
  Eye,
  BookOpen,
  Bot,
  SlidersHorizontal,
  X,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";

export interface BenchmarkItem {
  id: string;
  slug: string;
  name: string;
  category: string;
  description: string;
  maxScore: number;
  higherIsBetter: boolean;
  _count: {
    scores: number;
  };
}

interface BenchmarksViewProps {
  initialBenchmarks: BenchmarkItem[];
}

export function BenchmarksView({ initialBenchmarks }: BenchmarksViewProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("popular");

  const categories = [
    { label: "All Parameters", value: "ALL", icon: Trophy },
    { label: "Mathematics", value: "MATH", icon: Calculator },
    { label: "Reasoning", value: "REASONING", icon: Brain },
    { label: "Coding", value: "CODING", icon: Code2 },
    { label: "Multimodal", value: "MULTIMODAL", icon: Eye },
    { label: "Knowledge", value: "KNOWLEDGE", icon: BookOpen },
    { label: "Agentic", value: "AGENTIC", icon: Bot },
  ];

  // Count items per category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { ALL: initialBenchmarks.length };
    initialBenchmarks.forEach((b) => {
      counts[b.category] = (counts[b.category] || 0) + 1;
    });
    return counts;
  }, [initialBenchmarks]);

  // Filter and sort
  const filteredBenchmarks = useMemo(() => {
    let result = [...initialBenchmarks];

    // Category filter
    if (selectedCategory !== "ALL") {
      result = result.filter((b) => b.category === selectedCategory);
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (b) =>
          b.name.toLowerCase().includes(q) ||
          b.description.toLowerCase().includes(q) ||
          b.category.toLowerCase().includes(q) ||
          b.slug.toLowerCase().includes(q)
      );
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === "popular") {
        return b._count.scores - a._count.scores;
      }
      if (sortBy === "name_asc") {
        return a.name.localeCompare(b.name);
      }
      if (sortBy === "category") {
        return a.category.localeCompare(b.category);
      }
      if (sortBy === "max_score") {
        return b.maxScore - a.maxScore;
      }
      return 0;
    });

    return result;
  }, [initialBenchmarks, selectedCategory, searchQuery, sortBy]);

  const handleResetFilters = () => {
    setSelectedCategory("ALL");
    setSearchQuery("");
    setSortBy("popular");
  };

  return (
    <div className="space-y-8">
      {/* Header with Title and Description */}
      <div className="pb-8 border-b border-border">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs sm:text-sm font-bold text-primary mb-3">
          <Trophy className="h-4 w-4" />
          <span>Evaluation Standards</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
          AI Evaluation Benchmarks
        </h1>
        <p className="text-base text-muted-foreground mt-2 max-w-4xl leading-relaxed">
          Standardized, reproducible evaluations used to measure reasoning, coding, mathematics, and multimodal capabilities across frontier models.
        </p>

        {/* Filter Controls Bar */}
        <div className="mt-8 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative flex-1 max-w-lg">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search benchmarks (e.g. GSM8K, MATH, HumanEval, MMLU)..."
              className="w-full rounded-xl border border-border bg-card pl-11 pr-10 py-2.5 text-sm sm:text-base outline-none focus:border-primary shadow-xs transition-all placeholder:text-muted-foreground/70"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Dropdown Filters Group */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Category / Parameter Dropdown */}
            <div className="flex items-center gap-2">
              <label htmlFor="category-select" className="text-xs font-bold uppercase tracking-wider text-muted-foreground whitespace-nowrap hidden sm:inline">
                Parameter:
              </label>
              <select
                id="category-select"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-semibold outline-none focus:border-primary text-foreground shadow-xs cursor-pointer"
              >
                <option value="ALL">All Parameters ({categoryCounts.ALL || 0})</option>
                <option value="MATH">Mathematics ({categoryCounts.MATH || 0})</option>
                <option value="REASONING">Reasoning ({categoryCounts.REASONING || 0})</option>
                <option value="CODING">Coding ({categoryCounts.CODING || 0})</option>
                <option value="MULTIMODAL">Multimodal ({categoryCounts.MULTIMODAL || 0})</option>
                <option value="KNOWLEDGE">Knowledge ({categoryCounts.KNOWLEDGE || 0})</option>
                <option value="AGENTIC">Agentic ({categoryCounts.AGENTIC || 0})</option>
              </select>
            </div>

            {/* Direct Benchmark Selector Dropdown */}
            <div className="flex items-center gap-2">
              <label htmlFor="benchmark-select" className="text-xs font-bold uppercase tracking-wider text-muted-foreground whitespace-nowrap hidden sm:inline">
                Benchmark:
              </label>
              <select
                id="benchmark-select"
                defaultValue=""
                onChange={(e) => {
                  if (e.target.value) {
                    window.location.href = `/benchmarks/${e.target.value}`;
                  }
                }}
                className="rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-semibold outline-none focus:border-primary text-foreground shadow-xs cursor-pointer max-w-[200px] truncate"
              >
                <option value="" disabled>
                  Jump to benchmark...
                </option>
                {initialBenchmarks.map((b) => (
                  <option key={b.slug} value={b.slug}>
                    {b.name} ({b.category})
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-semibold outline-none focus:border-primary text-foreground shadow-xs cursor-pointer"
            >
              <option value="popular">Most Evaluated Models</option>
              <option value="name_asc">Name: A to Z</option>
              <option value="category">Category</option>
              <option value="max_score">Max Metric</option>
            </select>
          </div>
        </div>

        {/* Quick Parameter Filter Pills */}
        <div className="mt-6 flex items-center gap-2 overflow-x-auto pb-2">
          {categories.map((cat) => {
            const count = categoryCounts[cat.value] || 0;
            const active = selectedCategory === cat.value;
            const Icon = cat.icon;

            return (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all shadow-xs ${
                  active
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "border border-border bg-card text-muted-foreground hover:bg-accent hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{cat.label}</span>
                <span
                  className={`inline-flex h-5 px-1.5 items-center justify-center rounded-full text-xs font-bold ${
                    active ? "bg-white/20 text-white" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Count & Active Filter Indicator */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>
          Showing <strong className="text-foreground">{filteredBenchmarks.length}</strong> of{" "}
          <strong className="text-foreground">{initialBenchmarks.length}</strong> benchmarks
          {selectedCategory !== "ALL" && (
            <span> in <span className="text-primary font-semibold">{selectedCategory}</span></span>
          )}
        </span>

        {(selectedCategory !== "ALL" || searchQuery) && (
          <button
            onClick={handleResetFilters}
            className="text-xs sm:text-sm font-semibold text-primary hover:underline flex items-center gap-1"
          >
            <X className="h-4 w-4" />
            Reset all filters
          </button>
        )}
      </div>

      {/* Empty State */}
      {filteredBenchmarks.length === 0 && (
        <div className="rounded-2xl border border-border bg-card p-12 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary mx-auto mb-4">
            <SlidersHorizontal className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-bold text-foreground">No benchmarks matched your filter</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Try choosing a different parameter or clearing your search term.
          </p>
          <button
            onClick={handleResetFilters}
            className="mt-5 px-4 py-2 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors shadow-sm"
          >
            View All Benchmarks
          </button>
        </div>
      )}

      {/* Benchmarks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBenchmarks.map((benchmark) => (
          <div
            key={benchmark.slug}
            className="group flex flex-col justify-between rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-xl"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider bg-accent text-accent-foreground">
                  {benchmark.category}
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary/10 text-primary">
                  {benchmark._count.scores} models evaluated
                </span>
              </div>

              <Link href={`/benchmarks/${benchmark.slug}`} className="block">
                <h3 className="text-xl font-extrabold text-foreground group-hover:text-primary transition-colors">
                  {benchmark.name}
                </h3>
              </Link>

              <p className="mt-2 text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                {benchmark.description}
              </p>

              <div className="mt-5 flex items-center gap-6 text-sm text-muted-foreground border-t border-border/60 pt-4">
                <div>
                  <span className="text-xs font-bold text-foreground/80 block uppercase tracking-wider">
                    Max Metric
                  </span>
                  <span className="font-extrabold text-foreground">{benchmark.maxScore}</span>
                </div>
                <div>
                  <span className="text-xs font-bold text-foreground/80 block uppercase tracking-wider">
                    Direction
                  </span>
                  <span className="font-semibold text-foreground">
                    {benchmark.higherIsBetter ? "Higher is better" : "Lower is better"}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
              <Link
                href={`/benchmarks/${benchmark.slug}`}
                className="inline-flex items-center gap-1.5 text-sm font-bold text-primary hover:underline"
              >
                View Details & Top Models
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href={`/rankings?benchmark=${benchmark.slug}`}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground px-2.5 py-1 rounded-lg border border-border hover:bg-accent transition-colors"
              >
                <Gauge className="h-3.5 w-3.5 text-primary" />
                Leaderboard
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
