import React from "react";
import Link from "next/link";
import { Building2, Globe, ArrowRight, Sparkles } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CompareTray } from "@/components/features/compare/CompareTray";
import { ModelLogo } from "@/components/ui/ModelLogo";
import { findAllLabs } from "@/repositories/lab.repo";

export const revalidate = 60;

export default async function LabsPage() {
  const labs = await findAllLabs();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />

      <main className="flex-1 mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-10 py-8 w-full">
        {/* Header */}
        <div className="pb-6 border-b border-border mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-0.5 text-xs font-semibold text-primary mb-3">
            <Building2 className="h-3.5 w-3.5" />
            <span>AI Organizations</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            Frontier AI Research Labs
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Discover the organizations pioneering foundational model architectures, open weights, and reasoning breakthroughs.
          </p>
        </div>

        {/* Labs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {labs.map((lab) => (
            <div
              key={lab.slug}
              className="group flex flex-col justify-between rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-lg"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <ModelLogo labSlug={lab.slug} name={lab.name} size="lg" />
                  <div className="text-right">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary">
                      {lab._count.models} models
                    </span>
                    <span className="text-[11px] font-medium text-muted-foreground block mt-1">
                      {lab.country} • {lab.foundedYear}
                    </span>
                  </div>
                </div>

                <Link href={`/labs/${lab.slug}`} className="block">
                  <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                    {lab.name}
                  </h3>
                </Link>

                <p className="mt-2 text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                  {lab.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
                <Link
                  href={`/labs/${lab.slug}`}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                >
                  View Release Timeline
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>

                {lab.website && (
                  <a
                    href={lab.website}
                    target="_blank"
                    rel="noreferrer"
                    className="text-muted-foreground hover:text-foreground text-xs"
                    title="Visit website"
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
