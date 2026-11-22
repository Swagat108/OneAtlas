import React from "react";
import Link from "next/link";
import { Server, Globe, ArrowRight, ShieldCheck } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CompareTray } from "@/components/features/compare/CompareTray";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { findAllProviders } from "@/repositories/provider.repo";

export const revalidate = 60;

export default async function ProvidersPage() {
  const providers = await findAllProviders();

  return (
    <div className="min-h-screen min-h-dvh flex flex-col bg-background">
      <Navbar />

      <main id="main-content" className="flex-1 mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-10 py-8 w-full pb-24 sm:pb-8">
        {/* Header */}
        <div className="pb-6 border-b border-border mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-0.5 text-xs font-semibold text-primary mb-3">
            <Server className="h-3.5 w-3.5" />
            <span>Inference Infrastructure</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            Cloud AI Hosting Providers
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Compare latency, tokens-per-second throughput, regional hosting, and token economics across cloud APIs.
          </p>
        </div>

        {/* Providers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {providers.map((p) => (
            <div
              key={p.slug}
              className="group flex flex-col justify-between rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-lg"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <BrandLogo logoUrl={p.logoUrl} slug={p.slug} name={p.name} size="lg" />
                  <div className="text-right">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-brand-cyan/10 text-brand-cyan">
                      {p._count.models} hosted models
                    </span>
                    <span className="text-[11px] font-medium text-muted-foreground block mt-1 truncate max-w-[180px]">
                      {p.regions.join(", ")}
                    </span>
                  </div>
                </div>

                <Link href={`/providers/${p.slug}`} className="block">
                  <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                    {p.name}
                  </h3>
                </Link>

                <p className="mt-2 text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                  {p.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
                <Link
                  href={`/providers/${p.slug}`}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                >
                  View Hosted Models
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>

                {p.website && (
                  <a
                    href={p.website}
                    target="_blank"
                    rel="noreferrer"
                    className="text-muted-foreground hover:text-foreground text-xs"
                    title="Official platform"
                  >
                    <Globe className="h-4 w-4" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
      <CompareTray />
    </div>
  );
}
