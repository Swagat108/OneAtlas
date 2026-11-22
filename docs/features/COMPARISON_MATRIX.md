# Feature: Multi-Model Head-to-Head Comparison Matrix

- **Domain:** Side-by-Side Model Evaluation & Compare Tray
- **Routes:** \/compare\, \/api/compare\
- **Key Components:** \ComparisonMatrix.tsx\, \CompareTray.tsx\, \useCompareTray\, \compare-tray.context.tsx\
- **Capabilities:**
  1. Side-by-side comparison of 2 to 4 models across context windows, pricing, modalities, and latency.
  2. Automated winning badge calculations: Cheapest Input/Output, Largest Context, Lowest Latency (TTFT), and Highest Throughput.
  3. Benchmark head-to-head score comparison with winner highlighting.
  4. Floating comparison tray drawer supporting model addition, removal, and quick navigation.
  5. Deep-linkable shareable comparison state serialized directly in URL search params (\?models=gpt-4o,claude-3-5-sonnet\).
