# Patch: Benchmark Scores Coverage & Prioritization

- **Domain:** Evaluation Data Integrity
- **Key Files:** \src/services/ranking.service.ts\, \prisma/seed.ts\, \scripts/seed-additional-scores.ts\
- **Scope:**
  1. Populated scores for ARC-Challenge (18 models) and IFEval (16 models), achieving 100% score coverage across all 10 benchmarks.
  2. Fixed candidate benchmark selection algorithm to prioritize benchmarks with the most scores over alphabetical ordering.
