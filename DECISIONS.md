# Architecture Decision Records (ADR) — OneAtlas

This document tracks all significant architectural decisions, trade-offs, rationale, and future improvements across the development of OneAtlas.

---

## ADR 001: Next.js App Router with Layered Backend Architecture

- **Date:** 2026-11-21
- **Status:** Accepted
- **Context:**
  We require a fast, modern full-stack web application that serves both interactive client experiences (filterable model grids, comparison matrices, command palette) and search-engine-indexable model intelligence pages.
- **Decision:**
  Adopt Next.js App Router (`app/`) paired with a strict 4-layer backend architecture:
  1. `HTTP Route Handlers` (`app/api/**/route.ts`) — Strictly handles HTTP concerns (parsing request headers, URL search params, status codes, and JSON responses).
  2. `Zod Schema Validation` (`schemas/`) — Guarantees contract safety at the API boundary, validating all query parameters and request bodies before touching business logic.
  3. `Service Layer` (`services/`) — Pure, testable business logic (e.g., benchmark score normalization, price difference calculations, winning spec identification).
  4. `Repository / Prisma Client` (`repositories/`) — Centralized database querying, preventing N+1 queries using targeted Prisma `include` and `select`.
- **Trade-offs:**
  - *Pros:* Decoupled code, 100% testable via unit tests without spinning up Next.js HTTP servers, clean separation of concerns.
  - *Cons:* Slightly more boilerplate than inline database queries in route files.

---

## ADR 002: Storage of Currency as Decimal(10, 4) in PostgreSQL

- **Date:** 2026-11-21
- **Status:** Accepted
- **Context:**
  Token pricing in modern LLM APIs is often quoted at fractions of a cent per 1M tokens (e.g. $0.1500 per 1M input tokens on GPT-4o-mini, $0.0750 on Gemini 1.5 Flash).
- **Decision:**
  Store all token pricing as `Decimal(10, 4)` in PostgreSQL using Prisma's `Decimal` type, normalized to **USD per 1,000,000 tokens**.
- **Trade-offs:**
  - *Pros:* Eliminates IEEE-754 floating-point rounding inaccuracies (e.g., `0.1 + 0.2 !== 0.3`).
  - *Cons:* Requires explicit serialization to strings or precise numbers when serializing JSON responses for client consumption.

---

## ADR 003: URL Search Parameters as the Single Source of Truth for State

- **Date:** 2026-11-21
- **Status:** Accepted
- **Context:**
  Users navigating an AI model catalog frequently bookmark, share, and refresh filtered views (e.g., `models?provider=groq&minContext=128000&sort=price_asc`).
- **Decision:**
  Keep all filter, search, sort, and pagination state in the browser URL search parameters. TanStack Query query keys are derived directly from `searchParams.toString()`.
- **Trade-offs:**
  - *Pros:* Perfect shareability, deep linking, native browser back/forward history support, and zero duplicate state drift between UI and server.
  - *Cons:* Reading and writing URL params requires debouncing on search inputs to avoid thrashing the browser history.

---

## ADR 004: Dual-Connection Configuration for Neon PostgreSQL

- **Date:** 2026-11-21
- **Status:** Accepted
- **Context:**
  Neon is a serverless Postgres provider that utilizes connection poolers (PgBouncer) on port 6543 to support massive concurrency, but Prisma migrations and schema alterations require direct database connections on port 5432.
- **Decision:**
  Configure Prisma datasource with `url = env("DATABASE_URL")` (pooled connection) and `directUrl = env("DIRECT_URL")` (direct port 5432 connection).
- **Trade-offs:**
  - *Pros:* High concurrency in serverless Vercel functions while preserving migration compatibility.
  - *Cons:* Requires two connection strings configured in environment variables.

---

## ADR 005: Normalized Modalities and Capabilities Representation

- **Date:** 2026-11-21
- **Status:** Accepted
- **Context:**
  Models differ significantly in input vs. output capabilities (e.g. Vision models can ingest images but only output text; TTS models ingest text and output audio).
- **Decision:**
  Separate `ModelInputModality` and `ModelOutputModality` into distinct relational join models, rather than a generic flat list of modalities.
- **Trade-offs:**
  - *Pros:* Accurately captures asymmetric multimodal models (e.g., GPT-4o with audio in/out vs. Claude 3.5 Sonnet with image in / text out).
  - *Cons:* Requires explicit querying of both junction tables when retrieving model metadata.

---

## ADR 006: Client-Side Compare Tray with LocalStorage Persistence

- **Date:** 2026-11-21
- **Status:** Accepted
- **Context:**
  Users exploring models across multiple catalog pages, lab profiles, or provider pages want to collect models on the fly and launch comparisons without losing their selections on page transitions.
- **Decision:**
  Implement a lightweight React Context (`CompareTrayProvider`) backed by browser `localStorage`. Limits selection to 4 models and surfaces a floating dock at the bottom of the viewport with a one-click launcher to `/compare?models=a,b,c`.
- **Trade-offs:**
  - *Pros:* Frictionless user experience, persists across browser refreshes and page reloads, zero network round trips for tray additions.
  - *Cons:* State is client-local; sharing requires copying the generated `/compare?models=...` URL.

---

## ADR 007: TanStack Query Data Fetching & Caching Strategy

- **Date:** 2026-11-21
- **Status:** Accepted
- **Context:**
  Catalog filtering, searching, and model detail views require low latency and high responsiveness without triggering excessive database queries.
- **Decision:**
  Use `@tanstack/react-query` with a default `staleTime` of 60 seconds and `gcTime` of 5 minutes. Set HTTP response headers to `Cache-Control: public, s-maxage=60, stale-while-revalidate=300` on API route handlers.
- **Trade-offs:**
  - *Pros:* Instant navigation on back/forward buttons, deduplication of concurrent requests, seamless background revalidation.
  - *Cons:* Dynamic pricing updates have up to a 60-second propagation window unless manually invalidated.

---

## ADR 008: Rate Limiting & Scaling Considerations

- **Date:** 2026-11-21
- **Status:** Proposed / Future Improvement
- **Context:**
  Public API endpoints like `/api/search` and `/api/models` can be subjected to automated scraping or denial-of-service attempts.
- **Decision:**
  Currently protected by Next.js edge caching headers and safe pagination limits (`limit <= 100`). For production scaling, integrate Upstash Redis `@upstash/ratelimit` at the Next.js `middleware.ts` layer with a sliding window of 100 requests per minute per IP address.
- **Trade-offs:**
  - *Pros:* Prevents abusive scraping without impacting legitimate developers.
  - *Cons:* Requires an external Redis instance.

---

## ADR 009: Ergonomic Typography Scale & Accessible Design Tokens

- **Date:** 2026-11-21
- **Status:** Accepted
- **Context:**
  Dense developer tools like OpenRouter often use ultra-compact 10–12px typography that can cause eye fatigue and poor readability on high-DPI screens or mobile devices.
- **Decision:**
  1. Set the root HTML base font size to `16.5px` and extend the Tailwind font size scale (`xs: 13.5px`, `sm: 15.2px`, `base: 17px`, `lg: 19.2px`, `xl: 21.6px`, `2xl: 26.4px`, `3xl: 32.8px`).
  2. Increase touch target heights on all buttons (`h-10` to `h-12`) and inputs (`py-2.5` to `py-3`).
  3. Enforce high-contrast semantic badges with clear font weights (`font-semibold` to `font-bold`) and generous badge padding.
  4. Ensure all table cells, comparisons, and leaderboard score bars provide ample breathing room without sacrificing data density.
- **Trade-offs:**
  - *Pros:* Significantly superior readability, lower cognitive strain, accessible touch targets, and a polished, premium aesthetic.
  - *Cons:* Slightly fewer cards visible in a single viewport before scrolling.

---

## ADR 010: Production Git Branching Strategy & Lifecycle Management

- **Date:** 2026-11-21
- **Status:** Accepted
- **Context:**
  Production-grade enterprise web applications require decoupled, reviewable, and isolated feature development to prevent integration collisions, ensure CI predictability, and support seamless multi-developer collaboration.
- **Decision:**
  Adopt a standard GitFlow / GitHub Flow hybrid branching model with:
  1. `main` as the production release branch.
  2. `develop` as the continuous integration/staging branch.
  3. Feature-specific branches (`feature/models-catalog`, `feature/comparison-matrix`, `feature/benchmarks-and-rankings`, `feature/provider-pricing-and-labs`, `feature/search-command-palette`, `feature/brand-logos-and-ui-system`).
  4. Scoped patch branches (`fix/knowledge-benchmark-scores`).
  5. Hardened release branches (`release/v1.0.0`) with Semantic Versioning tags (`v1.0.0`).
- **Trade-offs:**
  - *Pros:* Clear change isolation, auditable PR history, zero risk to production stability, easy cherry-picking, and alignment with industry best practices (Google, Meta, Vercel).
  - *Cons:* Requires maintaining branch discipline and synchronizing integration branches.
