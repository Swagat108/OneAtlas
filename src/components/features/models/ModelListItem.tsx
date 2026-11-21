import React from "react";
import Link from "next/link";
import { Plus, Check, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { formatCurrency, formatTokenCount } from "@/lib/utils";
import { useCompareTray } from "@/hooks/use-compare-tray";
import { ModelSummary } from "./ModelCard";

interface ModelListItemProps {
  model: ModelSummary;
}

export function ModelListItem({ model }: ModelListItemProps) {
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

  return (
    <div className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/40 hover:shadow-sm">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <Link
            href={`/labs/${model.lab.slug}`}
            className="text-xs font-semibold text-primary hover:underline"
          >
            {model.lab.name}
          </Link>
          <span className="text-muted-foreground text-xs">•</span>
          <Badge variant="outline" size="sm">
            {model.modelType}
          </Badge>
          {model.parameterCount && (
            <Badge variant="secondary" size="sm">
              {model.parameterCount}
            </Badge>
          )}
        </div>

        <Link href={`/models/${model.slug}`} className="mt-1 block">
          <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors flex items-center gap-1.5">
            {model.name}
            <ExternalLink className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-primary" />
          </h3>
        </Link>
        <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">
          {model.description}
        </p>
      </div>

      {/* Right Column: Specs & Actions */}
      <div className="flex items-center gap-6 self-end sm:self-center shrink-0">
        <div className="text-right">
          <div className="text-xs font-bold text-foreground">
            {model.pricing.minInputPricePerMillion !== null
              ? `${formatCurrency(model.pricing.minInputPricePerMillion)} / 1M`
              : "Free"}
          </div>
          <div className="text-[11px] text-muted-foreground">
            {formatTokenCount(model.contextWindow)} ctx • {model.pricing.providerCount} host(s)
          </div>
        </div>

        <button
          onClick={toggleCompare}
          className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium border transition-colors ${
            inTray
              ? "bg-primary text-primary-foreground border-primary"
              : "border-border text-muted-foreground hover:bg-accent hover:text-foreground"
          }`}
        >
          {inTray ? <Check className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
          {inTray ? "Added" : "Compare"}
        </button>
      </div>
    </div>
  );
}
