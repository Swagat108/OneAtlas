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

---

## ADR 012: Sizing, Scale Normalization & Information Completeness

- **Date:** 2026-11-23
- **Status:** Accepted
- **Context:**
  On standard desktop displays (1366px, 1440px, 1920px) and laptops using Windows display scaling (125%–150%), the UI previously appeared overly magnified due to inflated custom Tailwind font sizes (17px base, 54px 5xl) and 1600px container widths. Furthermore, long model names and descriptions were truncated without full-text tooltips, and the Compare Tray overflowed silently when 3–4 models were selected.
- **Decision:**
  1. **Normalize Design Tokens:** Replaced oversized tokens in `tailwind.config.ts` and `globals.css` with industry-standard production scales (`base: 16px`, `sm: 14px`, `xs: 12px`, `html: 16px`).
  2. **Container Standards:** Normalized all main layout containers to `max-w-7xl` (1280px) with responsive side padding (`px-4 sm:px-6 lg:px-8`).
  3. **Compare Tray Overhaul:**
     - Enabled multi-row wrapping so all 1–4 selected models are visible simultaneously, matching the "(N/4)" counter.
     - Added an expandable detail sheet allowing users to view complete model names, labs, pricing, and remove actions in full rows.
     - Enforced `title` attributes on all model chips, provider lists, and table cells to guarantee zero data clipping.
     - Increased page bottom padding (`pb-32 sm:pb-28`) so the fixed tray never occludes page content.
- **Trade-offs:**
  - *Pros:* Sleek, proportional, developer-tool aesthetic matching Stripe, Linear, and Vercel; complete information accessibility.
  - *Cons:* Slightly denser information display.

---

## ADR 013: Visual Design System, Background Effects & Accessibility Safeguards

- **Date:** 2026-11-23
- **Status:** Accepted
- **Context:**
  Large flat surfaces in light and dark mode felt sterile and lacked spatial layering. Atmospheric background visuals were needed to elevate the product experience while maintaining strict performance, accessibility, and contrast standards.
- **Decision:**
  1. **Pure CSS & Inline SVG Backgrounds:**
     - Added a subtle global ambient dot pattern (`16px x 16px`) with radial fade mask.
     - Integrated a desktop-only cursor-following spotlight on the homepage Hero using GPU-accelerated CSS variables.
     - Added a technical micro-noise overlay (`feTurbulence`) for tactile depth.
     - Replaced blunt borders with hairline gradient dividers (`from-transparent via-border to-transparent`).
  2. **Logo Marquee:**
     - Created an infinite, GPU-accelerated marquee component showcasing official partner logos with left/right linear gradient fade masks.
     - Pausable on hover, static grid fallback for `prefers-reduced-motion`.
  3. **Detail & Data Accents:**
     - Header ambient brand glow derived from lab brand colors.
     - Multi-stop gradient benchmark score bars with smooth width transitions.
     - Subtle highlight bands behind winning comparison cells and top-3 leaderboard rows.
  4. **Original Line-Art SVG Illustrations:**
     - Custom Atlas navigation compass radar motif for empty states.
     - Celestial coordinate orbit motif for 404 pages.
  5. **Performance & Contrast Safeguards:**
     - All decorative elements flagged with `aria-hidden="true"`.
     - Zero WebGL or external raster weight (< 15KB total code addition).
     - Full WCAG AA contrast compliance across light and dark modes.


- **Date:** 2026-11-22
- **Status:** Accepted
- **Context:**
  OneAtlas handles dense data (46+ models, 10 AI labs, 9 cloud providers, multiple rate cards per million tokens, 10 benchmarks, and multi-model comparison matrices). On mobile viewports (320px–430px) and small tablets, complex data tables and multi-facet filtering can easily cause horizontal overflow, layout shift, or broken tap targets. Furthermore, users require immediate, non-intrusive feedback when managing comparisons or copying links.
- **Decision:**
  1. **Mobile Bottom-Sheet Filter Drawer:**
     - On `< lg` viewports, the desktop sidebar transforms into a slide-up bottom sheet drawer with backdrop blur and body scroll lock.
     - A sticky bottom action bar provides a one-click "Reset" button and a prominent "Apply Filters (N active)" button.
     - Active filters are rendered as dismissible chips directly above the catalog with a live result count indicator.
  2. **Sticky Column Architecture for Complex Tables:**
     - In `/compare`, the first column (`Model Spec`) is pinned with `sticky left-0 bg-card z-10 border-r border-border shadow-[2px_0_5px_rgba(0,0,0,0.03)]`, allowing smooth horizontal scrolling across 2–4 models without losing row context.
     - In `/rankings`, the `Rank` and `Model` columns are sticky pinned so model names and badges remain visible while scrolling through scores, context length, and pricing.
     - In `/models/[slug]`, the `Provider` column is sticky pinned on the cloud pricing table.
  3. **Accessible Toast Notification System:**
     - Centralized `ToastProvider` mounted in `src/app/providers.tsx` providing `useToast()`.
     - Automatically dismisses after 3.5s with slide-up CSS transitions and color-coded semantic icons (success, destructive, info, default).
     - Directly integrated into `CompareTrayProvider` for real-time notifications on model addition, tray capacity limits (max 4), and removals.
  4. **Human-Centric Information Design & Interactive Standout Features:**
     - Replaced raw ISO dates with relative human dates ("Released 2 months ago") with hover tooltips displaying the full exact date.
     - Added plain-language tooltips for technical jargon (`TTFT` = Time To First Token latency, `Throughput` = tokens per second, `Context Window` = prompt capacity).
     - Built an **Interactive Monthly Production Token Cost Calculator** widget directly on `/models/[slug]`, allowing engineering leaders to drag sliders for monthly input and output token volumes and instantly see ranked hosting provider costs and dollar savings.
     - Implemented full keyboard navigation (`ArrowUp`, `ArrowDown`, `Enter`, `ESC`) and `localStorage` recent searches in the global `Cmd+K` command palette.
- **Trade-offs:**
  - *Pros:* Exceptional mobile experience across all viewports (320px to 2560px), zero horizontal page overflow, instant user feedback, zero layout shift (CLS), and an interactive cost calculator that directly assists enterprise AI purchasing decisions.
  - *Cons:* Slightly increased component complexity for tables requiring both sticky positioning and border shadows.
