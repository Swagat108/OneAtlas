import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Server, Globe, ArrowLeft, ArrowRight, ExternalLink, Zap } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { CompareTray } from "@/components/features/compare/CompareTray";
import { Badge } from "@/components/ui/Badge";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { findProviderBySlug } from "@/repositories/provider.repo";
import { formatCurrency, formatTokenCount } from "@/lib/utils";

export const revalidate = 60;

export default async function ProviderDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const provider = await findProviderBySlug(params.slug);

  if (!provider) {
    return notFound();
  }

  return (
    <div className="min-h-screen min-h-dvh flex flex-col bg-background">
      <Navbar />

      <main id="main-content" className="flex-1 mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-10 py-8 w-full pb-24 sm:pb-8">
        {/* Navigation */}
        <div className="mb-6">
          <Link
            href="/providers"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Hosting Providers
          </Link>
        </div>

        {/* Profile Card */}
        <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 mb-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-border">
            <div className="flex items-center gap-5">
              <BrandLogo logoUrl={provider.logoUrl} slug={provider.slug} name={provider.name} size="xl" className="shadow-md" />
              <div>
                <span className="text-xs font-semibold text-primary block mb-1">
                  Regions: {provider.regions.join(", ")}
                </span>
                <h1 className="text-3xl font-extrabold tracking-tight">{provider.name}</h1>
              </div>
            </div>

            {provider.website && (
              <a
                href={provider.website}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold border border-border rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
              >
                <Globe className="h-3.5 w-3.5" />
                API Console
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>

          <p className="mt-4 text-sm text-muted-foreground leading-relaxed max-w-3xl">
            {provider.description}
          </p>

          <div className="mt-6 flex items-center gap-6 text-xs text-muted-foreground">
            <div>
              <span className="font-bold text-foreground text-base block">{provider.models.length}</span>
              Hosted Models
            </div>
          </div>
        </div>

        {/* Hosted Models Table */}
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          <div className="p-6 border-b border-border">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Server className="h-4 w-4 text-primary" />
              Supported Models & Inference Pricing
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-border bg-muted/40 font-semibold text-muted-foreground uppercase tracking-wider">
                  <th className="p-4">Model</th>
                  <th className="p-4">Lab</th>
                  <th className="p-4">Input Price (1M)</th>
                  <th className="p-4">Output Price (1M)</th>
                  <th className="p-4">Latency (TTFT)</th>
                  <th className="p-4">Throughput</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {provider.models.map((mp) => (
                  <tr key={mp.id} className="hover:bg-muted/20">
                    <td className="p-4 font-bold text-foreground">
                      <div className="flex items-center gap-2.5">
                        <BrandLogo
                          logoUrl={mp.model.lab?.logoUrl}
                          slug={mp.model.lab?.slug}
                          name={mp.model.name}
                          size="xs"
                        />
                        <Link
                          href={`/models/${mp.model.slug}`}
                          className="hover:text-primary transition-colors inline-flex items-center gap-1"
                        >
                          {mp.model.name}
                          <ExternalLink className="h-3 w-3 text-muted-foreground" />
                        </Link>
                      </div>
                    </td>
                    <td className="p-4 text-primary font-medium">
                      {mp.model.lab.name}
                    </td>
                    <td className="p-4 font-bold text-foreground">
                      {formatCurrency(Number(mp.inputPricePerMillion))}
                    </td>
                    <td className="p-4 text-foreground">
                      {formatCurrency(Number(mp.outputPricePerMillion))}
                    </td>
                    <td className="p-4 text-muted-foreground">
                      {mp.latencyMs ? `${mp.latencyMs} ms` : "N/A"}
                    </td>
                    <td className="p-4 text-muted-foreground">
                      {mp.throughputTps ? `${mp.throughputTps} tokens/s` : "N/A"}
                    </td>
                    <td className="p-4 text-right">
                      <Link
                        href={`/models/${mp.model.slug}`}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                      >
                        Specs <ArrowRight className="h-3 w-3" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <Footer />
      <CompareTray />
    </div>
  );
}
