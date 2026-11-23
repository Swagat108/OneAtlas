"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { BrandLogo } from "@/components/ui/BrandLogo";

interface PartnerLogo {
  slug: string;
  name: string;
  href: string;
  role: string;
}

const PARTNERS: PartnerLogo[] = [
  { slug: "openai", name: "OpenAI", href: "/labs/openai", role: "Frontier Lab" },
  { slug: "anthropic", name: "Anthropic", href: "/labs/anthropic", role: "Frontier Lab" },
  { slug: "google-deepmind", name: "Google DeepMind", href: "/labs/google-deepmind", role: "Research Lab" },
  { slug: "meta-ai", name: "Meta AI", href: "/labs/meta-ai", role: "Open Weights" },
  { slug: "mistral-ai", name: "Mistral AI", href: "/labs/mistral-ai", role: "Efficiency & Code" },
  { slug: "deepseek", name: "DeepSeek", href: "/labs/deepseek", role: "Reasoning Lab" },
  { slug: "cohere", name: "Cohere", href: "/labs/cohere", role: "Enterprise AI" },
  { slug: "xai", name: "xAI", href: "/labs/xai", role: "Frontier Lab" },
  { slug: "qwen-alibaba", name: "Qwen", href: "/labs/qwen-alibaba", role: "Open Foundation" },
  { slug: "groq", name: "Groq LPU", href: "/providers/groq", role: "Ultra-Fast Host" },
  { slug: "aws-bedrock", name: "AWS Bedrock", href: "/providers/aws-bedrock", role: "Enterprise Cloud" },
  { slug: "azure-openai", name: "Azure AI", href: "/providers/azure-openai", role: "Global Cloud" },
  { slug: "fireworks-ai", name: "Fireworks AI", href: "/providers/fireworks-ai", role: "Low Latency" },
  { slug: "together-ai", name: "Together AI", href: "/providers/together-ai", role: "Serverless Compute" },
];

export function LogoMarquee() {
  return (
    <section className="py-8 sm:py-10 border-b border-border/40 overflow-hidden relative" aria-label="Supported AI Labs and Cloud Providers">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-5 text-center">
        <p className="text-2xs sm:text-xs font-bold uppercase tracking-widest text-muted-foreground">
          Benchmarked & Evaluated Across Frontier Research Labs & Cloud Infrastructures
        </p>
      </div>

      {/* Marquee with left & right gradient fade masks */}
      <div className="relative w-full overflow-hidden mask-edge-fade">
        <div className="animate-marquee gap-8 sm:gap-12 items-center py-2">
          {/* Double array for seamless infinite looping */}
          {[...PARTNERS, ...PARTNERS].map((partner, idx) => (
            <Link
              key={`${partner.slug}-${idx}`}
              href={partner.href}
              className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl border border-border/50 bg-card/50 hover:bg-card hover:border-primary/40 transition-all shrink-0 group shadow-2xs"
            >
              <BrandLogo
                slug={partner.slug}
                name={partner.name}
                size="xs"
                variant="icon"
                className="transition-transform group-hover:scale-110"
              />
              <div className="text-left">
                <span className="text-xs font-bold text-foreground/90 group-hover:text-primary transition-colors block leading-tight">
                  {partner.name}
                </span>
                <span className="text-[10px] text-muted-foreground block font-medium">
                  {partner.role}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
