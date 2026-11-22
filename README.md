# OneAtlas

Developer-first AI model discovery, intelligence, and comparison platform.

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=flat&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18.3-blue?style=flat&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8?style=flat&logo=tailwindcss)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-5.22-2d3748?style=flat&logo=prisma)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?style=flat&logo=postgresql)](https://www.postgresql.org/)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?style=flat&logo=vercel)](https://vercel.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

* **Live Application:** [https://oneatlas.vercel.app](https://oneatlas.vercel.app) *(or your deployed production URL)*
* **GitHub Repository:** [https://github.com/Swagat108/OneAtlas](https://github.com/Swagat108/OneAtlas)

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Database Design](#database-design)
- [API Reference](#api-reference)
- [Data Sources and Methodology](#data-sources-and-methodology)

---

## Overview

OneAtlas is an independent intelligence platform built for developers, AI engineers, and researchers to discover, evaluate, and compare foundation AI models across multiple cloud inference providers. 

Modern AI engineering faces significant pricing fragmentation across cloud hosts (Groq, Together AI, AWS Bedrock, Azure) and non-standardized benchmark reporting. OneAtlas resolves this by aggregating verified technical specifications, normalized per-million-token pricing economics, and standardized evaluation benchmarks into a single, unified database interface. 100% of data is served from a relational PostgreSQL database through type-safe REST API route handlers.

---

## Features

### Discovery and Multi-Faceted Search
- Real-time text search across model names, research labs, and cloud hosting providers.
- Multi-dimensional filtering by research lab, provider, model architecture type (LLM, Multimodal), license (Open Weights, Proprietary), and capabilities (Function Calling, Vision, Reasoning).
- Sorting by input price, output price, context window length, and release date.
- Deep linking: filter, sort, search, and pagination state synchronize directly with URL query parameters for bookmarkable, shareable states.

### Model Detail Intelligence
- Comprehensive architectural breakdowns: parameter counts, maximum output limits, context window sizes, and licensing.
- Input and output pricing breakdowns normalized to USD per 1,000,000 tokens.
- Per-provider hosting comparison showing distinct rate cards, TTFT latency (ms), and TPS throughput.
- Interactive token cost forecasting slider allowing engineering teams to calculate monthly inference expenditures.

### Side-by-Side Comparison Matrix
- Compare between 2 and 4 models simultaneously in a unified matrix.
- Automatic winner identification highlighting lowest price, highest context window, lowest latency, and best benchmark scores.
- Two-dimensional sticky table architecture: column headers remain pinned vertically while model spec names stay pinned horizontally.
- Persistent comparison dock (Compare Tray) stored locally across catalog navigation.

### Benchmarks and Leaderboards
- Normalized leaderboards across standardized evaluations: Chatbot Arena Elo, MMLU-Pro, HumanEval, MATH-500, GPQA Diamond, IFEval, and SWE-bench Verified.
- Category filters for Coding, Reasoning, Mathematics, Knowledge, Multimodal, and Agentic benchmarks.
- Proportional score bars calibrated to each benchmark's upper bound with raw score precision.

### Lab and Provider Directories
- Dedicated profiles for AI research organizations (OpenAI, Anthropic, Meta AI, Google DeepMind, Mistral AI, Microsoft).
- Chronological release timelines displaying model evolution over time.
- Cloud hosting provider profiles with regional coverage and active model counts.

### Platform Experience
- Universal Command Palette (`Cmd+K` / `Ctrl+K`) accessible across all pages with debounced global search.
- Responsive mobile bottom-sheet drawer with badge counts and scroll locking.
- WCAG AA accessibility: high contrast ratios, visible focus rings, ARIA landmark roles, and "Skip to content" skip link.
- Skeleton loaders matching final layout shapes to guarantee zero Cumulative Layout Shift (CLS < 0.1).

---

## Tech Stack

| Layer | Technology | Rationale |
|---|---|---|
| **Frontend Framework** | Next.js 14 (App Router) | Server Components for SEO and fast initial paint; Client Components for dynamic filters. |
| **Language** | TypeScript 5.6 (Strict) | End-to-end static typing across database schemas, API responses, and React components. |
| **Styling** | TailwindCSS 3.4 | Utility-first styling with centralized design tokens and native dark/light mode support. |
| **Client State & Cache** | TanStack React Query v5 | Server state caching, background refetching, and query deduplication tied to URL search parameters. |
| **Database** | PostgreSQL 16 (Neon Serverless) | ACID compliance, transactional integrity, JSONB support, and serverless pooling. |
| **ORM** | Prisma 5.22 | Type-safe query building, declarative schema migrations, and relational cascading rules. |
| **Data Validation** | Zod 3.23 | Single source of truth for runtime API request parsing and environment variable validation. |
| **Icons & Branding** | Lucide React + @lobehub/icons | Lightweight, accessible SVG icons and vector logos for AI labs and providers. |
| **Unit Testing** | Vitest 2.1 | Fast, Vite-powered ESM test runner with TypeScript transformation out-of-the-box. |
| **Deployment** | Vercel | Edge-optimized deployment platform with automated GitHub CI/CD and serverless functions. |

---

## Architecture

OneAtlas follows a strict four-layer decoupled architecture to enforce separation of concerns and prevent business logic from leaking into UI components.

```mermaid
flowchart TD
    subgraph Client["Client Tier (Next.js 14 App Router)"]
        UI["UI Components (Tailwind CSS)"]
        URL["URL Search Params (Single Source of Truth)"]
        RQ["TanStack React Query (Cache & State)"]
        TRAY["Compare Tray (LocalStorage Dock)"]
        CMD["Command Palette (Cmd+K Modal)"]
    end

    subgraph API["Backend API Tier (Next.js Route Handlers)"]
        RH["Route Handlers (src/app/api/**)"]
        CRON["Protected Ingest Cron (/api/cron/ingest)"]
        ZOD["Zod Schema Validation (src/schemas/**)"]
        SVC["Service Layer (src/services/**)"]
        REPO["Repository Layer (src/repositories/**)"]
    end

    subgraph Database["Database Tier (PostgreSQL)"]
        POOL["Neon PgBouncer Connection Pooler (:6543)"]
        DIRECT["Direct Migration Endpoint (:5432)"]
        PG[("PostgreSQL Database")]
    end

    subgraph Pipeline["Ingestion & Verification Pipeline"]
        INGEST["scripts/verify-sources.ts"]
        OPENROUTER["OpenRouter Public API"]
        HF["Hugging Face Hub & Datasets"]
        LMSYS["LMSYS Arena Leaderboards"]
    end

    UI --> URL
    URL --> RQ
    RQ -->|HTTP GET /api/*| RH
    RH --> ZOD
    ZOD --> SVC
    SVC --> REPO
    REPO -->|DATABASE_URL| POOL
    POOL --> PG
    REPO -.->|DIRECT_URL| DIRECT
    DIRECT -.-> PG
    CRON -->|Protected Scheduled Sync| PG

    INGEST --> OPENROUTER
    INGEST --> HF
    INGEST --> LMSYS
    INGEST -->|Idempotent Upsert| PG
```

### Layer Responsibilities
1. **Route Handlers (`src/app/api/**/route.ts`):** Handle HTTP transport, parse headers, extract query parameters, set cache control headers, and return standardized JSON envelopes.
2. **Schema Validation (`src/schemas/**.ts`):** Validate incoming query bounds, types, and defaults using Zod before business logic executes.
3. **Service Layer (`src/services/**.ts`):** Pure, framework-agnostic domain logic (computing comparison winners, normalizing benchmark scales, aggregating search entities).
4. **Repository Layer (`src/repositories/**.ts`):** Encapsulated database operations using Prisma Client with compound `select` and `include` to eliminate N+1 queries.

---

## Database Design

```mermaid
erDiagram
    LAB ||--o{ MODEL : "develops"
    MODEL ||--|{ MODEL_INPUT_MODALITY : "accepts"
    MODALITY ||--|{ MODEL_INPUT_MODALITY : "is input"
    MODEL ||--|{ MODEL_OUTPUT_MODALITY : "produces"
    MODALITY ||--|{ MODEL_OUTPUT_MODALITY : "is output"
    MODEL ||--|{ MODEL_CAPABILITY : "exhibits"
    CAPABILITY ||--|{ MODEL_CAPABILITY : "belongs to"
    MODEL ||--|{ MODEL_PROVIDER : "hosted by"
    PROVIDER ||--|{ MODEL_PROVIDER : "hosts"
    MODEL ||--o{ BENCHMARK_SCORE : "evaluated on"
    BENCHMARK ||--o{ BENCHMARK_SCORE : "rates"
    MODEL ||--o{ MODEL_ALIAS : "identified as"

    LAB {
        string id PK
        string slug UK
        string name
        string description
        string website
        string country
        int foundedYear
        datetime createdAt
        datetime updatedAt
    }

    MODEL {
        string id PK
        string slug UK
        string name
        string labId FK
        string description
        enum modelType
        datetime releaseDate
        int contextWindow
        int maxOutputTokens
        string parameterCount
        enum license
        enum status
        string architecture
        string huggingFaceUrl
        string paperUrl
        datetime createdAt
        datetime updatedAt
    }

    MODALITY {
        string id PK
        string slug UK
        string name
        string description
    }

    MODEL_INPUT_MODALITY {
        string modelId PK,FK
        string modalityId PK,FK
    }

    MODEL_OUTPUT_MODALITY {
        string modelId PK,FK
        string modalityId PK,FK
    }

    CAPABILITY {
        string id PK
        string slug UK
        string name
        string description
    }

    MODEL_CAPABILITY {
        string modelId PK,FK
        string capabilityId PK,FK
    }

    PROVIDER {
        string id PK
        string slug UK
        string name
        string website
        string[] regions
        string description
        string logoUrl
        datetime createdAt
        datetime updatedAt
    }

    MODEL_PROVIDER {
        string id PK
        string modelId FK
        string providerId FK
        decimal inputPricePerMillion
        decimal outputPricePerMillion
        string currency
        int contextWindowOverride
        float latencyMs
        float throughputTps
        boolean isAvailable
        string source
        string sourceUrl
        datetime fetchedAt
        datetime createdAt
        datetime updatedAt
    }

    BENCHMARK {
        string id PK
        string slug UK
        string name
        enum category
        string description
        float maxScore
        boolean higherIsBetter
    }

    BENCHMARK_SCORE {
        string id PK
        string modelId FK
        string benchmarkId FK
        float score
        string source
        string sourceUrl
        datetime fetchedAt
        datetime measuredAt
    }

    MODEL_ALIAS {
        string id PK
        string modelId FK
        string alias UK
        string source
        datetime createdAt
    }

    DATA_SYNC_LOG {
        string id PK
        string source
        string status
        int recordsCreated
        int recordsUpdated
        int recordsSkipped
        string error
        datetime startedAt
        datetime finishedAt
    }
```

### Design Highlights
- **Decimal Precision for Token Pricing:** Token prices are stored as `Decimal(10, 4)` in PostgreSQL, preventing IEEE-754 binary floating-point rounding errors on fractional pricing.
- **Asymmetric Modalities:** Separate `ModelInputModality` and `ModelOutputModality` tables represent models that process vision or audio input but generate plain text output.
- **Indexing Strategy:** B-tree and compound indexes are defined across `slug`, `labId`, `releaseDate`, `contextWindow`, `modelType`, `license`, and provider prices.
- **Provenance Tracking:** Every `ModelProvider` price card and `BenchmarkScore` records its `source`, `sourceUrl`, and `fetchedAt` timestamp.

---

## API Reference

All API routes return standardized JSON envelopes:
- Success: `{ "success": true, "data": ... }`
- Paginated: `{ "success": true, "data": ..., "meta": { "total": 40, "page": 1, "limit": 20, "totalPages": 2, "hasNextPage": true, "hasPrevPage": false } }`
- Error: `{ "success": false, "error": { "code": "NOT_FOUND", "message": "Model not found" } }`

| Method | Path | Description | Key Parameters |
|---|---|---|---|
| `GET` | `/api/home` | Platform aggregates and spotlight models | None |
| `GET` | `/api/models` | List models with facets, filters, sort, pagination | `q`, `lab`, `provider`, `modelType`, `license`, `capabilities`, `sortBy`, `page`, `limit` |
| `GET` | `/api/models/[slug]` | Comprehensive model detail, rate cards, benchmarks | None |
| `GET` | `/api/models/compare` | Side-by-side matrix comparison for 2–4 models | `models` (comma-separated slugs, min 2, max 4) |
| `GET` | `/api/rankings` | Leaderboards ordered by score with normalized bars | `category`, `benchmark` |
| `GET` | `/api/benchmarks` | List supported evaluation benchmarks | None |
| `GET` | `/api/benchmarks/[slug]` | Detailed benchmark rankings and evaluation metrics | None |
| `GET` | `/api/labs` | Directory of AI research laboratories | None |
| `GET` | `/api/labs/[slug]` | Lab profile with chronological model releases | None |
| `GET` | `/api/providers` | Directory of cloud hosting providers | None |
| `GET` | `/api/providers/[slug]`| Provider rate cards and supported models | None |
| `GET` | `/api/search` | Multi-entity debounced search for Command Palette | `q` (query string), `limit` (default: 5) |
| `GET` | `/api/filters` | Dynamic faceted counts for catalog filters | None |

### Example Request and Response

**Request:**
```http
GET /api/models/compare?models=gpt-4o,claude-3-5-sonnet HTTP/1.1
Host: oneatlas.dev
Accept: application/json
```

**Response (HTTP 200 OK):**
```json
{
  "success": true,
  "data": {
    "models": [
      {
        "id": "cmwqor4zq00019yh66q24w69j",
        "slug": "gpt-4o",
        "name": "GPT-4o",
        "modelType": "MULTIMODAL",
        "contextWindow": 128000,
        "parameterCount": "Omni Multi-modal",
        "minInputPrice": 2.5,
        "minOutputPrice": 10.0,
        "latencyMs": 380,
        "throughputTps": 88
      },
      {
        "id": "cmwqor50d00069yh6v3h5j7c2",
        "slug": "claude-3-5-sonnet",
        "name": "Claude 3.5 Sonnet",
        "modelType": "MULTIMODAL",
        "contextWindow": 200000,
        "parameterCount": "Frontier Compound",
        "minInputPrice": 3.0,
        "minOutputPrice": 15.0,
        "latencyMs": 420,
        "throughputTps": 75
      }
    ],
    "winners": {
      "cheapestModelSlug": "gpt-4o",
      "largestContextSlug": "claude-3-5-sonnet",
      "fastestLatencySlug": "gpt-4o",
      "highestThroughputSlug": "gpt-4o"
    },
    "benchmarksComparison": [
      {
        "benchmark": {
          "slug": "humaneval",
          "name": "HumanEval (Pass@1)",
          "category": "CODING",
          "maxScore": 100,
          "higherIsBetter": true
        },
        "scores": {
          "gpt-4o": 90.2,
          "claude-3-5-sonnet": 93.7
        },
        "winningModelSlug": "claude-3-5-sonnet"
      }
    ]
  }
}
```

---

## Data Sources and Methodology

OneAtlas enforces strict data provenance: no synthetic or guessed numbers are permitted.

1. **Model Catalog & Token Economics:** Sourced via the [OpenRouter Public API](https://openrouter.ai/api/v1/models) and official provider rate sheets. Per-token values are converted to USD per 1,000,000 tokens ($1\text{M tokens} = \text{rate} \times 1,000,000$).
2. **Open-Weight Architecture Metadata:** Parameter counts, model architectures, and open licenses are verified through the [Hugging Face Hub API](https://huggingface.co/api/models) using safetensor metadata.
3. **Benchmark Evaluations:** Standardized scores are ingested from the [Hugging Face Open LLM Leaderboard](https://huggingface.co/spaces/open-llm-leaderboard/open_llm_leaderboard) (CC-BY 4.0), the [LMSYS Chatbot Arena](https://huggingface.co/spaces/lmarena-ai/arena-leaderboard) (Apache 2.0), and official technical system cards published by OpenAI, Anthropic, Google, and Meta.
4. **Missing Value Handling:** If a technical specification, price, or benchmark score cannot be verified against official primary sources, it is stored as `NULL` and rendered as `"N/A"` in the UI.
5. **Data Disclaimer:** Model pricing, provider availability, and benchmark evaluations are continuously updated and reflect the latest measurements from cited sources.

