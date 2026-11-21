import { describe, it, expect } from "vitest";

describe("compare winner logic", () => {
  const models = [
    {
      slug: "gpt-4o",
      name: "GPT-4o",
      contextWindow: 128000,
      minInputPrice: 2.5,
      latencyMs: 380,
      throughputTps: 85,
    },
    {
      slug: "claude-3-5-sonnet",
      name: "Claude 3.5 Sonnet",
      contextWindow: 200000,
      minInputPrice: 3.0,
      latencyMs: 450,
      throughputTps: 75,
    },
    {
      slug: "deepseek-v3",
      name: "DeepSeek-V3",
      contextWindow: 128000,
      minInputPrice: 0.14,
      latencyMs: 400,
      throughputTps: 70,
    },
  ];

  it("identifies cheapest model correctly", () => {
    let minPrice = Infinity;
    let cheapestSlug = "";
    for (const m of models) {
      if (m.minInputPrice < minPrice) {
        minPrice = m.minInputPrice;
        cheapestSlug = m.slug;
      }
    }
    expect(cheapestSlug).toBe("deepseek-v3");
    expect(minPrice).toBe(0.14);
  });

  it("identifies model with largest context window", () => {
    let maxContext = -1;
    let largestSlug = "";
    for (const m of models) {
      if (m.contextWindow > maxContext) {
        maxContext = m.contextWindow;
        largestSlug = m.slug;
      }
    }
    expect(largestSlug).toBe("claude-3-5-sonnet");
    expect(maxContext).toBe(200000);
  });

  it("identifies fastest latency (lowest TTFT)", () => {
    let minLatency = Infinity;
    let fastestSlug = "";
    for (const m of models) {
      if (m.latencyMs < minLatency) {
        minLatency = m.latencyMs;
        fastestSlug = m.slug;
      }
    }
    expect(fastestSlug).toBe("gpt-4o");
    expect(minLatency).toBe(380);
  });
});
