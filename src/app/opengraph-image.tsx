import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "OneAtlas - AI Model Discovery & Intelligence Platform";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #090d16 0%, #0f172a 50%, #1e1b4b 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "space-between",
          padding: "80px",
          fontFamily: "sans-serif",
          color: "#ffffff",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "14px",
              background: "linear-gradient(135deg, #38bdf8 0%, #6366f1 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 10px 25px rgba(99, 102, 241, 0.4)",
            }}
          >
            <span style={{ fontSize: "28px" }}>🌐</span>
          </div>
          <span style={{ fontSize: "36px", fontWeight: 800, letterSpacing: "-0.03em" }}>
            OneAtlas
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px", maxWidth: "950px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px 18px",
              background: "rgba(99, 102, 241, 0.15)",
              border: "1px solid rgba(99, 102, 241, 0.3)",
              borderRadius: "9999px",
              color: "#a5b4fc",
              fontSize: "18px",
              fontWeight: 600,
              width: "fit-content",
            }}
          >
            <span>⚡ AI Model Intelligence & Price Transparency Engine</span>
          </div>
          <h1
            style={{
              fontSize: "56px",
              fontWeight: 900,
              lineHeight: 1.15,
              letterSpacing: "-0.03em",
              margin: 0,
              background: "linear-gradient(to right, #ffffff, #cbd5e1)",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            Discover, Compare & Benchmark Frontier AI Models
          </h1>
          <p style={{ fontSize: "24px", color: "#94a3b8", lineHeight: 1.4, margin: 0 }}>
            Real-world token economics, verified benchmarks, and provider rate cards across OpenAI, Anthropic, Meta, and Google.
          </p>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            borderTop: "1px solid rgba(255, 255, 255, 0.1)",
            paddingTop: "24px",
            color: "#64748b",
            fontSize: "20px",
          }}
        >
          <span>oneatlas.dev</span>
          <span>100% PostgreSQL & REST API Driven</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
