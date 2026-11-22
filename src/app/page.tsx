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
  CheckCircle2,
  Server,
  Zap,
  Cpu,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CompareTray } from "@/components/features/compare/CompareTray";

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/models?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push("/models");
    }
  };

  const featuredModels = [
    {
      name: "OpenAI o1",
      lab: "OpenAI",
      slug: "o1",
      badge: "Reasoning Champion",
      desc: "Frontier test-time reasoning model trained with reinforcement learning.",
      context: "200K",
      price: "$15.00 / 1M",
    },
    {
      name: "Claude 3.5 Sonnet",
      lab: "Anthropic",
      slug: "claude-3-5-sonnet",
      badge: "Top Coding Model",
      desc: "Unmatched performance across SWE-bench Verified and production engineering.",
      context: "200K",
      price: "$3.00 / 1M",
    },
    {
      name: "DeepSeek-V3",
      lab: "DeepSeek",
      slug: "deepseek-v3",
      badge: "Open Weights Frontier",
      desc: "671B MoE model delivering frontier intelligence at ultra low token costs.",
      context: "128K",
      price: "$0.14 / 1M",
    },
    {
      name: "Llama 3.1 70B",
      lab: "Meta AI",
      slug: "llama-3-1-70b",
      badge: "High Throughput Workhorse",
      desc: "Open-weights foundation model serving up to 280 tokens/sec on Groq LPUs.",
      context: "128K",
      price: "$0.59 / 1M",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background selection:bg-primary/20">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-20 pb-16 md:pt-28 md:pb-24 border-b border-border/40">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(99,102,241,0.15),rgba(255,255,255,0))]" />

          <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
            <div className="inline-flex items-center gap-2.5 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs sm:text-sm font-bold text-primary mb-6 animate-in fade-in">
              <Sparkles className="h-4 w-4" />
              <span>The Independent AI Model Intelligence Engine</span>
            </div>

            <h1 className="text-4xl font-black tracking-tight sm:text-6xl lg:text-7xl">
              Discover, Compare & Evaluate <br />
              <span className="bg-gradient-to-r from-primary via-brand-purple to-brand-cyan bg-clip-text text-transparent">
                Frontier AI Models
              </span>
            </h1>

            <p className="mt-6 max-w-3xl mx-auto text-base sm:text-xl text-muted-foreground leading-relaxed">
              Real-time benchmarks, multi-provider token pricing, context limits, and latency metrics across OpenAI, Anthropic, Meta, DeepSeek, Google, and Mistral.
            </p>

            {/* Quick Search Bar */}
            <form onSubmit={handleSearchSubmit} className="mt-8 max-w-2xl mx-auto">
              <div className="relative flex items-center shadow-xl rounded-2xl overflow-hidden border border-border bg-card/95 backdrop-blur-md p-2 focus-within:border-primary transition-all">
                <Search className="h-5 w-5 text-muted-foreground ml-3 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search 45+ models, labs, or benchmarks (e.g. Claude 3.5, Groq, SWE-bench)..."
                  className="w-full bg-transparent px-3.5 py-2.5 text-sm sm:text-base outline-none placeholder:text-muted-foreground"
                />
                <Button type="submit" size="md" className="shrink-0 gap-1.5 rounded-xl">
                  Explore
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </form>

            {/* Stats Counter Strip */}
            <div className="mt-14 grid grid-cols-2 gap-4 sm:grid-cols-4 max-w-4xl mx-auto">
              <div className="rounded-2xl border border-border/80 bg-card/60 p-5 shadow-xs">
                <div className="text-3xl sm:text-4xl font-black text-foreground">45+</div>
                <div className="text-sm font-medium text-muted-foreground mt-1">Frontier Models</div>
              </div>
              <div className="rounded-2xl border border-border/80 bg-card/60 p-5 shadow-xs">
                <div className="text-3xl sm:text-4xl font-black text-foreground">9+</div>
                <div className="text-sm font-medium text-muted-foreground mt-1">Top AI Labs</div>
              </div>
              <div className="rounded-2xl border border-border/80 bg-card/60 p-5 shadow-xs">
                <div className="text-3xl sm:text-4xl font-black text-foreground">9+</div>
                <div className="text-sm font-medium text-muted-foreground mt-1">Cloud Hosting APIs</div>
              </div>
              <div className="rounded-2xl border border-border/80 bg-card/60 p-5 shadow-xs">
                <div className="text-3xl sm:text-4xl font-black text-foreground">10+</div>
                <div className="text-sm font-medium text-muted-foreground mt-1">Verified Benchmarks</div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Models Spotlight */}
        <section className="py-20 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <Badge variant="brand" size="md" className="mb-2.5">
                Curated Selection
              </Badge>
              <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                Frontier Model Spotlight
              </h2>
              <p className="text-base text-muted-foreground mt-2">
                Top performing models across reasoning, software development, and open-weights efficiency.
              </p>
            </div>
            <Link
              href="/models"
              className="inline-flex items-center gap-2 text-base font-bold text-primary hover:underline"
            >
              Browse all 45+ models
              <ArrowRight className="h-4.5 w-4.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featuredModels.map((item) => (
              <div
                key={item.slug}
                className="group flex flex-col justify-between rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-xl"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-sm font-bold text-primary">{item.lab}</span>
                    <Badge variant="success" size="sm">
                      {item.badge}
                    </Badge>
                  </div>
                  <Link href={`/models/${item.slug}`} className="block">
                    <h3 className="text-xl font-extrabold group-hover:text-primary transition-colors">
                      {item.name}
                    </h3>
                  </Link>
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-2 leading-relaxed">{item.desc}</p>
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
        <section className="py-20 bg-muted/30 border-y border-border/60">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                Engineered for Modern AI Builders
              </h2>
              <p className="text-base text-muted-foreground mt-3">
                Everything you need to select the optimal model provider without trial and error.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="rounded-2xl border border-border bg-card p-7 shadow-xs hover:border-primary/40 transition-all">
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

              <div className="rounded-2xl border border-border bg-card p-7 shadow-xs hover:border-primary/40 transition-all">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-purple/10 text-brand-purple mb-5">
                  <Layers className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-2.5">Side-by-Side Matrix</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Compare up to 4 models simultaneously. Automatic detection of the cheapest provider, fastest latency, and highest benchmark scores.
                </p>
                <Link
                  href="/compare?slugs=gpt-4o,claude-3-5-sonnet,deepseek-v3"
                  className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
                >
                  Try Sample Comparison <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="rounded-2xl border border-border bg-card p-7 shadow-xs hover:border-primary/40 transition-all">
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
