import { describe, it, expect } from "vitest";
import { formatCurrency, formatTokenCount, formatScore, slugify } from "@/lib/utils";
import { AppError, NotFoundError, BadRequestError } from "@/lib/errors";

describe("lib/utils", () => {
  describe("formatCurrency", () => {
    it("formats standard amounts with currency symbol", () => {
      expect(formatCurrency(2.5)).toBe("$2.50");
      expect(formatCurrency(0.15)).toBe("$0.15");
      expect(formatCurrency(0)).toBe("$0.00");
    });

    it("handles null or undefined safely", () => {
      expect(formatCurrency(null)).toBe("N/A");
      expect(formatCurrency(undefined)).toBe("N/A");
    });
  });

  describe("formatTokenCount", () => {
    it("formats thousands and millions accurately", () => {
      expect(formatTokenCount(128000)).toBe("128K");
      expect(formatTokenCount(1000000)).toBe("1M");
      expect(formatTokenCount(2000000)).toBe("2M");
      expect(formatTokenCount(4096)).toBe("4K");
      expect(formatTokenCount(500)).toBe("500");
    });

    it("handles null or undefined gracefully", () => {
      expect(formatTokenCount(null)).toBe("N/A");
      expect(formatTokenCount(undefined)).toBe("N/A");
    });
  });

  describe("formatScore", () => {
    it("formats percentage benchmarks correctly", () => {
      expect(formatScore(88.6)).toBe("88.6%");
    });

    it("formats non-percentage benchmarks (e.g. Elo)", () => {
      expect(formatScore(1285.4, 1500)).toBe("1285.4");
    });
  });

  describe("slugify", () => {
    it("creates clean URL slugs", () => {
      expect(slugify("GPT-4o Mini")).toBe("gpt-4o-mini");
      expect(slugify("Claude 3.5 Sonnet (New)")).toBe("claude-35-sonnet-new");
      expect(slugify("   DeepSeek-V2.5  ")).toBe("deepseek-v25");
    });
  });
});

describe("lib/errors", () => {
  it("creates custom AppError with correct status code", () => {
    const err = new AppError("Test error", "TEST_CODE", 418);
    expect(err.message).toBe("Test error");
    expect(err.code).toBe("TEST_CODE");
    expect(err.statusCode).toBe(418);
  });

  it("creates NotFoundError with 404 status", () => {
    const err = new NotFoundError("Model", "gpt-4o");
    expect(err.statusCode).toBe(404);
    expect(err.code).toBe("NOT_FOUND");
    expect(err.message).toContain("Model with identifier 'gpt-4o' was not found.");
  });

  it("creates BadRequestError with 400 status", () => {
    const err = new BadRequestError("Invalid payload", { field: "name" });
    expect(err.statusCode).toBe(400);
    expect(err.code).toBe("BAD_REQUEST");
    expect(err.details).toEqual({ field: "name" });
  });
});
