import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines Tailwind class names safely resolving conflicts
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a number as USD currency with variable precision
 * e.g. 0.005 -> $0.0050, 1.5 -> $1.50
 */
export function formatCurrency(
  amount: number | string | { toString: () => string } | null | undefined,
  minimumFractionDigits = 2,
  maximumFractionDigits = 4
): string {
  if (amount === null || amount === undefined) return "N/A";
  const num = typeof amount === "number" ? amount : parseFloat(amount.toString());
  if (isNaN(num)) return "N/A";

  if (num === 0) return "$0.00";

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(num);
}

/**
 * Formats token counts into human-readable strings (e.g. 128000 -> 128K, 1000000 -> 1M)
 */
export function formatTokenCount(tokens: number | null | undefined): string {
  if (tokens === null || tokens === undefined) return "N/A";
  if (tokens >= 1_000_000) {
    const m = tokens / 1_000_000;
    return `${m % 1 === 0 ? m : m.toFixed(1)}M`;
  }
  if (tokens >= 1_000) {
    const k = tokens / 1_000;
    return `${k % 1 === 0 ? k : k.toFixed(0)}K`;
  }
  return tokens.toLocaleString();
}

/**
 * Formats benchmark score with proper rounding
 */
export function formatScore(score: number | null | undefined, maxScore = 100): string {
  if (score === null || score === undefined) return "N/A";
  if (maxScore === 100) {
    return `${score.toFixed(1)}%`;
  }
  return score.toFixed(1);
}

/**
 * Formats standard date into human readable string
 */
export function formatDate(date: string | Date | null | undefined): string {
  if (!date) return "N/A";
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    year: "numeric",
    day: "numeric",
  }).format(d);
}

/**
 * Converts a text string to URL slug
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
}
