"use client";

import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Sparkles,
  ArrowLeft,
  Layers,
  Plus,
  Check,
  Zap,
  Globe,
  Clock,
  ExternalLink,
  ShieldCheck,
  Server,
  FileText,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CompareTray } from "@/components/features/compare/CompareTray";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ScoreBar } from "@/components/ui/ScoreBar";
import { Skeleton } from "@/components/ui/Skeleton";
import { formatCurrency, formatTokenCount, formatDate } from "@/lib/utils";
import { useModelDetail } from "@/hooks/use-model-detail";
import { useCompareTray } from "@/hooks/use-compare-tray";

export default function ModelDetailPage({ params }: { params: { slug: string } }) {
  const { data: model, isLoading, isError } = useModelDetail(params.slug);
  const { isInTray, addModel, removeModel } = useCompareTray();

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

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-10 py-8 w-full">
        {/* Breadcrumb & Navigation */}
        <div className="mb-6">
          <Link
            href="/models"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Model Catalog
          </Link>
        </div>

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
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Link
                    href={`/labs/${model.lab.slug}`}
                    className="text-sm font-semibold text-primary hover:underline"
                  >
                    {model.lab.name}
                  </Link>
                  <span className="text-muted-foreground">•</span>
                  <span className="text-xs text-muted-foreground">
                    Released {formatDate(model.releaseDate)}
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

            {/* Quick Specs Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="rounded-xl border border-border bg-card p-4">
                <span className="text-xs text-muted-foreground block">Context Window</span>
                <span className="text-xl font-extrabold text-foreground mt-1 block">
                  {formatTokenCount(model.contextWindow)} tokens
                </span>
              </div>
              <div className="rounded-xl border border-border bg-card p-4">
                <span className="text-xs text-muted-foreground block">Max Output Tokens</span>
                <span className="text-xl font-extrabold text-foreground mt-1 block">
                  {formatTokenCount(model.maxOutputTokens)} tokens
                </span>
              </div>
              <div className="rounded-xl border border-border bg-card p-4">
                <span className="text-xs text-muted-foreground block">Cheapest Input Price</span>
                <span className="text-xl font-extrabold text-primary mt-1 block">
                  {model.pricingSummary.minInputPricePerMillion !== null
                    ? `${formatCurrency(model.pricingSummary.minInputPricePerMillion)} / 1M`
                    : "Free"}
                </span>
              </div>
              <div className="rounded-xl border border-border bg-card p-4">
                <span className="text-xs text-muted-foreground block">Hosting Providers</span>
                <span className="text-xl font-extrabold text-foreground mt-1 block">
                  {model.providers.length} available
                </span>
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

            {/* Provider Pricing Comparison Table */}
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
                      <th className="p-4">Provider</th>
                      <th className="p-4">Input Price (1M tokens)</th>
                      <th className="p-4">Output Price (1M tokens)</th>
                      <th className="p-4">Latency (TTFT)</th>
                      <th className="p-4">Throughput</th>
                      <th className="p-4">Availability</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {model.providers.map((p: any, idx: number) => (
                      <tr key={p.id} className="hover:bg-muted/20">
                        <td className="p-4 font-semibold text-foreground">
                          <Link
                            href={`/providers/${p.provider.slug}`}
                            className="hover:text-primary transition-colors flex items-center gap-1.5"
                          >
                            {p.provider.name}
                            {idx === 0 && (
                              <Badge variant="success" size="sm" className="ml-1.5">
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
          </div>
        ) : null}
      </main>

      <Footer />
      <CompareTray />
    </div>
  );
}
