"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, Compass, Building2, Server, X, ArrowRight } from "lucide-react";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { useSearch } from "@/hooks/use-search";
import { cn } from "@/lib/utils";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const router = useRouter();
  const { data, isLoading } = useSearch(query, 5);

  // Global Cmd+K / Ctrl+K keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        onClose();
        // Toggle palette
        if (!isOpen) {
          // Open
          const evt = new CustomEvent("open-command-palette");
          window.dispatchEvent(evt);
        }
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const navigateTo = (url: string) => {
    onClose();
    setQuery("");
    router.push(url);
  };

  const hasResults =
    data &&
    (data.models.length > 0 || data.labs.length > 0 || data.providers.length > 0);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-background/70 backdrop-blur-sm animate-in fade-in">
      <div
        className="w-full max-w-xl rounded-2xl border border-border bg-card shadow-2xl overflow-hidden animate-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center border-b border-border px-5 py-4">
          <Search className="h-5 w-5 text-muted-foreground mr-3 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search AI models, labs, providers (e.g. GPT-4o, Groq, Meta)..."
            className="flex-1 bg-transparent text-base font-medium outline-none placeholder:text-muted-foreground"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="text-muted-foreground hover:text-foreground mr-2"
            >
              <X className="h-4.5 w-4.5" />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-xs border border-border rounded-md px-2 py-1 text-muted-foreground font-mono"
          >
            ESC
          </button>
        </div>

        {/* Results Area */}
        <div className="max-h-96 overflow-y-auto p-2">
          {isLoading && query && (
            <div className="p-6 text-center text-xs text-muted-foreground">
              Searching OneAtlas index...
            </div>
          )}

          {!isLoading && query && !hasResults && (
            <div className="p-8 text-center text-sm text-muted-foreground">
              No matching models, labs, or providers found.
            </div>
          )}

          {!query && (
            <div className="p-4 text-xs text-muted-foreground">
              <p className="font-semibold text-foreground mb-2">Quick Navigation</p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => navigateTo("/models")}
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent text-left"
                >
                  <Compass className="h-4 w-4 text-primary" />
                  <span>Browse Catalog</span>
                </button>
                <button
                  onClick={() => navigateTo("/rankings")}
                  className="flex items-center gap-2 p-2 rounded-lg hover:bg-accent text-left"
                >
                  <Building2 className="h-4 w-4 text-primary" />
                  <span>Leaderboards</span>
                </button>
              </div>
            </div>
          )}

          {data && data.models.length > 0 && (
            <div className="mb-3">
              <div className="px-3 py-1.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                Models
              </div>
              {data.models.map((m: any) => (
                <button
                  key={m.slug}
                  onClick={() => navigateTo(m.url)}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-accent text-left transition-colors text-sm group"
                >
                  <div className="flex items-center gap-2.5">
                    <BrandLogo
                      logoUrl={m.logoUrl}
                      slug={m.labSlug || m.slug}
                      name={m.name}
                      size="xs"
                    />
                    <div>
                      <span className="font-medium">{m.name}</span>
                      <span className="text-xs text-muted-foreground ml-2">by {m.lab}</span>
                    </div>
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-primary" />
                </button>
              ))}
            </div>
          )}

          {data && data.labs.length > 0 && (
            <div className="mb-3">
              <div className="px-3 py-1.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                AI Research Labs
              </div>
              {data.labs.map((l: any) => (
                <button
                  key={l.slug}
                  onClick={() => navigateTo(l.url)}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-accent text-left transition-colors text-sm group"
                >
                  <div className="flex items-center gap-2.5">
                    <BrandLogo
                      logoUrl={l.logoUrl}
                      slug={l.slug}
                      name={l.name}
                      size="xs"
                    />
                    <div>
                      <span className="font-medium">{l.name}</span>
                      <span className="text-xs text-muted-foreground ml-2">({l.modelCount} models)</span>
                    </div>
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-brand-purple" />
                </button>
              ))}
            </div>
          )}

          {data && data.providers.length > 0 && (
            <div>
              <div className="px-3 py-1.5 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                Cloud Providers
              </div>
              {data.providers.map((p: any) => (
                <button
                  key={p.slug}
                  onClick={() => navigateTo(p.url)}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-accent text-left transition-colors text-sm group"
                >
                  <div className="flex items-center gap-2.5">
                    <BrandLogo
                      logoUrl={p.logoUrl}
                      slug={p.slug}
                      name={p.name}
                      size="xs"
                    />
                    <div>
                      <span className="font-medium">{p.name}</span>
                      <span className="text-xs text-muted-foreground ml-2">({p.modelCount} models)</span>
                    </div>
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity text-brand-emerald" />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
