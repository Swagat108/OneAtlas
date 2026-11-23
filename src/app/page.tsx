"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  ArrowRight,
  Compass,
  Layers,
  Trophy,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { Skeleton } from "@/components/ui/Skeleton";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CompareTray } from "@/components/features/compare/CompareTray";
import { LogoMarquee } from "@/components/features/home/LogoMarquee";
import { useHomeData } from "@/hooks/use-home-data";

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [spotlightPos, setSpotlightPos] = useState({ x: 50, y: 35 });
  const router = useRouter();
  const { data, isLoading } = useHomeData();

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setSpotlightPos({
      x: Math.round(((e.clientX - rect.left) / rect.width) * 100),
      y: Math.round(((e.clientY - rect.top) / rect.height) * 100),
    });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/models?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push("/models");
    }
  };

  const stats = data?.stats ?? {
    modelsCount: 46,
    labsCount: 10,
    providersCount: 9,
    benchmarksCount: 10,
  };

  const featuredModels = data?.featuredModels ?? [];

  return (
    <div className="min-h-screen min-h-dvh flex flex-col bg-background selection:bg-primary/20">
      <Navbar />

      <main id="main-content" className="flex-1 pb-24 sm:pb-8">
        {/* Hero Section */}
        <section
          onMouseMove={handleMouseMove}
          className="relative overflow-hidden pt-12 pb-12 md:pt-18 md:pb-18 border-b border-border/40"
        >
          {/* Layer 1: Ambient technical grid */}
          <div className="absolute inset-0 -z-20 bg-grid-pattern opacity-40 mask-radial-fade pointer-events-none" aria-hidden="true" />

          {/* Layer 2: Slow, desktop-only cursor tracking spotlight */}
          <div
            className="absolute inset-0 -z-10 pointer-events-none transition-opacity duration-700 opacity-70"
            style={{
              background: `radial-gradient(circle 550px at ${spotlightPos.x}% ${spotlightPos.y}%, rgba(99, 102, 241, 0.16), transparent 75%)`,
            }}
            aria-hidden="true"
          />

          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3.5 py-1 text-xs sm:text-sm font-semibold text-primary mb-5 shadow-xs backdrop-blur-xs animate-in fade-in">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span>The Independent AI Model Intelligence Engine</span>
            </div>

            <h1 className="text-3xl font-black tracking-tight sm:text-5xl lg:text-5xl">
              Discover, Compare & Evaluate <br />
              <span className="bg-gradient-to-r from-primary via-brand-purple to-brand-cyan bg-clip-text text-transparent">
                Frontier AI Models
              </span>
            </h1>

            <p className="mt-4 max-w-2xl mx-auto text-sm sm:text-base text-muted-foreground leading-relaxed px-2">
              Real-time benchmarks, multi-provider token pricing, context limits, and latency metrics across OpenAI, Anthropic, Meta, DeepSeek, Google, and Mistral.
            </p>

            {/* Quick Search Bar */}
            <form onSubmit={handleSearchSubmit} className="mt-6 max-w-2xl mx-auto px-2">
              <div className="relative flex flex-col sm:flex-row items-stretch sm:items-center shadow-xl rounded-2xl overflow-hidden border border-border/80 bg-card/95 backdrop-blur-md p-1.5 gap-2 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                <div className="flex items-center flex-1 min-w-0 pl-3 pr-2">
                  <Search className="h-4 w-4 text-muted-foreground mr-2.5 shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search models, labs, or benchmarks (e.g. Claude 3.5, Groq)..."
                    className="w-full bg-transparent py-2 text-sm outline-none placeholder:text-muted-foreground min-w-0 truncate pr-3"
                  />
                </div>
                <Button type="submit" size="md" className="btn-shine shrink-0 gap-1.5 rounded-xl justify-center h-10 px-5 font-bold shadow-md">
                  Explore
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </form>

            {/* Dynamic Stats Counter Strip */}
            <div className="mt-8 sm:mt-10 grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-4 max-w-3xl mx-auto">
              <div className="rounded-2xl border border-border/70 bg-card/70 backdrop-blur-xs p-3.5 sm:p-4 shadow-2xs hover:border-primary/40 transition-colors">
                <div className="text-xl sm:text-2xl font-black text-foreground">
                  {isLoading ? <Skeleton className="h-8 w-14 mx-auto" /> : `${stats.modelsCount}+`}
                </div>
                <div className="text-2xs sm:text-xs font-semibold text-muted-foreground mt-1">Frontier Models</div>
              </div>
              <div className="rounded-2xl border border-border/70 bg-card/70 backdrop-blur-xs p-3.5 sm:p-4 shadow-2xs hover:border-primary/40 transition-colors">
                <div className="text-xl sm:text-2xl font-black text-foreground">
                  {isLoading ? <Skeleton className="h-8 w-14 mx-auto" /> : `${stats.labsCount}+`}
                </div>
                <div className="text-2xs sm:text-xs font-semibold text-muted-foreground mt-1">Top AI Labs</div>
              </div>
              <div className="rounded-2xl border border-border/70 bg-card/70 backdrop-blur-xs p-3.5 sm:p-4 shadow-2xs hover:border-primary/40 transition-colors">
                <div className="text-xl sm:text-2xl font-black text-foreground">
                  {isLoading ? <Skeleton className="h-8 w-14 mx-auto" /> : `${stats.providersCount}+`}
                </div>
                <div className="text-2xs sm:text-xs font-semibold text-muted-foreground mt-1">Cloud Hosting APIs</div>
              </div>
              <div className="rounded-2xl border border-border/70 bg-card/70 backdrop-blur-xs p-3.5 sm:p-4 shadow-2xs hover:border-primary/40 transition-colors">
                <div className="text-xl sm:text-2xl font-black text-foreground">
                  {isLoading ? <Skeleton className="h-8 w-14 mx-auto" /> : `${stats.benchmarksCount}+`}
                </div>
                <div className="text-2xs sm:text-xs font-semibold text-muted-foreground mt-1">Verified Benchmarks</div>
              </div>
            </div>
          </div>
        </section>

        {/* Real Labs & Providers Edge-Faded Logo Marquee */}
        <LogoMarquee />

        {/* Featured Models Spotlight */}
        <section className="py-12 sm:py-16 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-10 gap-4">
            <div>
              <Badge variant="brand" size="md" className="mb-2.5">
                Curated Selection
              </Badge>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
                Frontier Model Spotlight
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground mt-2">
                Top performing models across reasoning, software development, and open-weights efficiency.
              </p>
            </div>
            <Link
              href="/models"
              className="inline-flex items-center gap-2 text-sm sm:text-base font-bold text-primary hover:underline"
            >
              Browse all {stats.modelsCount}+ models
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {isLoading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="rounded-2xl border border-border bg-card p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-6 w-24 rounded-full" />
                      <Skeleton className="h-5 w-20 rounded-md" />
                    </div>
                    <Skeleton className="h-7 w-3/4 rounded-md" />
                    <Skeleton className="h-14 w-full rounded-md" />
                    <div className="pt-4 border-t border-border flex justify-between">
                      <Skeleton className="h-6 w-16" />
                      <Skeleton className="h-6 w-16" />
                    </div>
                  </div>
                ))
              : featuredModels.map((item, idx) => (
                  <div
                    key={item.slug}
                    className={cn(
                      "group flex flex-col justify-between rounded-2xl border p-5 transition-all hover:border-primary/60 hover:shadow-xl relative",
                      idx === 0
                        ? "border-primary/40 shadow-sm ring-1 ring-primary/20 bg-gradient-to-b from-card via-card to-primary/[0.04]"
                        : "border-border/80 bg-card/90"
                    )}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <div className="flex items-center gap-2">
                          <BrandLogo
                            logoUrl={item.logoUrl}
                            slug={item.labSlug || item.slug}
                            name={item.name}
                            size="xs"
                          />
                          <span className="text-sm font-bold text-primary">{item.lab}</span>
                        </div>
                        <Badge variant="success" size="sm">
                          {item.badge}
                        </Badge>
                      </div>
                      <Link href={`/models/${item.slug}`} className="block">
                        <h3 className="text-xl font-extrabold group-hover:text-primary transition-colors">
                          {item.name}
                        </h3>
                      </Link>
                      <p className="mt-2 text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>

                    <div className="mt-6 border-t border-border pt-4 flex items-center justify-between text-sm">
                      <div>
                        <span className="text-muted-foreground block text-xs font-medium">Context</span>
                        <span className="font-bold text-foreground">{item.context}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-muted-foreground block text-xs font-medium">Price</span>
                        <span className="font-bold text-primary">{item.price}</span>
                      </div>
                    </div>
                  </div>
                ))}
          </div>
        </section>

        {/* Feature Grid: Discovery, Compare, Leaderboards */}
        <section className="py-12 sm:py-16 bg-muted/20 border-y border-border/50 relative overflow-hidden">
          <div className="absolute inset-0 bg-dot-pattern opacity-30 mask-radial-fade pointer-events-none" aria-hidden="true" />
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-14">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
                Engineered for Modern AI Builders
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground mt-3">
                Everything you need to select the optimal model provider without trial and error.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              <div className="rounded-2xl border border-border bg-card p-6 sm:p-7 shadow-xs hover:border-primary/40 transition-all">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-5">
                  <Compass className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-2.5">Faceted Discovery</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Filter by context size (up to 2M tokens), capability flags (function calling, JSON mode, vision), license type, and price range.
                </p>
                <Link
                  href="/models"
                  className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
                >
                  Explore Catalog <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="rounded-2xl border border-border bg-card p-6 sm:p-7 shadow-xs hover:border-primary/40 transition-all">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-purple/10 text-brand-purple mb-5">
                  <Layers className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-2.5">Side-by-Side Matrix</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Compare up to 4 models simultaneously. Automatic detection of the cheapest provider, fastest latency, and highest benchmark scores.
                </p>
                <Link
                  href="/compare?models=gpt-4o,claude-3-5-sonnet,deepseek-v3"
                  className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
                >
                  Try Sample Comparison <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="rounded-2xl border border-border bg-card p-6 sm:p-7 shadow-xs hover:border-primary/40 transition-all">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-500 mb-5">
                  <Trophy className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-2.5">Benchmark Leaderboard</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Normalized rankings across MMLU-Pro, SWE-bench, HumanEval, and LMSYS Chatbot Arena with multi-provider price overlays.
                </p>
                <Link
                  href="/rankings"
                  className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
                >
                  View Rankings <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <CompareTray />
    </div>
  );
}
