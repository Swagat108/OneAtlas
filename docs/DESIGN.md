# OneAtlas Design System & Motion Specification

> **Aesthetic Direction:** Data-First Developer Tool  
> **Quality Benchmarks:** Linear, OpenRouter, Raycast, Stripe, Vercel  
> **Core Principle:** Dense, scannable, calm, and confident. Data takes precedence over decoration.

---

## 1. Design Direction

### 1.1 Color Architecture
OneAtlas shifts from consumer "AI SaaS" tropes (purple/cyan gradients, floating glowing blobs, heavy glassmorphism) to a high-contrast, precision engineering workbench.

- **Neutrals (Tuned for Dark & Light):**
  - **Dark Mode:** Base `#09090b` (zinc-950), Surface `#121215` (subtle elevation), Elevated Surface `#18181b` (zinc-900), Border `rgba(255, 255, 255, 0.08)`, Subdued Text `#a1a1aa` (zinc-400), High-Contrast Text `#f4f4f5` (zinc-100).
  - **Light Mode:** Base `#fcfcfd`, Surface `#ffffff`, Elevated Surface `#f4f4f5`, Border `rgba(0, 0, 0, 0.08)`, Subdued Text `#71717a` (zinc-500), High-Contrast Text `#09090b` (zinc-950).
- **Single Restrained Accent:**
  - **Electric Indigo / Precision Cobalt:** `#4f46e5` (dark: `#6366f1`, light: `#4338ca`).
  - Used exclusively for interactive focus rings, active navigation indicators, primary CTA buttons, and direct selection state.
  - **Strict Rule:** Zero decorative rainbow gradients (`from-primary via-purple to-cyan` removed across the entire platform).
- **Semantic Colors (Functional Meaning Only):**
  - **Emerald (`#10b981` / text `#34d399`):** Lowest price, highest benchmark score, best value, verified active status.
  - **Amber (`#f59e0b` / text `#fbbf24`):** Proprietary license warning, latency caution, approaching limits.
  - **Rose (`#ef4444` / text `#f87171`):** Errors, destructive actions, discontinued models.
  - **Slate/Zinc (`#71717a`):** Neutral benchmarks, unverified, N/A metrics.

---

### 1.2 Typography & Numerical Precision
- **Font Pairing:**
  - **Primary UI:** `Inter` via `next/font/google` (`--font-inter`). Features enabled: `cv02`, `cv03`, `cv04`, `cv11` for clean geometric numerals and distinct capital letters.
  - **Data, Numbers, Slugs & Pricing:** `JetBrains Mono` via `next/font/google` (`--font-mono`) with `tabular-nums` forced on all currency, latency, score, token, and timestamp displays.
- **Typographic Scale & Weights:**
  - **Micro / Sub-badges:** `11px` (`0.6875rem`), weight `600`, tracking `+0.04em` uppercase.
  - **Caption & Meta:** `12px` (`0.75rem`), weight `500`, line-height `1.3`.
  - **Dense Data / Table Cells:** `13px` (`0.8125rem`), weight `450` / `550`, line-height `1.4`.
  - **Body / Standard UI:** `14px` (`0.875rem`), weight `400` / `500`, line-height `1.5`.
  - **H3 / Card Titles:** `16px` (`1rem`), weight `600`, tracking `-0.015em`.
  - **H2 / Section Headers:** `22px` (`1.375rem`), weight `700`, tracking `-0.025em`.
  - **H1 / Page Titles:** `32px` (`2rem`), weight `750`, tracking `-0.035em`.
  - **Hero Title:** `48px` - `56px` (`3rem` - `3.5rem`), weight `800`, tracking `-0.04em`, no text gradient clipping.

---

### 1.3 Geometry & Elevation
- **Border-First Architecture:**
  - Replace thick drop shadows and colorful outer glows with crisp 1px borders (`border-border/70` in light, `border-white/[0.08]` in dark).
  - Subtle top-edge 1px highlight on elevated surfaces (`border-t border-t-white/[0.12]`) simulating realistic physical bezel light.
- **Radius Scale:**
  - `rounded-md` (`6px`): Micro badges, tooltips, tags, dropdown items.
  - `rounded-lg` (`8px`): Inputs, standard buttons, tabs, segment controls.
  - `rounded-xl` (`12px`): Cards, modal containers, compare tray, table shells.
- **Shadows:**
  - Resting cards have `shadow-none`.
  - Hover state has subtle 1px border brightening (`border-zinc-700/80`) and `shadow-[0_4px_20px_-4px_rgba(0,0,0,0.25)]`.
  - Heavy shadows are strictly reserved for popovers, command palettes, and floating compare docks.

---

### 1.4 Iconography & Imagery
- **Icons:** Strict single library usage with `Lucide React`. Stroke width normalized to `1.5px` or `1.75px` across all sizes.
- **Zero Emojis:** Replace all inline emojis in headers, buttons, and badges with functional Lucide SVG icons.
- **Brand Logos:** Real SVGs from `@lobehub/icons` with deterministic, accessibility-checked contrast backgrounds and monochromatic inversion for dark mode.
- **Zero Stock Illusions:** No 3D blobs, no floating fake diagrams, no placeholder screenshots.

---

## 2. Motion System & Physics

### 2.1 Motion Tokens (`src/lib/motion.ts`)
```ts
export const MOTION_DURATIONS = {
  instant: 0,
  fast: 0.14,    // 140ms: Hover, toggle, micro-press
  base: 0.22,    // 220ms: Dropdowns, tabs, active indicators
  slow: 0.38,    // 380ms: Modal entrances, drawer slides, page transitions
  stagger: 0.035 // 35ms: List and table row cascade
};

export const MOTION_EASINGS = {
  // Linear/Raycast out-expo deceleration curve
  outExpo: [0.16, 1, 0.3, 1],
  // Smooth symmetric curve for layout morphs
  easeInOut: [0.4, 0, 0.2, 1],
  // Standard UI entrance
  easeOut: [0, 0, 0.2, 1],
};

export const MOTION_SPRINGS = {
  // Tactile press response
  press: { type: "spring", stiffness: 450, damping: 28 },
  // Dock and bottom sheet slide
  drawer: { type: "spring", stiffness: 320, damping: 32 },
  // Smooth layout reordering
  layout: { type: "spring", stiffness: 380, damping: 34 },
};
```

---

### 2.2 Global Rules & Accessibility Safeguards
1. **GPU Acceleration Only:** Animate strictly `transform` and `opacity`. Never animate `height`, `width`, `top`, or `padding` to prevent browser reflows and ensure steady 60fps.
2. **`prefers-reduced-motion` Enforcement:**
   - Detect system setting via CSS `@media (prefers-reduced-motion: reduce)` and Framer Motion's `useReducedMotion()`.
   - On reduced motion: disable all layout gliding, coordinate transitions, and count-up animations; fallback to instantaneous render or gentle 100ms opacity fades.
3. **Restraint & Signature Effects:**
   - Maximum **ONE** signature effect per page (e.g., Home has a slow, cursor-following dot-matrix spotlight; Compare has a pulse highlight on winning metrics).
   - No looping animations, no continuous spinning badges, no parallax jitter.
4. **Touch vs Pointer:**
   - Hover animations strictly wrapped in `@media (hover: hover) and (pointer: fine)`.
   - Touch devices receive immediate active press feedback (`scale: 0.97`) without stuck hover states.
5. **SEO & Server-Side Rendering:**
   - All critical semantic data exists in the initial SSR HTML; motion components wrap children without blocking crawler discovery.

---

### 2.3 Reusable Motion Primitives (`src/components/motion/`)
- `FadeIn`: Subtle opacity fade with optional `4px` upward translation.
- `Stagger`: Container and child items orchestrating `35ms` staggered reveals.
- `CountUp`: Tabular numeral integer/decimal counter running once when scrolled into view.
- `Reveal`: Single-fire viewport intersection observer reveal.
- `SpringPress`: Wraps buttons and interactive elements with a gentle `0.975` scale press spring.
- `AnimatedBar`: Calibrated horizontal progress bar animating from width `0%` to value on enter.
- `PageTransition`: Route change wrapper with fade and subtle `6px` glide.

---

## 3. Page-by-Page Redesign Plan

| Page | Planned Signature Effect | Layout & Hierarchy Transformation |
|---|---|---|
| **Global / Layout** | Floating navbar with active sliding pill indicator | Monochromatic brand identity; single theme-toggle morph; thin top scroll-progress indicator; redesigned Command Palette with keyboard hotkeys and grouped results. |
| **Home** | Subtle interactive dot grid with desktop cursor spotlight | Plain-language engineer hero; real database counter with tabular CountUp; pausable logo marquee of real labs/providers; structured asymmetric sections for "Recent Releases", "Best Value", and "Provider Benchmark Matrix". |
| **Models (Discovery)** | Staggered row reveal + layout transition on filter change | Compact table/card switch; monospace pricing (`$2.50 / 1M`); collapsable filter groups with counts and active filter bar; bottom-sheet drawer for mobile with spring physics. |
| **Model Detail** | Animated benchmark score bars + interactive token forecaster | Clean lab header with specs badge strip; provider rate cards sorted by lowest price with "Cheapest" badge; animated benchmark metrics with ranking context; related models strip. |
| **Compare** | Dynamic column add/remove animation + winner pulse | Sticky 2D matrix (pinned row headers & column specs); difference-only toggle; shareable link toast; fly-into-tray comparison dock with animated counter. |
| **Rankings** | Smooth leaderboard rank reordering on category switch | Segmented category pills; sticky table header; normalized score bars with benchmark upper-bound indicators; direct comparison shortcuts. |
| **Labs & Providers** | Clean release timeline and provider infrastructure directory | Metric cards with hosted model counts and regional coverage; chronological release trees for research labs. |
