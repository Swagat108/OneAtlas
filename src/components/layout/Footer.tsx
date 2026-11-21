import React from "react";
import Link from "next/link";
import { Sparkles, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card/40 mt-20">
      <div className="mx-auto max-w-[1600px] px-4 py-12 sm:px-6 lg:px-10">
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

          <div className="text-xs text-muted-foreground flex items-center gap-1">
            Built with Next.js, Prisma, Neon & Tailwind
          </div>
        </div>
      </div>
    </footer>
  );
}
