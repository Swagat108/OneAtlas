# Production Git Workflow & Branching Strategy — OneAtlas

## 1. Overview & Architecture

OneAtlas follows the **Production GitFlow / GitHub Flow** hybrid standard utilized by modern AI engineering teams and enterprise platforms (e.g. Vercel, Supabase, Cloudflare). 

In this model:
- **`main`** is protected, stable, and always deployable directly to production (`https://oneatlas.dev`).
- **`develop`** serves as the primary staging and integration branch where feature branches merge for cross-system integration and regression tests.
- **`feature/*`** branches isolate discrete functional domains, ensuring modular development, clean pull requests, focused code reviews, and zero regressions.
- **`fix/*`** branches address targeted bugs or data integrity patches.
- **`release/*`** branches freeze code for final validation, tagging (`v1.0.0`), and release prep.

```
                    ┌─ feature/models-catalog ─────────────┐
                    │                                      │
                    ├─ feature/comparison-matrix ──────────┤
                    │                                      │
develop ────────────┼─ feature/benchmarks-and-rankings ────┼── release/v1.0.0 ───► main (v1.0.0)
                    │                                      │
                    ├─ feature/provider-pricing-and-labs ──┤
                    │                                      │
                    ├─ feature/search-command-palette ─────┤
                    │                                      │
                    └─ feature/brand-logos-and-ui-system ──┘
```

---

## 2. Active Branch Inventory & Responsibilities

| Branch | Classification | Scope & Key Components |
|---|---|---|
| **`main`** | Production | Stable, production-verified deployment. Zero compiler warnings, 100% test pass rate. |
| **`develop`** | Integration / Staging | Central integration point for all feature modules and automated CI regression pipelines. |
| **`feature/models-catalog`** | Feature Domain | Model directory (`/models`), multi-parameter faceted filtering, card/list layouts, parameter count, sorting, and detail views (`/models/[slug]`). |
| **`feature/comparison-matrix`** | Feature Domain | Head-to-head comparison engine (`/compare`), winner highlighting logic, floating `CompareTray` drawer, and deep-linkable shareable comparison state. |
| **`feature/benchmarks-and-rankings`** | Feature Domain | Standardized evaluations catalog (`/benchmarks`), parameter categories (Math, Reasoning, Coding, Multimodal, Knowledge, Agentic), and dynamic leaderboard rankings (`/rankings`). |
| **`feature/provider-pricing-and-labs`** | Feature Domain | Cloud infrastructure directories (`/providers`, `/providers/[slug]`), TTFT latency, throughput metrics, token rate cards, AI research labs (`/labs`), and chronological foundation model release history. |
| **`feature/search-command-palette`** | Feature Domain | Global instant command palette (`⌘K`), fuzzy index, multi-entity search results across models, labs, and providers. |
| **`feature/brand-logos-and-ui-system`** | Feature Domain | Vector SVG brand insignia component (`ModelLogo`), dark/light theme tokens, 1600px container expansion, floating pill navigation bar, and accessible typography scale. |
| **`fix/knowledge-benchmark-scores`** | Patch / Bug Fix | Benchmark score population for ARC-Challenge & IFEval, score count sorting algorithm, and 100% evaluation category coverage. |
| **`release/v1.0.0`** | Release Candidate | Hardened production candidate with tagged release `v1.0.0`. |

---

## 3. Production Branching Conventions

### Branch Naming Standards
- **Features**: `feature/<domain-or-capability>` (e.g., `feature/models-catalog`)
- **Bug Fixes**: `fix/<issue-description>` (e.g., `fix/knowledge-benchmark-scores`)
- **Performance / Refactor**: `perf/<optimization-target>` or `refactor/<module-name>`
- **Releases**: `release/v<semver>` (e.g., `release/v1.0.0`)
- **Hotfixes**: `hotfix/<critical-patch>`

### Commit Message Guidelines (Conventional Commits)
All commit messages across all branches strictly adhere to the Conventional Commits specification:
```
<type>(<scope>): <short imperative summary>

[optional body explaining motivation, architecture, or trade-offs]
[optional footer with issue reference or breaking changes]
```
Common types:
- `feat`: A new user-facing capability or API endpoint
- `fix`: A bug fix or data integrity restoration
- `style`: Changes that do not affect the meaning of the code (formatting, CSS spacing, typography)
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `test`: Adding missing unit, integration, or schema tests
- `docs`: Documentation updates or Architecture Decision Records (ADR)
- `chore`: Build scripts, dependencies, or database migrations

---

## 4. Pull Request & Merging Lifecycle

In production environments, direct pushes to `main` and `develop` are protected by branch protection rules:
1. **Pull Request Required**: Every change originates from a dedicated `feature/*` or `fix/*` branch.
2. **Mandatory CI Checks**:
   - `npx tsc --noEmit` must pass with 0 errors.
   - `npx vitest run` must pass all test suites.
   - `npm run lint` must pass with 0 ESLint errors.
3. **Merge Method**:
   - Feature branches into `develop`: **Squash and Merge** (to preserve a clean, atomic commit per feature).
   - `develop` into `main`: **Merge Commit** (to preserve branch topology and release milestone tracking).
4. **SemVer Tagging**: Every production merge to `main` receives a signed Semantic Versioning tag (`v1.0.0`).
