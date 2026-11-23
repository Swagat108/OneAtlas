"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Trophy, X, Share2, CheckCheck, Sparkles, ExternalLink, Zap, DollarSign, Maximize2 } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { formatCurrency, formatTokenCount, formatScore, cn } from "@/lib/utils";
import { useCompareTray } from "@/hooks/use-compare-tray";
import { useToast } from "@/context/toast.context";

interface ComparisonMatrixProps {
  data: {
    models: any[];
    winners: {
      cheapestModelSlug: string | null;
      largestContextSlug: string | null;
      fastestLatencySlug: string | null;
      highestThroughputSlug: string | null;
    };
    benchmarksComparison: {
      benchmark: {
        slug: string;
        name: string;
        category: string;
        maxScore: number;
        higherIsBetter: boolean;
      };
      scores: Record<string, number | null>;
      winningModelSlug: string | null;
    }[];
  };
}

export function ComparisonMatrix({ data }: ComparisonMatrixProps) {
  const { models, winners, benchmarksComparison } = data;
  const { removeModel } = useCompareTray();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      toast({
        title: "Link Copied!",
        description: "Direct comparison link copied to your clipboard.",
        variant: "success",
      });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const cheapestModel = models.find((m) => m.slug === winners.cheapestModelSlug);
  const largestContextModel = models.find((m) => m.slug === winners.largestContextSlug);

  return (
    <div className="space-y-6">
      {/* Top action bar & Verdict Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          Comparing <span className="font-semibold text-foreground">{models.length}</span> models side-by-side
        </p>
        <Button variant="outline" size="sm" onClick={handleShare} className="gap-2 shrink-0">
          {copied ? <CheckCheck className="h-4 w-4 text-emerald-500" /> : <Share2 className="h-4 w-4" />}
          {copied ? "Link Copied!" : "Share Comparison"}
        </Button>
      </div>

      {/* Human-friendly Comparison Verdict Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 p-4 rounded-2xl border border-primary/20 bg-primary/5">
        {cheapestModel && (
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0">
              <DollarSign className="h-4.5 w-4.5" />
            </div>
            <div className="min-w-0">
              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">Best Economy</span>
              <span className="text-xs font-bold text-foreground truncate block">{cheapestModel.name}</span>
            </div>
          </div>
        )}

        {largestContextModel && (
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-cyan/10 text-brand-cyan shrink-0">
              <Maximize2 className="h-4.5 w-4.5" />
            </div>
            <div className="min-w-0">
              <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">Largest Context</span>
              <span className="text-xs font-bold text-foreground truncate block">{largestContextModel.name} ({formatTokenCount(largestContextModel.contextWindow)})</span>
            </div>
          </div>
        )}

        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-purple/10 text-brand-purple shrink-0">
            <Zap className="h-4.5 w-4.5" />
          </div>
          <div className="min-w-0">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">Benchmarks Evaluated</span>
            <span className="text-xs font-bold text-foreground truncate block">{benchmarksComparison.length} Standard Tests</span>
          </div>
        </div>
      </div>

      {/* Side-by-side spec table with sticky top headers and sticky first column */}
      <div className="overflow-auto max-h-[calc(100vh-10rem)] rounded-2xl border border-border bg-card shadow-sm">
        <table className="w-full text-left border-collapse text-sm">
          <thead className="sticky top-0 z-30 bg-card border-b border-border shadow-xs">
            <tr className="border-b border-border bg-card">
              <th className="sticky left-0 top-0 z-40 bg-card p-4 font-semibold text-xs text-muted-foreground uppercase tracking-wider w-48 min-w-[11rem] border-r border-b border-border shadow-[2px_2px_5px_rgba(0,0,0,0.03)]">
                Model Spec
              </th>
              {models.map((m) => (
                <th key={m.slug} className="sticky top-0 z-30 bg-card p-4 font-bold min-w-[15rem] align-top border-b border-border">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2.5">
                      <BrandLogo
                        logoUrl={m.lab?.logoUrl}
                        slug={m.lab?.slug}
                        name={m.name}
                        size="md"
                        className="mt-0.5"
                      />
                      <div>
                        <span className="text-xs text-primary font-medium block">
                          {m.lab.name}
                        </span>
                        <Link
                          href={`/models/${m.slug}`}
                          className="text-base text-foreground hover:text-primary transition-colors inline-flex items-center gap-1"
                        >
                          {m.name}
                          <ExternalLink className="h-3.5 w-3.5" />
                        </Link>
                      </div>
                    </div>
                    <button
                      onClick={() => removeModel(m.slug)}
                      className="text-muted-foreground hover:text-destructive p-1 rounded-md"
                      title="Remove model"
                      aria-label={`Remove ${m.name}`}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-border text-sm">
            {/* Input Pricing */}
            <tr className="hover:bg-muted/20">
              <td className="sticky left-0 bg-card z-10 p-4 font-medium text-muted-foreground border-r border-border shadow-[2px_0_5px_rgba(0,0,0,0.03)]">
                Min Input Price (1M tokens)
              </td>
              {models.map((m) => {
                const isWinner = winners.cheapestModelSlug === m.slug;
                return (
                  <td key={m.slug} className={cn("p-4 transition-colors", isWinner && "bg-emerald-500/[0.04]")}>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-foreground">
                        {m.minInputPrice !== null ? formatCurrency(m.minInputPrice) : "Free"}
                      </span>
                      {isWinner && (
                        <Badge variant="success" size="sm" className="gap-1">
                          <Trophy className="h-3 w-3" /> Cheapest
                        </Badge>
                      )}
                    </div>
                  </td>
                );
              })}
            </tr>

            {/* Context Window */}
            <tr className="hover:bg-muted/20">
              <td className="sticky left-0 bg-card z-10 p-4 font-medium text-muted-foreground border-r border-border shadow-[2px_0_5px_rgba(0,0,0,0.03)]">
                Context Window
              </td>
              {models.map((m) => {
                const isWinner = winners.largestContextSlug === m.slug;
                return (
                  <td key={m.slug} className={cn("p-4 transition-colors", isWinner && "bg-emerald-500/[0.04]")}>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-foreground">
                        {formatTokenCount(m.contextWindow)} tokens
                      </span>
                      {isWinner && (
                        <Badge variant="brand" size="sm" className="gap-1">
                          <Sparkles className="h-3 w-3" /> Largest
                        </Badge>
                      )}
                    </div>
                  </td>
                );
              })}
            </tr>

            {/* Parameter Count */}
            <tr className="hover:bg-muted/20">
              <td className="sticky left-0 bg-card z-10 p-4 font-medium text-muted-foreground border-r border-border shadow-[2px_0_5px_rgba(0,0,0,0.03)]">
                Parameters
              </td>
              {models.map((m) => (
                <td key={m.slug} className="p-4 font-medium text-foreground">
                  {m.parameterCount || "Proprietary"}
                </td>
              ))}
            </tr>

            {/* License */}
            <tr className="hover:bg-muted/20">
              <td className="sticky left-0 bg-card z-10 p-4 font-medium text-muted-foreground border-r border-border shadow-[2px_0_5px_rgba(0,0,0,0.03)]">
                License
              </td>
              {models.map((m) => (
                <td key={m.slug} className="p-4 capitalize">
                  {m.license.toLowerCase().replace("_", " ")}
                </td>
              ))}
            </tr>

            {/* Latency & Throughput */}
            <tr className="hover:bg-muted/20">
              <td className="sticky left-0 bg-card z-10 p-4 font-medium text-muted-foreground border-r border-border shadow-[2px_0_5px_rgba(0,0,0,0.03)]">
                Best Latency / Throughput
              </td>
              {models.map((m) => (
                <td key={m.slug} className="p-4">
                  <div>
                    {m.latencyMs ? `${m.latencyMs} ms TTFT` : "N/A"}
                  </div>
                  <div className="text-[11px] text-muted-foreground">
                    {m.throughputTps ? `${m.throughputTps} tokens/sec` : "N/A"}
                  </div>
                </td>
              ))}
            </tr>

            {/* Capabilities */}
            <tr className="hover:bg-muted/20">
              <td className="sticky left-0 bg-card z-10 p-4 font-medium text-muted-foreground border-r border-border shadow-[2px_0_5px_rgba(0,0,0,0.03)]">
                Capabilities
              </td>
              {models.map((m) => (
                <td key={m.slug} className="p-4">
                  <div className="flex flex-wrap gap-1">
                    {m.capabilities.map((cap: string) => (
                      <span
                        key={cap}
                        className="rounded-md bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground"
                      >
                        {cap}
                      </span>
                    ))}
                  </div>
                </td>
              ))}
            </tr>

            {/* Section Header: Benchmarks */}
            <tr className="bg-muted/60">
              <td colSpan={models.length + 1} className="p-3 font-bold text-xs uppercase tracking-wider text-foreground">
                Benchmark Intelligence
              </td>
            </tr>

            {benchmarksComparison.map((row) => (
              <tr key={row.benchmark.slug} className="hover:bg-muted/20">
                <td className="sticky left-0 bg-card z-10 p-4 border-r border-border shadow-[2px_0_5px_rgba(0,0,0,0.03)]">
                  <span className="font-semibold block text-foreground">{row.benchmark.name}</span>
                  <span className="text-[10px] text-muted-foreground uppercase">{row.benchmark.category}</span>
                </td>
                {models.map((m) => {
                  const score = row.scores[m.slug];
                  const isWinner = row.winningModelSlug === m.slug;
                  return (
                    <td key={m.slug} className={cn("p-4 transition-colors", isWinner && "bg-emerald-500/[0.04]")}>
                      {score !== null ? (
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-bold ${
                              isWinner ? "text-primary text-sm" : "text-foreground"
                            }`}
                          >
                            {formatScore(score, row.benchmark.maxScore)}
                          </span>
                          {isWinner && (
                            <Badge variant="success" size="sm" className="gap-1">
                              <Trophy className="h-3 w-3" /> Best
                            </Badge>
                          )}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">N/A</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
