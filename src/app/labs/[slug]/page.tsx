import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Building2, Globe, ArrowLeft, Calendar, ArrowRight, ExternalLink } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CompareTray } from "@/components/features/compare/CompareTray";
import { Badge } from "@/components/ui/Badge";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { findLabBySlug } from "@/repositories/lab.repo";
import { formatDate, formatTokenCount, formatCurrency } from "@/lib/utils";

export const revalidate = 60;

export default async function LabDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const lab = await findLabBySlug(params.slug);

  if (!lab) {
    return notFound();
  }

  return (
    <div className="min-h-screen min-h-dvh flex flex-col bg-background">
      <Navbar />

      <main id="main-content" className="flex-1 mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-10 py-8 w-full pb-24 sm:pb-8">
        {/* Navigation */}
        <div className="mb-6">
          <Link
            href="/labs"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to AI Labs
          </Link>
        </div>

        {/* Lab Profile Header */}
        <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 mb-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-border">
            <div className="flex items-center gap-5">
              <BrandLogo logoUrl={lab.logoUrl} slug={lab.slug} name={lab.name} size="xl" className="shadow-md" />
              <div>
                <span className="text-xs font-semibold text-primary block mb-1">
                  {lab.country} • Founded {lab.foundedYear}
                </span>
                <h1 className="text-3xl font-extrabold tracking-tight">{lab.name}</h1>
              </div>
            </div>

            {lab.website && (
              <a
                href={lab.website}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold border border-border rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
              >
                <Globe className="h-3.5 w-3.5" />
                Official Website
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>

          <p className="mt-4 text-sm text-muted-foreground leading-relaxed max-w-3xl">
            {lab.description}
          </p>

          <div className="mt-6 flex items-center gap-6 text-xs text-muted-foreground">
            <div>
              <span className="font-bold text-foreground text-base block">{lab.models.length}</span>
              Models Documented
            </div>
          </div>
        </div>

        {/* Chronological Release Timeline */}
        <div>
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            Foundation Model Release History
          </h2>

          <div className="relative border-l-2 border-border ml-3 pl-6 space-y-8">
            {lab.models.map((model) => {
              const cheapestProvider = model.providers[0];
              const minPrice = cheapestProvider
                ? Number(cheapestProvider.inputPricePerMillion)
                : null;

              return (
                <div key={model.slug} className="relative group">
                  {/* Timeline dot */}
                  <div className="absolute -left-[31px] top-1.5 h-3.5 w-3.5 rounded-full border-2 border-primary bg-background group-hover:bg-primary transition-colors" />

                  <div className="rounded-xl border border-border bg-card p-5 transition-all hover:border-primary/50 hover:shadow-md">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2.5">
                        <BrandLogo
                          logoUrl={lab.logoUrl}
                          slug={lab.slug}
                          name={model.name}
                          size="sm"
                        />
                        <Link href={`/models/${model.slug}`}>
                          <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
                            {model.name}
                          </h3>
                        </Link>
                        <Badge variant="outline" size="sm">
                          {model.modelType}
                        </Badge>
                        {model.parameterCount && (
                          <Badge variant="secondary" size="sm">
                            {model.parameterCount}
                          </Badge>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground font-medium">
                        {formatDate(model.releaseDate)}
                      </span>
                    </div>

                    <p className="text-xs text-muted-foreground line-clamp-2 mt-1 mb-4">
                      {model.description}
                    </p>

                    <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-border/60 text-xs">
                      <div className="flex items-center gap-4 text-muted-foreground">
                        <span>
                          Context: <strong className="text-foreground">{formatTokenCount(model.contextWindow)}</strong>
                        </span>
                        <span>
                          Min Price:{" "}
                          <strong className="text-foreground">
                            {minPrice !== null ? `${formatCurrency(minPrice)} / 1M` : "Free"}
                          </strong>
                        </span>
                      </div>

                      <Link
                        href={`/models/${model.slug}`}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                      >
                        Model Intelligence <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      <Footer />
      <CompareTray />
    </div>
  );
}
