"use client";

import React, { useState } from "react";
import { Calculator, DollarSign, TrendingDown, Info } from "lucide-react";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { Badge } from "@/components/ui/Badge";
import { formatCurrency } from "@/lib/utils";

interface ProviderPricing {
  id: string;
  provider: {
    name: string;
    slug: string;
    logoUrl?: string | null;
  };
  inputPricePerMillion: number;
  outputPricePerMillion: number;
  latencyMs?: number | null;
  throughputTps?: number | null;
}

interface TokenCostCalculatorProps {
  providers: ProviderPricing[];
  modelName: string;
}

export function TokenCostCalculator({ providers, modelName }: TokenCostCalculatorProps) {
  const [inputMillions, setInputMillions] = useState(10);
  const [outputMillions, setOutputMillions] = useState(2);

  if (!providers || providers.length === 0) return null;

  // Calculate monthly costs for each provider
  const calculatedProviders = providers
    .map((p) => {
      const inputCost = inputMillions * p.inputPricePerMillion;
      const outputCost = outputMillions * p.outputPricePerMillion;
      const totalCost = inputCost + outputCost;
      return {
        ...p,
        inputCost,
        outputCost,
        totalCost,
      };
    })
    .sort((a, b) => a.totalCost - b.totalCost);

  const cheapest = calculatedProviders[0];
  const mostExpensive = calculatedProviders[calculatedProviders.length - 1];
  const maxSavings =
    mostExpensive && cheapest && mostExpensive.totalCost > cheapest.totalCost
      ? mostExpensive.totalCost - cheapest.totalCost
      : 0;

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-3 py-1 text-xs font-bold mb-2">
            <Calculator className="h-3.5 w-3.5" />
            <span>Interactive Cost Estimator</span>
          </div>
          <h3 className="text-xl font-extrabold text-foreground">
            Monthly Production Token Cost
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Simulate monthly infrastructure spend for {modelName} across hosting providers.
          </p>
        </div>

        {maxSavings > 0 && (
          <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-2 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
            <TrendingDown className="h-4 w-4 shrink-0" />
            <span>Save up to {formatCurrency(maxSavings)}/mo with {cheapest.provider.name}</span>
          </div>
        )}
      </div>

      {/* Sliders Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6 p-4 rounded-xl bg-muted/30 border border-border">
        {/* Input tokens slider */}
        <div>
          <div className="flex items-center justify-between text-xs font-bold mb-2">
            <span className="text-muted-foreground">Monthly Prompt Input</span>
            <span className="text-primary font-mono text-sm">{inputMillions}M tokens</span>
          </div>
          <input
            type="range"
            min="1"
            max="100"
            step="1"
            value={inputMillions}
            onChange={(e) => setInputMillions(Number(e.target.value))}
            className="w-full accent-primary h-2 rounded-lg cursor-pointer bg-border"
          />
          <div className="flex justify-between text-[10px] text-muted-foreground mt-1 font-mono">
            <span>1M</span>
            <span>25M</span>
            <span>50M</span>
            <span>100M</span>
          </div>
        </div>

        {/* Output tokens slider */}
        <div>
          <div className="flex items-center justify-between text-xs font-bold mb-2">
            <span className="text-muted-foreground">Monthly Completion Output</span>
            <span className="text-primary font-mono text-sm">{outputMillions}M tokens</span>
          </div>
          <input
            type="range"
            min="0.5"
            max="25"
            step="0.5"
            value={outputMillions}
            onChange={(e) => setOutputMillions(Number(e.target.value))}
            className="w-full accent-primary h-2 rounded-lg cursor-pointer bg-border"
          />
          <div className="flex justify-between text-[10px] text-muted-foreground mt-1 font-mono">
            <span>0.5M</span>
            <span>5M</span>
            <span>15M</span>
            <span>25M</span>
          </div>
        </div>
      </div>

      {/* Ranked Provider Estimates */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Ranked Provider Estimates
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {calculatedProviders.map((item, idx) => (
            <div
              key={item.id}
              className={`rounded-xl border p-4 flex flex-col justify-between transition-all ${
                idx === 0
                  ? "border-emerald-500/40 bg-emerald-500/5 shadow-xs"
                  : "border-border bg-card hover:border-border/80"
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <BrandLogo
                    logoUrl={item.provider.logoUrl}
                    slug={item.provider.slug}
                    name={item.provider.name}
                    size="xs"
                  />
                  <span className="font-bold text-sm text-foreground">{item.provider.name}</span>
                </div>
                {idx === 0 && (
                  <Badge variant="success" size="sm">
                    Lowest Cost
                  </Badge>
                )}
              </div>

              <div>
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-muted-foreground">Estimated Cost:</span>
                  <span className="text-lg font-black text-foreground">
                    {formatCurrency(item.totalCost)}
                    <span className="text-xs font-normal text-muted-foreground">/mo</span>
                  </span>
                </div>

                <div className="mt-2 pt-2 border-t border-border/60 text-[11px] text-muted-foreground flex justify-between">
                  <span>In: {formatCurrency(item.inputCost)}</span>
                  <span>Out: {formatCurrency(item.outputCost)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
