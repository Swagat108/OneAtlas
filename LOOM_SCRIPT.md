# Loom Presentation Script — OneAtlas (5-10 Minutes)

> Use this comprehensive script outline to deliver a confident, high-impact walkthrough of your architectural decisions, engineering execution, database design, and key features.

---

## ⏱️ Video Timeline Overview

| Section | Timestamp | Focus Area |
|---|---|---|
| **1. Introduction & Motivation** | `0:00 - 1:00` | Problem statement, what OneAtlas is, inspired by OpenRouter/LiteLLM |
| **2. System Architecture** | `1:00 - 2:30` | Layered backend, Next.js App Router, Zod validation, TanStack Query |
| **3. Database Design & Schema** | `2:30 - 4:00` | Normalized Postgres schema, Decimal pricing, asymmetric modalities, compound indexes |
| **4. Feature Walkthrough & Demo** | `4:00 - 6:30` | Live demo of Catalog, Matrix Compare, Leaderboards, Command Palette, Compare Tray |
| **5. Key Engineering Decisions** | `6:30 - 8:00` | URL search params as single source of truth, Neon pooling, ADR log |
| **6. Challenges & Reliability** | `8:00 - 9:00` | Type safety, Vitest unit testing, pagination and N+1 prevention |
| **7. Future Improvements & Closing** | `9:00 - 10:00` | Live latency pingers, Redis rate limiting, user saved lists |

---

## 🎙️ Step-by-Step Speaking Script

### 1. Introduction & Motivation (0:00 - 1:00)
- **Visual:** Landing Page (`http://localhost:3000`)
- **Script:**
  > *"Hi everyone, today I'm presenting **OneAtlas**, an AI model discovery and intelligence platform designed for developers, AI engineers, and researchers to discover, compare, and evaluate foundation models across hosting providers.*
  >
  > *With models launching weekly across OpenAI, Anthropic, Meta, DeepSeek, and Google, developers face two major challenges: **fragmented pricing economics** across cloud hosts like Groq, Together, and Bedrock, and **inconsistent benchmark evaluations**.*
  >
  > *Inspired by platforms like OpenRouter and LiteLLM, OneAtlas provides a single pane of glass for verified benchmark intelligence, token economics, context limits, and latency metrics—with 100% of the data driven by a normalized PostgreSQL database."*

---

### 2. System Architecture (1:00 - 2:30)
- **Visual:** Show `README.md` Mermaid Architecture Diagram or IDE folder structure (`src/`)
- **Script:**
  > *"To ensure reliability and clean maintainability, I followed a strict **4-layer decoupled architecture**:*
  > 
  > 1. *First, the **HTTP Route Handlers** (`src/app/api/**/route.ts`). They handle pure HTTP responsibilities: parsing search params, setting cache headers, and delegating to services.*
  > 2. *Second, **Zod Schema Validation** (`src/schemas/`). Every query parameter—from pagination bounds to filter arrays—is validated and sanitized before any business logic executes.*
  > 3. *Third, the **Service Layer** (`src/services/`). This contains pure, testable domain logic: computing winning model specs in comparisons, normalizing benchmark scores across differing scales, and aggregating multi-entity search results.*
  > 4. *Fourth, the **Repository Layer** (`src/repositories/`). Centralized Prisma queries that prevent N+1 queries using targeted includes and selects.*
  >
  > *On the frontend, we use Next.js App Router with Server Components for static SEO and Client Components with TanStack Query for interactive filtering."*

---

### 3. Database Design & Schema Walkthrough (2:30 - 4:00)
- **Visual:** Show `prisma/schema.prisma` and the ER diagram in `README.md`
- **Script:**
  > *"Let's look at the database schema designed in Prisma for PostgreSQL:*
  >
  > - ***Precision Token Pricing:** Token prices are stored as `Decimal(10, 4)` rather than floating-point numbers. When prices are fractions of a cent (e.g. $0.075 per 1M tokens on Gemini Flash), IEEE-754 floats introduce rounding bugs. Decimal guarantees exact currency arithmetic.*
  > - ***Asymmetric Modalities:** Rather than a flat tags array, we created separate `ModelInputModality` and `ModelOutputModality` join tables. This accurately models asymmetric models like Vision models that accept images as input but only output text.*
  > - ***Multi-Provider Rate Cards:** The `ModelProvider` junction table records provider-specific prices, latency (TTFT in ms), and throughput (tokens/sec). For instance, Llama 3.1 70B has distinct pricing and speed on Groq vs. Together AI vs. AWS Bedrock.*
  > - ***Indexing Strategy:** We applied compound and B-tree indexes across frequently filtered dimensions: `slug`, `labId`, `releaseDate`, `contextWindow`, and provider pricing.*
  > - ***Seed Data:** Our seed script populates 40+ realistic models across 9 labs and 9 providers, with verified scores across 10 benchmarks."*

---

### 4. Key Feature Walkthrough & Live Demo (4:00 - 6:30)
- **Visual:** Switch to live browser tabs

#### Feature A: Discovery Catalog (`/models`)
> *"On the catalog page, users can filter across 40+ models by research lab, model type, license, context window (up to 2M tokens), and capabilities like function calling and vision. Notice that every filter and sort selection instantly updates the URL search parameters—meaning filtered views are completely bookmarkable and shareable."*

#### Feature B: Floating Compare Tray
> *"Notice this floating Compare Dock at the bottom. Across any page—whether the catalog, a lab profile, or model detail—clicking 'Compare' adds that model to a local dock limited to 4 models, persisted in localStorage. When ready, clicking 'Compare Now' opens the side-by-side matrix."*

#### Feature C: Comparison Matrix (`/compare?models=...`)
> *"In the comparison matrix, OneAtlas automatically highlights winning specs: the cheapest price per 1M tokens with a green badge, the largest context window, and the highest benchmark score across every evaluation category. You can also click 'Share Comparison' to copy the URL."*

#### Feature D: Benchmark Leaderboards (`/rankings`)
> *"The Leaderboards page allows filtering by benchmark categories: Coding, Reasoning, Math, Agentic, and Multimodal. Notice the normalized score bars: whether a benchmark is 0-100% like HumanEval or an Elo rating like Chatbot Arena, scores are normalized for uniform visual comparison while displaying the raw score."*

#### Feature E: Global Command Palette (`Cmd+K`)
> *"Pressing `Cmd+K` anywhere opens a fast search modal that performs debounced, multi-entity search across models, labs, and providers simultaneously."*

---

### 5. Technical Decisions & Trade-offs (6:30 - 8:00)
- **Visual:** Show `DECISIONS.md`
- **Script:**
  > *"Every architectural choice was documented in our running `DECISIONS.md`:*
  >
  > - ***URL as Single Source of Truth:** Rather than storing filter state in complex React state or Redux, we treat the URL search params as the single source of truth. TanStack Query keys are derived directly from `searchParams.toString()`, eliminating state drift and providing native browser back/forward history support.*
  > - ***Neon Dual-Connection Strategy:** Serverless Vercel functions use Neon's PgBouncer pooler (`DATABASE_URL` on port 6543) to prevent connection pool exhaustion, while Prisma schema migrations use the direct connection string (`DIRECT_URL` on port 5432).*
  > - ***Client vs Server Component Boundary:** Marketing and detail headers are server components for fast TTFB and SEO, while the filter drawer and compare dock are lightweight client components."*

---

### 6. Challenges & Reliability (8:00 - 9:00)
- **Visual:** Show terminal running `npm test` and `npx tsc --noEmit`
- **Script:**
  > *"A key engineering challenge was ensuring strict type safety and zero floating point bugs between Prisma Decimals, Zod schemas, and client UI components. We solved this with a centralized utility layer and built unit test suites with Vitest covering our Zod schemas, error classes, and comparison normalization logic.*
  >
  > *All tests pass and the TypeScript compiler runs with zero errors in strict mode."*

---

### 7. Future Improvements & Closing (9:00 - 10:00)
- **Visual:** Return to Landing Page
- **Script:**
  > *"Looking ahead, future improvements planned in our ADR include:*
  > 1. ***Live synthetic latency probes:** Actively pinging provider inference APIs every 5 minutes to show 99th-percentile real-time latency graphs.*
  > 2. ***Edge rate limiting:** Adding Upstash Redis middleware to protect search and model endpoints from abusive scraping.*
  > 3. ***User saved lists & API cost calculator:** Allowing developers to input their monthly token volume and calculate projected costs across each provider.*
  >
  > *Thank you for watching, and feel free to explore the repository and live demo!"*
