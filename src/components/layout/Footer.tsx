import React from "react";
import Link from "next/link";
import { Sparkles } from "lucide-react";

export function Footer() {
  return (
    <footer className="relative border-t border-border/40 bg-card/50 mt-20 overflow-hidden">
      {/* Background ambient pattern and fading large watermark */}
      <div className="absolute inset-0 bg-dot-pattern opacity-20 mask-top-fade pointer-events-none" aria-hidden="true" />
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 pointer-events-none select-none text-[6rem] sm:text-[10rem] font-black tracking-widest text-foreground/[0.018] leading-none whitespace-nowrap overflow-hidden z-0"
        aria-hidden="true"
      >
        ONEATLAS
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Sparkles className="h-4 w-4" />
            </div>
            <span className="text-base font-bold">OneAtlas</span>
            <span className="text-xs text-muted-foreground ml-2">
              Frontier Model Discovery & Intelligence
            </span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground">
            <Link href="/models" className="hover:text-foreground transition-colors">
              Models
            </Link>
            <Link href="/compare" className="hover:text-foreground transition-colors">
              Comparison Matrix
            </Link>
            <Link href="/rankings" className="hover:text-foreground transition-colors">
              Leaderboards
            </Link>
            <Link href="/benchmarks" className="hover:text-foreground transition-colors">
              Benchmarks
            </Link>
            <Link href="/labs" className="hover:text-foreground transition-colors">
              AI Labs
            </Link>
            <Link href="/providers" className="hover:text-foreground transition-colors">
              Cloud Providers
            </Link>
          </div>
        </div>

        {/* Legal & Trademark Attribution */}
        <div className="mt-8 pt-6 border-t border-border/40 text-center">
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            All logos and trademarks are the property of their respective owners and are used for identification purposes only.
          </p>
        </div>
      </div>
    </footer>
  );
}
