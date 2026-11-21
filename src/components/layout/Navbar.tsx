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
      <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-primary to-brand-cyan shadow-md text-primary-foreground">
                <Sparkles className="h-5 w-5 transition-transform group-hover:scale-110" />
              </div>
              <span className="text-2xl font-black tracking-tight bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text">
                OneAtlas
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1.5">
              {navLinks.map((link) => {
                const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all",
                      isActive
                        ? "bg-accent text-foreground shadow-xs font-bold"
                        : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {link.label}
                    {link.badge ? (
                      <span className="ml-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                        {link.badge}
                      </span>
                    ) : null}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            {/* Quick Search Button */}
            <button
              onClick={() => setIsCommandOpen(true)}
              className="flex items-center gap-2.5 rounded-xl border border-border bg-card/80 px-3.5 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground transition-all shadow-xs"
            >
              <Search className="h-4 w-4" />
              <span className="hidden sm:inline">Search models, labs...</span>
              <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded-md border border-border bg-muted px-2 py-0.5 text-xs font-mono font-semibold">
                ⌘K
              </kbd>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-border text-muted-foreground hover:bg-accent hover:text-foreground transition-all"
              aria-label="Toggle theme"
            >
              {resolvedTheme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </button>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden flex h-10 w-10 items-center justify-center rounded-xl border border-border text-muted-foreground hover:bg-accent"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-border bg-card p-4 space-y-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center justify-between p-2.5 rounded-lg text-sm font-medium",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    {link.label}
                  </div>
                  {link.badge ? (
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary/20 text-xs font-bold">
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
