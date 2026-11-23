"use client";

import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Sparkles,
  ArrowLeft,
  Plus,
  Check,
  Zap,
  Globe,
  ExternalLink,
  ShieldCheck,
  Server,
  ChevronRight,
  Info,
  Clock,
  ArrowRight,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CompareTray } from "@/components/features/compare/CompareTray";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ScoreBar } from "@/components/ui/ScoreBar";
import { Skeleton } from "@/components/ui/Skeleton";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { TokenCostCalculator } from "@/components/features/models/TokenCostCalculator";
import { formatCurrency, formatTokenCount, formatDate, formatRelativeTime } from "@/lib/utils";
import { useModelDetail } from "@/hooks/use-model-detail";
import { useModels } from "@/hooks/use-models";
import { useCompareTray } from "@/hooks/use-compare-tray";

export default function ModelDetailPage({ params }: { params: { slug: string } }) {
  const { data: model, isLoading, isError } = useModelDetail(params.slug);
  const { isInTray, addModel, removeModel } = useCompareTray();

  // Related models from the same lab
  const labSlug = model?.lab?.slug;
  const { data: relatedData } = useModels(labSlug ? `lab=${labSlug}&pageSize=4` : "");

  if (isError) {
    return notFound();
  }

  const inTray = model ? isInTray(model.slug) : false;

  const toggleCompare = () => {
    if (!model) return;
    if (inTray) {
      removeModel(model.slug);
    } else {
      addModel({
        slug: model.slug,
        name: model.name,
        labName: model.lab.name,
      });
    }
  };

  const relatedModels = (relatedData?.data ?? []).filter((m: any) => m.slug !== params.slug).slice(0, 3);

  return (
    <div className="min-h-screen min-h-dvh flex flex-col bg-background">
      <Navbar />

      <main id="main-content" className="flex-1 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 w-full pb-24 sm:pb-8">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-muted-foreground mb-6 overflow-x-auto whitespace-nowrap pb-1">
          <Link href="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground/60" />
          <Link href="/models" className="hover:text-foreground transition-colors">
            Models
          </Link>
          {model && (
            <>
              <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground/60" />
              <Link href={`/labs/${model.lab.slug}`} className="hover:text-foreground transition-colors">
                {model.lab.name}
              </Link>
              <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground/60" />
              <span className="font-semibold text-foreground truncate max-w-[200px]">
                {model.name}
              </span>
            </>
          )}
        </nav>

        {isLoading ? (
          <div className="space-y-6">
            <Skeleton className="h-12 w-2/3" />
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        ) : model ? (
          <div className="space-y-10">
            {/* Model Header */}
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 border-b border-border pb-8">
              <div className="flex items-start gap-5">
                <BrandLogo
                  logoUrl={model.lab.logoUrl}
                  slug={model.lab.slug}
                  name={model.name}
                  size="xl"
                  className="mt-1 shadow-md"
                />
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/labs/${model.lab.slug}`}
                      className="text-sm font-semibold text-primary hover:underline"
                    >
                      {model.lab.name}
                    </Link>
                    <span className="text-muted-foreground">•</span>
                    <span
                      title={formatDate(model.releaseDate)}
                      className="text-xs text-muted-foreground flex items-center gap-1 cursor-help"
                    >
                      <Clock className="h-3 w-3" />
                      Released {formatRelativeTime(model.releaseDate)}
                    </span>
                  </div>

                  <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                    {model.name}
                  </h1>

                  <p className="max-w-3xl text-sm sm:text-base text-muted-foreground leading-relaxed">
                    {model.description}
                  </p>

                  {/* Modalities & Capabilities Pills */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    <Badge variant="brand" size="md">
                      {model.modelType}
                    </Badge>
                    {model.parameterCount && (
                      <Badge variant="secondary" size="md">
                        {model.parameterCount}
                      </Badge>
                    )}
                    <Badge variant="outline" size="md" className="capitalize">
                      {model.license.toLowerCase().replace("_", " ")}
                    </Badge>
                    {model.architecture && (
                      <Badge variant="outline" size="md">
                        {model.architecture}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <Button
                  variant={inTray ? "secondary" : "primary"}
                  onClick={toggleCompare}
                  className="gap-2"
                >
                  {inTray ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                  {inTray ? "In Comparison Tray" : "Add to Compare"}
                </Button>

                {model.lab.website && (
                  <a
                    href={model.lab.website}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center h-9 px-3 text-xs border border-border rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-colors gap-1.5"
                  >
                    <Globe className="h-3.5 w-3.5" />
                    Lab Website
                  </a>
                )}
              </div>
            </div>

            {/* Quick Specs Strip with Human Tooltips */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="rounded-xl border border-border bg-card p-4">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Context Window</span>
                  <span title="Total capacity of input prompt plus generation history" className="cursor-help">
                    <Info className="h-3.5 w-3.5" />
                  </span>
                </div>
                <span className="text-xl font-extrabold text-foreground mt-1 block">
                  {formatTokenCount(model.contextWindow)} tokens
                </span>
                <span className="text-[11px] text-muted-foreground mt-0.5 block">Max prompt size</span>
              </div>

              <div className="rounded-xl border border-border bg-card p-4">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Max Output Tokens</span>
                  <span title="Maximum number of tokens the model can produce in a single response" className="cursor-help">
                    <Info className="h-3.5 w-3.5" />
                  </span>
                </div>
                <span className="text-xl font-extrabold text-foreground mt-1 block">
                  {formatTokenCount(model.maxOutputTokens)} tokens
                </span>
                <span className="text-[11px] text-muted-foreground mt-0.5 block">Per response</span>
              </div>

              <div className="rounded-xl border border-border bg-card p-4">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Cheapest Input Price</span>
                  <span title="Lowest pricing per million input tokens across all hosting providers" className="cursor-help">
                    <Info className="h-3.5 w-3.5" />
                  </span>
                </div>
                <span className="text-xl font-extrabold text-primary mt-1 block">
                  {model.pricingSummary.minInputPricePerMillion !== null
                    ? `${formatCurrency(model.pricingSummary.minInputPricePerMillion)} / 1M`
                    : "Free"}
                </span>
                <span className="text-[11px] text-muted-foreground mt-0.5 block">Best rate card</span>
              </div>

              <div className="rounded-xl border border-border bg-card p-4">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Hosting Providers</span>
                  <span title="Number of commercial and cloud inference APIs hosting this model" className="cursor-help">
                    <Info className="h-3.5 w-3.5" />
                  </span>
                </div>
                <span className="text-xl font-extrabold text-foreground mt-1 block">
                  {model.providers.length} available
                </span>
                <span className="text-[11px] text-muted-foreground mt-0.5 block">Inference endpoints</span>
              </div>
            </div>

            {/* Capabilities and Modalities Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-2xl border border-border bg-card p-6">
                <h3 className="text-base font-bold mb-4 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  Supported Modalities
                </h3>
                <div className="space-y-3 text-xs">
                  <div>
                    <span className="text-muted-foreground block mb-1 font-medium">Input Modalities:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {model.inputModalities.map((im: any) => (
                        <span key={im.slug} className="rounded-md border border-border bg-accent/60 px-2 py-1 font-medium">
                          {im.name}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-foreground block mb-1 font-medium">Output Modalities:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {model.outputModalities.map((om: any) => (
                        <span key={om.slug} className="rounded-md border border-border bg-accent/60 px-2 py-1 font-medium">
                          {om.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-card p-6">
                <h3 className="text-base font-bold mb-4 flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-brand-cyan" />
                  Key Features & Capabilities
                </h3>
                <div className="flex flex-wrap gap-2">
                  {model.capabilities.map((cap: any) => (
                    <span
                      key={cap.slug}
                      className="inline-flex items-center gap-1 rounded-lg border border-border bg-accent/40 px-2.5 py-1 text-xs font-medium"
                    >
                      <Check className="h-3 w-3 text-primary" />
                      {cap.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Provider Pricing Comparison Table with Sticky First Column */}
            <div className="rounded-2xl border border-border bg-card overflow-hidden">
              <div className="p-6 border-b border-border flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    <Server className="h-4 w-4 text-primary" />
                    Cloud Hosting Providers & Token Economics
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Multi-provider rate cards per million tokens, time-to-first-token latency, and throughput.
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-border bg-muted/40 font-semibold text-muted-foreground uppercase tracking-wider">
                      <th className="sticky left-0 bg-card z-20 p-4 min-w-[12rem] border-r border-border shadow-[2px_0_5px_rgba(0,0,0,0.03)]">
                        Provider
                      </th>
                      <th className="p-4">Input Price (1M tokens)</th>
                      <th className="p-4">Output Price (1M tokens)</th>
                      <th className="p-4">
                        <span className="flex items-center gap-1" title="Time to first token (response latency)">
                          Latency (TTFT) <Info className="h-3 w-3 text-muted-foreground" />
                        </span>
                      </th>
                      <th className="p-4">
                        <span className="flex items-center gap-1" title="Generation speed in tokens per second">
                          Throughput <Info className="h-3 w-3 text-muted-foreground" />
                        </span>
                      </th>
                      <th className="p-4">Availability</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {model.providers.map((p: any, idx: number) => (
                      <tr key={p.id} className="hover:bg-muted/20">
                        <td className="sticky left-0 bg-card z-10 p-4 font-semibold text-foreground border-r border-border shadow-[2px_0_5px_rgba(0,0,0,0.03)]">
                          <Link
                            href={`/providers/${p.provider.slug}`}
                            className="hover:text-primary transition-colors inline-flex items-center gap-2"
                          >
                            <BrandLogo
                              logoUrl={p.provider.logoUrl}
                              slug={p.provider.slug}
                              name={p.provider.name}
                              size="xs"
                            />
                            <span>{p.provider.name}</span>
                            {idx === 0 && (
                              <Badge variant="success" size="sm" className="ml-1">
                                Best Price
                              </Badge>
                            )}
                          </Link>
                        </td>
                        <td className="p-4 font-bold text-foreground">
                          {formatCurrency(p.inputPricePerMillion)}
                        </td>
                        <td className="p-4 text-foreground">
                          {formatCurrency(p.outputPricePerMillion)}
                        </td>
                        <td className="p-4 text-muted-foreground">
                          {p.latencyMs ? `${p.latencyMs} ms` : "N/A"}
                        </td>
                        <td className="p-4 text-muted-foreground">
                          {p.throughputTps ? `${p.throughputTps} tokens/s` : "N/A"}
                        </td>
                        <td className="p-4">
                          <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            Live
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Interactive Monthly Token Cost Calculator */}
            <TokenCostCalculator providers={model.providers} modelName={model.name} />

            {/* Benchmark Scores Section */}
            {model.benchmarkScores && model.benchmarkScores.length > 0 && (
              <div className="rounded-2xl border border-border bg-card p-6">
                <h3 className="text-lg font-bold mb-1 flex items-center gap-2">
                  <Zap className="h-4 w-4 text-brand-purple" />
                  Verified Benchmark Performance
                </h3>
                <p className="text-xs text-muted-foreground mb-6">
                  Standardized test evaluation results published by independent labs and research teams.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {model.benchmarkScores.map((bs: any) => (
                    <div
                      key={bs.id}
                      className="rounded-xl border border-border bg-background p-4 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                          <span className="uppercase tracking-wider text-[10px] font-semibold text-primary">
                            {bs.benchmark.category}
                          </span>
                          <span>{bs.source}</span>
                        </div>
                        <h4 className="font-bold text-sm text-foreground mb-3">
                          {bs.benchmark.name}
                        </h4>
                      </div>

                      <ScoreBar
                        score={bs.score}
                        maxScore={bs.benchmark.maxScore}
                        displayValue={
                          bs.benchmark.maxScore === 100
                            ? `${bs.score.toFixed(1)}%`
                            : String(bs.score)
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Similar Models Cross-linking Section */}
            {relatedModels.length > 0 && (
              <div className="pt-6 border-t border-border">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-extrabold text-foreground">
                      More Models from {model.lab.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                      Explore alternative tiers and releases from the same research laboratory.
                    </p>
                  </div>
                  <Link
                    href={`/models?lab=${model.lab.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-primary hover:underline"
                  >
                    View all <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {relatedModels.map((rm: any) => (
                    <Link
                      key={rm.slug}
                      href={`/models/${rm.slug}`}
                      className="rounded-xl border border-border bg-card p-4 hover:border-primary/50 hover:shadow-md transition-all group"
                    >
                      <div className="flex items-center gap-2.5 mb-2">
                        <BrandLogo
                          logoUrl={rm.lab?.logoUrl}
                          slug={rm.lab?.slug}
                          name={rm.name}
                          size="xs"
                        />
                        <span className="font-bold text-sm text-foreground group-hover:text-primary transition-colors">
                          {rm.name}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                        {rm.description}
                      </p>
                      <div className="mt-3 pt-2 border-t border-border/60 flex items-center justify-between text-[11px]">
                        <span className="text-muted-foreground">Context: {formatTokenCount(rm.contextWindow)}</span>
                        <span className="font-bold text-primary">
                          {rm.minInputPrice !== null ? `${formatCurrency(rm.minInputPrice)} / 1M` : "Free"}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : null}
      </main>

      <Footer />
      <CompareTray />
    </div>
  );
}
