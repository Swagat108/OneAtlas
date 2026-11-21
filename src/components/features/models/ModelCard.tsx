import React from "react";
import Link from "next/link";
import { Cpu, Layers, Plus, Check, ExternalLink, Zap } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { formatCurrency, formatTokenCount } from "@/lib/utils";
import { useCompareTray } from "@/hooks/use-compare-tray";

export interface ModelSummary {
  id: string;
  slug: string;
  name: string;
  description: string;
  modelType: string;
  releaseDate: string;
  contextWindow: number;
  maxOutputTokens: number;
  parameterCount?: string | null;
  license: string;
  lab: {
    slug: string;
    name: string;
    logoUrl?: string | null;
  };
  pricing: {
    minInputPricePerMillion: number | null;
    minOutputPricePerMillion: number | null;
    providerCount: number;
  };
  capabilities: { slug: string; name: string }[];
  inputModalities: { slug: string; name: string }[];
  benchmarkScores?: { slug: string; name: string; score: number }[];
}

interface ModelCardProps {
  model: ModelSummary;
}

export function ModelCard({ model }: ModelCardProps) {
  const { isInTray, addModel, removeModel } = useCompareTray();
  const inTray = isInTray(model.slug);

  const toggleCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
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

  const arenaScore = model.benchmarkScores?.find((s) => s.slug === "arena-elo")?.score;

  return (
    <div className="group relative flex flex-col justify-between rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-xl">
      <div>
        {/* Header: Logo, Lab & Compare Action */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <BrandLogo
              logoUrl={model.lab.logoUrl}
              slug={model.lab.slug}
              name={model.name}
              size="sm"
            />
            <Link
              href={`/labs/${model.lab.slug}`}
              className="text-sm font-bold text-primary hover:underline tracking-tight truncate"
            >
              {model.lab.name}
            </Link>
          </div>

          <button
            onClick={toggleCompare}
            className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold border transition-all shrink-0 ${
              inTray
                ? "bg-primary text-primary-foreground border-primary shadow-xs"
                : "border-border text-muted-foreground hover:bg-accent hover:text-foreground"
            }`}
          >
            {inTray ? <Check className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
            {inTray ? "Comparing" : "Compare"}
          </button>
        </div>

        {/* Model Title & Description */}
        <div className="mt-3">
          <Link href={`/models/${model.slug}`} className="block">
            <h3 className="text-lg font-extrabold text-foreground group-hover:text-primary transition-colors flex items-center gap-2">
              {model.name}
              <ExternalLink className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity text-primary" />
            </h3>
          </Link>
          <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground leading-relaxed">
            {model.description}
          </p>
        </div>

        {/* Badges: Type, Parameters, Arena Score */}
        <div className="mt-4 flex flex-wrap gap-2">
          <Badge variant="outline" size="sm">
            {model.modelType}
          </Badge>
          {model.parameterCount && (
            <Badge variant="secondary" size="sm">
              {model.parameterCount}
            </Badge>
          )}
          {arenaScore && (
            <Badge variant="success" size="sm" className="font-bold">
              <Zap className="h-3.5 w-3.5 mr-1" />
              {arenaScore} Elo
            </Badge>
          )}
        </div>
      </div>

      {/* Footer Specs & Pricing */}
      <div className="mt-6 border-t border-border pt-4">
        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <span className="text-muted-foreground block text-xs font-medium">Context Window</span>
            <span className="text-sm font-bold text-foreground">
              {formatTokenCount(model.contextWindow)} tokens
            </span>
          </div>
          <div>
            <span className="text-muted-foreground block text-xs font-medium">Input Price</span>
            <span className="text-sm font-bold text-foreground">
              {model.pricing.minInputPricePerMillion !== null
                ? `${formatCurrency(model.pricing.minInputPricePerMillion)} / 1M`
                : "Free / Local"}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border/40 font-medium">
          <span>{model.pricing.providerCount} hosting provider(s)</span>
          <span className="capitalize">{model.license.toLowerCase().replace("_", " ")}</span>
        </div>
      </div>
    </div>
  );
}
