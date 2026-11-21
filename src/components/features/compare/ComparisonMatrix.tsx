"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Check, Trophy, X, Share2, Copy, CheckCheck, Sparkles, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { formatCurrency, formatTokenCount, formatScore } from "@/lib/utils";
import { useCompareTray } from "@/hooks/use-compare-tray";

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
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-8">
      {/* Top action bar */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Comparing <span className="font-semibold text-foreground">{models.length}</span> models side-by-side
        </p>
        <Button variant="outline" size="sm" onClick={handleShare} className="gap-2">
          {copied ? <CheckCheck className="h-4 w-4 text-emerald-500" /> : <Share2 className="h-4 w-4" />}
          {copied ? "Link Copied!" : "Share Comparison"}
        </Button>
      </div>

      {/* Side-by-side spec table */}
      <div className="overflow-x-auto rounded-2xl border border-border bg-card">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              <th className="p-4 font-semibold text-xs text-muted-foreground uppercase tracking-wider w-48 min-w-[12rem]">
                Model Spec
              </th>
              {models.map((m) => (
                <th key={m.slug} className="p-4 font-bold min-w-[16rem] align-top">
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
              <td className="p-4 font-medium text-muted-foreground">Min Input Price (1M tokens)</td>
              {models.map((m) => {
                const isWinner = winners.cheapestModelSlug === m.slug;
                return (
                  <td key={m.slug} className="p-4">
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
              <td className="p-4 font-medium text-muted-foreground">Context Window</td>
              {models.map((m) => {
                const isWinner = winners.largestContextSlug === m.slug;
                return (
                  <td key={m.slug} className="p-4">
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
              <td className="p-4 font-medium text-muted-foreground">Parameters</td>
              {models.map((m) => (
                <td key={m.slug} className="p-4 font-medium text-foreground">
                  {m.parameterCount || "Proprietary"}
                </td>
              ))}
            </tr>

            {/* License */}
            <tr className="hover:bg-muted/20">
              <td className="p-4 font-medium text-muted-foreground">License</td>
              {models.map((m) => (
                <td key={m.slug} className="p-4 capitalize">
                  {m.license.toLowerCase().replace("_", " ")}
                </td>
              ))}
            </tr>

            {/* Latency & Throughput */}
            <tr className="hover:bg-muted/20">
              <td className="p-4 font-medium text-muted-foreground">Best Latency / Throughput</td>
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
              <td className="p-4 font-medium text-muted-foreground">Capabilities</td>
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
                <td className="p-4">
                  <span className="font-semibold block text-foreground">{row.benchmark.name}</span>
                  <span className="text-[10px] text-muted-foreground uppercase">{row.benchmark.category}</span>
                </td>
                {models.map((m) => {
                  const score = row.scores[m.slug];
                  const isWinner = row.winningModelSlug === m.slug;
                  return (
                    <td key={m.slug} className="p-4">
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
