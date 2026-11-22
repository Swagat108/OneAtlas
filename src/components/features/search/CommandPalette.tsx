"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Search, Compass, Trophy, Building2, Server, X, ArrowRight, Clock, Trash2 } from "lucide-react";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { useSearch } from "@/hooks/use-search";
import { cn } from "@/lib/utils";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

const RECENT_SEARCHES_KEY = "oneatlas_recent_searches";

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const router = useRouter();
  const { data, isLoading } = useSearch(query, 5);

  // Load recent searches
  useEffect(() => {
    try {
      const saved = localStorage.getItem(RECENT_SEARCHES_KEY);
      if (saved) {
        setRecentSearches(JSON.parse(saved).slice(0, 5));
      }
    } catch {
      // Ignore
    }
  }, [isOpen]);

  const saveRecentSearch = (term: string) => {
    if (!term.trim()) return;
    try {
      const updated = [term.trim(), ...recentSearches.filter((s) => s !== term.trim())].slice(0, 6);
      setRecentSearches(updated);
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
    } catch {
      // Ignore
    }
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    try {
      localStorage.removeItem(RECENT_SEARCHES_KEY);
    } catch {
      // Ignore
    }
  };

  // Flatten searchable results for keyboard navigation
  const allResults = useMemo(() => {
    const list: { type: "model" | "lab" | "provider"; id: string; name: string; url: string; sub?: string }[] = [];
    if (!data) return list;

    data.models?.forEach((m: any) => {
      list.push({
        type: "model",
        id: m.slug,
        name: m.name,
        url: m.url,
        sub: `by ${m.lab}`,
      });
    });

    data.labs?.forEach((l: any) => {
      list.push({
        type: "lab",
        id: l.slug,
        name: l.name,
        url: l.url,
        sub: `${l.modelCount} models`,
      });
    });

    data.providers?.forEach((p: any) => {
      list.push({
        type: "provider",
        id: p.slug,
        name: p.name,
        url: p.url,
        sub: `${p.modelCount} models`,
      });
    });

    return list;
  }, [data]);

  // Reset selected index when results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [allResults]);

  // Global Cmd+K / Ctrl+K keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        onClose();
        if (!isOpen) {
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

  // Handle arrow key and enter navigation
  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < allResults.length - 1 ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : allResults.length - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (allResults.length > 0 && allResults[selectedIndex]) {
        saveRecentSearch(allResults[selectedIndex].name);
        navigateTo(allResults[selectedIndex].url);
      } else if (query.trim()) {
        saveRecentSearch(query.trim());
        navigateTo(`/models?q=${encodeURIComponent(query.trim())}`);
      }
    }
  };

  if (!isOpen) return null;

  const navigateTo = (url: string) => {
    onClose();
    setQuery("");
    router.push(url);
  };

  const hasResults = allResults.length > 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-0 sm:pt-20 p-0 sm:p-4 bg-background/80 backdrop-blur-sm animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="w-full sm:max-w-xl h-full sm:h-auto max-h-full sm:max-h-[85vh] rounded-none sm:rounded-2xl border-0 sm:border border-border bg-card shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center border-b border-border px-5 py-4 shrink-0">
          <Search className="h-5 w-5 text-muted-foreground mr-3 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleInputKeyDown}
            placeholder="Search AI models, labs, providers (e.g. GPT-4o, Groq, Meta)..."
            className="flex-1 bg-transparent text-base font-medium outline-none placeholder:text-muted-foreground min-w-0"
            aria-label="Search models, labs, and providers"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="text-muted-foreground hover:text-foreground mr-2 p-1"
              aria-label="Clear search text"
            >
              <X className="h-4.5 w-4.5" />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-xs border border-border rounded-md px-2 py-1 text-muted-foreground font-mono hover:bg-accent"
          >
            ESC
          </button>
        </div>

        {/* Results Area */}
        <div className="flex-1 overflow-y-auto p-2">
          {isLoading && query && (
            <div className="p-6 text-center text-xs text-muted-foreground animate-pulse">
              Searching OneAtlas index...
            </div>
          )}

          {!isLoading && query && !hasResults && (
            <div className="p-8 text-center text-sm text-muted-foreground">
              <p>No matching models, labs, or providers found.</p>
              <button
                onClick={() => navigateTo(`/models?q=${encodeURIComponent(query)}`)}
                className="mt-3 text-xs font-bold text-primary hover:underline inline-flex items-center gap-1"
              >
                Search all models for &ldquo;{query}&rdquo; <ArrowRight className="h-3 w-3" />
              </button>
            </div>
          )}

          {!query && (
            <div className="p-3 space-y-4">
              {/* Recent searches */}
              {recentSearches.length > 0 && (
                <div>
                  <div className="flex items-center justify-between px-2 mb-1.5">
                    <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                      <Clock className="h-3 w-3" /> Recent Searches
                    </span>
                    <button
                      onClick={clearRecentSearches}
                      className="text-[10px] text-muted-foreground hover:text-destructive flex items-center gap-1"
                    >
                      <Trash2 className="h-3 w-3" /> Clear
                    </button>
                  </div>
                  <div className="space-y-1">
                    {recentSearches.map((term) => (
                      <button
                        key={term}
                        onClick={() => {
                          setQuery(term);
                        }}
                        className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-accent text-left text-sm text-foreground transition-colors group"
                      >
                        <span className="truncate">{term}</span>
                        <ArrowRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 text-primary transition-opacity" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick Navigation */}
              <div>
                <p className="px-2 text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2">
                  Quick Navigation
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    onClick={() => navigateTo("/models")}
                    className="flex items-center gap-2.5 p-3 rounded-xl border border-border/80 hover:bg-accent text-left transition-colors"
                  >
                    <Compass className="h-4.5 w-4.5 text-primary shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-foreground">Catalog</div>
                      <div className="text-[10px] text-muted-foreground">All 46+ models</div>
                    </div>
                  </button>
                  <button
                    onClick={() => navigateTo("/rankings")}
                    className="flex items-center gap-2.5 p-3 rounded-xl border border-border/80 hover:bg-accent text-left transition-colors"
                  >
                    <Trophy className="h-4.5 w-4.5 text-brand-purple shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-foreground">Rankings</div>
                      <div className="text-[10px] text-muted-foreground">Benchmarks</div>
                    </div>
                  </button>
                  <button
                    onClick={() => navigateTo("/compare?models=gpt-4o,claude-3-5-sonnet")}
                    className="flex items-center gap-2.5 p-3 rounded-xl border border-border/80 hover:bg-accent text-left transition-colors"
                  >
                    <Server className="h-4.5 w-4.5 text-brand-cyan shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-foreground">Compare</div>
                      <div className="text-[10px] text-muted-foreground">Side-by-side</div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Search Results list with Active Keyboard Index */}
          {hasResults && (
            <div className="space-y-1">
              {allResults.map((item, index) => {
                const isSelected = index === selectedIndex;
                return (
                  <button
                    key={`${item.type}-${item.id}`}
                    onClick={() => {
                      saveRecentSearch(item.name);
                      navigateTo(item.url);
                    }}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={cn(
                      "w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-all text-sm",
                      isSelected
                        ? "bg-primary/10 text-primary font-semibold border-l-4 border-primary pl-2.5"
                        : "hover:bg-accent text-foreground"
                    )}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <BrandLogo slug={item.id} name={item.name} size="xs" />
                      <div className="min-w-0">
                        <div className="truncate font-medium">{item.name}</div>
                        {item.sub && (
                          <div className="text-[11px] text-muted-foreground truncate">
                            {item.sub}
                          </div>
                        )}
                      </div>
                    </div>
                    <span className="text-[10px] uppercase font-bold text-muted-foreground px-2 py-0.5 rounded-md bg-muted/60 shrink-0 ml-2">
                      {item.type}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="hidden sm:flex items-center justify-between border-t border-border px-4 py-2.5 bg-muted/30 text-[11px] text-muted-foreground shrink-0">
          <div className="flex items-center gap-3">
            <span>
              <kbd className="px-1.5 py-0.5 bg-background border border-border rounded text-[10px] font-mono mr-1">↑</kbd>
              <kbd className="px-1.5 py-0.5 bg-background border border-border rounded text-[10px] font-mono mr-1">↓</kbd>
              to navigate
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 bg-background border border-border rounded text-[10px] font-mono mr-1">↵</kbd>
              to select
            </span>
          </div>
          <span>
            <kbd className="px-1.5 py-0.5 bg-background border border-border rounded text-[10px] font-mono mr-1">ESC</kbd>
            to close
          </span>
        </div>
      </div>
    </div>
  );
}
