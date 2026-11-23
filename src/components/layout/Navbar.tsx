"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Compass,
  Layers,
  Trophy,
  Gauge,
  Building2,
  Server,
  Search,
  Moon,
  Sun,
  Menu,
  X,
  Sparkles,
} from "lucide-react";
import { useTheme } from "@/app/providers";
import { useCompareTray } from "@/hooks/use-compare-tray";
import { CommandPalette } from "../features/search/CommandPalette";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const { resolvedTheme, setTheme } = useTheme();
  const { selectedModels } = useCompareTray();
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: "/models", label: "Models", icon: Compass },
    { href: "/compare", label: "Compare", icon: Layers, badge: selectedModels.length },
    { href: "/rankings", label: "Rankings", icon: Trophy },
    { href: "/benchmarks", label: "Benchmarks", icon: Gauge },
    { href: "/labs", label: "Labs", icon: Building2 },
    { href: "/providers", label: "Providers", icon: Server },
  ];

  return (
    <>
      <header className="sticky top-2 sm:top-2.5 z-40 w-full px-3 sm:px-6 lg:px-8 transition-all">
        <div className="mx-auto flex h-14 sm:h-16 max-w-7xl items-center justify-between px-3 sm:px-6 lg:px-8 rounded-2xl border border-border/80 bg-background/90 backdrop-blur-md shadow-md">
          {/* Zone 1: Left (Logo) */}
          <div className="flex items-center shrink-0">
            <Link href="/" className="flex items-center gap-2 sm:gap-3 group">
              <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-primary to-brand-cyan shadow-md text-primary-foreground shrink-0">
                <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 transition-transform group-hover:scale-110" />
              </div>
              <span className="text-xl sm:text-2xl font-black tracking-tight bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text">
                OneAtlas
              </span>
            </Link>
          </div>

          {/* Zone 2: Center (Desktop Navigation Links - active only at xl:1280px+ where they fit comfortably) */}
          <nav className="hidden xl:flex items-center gap-1 min-w-0 mx-4">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs lg:text-sm font-semibold transition-all whitespace-nowrap",
                    isActive
                      ? "bg-accent text-foreground shadow-xs font-bold"
                      : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{link.label}</span>
                  {link.badge ? (
                    <span className="ml-1 inline-flex h-4.5 min-w-4.5 px-1.5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                      {link.badge}
                    </span>
                  ) : null}
                </Link>
              );
            })}
          </nav>

          {/* Zone 3: Right Controls Group (Search, Theme Toggle, Hamburger) - always strictly contained */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Quick Search Button (compact on mobile/tablet, full on xl+) */}
            <button
              onClick={() => setIsCommandOpen(true)}
              className="flex items-center justify-center gap-2 rounded-xl border border-border bg-card/80 h-9 sm:h-10 px-2.5 sm:px-3 xl:px-3.5 text-sm text-muted-foreground hover:bg-accent hover:text-foreground transition-all shadow-xs whitespace-nowrap shrink-0"
              title="Search models, labs, benchmarks (Cmd+K)"
              aria-label="Search models and benchmarks"
            >
              <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
              <span className="hidden xl:inline text-xs font-medium">Search models, labs...</span>
              <kbd className="hidden xl:inline-flex items-center gap-0.5 rounded-md border border-border bg-muted px-1.5 py-0.5 text-[10px] font-mono font-semibold ml-1">
                ⌘K
              </kbd>
            </button>

            {/* Theme Toggle Button (fixed 36px/40px stable icon button, always visible on >=360px) */}
            <button
              onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
              className="hidden min-[360px]:flex h-9 w-9 sm:h-10 sm:w-10 min-w-9 sm:min-w-10 items-center justify-center rounded-xl border border-border text-muted-foreground hover:bg-accent hover:text-foreground transition-colors shrink-0"
              aria-label="Toggle theme"
              title={`Switch to ${resolvedTheme === "dark" ? "light" : "dark"} mode`}
            >
              {resolvedTheme === "dark" ? (
                <Sun className="h-4 w-4 shrink-0 transition-transform" />
              ) : (
                <Moon className="h-4 w-4 shrink-0 transition-transform" />
              )}
            </button>

            {/* Mobile / Tablet Menu Trigger (hidden on xl:1280px+) */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden flex h-9 w-9 sm:h-10 sm:w-10 min-w-9 sm:min-w-10 items-center justify-center rounded-xl border border-border text-muted-foreground hover:bg-accent hover:text-foreground transition-colors shrink-0"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="h-4 w-4 shrink-0" /> : <Menu className="h-4 w-4 shrink-0" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown (<xl) */}
        {mobileMenuOpen && (
          <div className="xl:hidden mx-auto max-w-7xl mt-2 rounded-2xl border border-border bg-card/95 backdrop-blur-md p-3 sm:p-4 space-y-2 shadow-xl animate-in fade-in slide-in-from-top-2">
            {/* Dedicated theme toggle row on small screens (<360px) */}
            <div className="min-[360px]:hidden flex items-center justify-between p-2.5 mb-2 rounded-xl border border-border/80 bg-accent/40">
              <span className="text-xs font-semibold text-foreground">Theme Mode</span>
              <button
                onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs font-semibold text-foreground bg-card hover:bg-accent"
              >
                {resolvedTheme === "dark" ? (
                  <>
                    <Sun className="h-3.5 w-3.5 text-amber-500" />
                    <span>Light Mode</span>
                  </>
                ) : (
                  <>
                    <Moon className="h-3.5 w-3.5 text-indigo-400" />
                    <span>Dark Mode</span>
                  </>
                )}
              </button>
            </div>

            {navLinks.map((link) => {
              const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center justify-between p-2.5 rounded-xl text-sm font-semibold transition-colors",
                    isActive
                      ? "bg-primary text-primary-foreground font-bold shadow-xs"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="h-4 w-4 shrink-0" />
                    <span>{link.label}</span>
                  </div>
                  {link.badge ? (
                    <span className="inline-flex h-5 min-w-5 px-1.5 items-center justify-center rounded-full bg-primary/20 text-xs font-bold">
                      {link.badge}
                    </span>
                  ) : null}
                </Link>
              );
            })}
          </div>
        )}
      </header>

      {/* Global Command Palette modal */}
      <CommandPalette isOpen={isCommandOpen} onClose={() => setIsCommandOpen(false)} />
    </>
  );
}
