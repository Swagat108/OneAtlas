import { describe, it, expect } from "vitest";
import { modelFilterQuerySchema } from "@/schemas/model.schema";
import { compareQuerySchema } from "@/schemas/compare.schema";
import { searchQuerySchema } from "@/schemas/search.schema";

describe("schemas/model.schema", () => {
  it("parses valid query with default pagination and sorting", () => {
    const result = modelFilterQuerySchema.parse({});
    expect(result.page).toBe(1);
    expect(result.limit).toBe(20);
    expect(result.sortBy).toBe("release_desc");
  });

  it("transforms comma-separated capabilities and modalities to arrays", () => {
    const result = modelFilterQuerySchema.parse({
      capabilities: "function-calling, vision, tool-use",
      modalities: "text, image",
    });
    expect(result.capabilities).toEqual(["function-calling", "vision", "tool-use"]);
    expect(result.modalities).toEqual(["text", "image"]);
  });

  it("coerces numerical inputs properly", () => {
    const result = modelFilterQuerySchema.parse({
      minPrice: "0.50",
      maxPrice: "5.00",
      minContext: "128000",
      page: "2",
      limit: "50",
    });
    expect(result.minPrice).toBe(0.5);
    expect(result.maxPrice).toBe(5);
    expect(result.minContext).toBe(128000);
    expect(result.page).toBe(2);
    expect(result.limit).toBe(50);
  });
});

describe("schemas/compare.schema", () => {
  it("successfully parses 2 to 4 comma-separated model slugs", () => {
    const result = compareQuerySchema.parse({
      slugs: "gpt-4o, claude-3-5-sonnet, gemini-1-5-pro",
    });
    expect(result.slugs).toEqual(["gpt-4o", "claude-3-5-sonnet", "gemini-1-5-pro"]);
  });

  it("rejects fewer than 2 model slugs", () => {
    expect(() => compareQuerySchema.parse({ slugs: "gpt-4o" })).toThrow();
  });

  it("rejects more than 4 model slugs", () => {
    expect(() =>
      compareQuerySchema.parse({
        slugs: "gpt-4o, claude-3-5-sonnet, gemini-1-5-pro, llama-3-1-405b, mistral-large-2",
      })
    ).toThrow();
  });
});

describe("schemas/search.schema", () => {
  it("validates search query string", () => {
    const result = searchQuerySchema.parse({ q: "llama", limit: "10" });
    expect(result.q).toBe("llama");
    expect(result.limit).toBe(10);
  });

  it("rejects empty query string", () => {
    expect(() => searchQuerySchema.parse({ q: "" })).toThrow();
  });
});
