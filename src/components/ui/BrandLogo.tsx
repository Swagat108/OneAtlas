"use client";

import React, { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

export interface BrandLogoProps {
  slug?: string;
  name?: string;
  logoUrl?: string | null;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  variant?: "icon" | "avatar";
  className?: string;
  // Convenience aliases for flexible call sites
  labSlug?: string;
  providerSlug?: string;
  modelSlug?: string;
}

// Fixed dimensions to ensure absolute layout stability (0 layout shift)
const DIMENSIONS = {
  xs: { box: "h-5 w-5 min-w-5", px: 13, text: "text-[9px]" },
  sm: { box: "h-7 w-7 min-w-7", px: 18, text: "text-xs" },
  md: { box: "h-9 w-9 min-w-9", px: 22, text: "text-sm" },
  lg: { box: "h-12 w-12 min-w-12", px: 30, text: "text-base" },
  xl: { box: "h-16 w-16 min-w-16", px: 42, text: "text-xl" },
};

// High-contrast deterministic background colors for generated fallback initials avatars
const AVATAR_PALETTES = [
  "bg-blue-600 text-white",
  "bg-emerald-600 text-white",
  "bg-indigo-600 text-white",
  "bg-purple-600 text-white",
  "bg-amber-600 text-white",
  "bg-rose-600 text-white",
  "bg-cyan-700 text-white",
  "bg-slate-700 text-white",
];

// Helper to deterministically pick a color from the slug
function getInitialsColor(key: string): string {
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = (hash << 5) - hash + key.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % AVATAR_PALETTES.length;
  return AVATAR_PALETTES[index];
}

// Helper to generate initials from name (e.g. "Google DeepMind" -> "GD", "OpenAI" -> "OA")
function getInitials(name?: string, slug?: string): string {
  const source = name || slug || "AI";
  const words = source.trim().split(/[\s-_]+/);
  if (words.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  }
  return source.slice(0, 2).toUpperCase();
}

// Known monochrome logos that need dark:invert for dark mode contrast
const MONOCHROME_SLUGS = new Set([
  "openai",
  "openai-api",
  "anthropic",
  "anthropic-api",
  "groq",
  "xai",
  "grok",
]);

export function BrandLogo({
  slug,
  name,
  logoUrl,
  size = "md",
  variant = "avatar",
  className,
  labSlug,
  providerSlug,
  modelSlug,
}: BrandLogoProps) {
  const [hasError, setHasError] = useState(false);

  // Normalize key from slug or aliases
  const rawKey = (slug || labSlug || providerSlug || modelSlug || "").toLowerCase();
  
  // Resolve source from DB logoUrl, or fallback to standard /logos/<slug>.svg convention
  let resolvedUrl = logoUrl;
  if (!resolvedUrl && rawKey) {
    if (rawKey.includes("openai") || rawKey.startsWith("gpt") || rawKey.startsWith("o1")) {
      resolvedUrl = "/logos/openai.svg";
    } else if (rawKey.includes("anthropic") || rawKey.includes("claude")) {
      resolvedUrl = "/logos/anthropic.svg";
    } else if (rawKey.includes("deepmind") || rawKey.includes("gemini")) {
      resolvedUrl = "/logos/google-deepmind.svg";
    } else if (rawKey.includes("google") || rawKey.includes("vertex")) {
      resolvedUrl = "/logos/google-vertex-ai.svg";
    } else if (rawKey.includes("meta") || rawKey.includes("llama")) {
      resolvedUrl = "/logos/meta-ai.svg";
    } else if (rawKey.includes("mistral") || rawKey.includes("codestral")) {
      resolvedUrl = "/logos/mistral-ai.svg";
    } else if (rawKey.includes("deepseek")) {
      resolvedUrl = "/logos/deepseek.svg";
    } else if (rawKey.includes("cohere") || rawKey.includes("command")) {
      resolvedUrl = "/logos/cohere.svg";
    } else if (rawKey.includes("xai") || rawKey.includes("grok")) {
      resolvedUrl = "/logos/xai.svg";
    } else if (rawKey.includes("qwen") || rawKey.includes("alibaba")) {
      resolvedUrl = "/logos/qwen-alibaba.svg";
    } else if (rawKey.includes("groq")) {
      resolvedUrl = "/logos/groq.svg";
    } else if (rawKey.includes("together")) {
      resolvedUrl = "/logos/together-ai.svg";
    } else if (rawKey.includes("fireworks")) {
      resolvedUrl = "/logos/fireworks-ai.svg";
    } else if (rawKey.includes("bedrock") || rawKey.includes("aws")) {
      resolvedUrl = "/logos/aws-bedrock.svg";
    } else if (rawKey.includes("azure")) {
      resolvedUrl = "/logos/azure-openai.svg";
    } else if (rawKey.includes("copilot")) {
      resolvedUrl = "/logos/copilot.svg";
    } else if (rawKey.includes("microsoft")) {
      resolvedUrl = "/logos/microsoft.svg";
    }
  }

  const dim = DIMENSIONS[size];
  const displayName = name || slug || labSlug || providerSlug || modelSlug || "AI";
  const isMonochrome = MONOCHROME_SLUGS.has(rawKey) || rawKey.includes("openai") || rawKey.includes("anthropic") || rawKey.includes("groq") || rawKey.includes("xai");

  // Variant styling
  const variantStyles =
    variant === "avatar"
      ? "rounded-xl border border-border/80 bg-card/95 p-1 shadow-2xs dark:bg-muted/30"
      : "rounded-md p-0.5";

  // Fallback Initials Avatar (rendered when logoUrl is missing or image load triggers error)
  if (!resolvedUrl || hasError) {
    const palette = getInitialsColor(rawKey || displayName);
    return (
      <div
        className={cn(
          "inline-flex shrink-0 items-center justify-center font-bold tracking-tight select-none",
          dim.box,
          dim.text,
          variant === "avatar" ? "rounded-xl shadow-2xs" : "rounded-md",
          palette,
          className
        )}
        title={`${displayName} (Initials Avatar)`}
        aria-label={`${displayName} logo`}
      >
        {getInitials(name, rawKey)}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "inline-flex shrink-0 items-center justify-center overflow-hidden select-none transition-colors",
        dim.box,
        variantStyles,
        className
      )}
      title={displayName}
    >
      <Image
        src={resolvedUrl}
        alt={`${displayName} logo`}
        width={dim.px}
        height={dim.px}
        unoptimized
        onError={() => setHasError(true)}
        className={cn(
          "object-contain transition-opacity duration-200",
          isMonochrome && "dark:brightness-0 dark:invert"
        )}
      />
    </div>
  );
}

// Re-export as ModelLogo for backwards compatibility
export const ModelLogo = BrandLogo;
