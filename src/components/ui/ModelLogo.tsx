import React from "react";
import { cn } from "@/lib/utils";

interface ModelLogoProps {
  labSlug?: string;
  modelSlug?: string;
  providerSlug?: string;
  name?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
}

export function ModelLogo({
  labSlug,
  modelSlug,
  providerSlug,
  name,
  size = "md",
  className,
}: ModelLogoProps) {
  // Normalize key to find matching brand
  const key = (labSlug || providerSlug || modelSlug || "").toLowerCase();

  const sizeClasses = {
    xs: "h-5 w-5 min-w-5 rounded-md text-[10px]",
    sm: "h-7 w-7 min-w-7 rounded-lg text-xs",
    md: "h-9 w-9 min-w-9 rounded-xl text-sm",
    lg: "h-12 w-12 min-w-12 rounded-2xl text-lg",
    xl: "h-16 w-16 min-w-16 rounded-3xl text-2xl",
  };

  const iconSizes = {
    xs: 12,
    sm: 16,
    md: 20,
    lg: 28,
    xl: 36,
  };

  const px = iconSizes[size];

  // Helper renderer for each official AI lab / provider
  const renderIcon = () => {
    // 1. OpenAI
    if (key.includes("openai") || key.startsWith("gpt") || key.startsWith("o1") || key.startsWith("dall")) {
      return (
        <div className="flex h-full w-full items-center justify-center bg-[#10a37f]/10 text-[#10a37f] border border-[#10a37f]/25 dark:bg-[#10a37f]/15">
          <svg
            width={px}
            height={px}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-emerald-500 dark:text-[#10a37f]"
          >
            <path d="M12 2a4.5 4.5 0 0 0-4.4 3.5A4.5 4.5 0 0 0 4 10a4.5 4.5 0 0 0 .9 2.9A4.5 4.5 0 0 0 4 16a4.5 4.5 0 0 0 3.6 4.4A4.5 4.5 0 0 0 12 22a4.5 4.5 0 0 0 4.4-3.5A4.5 4.5 0 0 0 20 14a4.5 4.5 0 0 0-.9-2.9A4.5 4.5 0 0 0 20 8a4.5 4.5 0 0 0-3.6-4.4A4.5 4.5 0 0 0 12 2Z" />
            <path d="M12 8v8" />
            <path d="m8.5 10 7 4" />
            <path d="m8.5 14 7-4" />
          </svg>
        </div>
      );
    }

    // 2. Anthropic / Claude
    if (key.includes("anthropic") || key.includes("claude")) {
      return (
        <div className="flex h-full w-full items-center justify-center bg-[#d97757]/10 text-[#d97757] border border-[#d97757]/25 dark:bg-[#d97757]/15">
          <svg
            width={px}
            height={px}
            viewBox="0 0 24 24"
            fill="currentColor"
            className="text-[#d97757]"
          >
            <path d="M17.3 3.5H13l-6.8 17h3.7l1.4-3.7h5.4l1.4 3.7h3.7L17.3 3.5zm-5 10.3 2-5.4 2 5.4h-4z" />
          </svg>
        </div>
      );
    }

    // 3. Google DeepMind / Gemini / Gemma
    if (key.includes("google") || key.includes("deepmind") || key.includes("gemini") || key.includes("gemma")) {
      return (
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-tr from-blue-500/15 via-indigo-500/15 to-purple-500/15 border border-indigo-500/25">
          <svg
            width={px}
            height={px}
            viewBox="0 0 24 24"
            fill="none"
            className="text-indigo-400"
          >
            <path
              d="M12 2C12 7.52285 7.52285 12 2 12C7.52285 12 12 16.4771 12 22C12 16.4771 16.4771 12 22 12C16.4771 12 12 7.52285 12 2Z"
              fill="url(#gemini-grad)"
            />
            <defs>
              <linearGradient id="gemini-grad" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                <stop stopColor="#38bdf8" />
                <stop offset="0.5" stopColor="#818cf8" />
                <stop offset="1" stopColor="#c084fc" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      );
    }

    // 4. Meta AI / Llama
    if (key.includes("meta") || key.includes("llama")) {
      return (
        <div className="flex h-full w-full items-center justify-center bg-[#0081fb]/10 text-[#0081fb] border border-[#0081fb]/25 dark:bg-[#0081fb]/15">
          <svg
            width={px}
            height={px}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-[#0081fb]"
          >
            <path d="M6 16c-3-3-3-6 0-9 2-2 4 0 6 5 2-5 4-7 6-5 3 3 3 6 0 9-2 2-4 0-6-5-2 5-4 7-6 5Z" />
          </svg>
        </div>
      );
    }

    // 5. Mistral AI / Codestral
    if (key.includes("mistral") || key.includes("codestral")) {
      return (
        <div className="flex h-full w-full items-center justify-center bg-[#ff7000]/10 text-[#ff7000] border border-[#ff7000]/25 dark:bg-[#ff7000]/15">
          <svg
            width={px}
            height={px}
            viewBox="0 0 24 24"
            fill="currentColor"
            className="text-[#ff7000]"
          >
            <path d="M3 4h4v4H3V4zm5 4h4v4H8V8zm5 4h4v4h-4v-4zm5 4h4v4h-4v-4zM3 16h4v4H3v-4zm15-8h4v4h-4V8z" />
          </svg>
        </div>
      );
    }

    // 6. DeepSeek
    if (key.includes("deepseek")) {
      return (
        <div className="flex h-full w-full items-center justify-center bg-[#1d4ed8]/10 text-[#3b82f6] border border-[#3b82f6]/25 dark:bg-[#1d4ed8]/20">
          <svg
            width={px}
            height={px}
            viewBox="0 0 24 24"
            fill="currentColor"
            className="text-[#3b82f6]"
          >
            <path d="M12 3C7 3 3 7 3 12c0 3 1.5 5.5 3.8 7.1L6 21l3-1.2c1 .4 2 .6 3 .6 5 0 9-4 9-8.4C21 7.2 17 3 12 3zm3.5 10.5c-.8.8-2 1.3-3.5 1.3s-2.7-.5-3.5-1.3l1.1-1.1c.6.6 1.4.9 2.4.9s1.8-.3 2.4-.9l1.1 1.1z" />
          </svg>
        </div>
      );
    }

    // 7. xAI / Grok
    if (key.includes("xai") || key.includes("grok")) {
      return (
        <div className="flex h-full w-full items-center justify-center bg-black/40 text-foreground border border-border">
          <span className="font-mono font-black tracking-tighter text-white">
            xAI
          </span>
        </div>
      );
    }

    // 8. Qwen (Alibaba)
    if (key.includes("qwen") || key.includes("alibaba")) {
      return (
        <div className="flex h-full w-full items-center justify-center bg-[#ff6a00]/10 text-[#ff6a00] border border-[#ff6a00]/25 dark:bg-[#ff6a00]/15">
          <svg
            width={px}
            height={px}
            viewBox="0 0 24 24"
            fill="currentColor"
            className="text-[#ff6a00]"
          >
            <path d="M12 2L3 7v10l9 5 9-5V7l-9-5zm0 2.3l6.7 3.7-3 1.7-6.7-3.7 3-1.7zm-8 4.6l7 3.9v7.4l-7-3.9V8.9zm16 7.4l-7 3.9v-7.4l7-3.9v7.4z" />
          </svg>
        </div>
      );
    }

    // 9. Cohere
    if (key.includes("cohere") || key.includes("command")) {
      return (
        <div className="flex h-full w-full items-center justify-center bg-[#39594d]/10 text-[#39594d] border border-[#39594d]/25 dark:bg-[#d8c3b4]/15">
          <svg
            width={px}
            height={px}
            viewBox="0 0 24 24"
            fill="currentColor"
            className="text-[#39594d] dark:text-[#d8c3b4]"
          >
            <circle cx="8" cy="8" r="4" />
            <circle cx="16" cy="8" r="4" />
            <circle cx="12" cy="16" r="5" />
          </svg>
        </div>
      );
    }

    // 10. Groq (Provider)
    if (key.includes("groq")) {
      return (
        <div className="flex h-full w-full items-center justify-center bg-[#f55036]/10 text-[#f55036] border border-[#f55036]/25 dark:bg-[#f55036]/15">
          <span className="font-extrabold tracking-tighter text-[#f55036]">
            G
          </span>
        </div>
      );
    }

    // 11. Together AI (Provider)
    if (key.includes("together")) {
      return (
        <div className="flex h-full w-full items-center justify-center bg-blue-500/10 text-blue-500 border border-blue-500/25">
          <svg
            width={px}
            height={px}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            className="text-blue-500"
          >
            <circle cx="9" cy="12" r="5" />
            <circle cx="15" cy="12" r="5" />
          </svg>
        </div>
      );
    }

    // 12. Fireworks AI (Provider)
    if (key.includes("fireworks")) {
      return (
        <div className="flex h-full w-full items-center justify-center bg-amber-500/10 text-amber-500 border border-amber-500/25">
          <svg
            width={px}
            height={px}
            viewBox="0 0 24 24"
            fill="currentColor"
            className="text-amber-500"
          >
            <path d="M12 2l2.4 6.9 7.1.3-5.5 4.5 1.8 7-5.8-4.2-5.8 4.2 1.8-7-5.5-4.5 7.1-.3z" />
          </svg>
        </div>
      );
    }

    // 13. AWS Bedrock (Provider)
    if (key.includes("bedrock") || key.includes("aws")) {
      return (
        <div className="flex h-full w-full items-center justify-center bg-[#ff9900]/10 text-[#ff9900] border border-[#ff9900]/25">
          <svg
            width={px}
            height={px}
            viewBox="0 0 24 24"
            fill="currentColor"
            className="text-[#ff9900]"
          >
            <path d="M18.8 17.5c-2.4 1.8-5.8 2.8-8.8 2.8-4.2 0-8-1.5-10.9-4-.2-.2 0-.5.3-.3 3.1 1.8 7 2.8 10.9 2.8 2.7 0 5.6-.8 8.2-2.3.4-.3.7.1.3.5zm1.5-1.5c-.3-.4-2-.2-3.1 0-.3 0-.4-.2-.1-.4 1.8-1.3 4.7-.9 5 .1.2.9-.6 3.7-2.3 5.1-.3.2-.5.1-.4-.2.4-1.1 1.2-4.1.9-4.6z" />
          </svg>
        </div>
      );
    }

    // 14. Azure OpenAI (Provider)
    if (key.includes("azure")) {
      return (
        <div className="flex h-full w-full items-center justify-center bg-[#0078d4]/10 text-[#0078d4] border border-[#0078d4]/25">
          <svg
            width={px}
            height={px}
            viewBox="0 0 24 24"
            fill="currentColor"
            className="text-[#0078d4]"
          >
            <path d="M13 3l-8 14h6l2 4 8-18z" />
          </svg>
        </div>
      );
    }

    // Fallback: Elegant Monogram Badge
    const initial = (name || labSlug || modelSlug || "M").charAt(0).toUpperCase();
    return (
      <div className="flex h-full w-full items-center justify-center bg-accent text-accent-foreground font-black border border-border">
        {initial}
      </div>
    );
  };

  return (
    <div
      className={cn(
        "inline-flex shrink-0 items-center justify-center overflow-hidden shadow-2xs select-none",
        sizeClasses[size],
        className
      )}
      title={name || labSlug || modelSlug}
    >
      {renderIcon()}
    </div>
  );
}
